/* =====================================================
   ALL_SMALL_FUNCTIONS.JS
   Поиск по названию, фильтр по бренду, сортировка по цене
===================================================== */


// ─── Открытие/закрытие дропдаунов ──────────────────

function filterFunction() {
    document.getElementById("filterDropdown").classList.toggle("show");
}

function sortFunction() {
    document.getElementById("sortDropdown").classList.toggle("show");
}

// Закрытие при клике вне меню
document.addEventListener("click", function (e) {
    const filterDropdown = document.getElementById("filterDropdown");
    const sortDropdown   = document.getElementById("sortDropdown");

    if (filterDropdown && !e.target.closest(".drop-filter")) {
        filterDropdown.classList.remove("show");
    }
    if (sortDropdown && !e.target.closest(".drop-sort")) {
        sortDropdown.classList.remove("show");
    }
});


// ─── Collapsible описание товара ────────────────────

var coll = document.getElementsByClassName("collapsible");
for (var i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        const isOpen = content.style.display === "block";
        content.style.display = isOpen ? "none" : "block";
        // Поворот стрелки управляется CSS через класс .active
    });
}

// Стрелка коллапсибла управляется через CSS ::after + класс .active


// ─── Состояние фильтров ─────────────────────────────

let activeBrand = null;
let activeSort  = null;


// ─── Главная функция: применяет всё сразу ───────────

function applyFilters() {
    const grid = document.querySelector(".product-grid");
    if (!grid) return;

    const searchQuery = document.querySelector(".search-input")?.value.trim().toLowerCase() || "";
    let cards = Array.from(grid.querySelectorAll(".card"));

    // 1. Поиск по названию + фильтр по бренду
    cards.forEach(card => {
        const title = card.querySelector(".product-title")?.textContent.trim().toLowerCase() || "";
        const brand = (card.dataset.brand || "").toLowerCase();

        const matchesSearch = !searchQuery || title.includes(searchQuery);
        const matchesBrand  = !activeBrand || brand === activeBrand;

        card.style.display = matchesSearch && matchesBrand ? "" : "none";
    });

    // 2. Сортировка по цене (только видимые карточки)
    if (activeSort) {
        const visible = cards.filter(c => c.style.display !== "none");
        visible.sort((a, b) => {
            const priceA = parseFloat(a.querySelector(".price-value")?.textContent.replace(",", ".")) || 0;
            const priceB = parseFloat(b.querySelector(".price-value")?.textContent.replace(",", ".")) || 0;
            return activeSort === "price-asc" ? priceA - priceB : priceB - priceA;
        });
        visible.forEach(card => grid.appendChild(card));
    }

    // 3. Сообщение если ничего не найдено
    const anyVisible = cards.some(c => c.style.display !== "none");
    let noResults = grid.querySelector(".no-results");
    if (!anyVisible) {
        if (!noResults) {
            noResults = document.createElement("div");
            noResults.className = "no-results";
            noResults.textContent = getNoResultsText();
            grid.appendChild(noResults);
        }
    } else {
        noResults?.remove();
    }
}

function getNoResultsText() {
    const lang = document.documentElement.lang || "de";
    if (lang === "ru") return "Ничего не найдено";
    if (lang === "en") return "No results found";
    return "Keine Ergebnisse gefunden";
}


// ─── Поиск ──────────────────────────────────────────

const searchInput = document.querySelector(".search-input");
if (searchInput) {
    searchInput.closest("form")?.addEventListener("submit", e => e.preventDefault());
    searchInput.addEventListener("input", applyFilters);
}


// ─── Фильтр по бренду ───────────────────────────────

document.querySelectorAll("#filterDropdown a[data-brand]").forEach(link => {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        const brand = this.dataset.brand.toLowerCase();

        activeBrand = activeBrand === brand ? null : brand;

        document.querySelectorAll("#filterDropdown a").forEach(l => l.classList.remove("active-filter"));
        if (activeBrand) this.classList.add("active-filter");

        document.getElementById("filterDropdown").classList.remove("show");
        applyFilters();
    });
});


// ─── Сортировка по цене ─────────────────────────────

document.querySelectorAll("#sortDropdown a[data-sort]").forEach(link => {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        const sort = this.dataset.sort;

        activeSort = activeSort === sort ? null : sort;

        document.querySelectorAll("#sortDropdown a").forEach(l => l.classList.remove("active-sort"));
        if (activeSort) this.classList.add("active-sort");

        document.getElementById("sortDropdown").classList.remove("show");
        applyFilters();
    });
});


// ─── Чтение ?search= из URL при загрузке страницы ───
// Работает на search_de.html и на всех категорийных страницах

document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const query  = params.get("search");
    if (query) {
        const input = document.querySelector(".search-input");
        if (input) {
            input.value = query;
            applyFilters();
        }
    }
});
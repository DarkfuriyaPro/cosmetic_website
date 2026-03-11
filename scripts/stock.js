// =============================================
//  stock.js — управление остатками товаров
//  Работает на странице одного товара И на странице списка
// =============================================

const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRgn6Su5cIiKFL69Z3PZkSVmC6m7bHxnHDWz8OBdiBSzrR3BAcTnRxmRYjnP_6L3Go6nw-Cn_Pqhz1r/pub?gid=337012517&single=true&output=csv";

const STOCK_LOW_THRESHOLD = 5;

// ── ТЕКСТЫ НА ТРЁХ ЯЗЫКАХ ────────────────────────────
const STATUS_TEXTS = {
    de: {
        inStock:     { text: "Auf Lager",              color: "#2C5C50" },
        low:         { text: "Nur noch {n} verfügbar", color: "#e07b00" },
        outOfStock:  { text: "Nicht verfügbar",        color: "#cc0000" },
        btnDisabled: "Nicht verfügbar",
    },
    ru: {
        inStock:     { text: "В наличии",              color: "#2C5C50" },
        low:         { text: "Осталось {n} шт.",        color: "#e07b00" },
        outOfStock:  { text: "Нет в наличии",           color: "#cc0000" },
        btnDisabled: "Нет в наличии",
    },
    en: {
        inStock:     { text: "In Stock",               color: "#2C5C50" },
        low:         { text: "Only {n} left",          color: "#e07b00" },
        outOfStock:  { text: "Out of Stock",           color: "#cc0000" },
        btnDisabled: "Out of Stock",
    },
};

const PAGE_LANG = document.documentElement.lang || "de";
const STATUS = STATUS_TEXTS[PAGE_LANG] ?? STATUS_TEXTS["de"];

// ── СТАРТ ────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", async () => {
    const allProductEls = document.querySelectorAll("[data-product-id]");
    if (!allProductEls.length) return;

    // Загружаем CSV один раз для всей страницы
    let stockMap = {};
    try {
        stockMap = await fetchAllStock();
    } catch (err) {
        console.warn("stock.js: не удалось загрузить остатки", err);
        return;
    }

    // Режим 1: страница одного товара (.foot-product или .product-block)
    // Признак — есть элемент .in-stock
    const isSinglePage = !!document.querySelector(".in-stock");

    if (isSinglePage) {
        // Берём первый элемент с data-product-id
        const productEl = allProductEls[0];
        const productId = productEl.dataset.productId;
        const stockEl   = document.querySelector(".in-stock");

        const stock = stockMap[productId.toLowerCase()] ?? 999;
        renderStockStatus(stockEl, stock, /* isCard */ false);

    } else {
        // Режим 2: страница со списком товаров (.product-grid)
        // Для каждой карточки — добавляем метку и блокируем кнопку если нет в наличии
        allProductEls.forEach(cardEl => {
            const productId = cardEl.dataset.productId;
            const stock = stockMap[productId.toLowerCase()] ?? 999;

            if (stock <= 0) {
                // Блокируем кнопку "В корзину"
                const btn = cardEl.querySelector(".add-to-cart");
                if (btn) {
                    btn.disabled = true;
                    btn.textContent = STATUS.btnDisabled;
                    btn.style.opacity = "0.5";
                    btn.style.cursor = "not-allowed";
                    btn.style.backgroundColor = "#999";
                }

                // Добавляем метку "Нет в наличии" под ценой
                const priceEl = cardEl.querySelector(".product-price");
                if (priceEl && !priceEl.querySelector(".stock-badge")) {
                    const badge = document.createElement("div");
                    badge.className = "stock-badge";
                    badge.textContent = STATUS.outOfStock.text;
                    badge.style.color = STATUS.outOfStock.color;
                    badge.style.fontSize = "12px";
                    badge.style.marginTop = "4px";
                    priceEl.appendChild(badge);
                }

            } else if (stock <= STOCK_LOW_THRESHOLD) {
                // Добавляем метку "Осталось мало"
                const priceEl = cardEl.querySelector(".product-price");
                if (priceEl && !priceEl.querySelector(".stock-badge")) {
                    const badge = document.createElement("div");
                    badge.className = "stock-badge";
                    badge.textContent = STATUS.low.text.replace("{n}", stock);
                    badge.style.color = STATUS.low.color;
                    badge.style.fontSize = "12px";
                    badge.style.marginTop = "4px";
                    priceEl.appendChild(badge);
                }
            }
            // Если товар есть в наличии — ничего не меняем, всё и так выглядит хорошо
        });
    }
});

// ── ПОЛУЧЕНИЕ ВСЕХ ОСТАТКОВ СРАЗУ ───────────────────
// Возвращает объект { "product-id": количество, ... }

async function fetchAllStock() {
    const url = `${SHEET_CSV_URL}&t=${Date.now()}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("CSV fetch failed");

    const text = await response.text();
    const rows = parseCSV(text);

    const map = {};
    for (const row of rows) {
        if (!row[0]) continue;
        const id    = row[0].trim().toLowerCase();
        const stock = parseInt(row[1], 10);
        map[id] = isNaN(stock) ? 999 : stock;
    }
    return map;
}

// ── ПАРСИНГ CSV ──────────────────────────────────────

function parseCSV(text) {
    return text
        .split("\n")
        .map(line => line.split(",").map(cell => cell.trim().replace(/^"|"$/g, "")))
        .filter(row => row.length >= 2);
}

// ── ОТРИСОВКА СТАТУСА (только для страницы одного товара) ───

function renderStockStatus(el, stock) {
    let status;

    if (stock <= 0) {
        status = STATUS.outOfStock;
        const btn = document.querySelector(".add-product");
        if (btn) {
            btn.disabled = true;
            btn.style.opacity = "0.5";
            btn.style.cursor = "not-allowed";
            btn.textContent = STATUS.btnDisabled;
        }
    } else if (stock <= STOCK_LOW_THRESHOLD) {
        status = {
            text:  STATUS.low.text.replace("{n}", stock),
            color: STATUS.low.color,
        };
    } else {
        status = STATUS.inStock;
    }

    el.textContent = status.text;
    el.style.color  = status.color;
}
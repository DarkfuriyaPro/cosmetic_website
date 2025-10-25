/* Filter */
function filterFunction() {
    document.getElementById("filterDropdown").classList.toggle("show");

    // Закрытие при клике вне меню
    document.addEventListener("click", function (event) {
        const dropdown = document.getElementById("filterDropdown");
        const button = document.querySelector(".btn-filter");

        if (!dropdown.contains(event.target) && !button.contains(event.target)) {
            dropdown.classList.remove("show");
        }
    });
}



/* Sort */
function sortFunction() {
    document.getElementById("sortDropdown").classList.toggle("show");

    // Закрытие при клике вне меню
    document.addEventListener("click", function (event) {
        const dropdown = document.getElementById("sortDropdown");
        const button = document.querySelector(".btn-sort");

        if (!dropdown.contains(event.target) && !button.contains(event.target)) {
            dropdown.classList.remove("show");
        }
    });
}

/* Liked products */
const likedProducts = [];

document.querySelectorAll('.card').forEach((card, index) => {
    const likeBtn = card.querySelector('.like');
    const likeImg = likeBtn.querySelector('img');
    const title = card.querySelector('.title')?.innerText || 'Товар';
    const productId = `product-${index}`;

    // Устанавливаем ID на карточку
    card.dataset.productId = productId;

    likeBtn.addEventListener('click', function (e) {
        e.preventDefault();

        const isLiked = likeBtn.dataset.liked === "true";

        if (isLiked) {
            likeImg.src = "../images/unlike-white.png";
            likeBtn.dataset.liked = "false";
            // Удалить из массива
            const index = likedProducts.findIndex(p => p.id === productId);
            if (index !== -1) likedProducts.splice(index, 1);
        } else {
            likeImg.src = "../images/like-product.png";
            likeBtn.dataset.liked = "true";
            likedProducts.push({ id: productId, title: title });
        }

        updateLikedList();
    });
});

function updateLikedList() {
    const likedList = document.querySelector('.liked-list');
    likedList.innerHTML = '';

    if (likedProducts.length === 0) {
        likedList.innerHTML = '<p>Пока нет лайков</p>';
    } else {
        likedProducts.forEach(product => {
            const item = document.createElement('div');
            item.textContent = product.title;
            likedList.appendChild(item);
        });
    }
}



/* Collapsible product description */
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
    });
}


// ===== 1. ОПРЕДЕЛЯЕМ ЯЗЫК (ЕДИНАЯ ЛОГИКА ДЛЯ ВСЕГО САЙТА) =====

// 1) сначала пробуем взять из URL (?lang=de)
const params = new URLSearchParams(window.location.search);
let lang = params.get('lang');

// 2) если нет в URL — берём из localStorage
if (!lang) {
    lang = localStorage.getItem('siteLang');
}

// 3) если вообще ничего нет — ставим русский по умолчанию
if (!lang) {
    lang = 'ru';
}

// 4) сохраняем язык, чтобы он работал на ВСЕХ страницах
localStorage.setItem('siteLang', lang);

function updateLanguageFlag() {
    const langBtn = document.querySelector('.btn-lang');
    if (!langBtn) return;

    // Убираем старые классы флагов
    langBtn.classList.remove('lang-ru', 'lang-de', 'lang-en');

    // Добавляем нужный класс по текущему языку
    langBtn.classList.add(`lang-${lang}`);
}

// вызываем при загрузке страницы
updateLanguageFlag();


// ===== 2. СЛОВАРЬ (оставляем твой как есть) =====
const translations = {
    ru: {
        cart: "Корзина",
        empty: "Пустая",
        toDelivery: "К доставке",
        delivery: "Доставка",
        payment: "Оплата",
        toPayment: "К оплате",
        toPay: "Оплатить",
        total: "Стоимость:",
        impressum: "Импрессум",
        agb: "Пользовательское соглашение",
        datenschutz: "Политика конфиденциальности",
        paymentmethods: "Выберите способ оплаты",

        firstName: "Имя*",
        lastName: "Фамилия*",
        phone: "Номер телефона*",
        email: "Email*",
        city: "Город*",
        street: "Улица*",
        postcode: "Почтовый индекс*",
        countryGermany: "Германия"
    },

    de: {
        cart: "Warenkorb",
        empty: "ist leer",
        toDelivery: "Zur Lieferung",
        delivery: "Lieferung",
        payment: "Zahlung",
        toPayment: "Zur Zahlung",
        toPay: "Bezahlen",
        total: "Gesamt:",
        impressum: "Impressum",
        agb: "AGB",
        datenschutz: "Datenschutz",
        paymentmethods: "Wählen Sie eine Zahlungsmethode aus",

        firstName: "Vorname*",
        lastName: "Nachname*",
        phone: "Telefonnummer*",
        email: "E-Mail*",
        city: "Stadt*",
        street: "Straße*",
        postcode: "Postleitzahl*",
        countryGermany: "Deutschland"
    },

    en: {
        cart: "Cart",
        empty: "Empty",
        toDelivery: "To Delivery",
        delivery: "Delivery",
        payment: "Payment",
        toPayment: "To payment",
        toPay: "Pay",
        total: "Total:",
        paymentmethods: "Choose a payment method",

        firstName: "First name*",
        lastName: "Last name*",
        phone: "Phone number*",
        email: "Email*",
        city: "City*",
        street: "Street*",
        postcode: "Postal code*",
        countryGermany: "Germany"
    }
};


// ===== 3. ПРИМЕНЯЕМ ПЕРЕВОД =====
document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (translations[lang] && translations[lang][key]) {
        el.textContent = translations[lang][key];
    }
});

document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (translations[lang] && translations[lang][key]) {
        el.placeholder = translations[lang][key];
    }
});

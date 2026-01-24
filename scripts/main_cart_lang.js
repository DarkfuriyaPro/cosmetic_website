// Получаем язык из URL, если нет — по умолчанию русский
const urlParams = new URLSearchParams(window.location.search);
const lang = urlParams.get('lang') || 'ru';

// Словарь переводов
const translations = {
    ru: {
        cart: "Корзина",
        empty: "Пустая",
        toDelivery: "К доставке",
    },
    de: {
        cart: "Warenkorb",
        empty: "ist leer",
        toDelivery: "Zur Lieferung",
        delivery: "Lieferung",
        payment: "Zahlung",
        impressum: "Impressum",
        agb: "AGB",
        datenschutz: "Datenschutz"
    },
    en: {
        cart: "Cart",
        empty: "Empty",
        toDelivery: "To Delivery",
    }
};

// Функция для замены текстов на нужный язык
function setLanguageTexts(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    // Также меняем текст на SVG
    document.querySelectorAll('textPath').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
}

setLanguageTexts(lang);

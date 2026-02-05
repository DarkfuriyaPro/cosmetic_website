// 1. определяем язык
const params = new URLSearchParams(window.location.search);
const lang = params.get('lang') || 'ru';

// 2. переводы
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

// 3. применяем тексты
document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (translations[lang]?.[key]) {
        el.textContent = translations[lang][key];
    }
});

// 3a. placeholder’ы
document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (translations[lang]?.[key]) {
        el.placeholder = translations[lang][key];
    }
});

// 4. корзина → доставка
const deliveryBtn = document.querySelector('.go-to-delivery-btn');
if (deliveryBtn) {
    deliveryBtn.href = `/delivery.html?lang=${lang}`;
}

// 5. доставка → оплата
const payBtn = document.querySelector('.go-to-pay-btn');
if (payBtn) {
    payBtn.href = `/payment.html?lang=${lang}`;
}



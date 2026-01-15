// 1. Берём язык из URL
function getCurrentLang() {
  const params = new URLSearchParams(window.location.search);
  const lang = params.get('lang');

  if (['ru', 'de', 'en'].includes(lang)) {
    return lang;
  }

  return 'ru'; // по умолчанию
}

const currentLang = getCurrentLang();
document.documentElement.lang = currentLang;

// 2. Переводы
const translations = {
  ru: {
    cart: 'Корзина',
    empty: 'Пустая',
    delivery: 'Доставка',
    payment: 'Оплата',
    total: 'Итого:',
    toDelivery: 'К доставке',
    goToCart: 'Перейти в корзину'
  },
  de: {
    cart: 'Warenkorb',
    empty: 'Leer',
    delivery: 'Lieferung',
    payment: 'Zahlung',
    total: 'Gesamt:',
    toDelivery: 'Zur Lieferung',
    goToCart: 'Zum Warenkorb'
  },
  en: {
    cart: 'Cart',
    empty: 'Empty',
    delivery: 'Delivery',
    payment: 'Payment',
    total: 'Total:',
    toDelivery: 'To delivery',
    goToCart: 'Go to cart'
  }
};

// 3. Применяем переводы
function applyTranslations(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  applyTranslations(currentLang);
});

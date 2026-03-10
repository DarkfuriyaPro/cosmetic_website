// =============================================
//  stock.js — управление остатками товаров
// =============================================

const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRgn6Su5cIiKFL69Z3PZkSVmC6m7bHxnHDWz8OBdiBSzrR3BAcTnRxmRYjnP_6L3Go6nw-Cn_Pqhz1r/pub?gid=337012517&single=true&output=csv";

const STOCK_LOW_THRESHOLD = 5;

// ── ТЕКСТЫ НА ТРЁХ ЯЗЫКАХ ────────────────────────────
const STATUS_TEXTS = {
    de: {
        inStock:    { text: "Auf Lager",              color: "#2C5C50" },
        low:        { text: "Nur noch {n} verfügbar", color: "#e07b00" },
        outOfStock: { text: "Nicht verfügbar",          color: "#cc0000" },
        btnDisabled: "Nicht verfügbar",
    },
    ru: {
        inStock:    { text: "В наличии",              color: "#2C5C50" },
        low:        { text: "Осталось {n} шт.",        color: "#e07b00" },
        outOfStock: { text: "Нет в наличии",           color: "#cc0000" },
        btnDisabled: "Нет в наличии",
    },
    en: {
        inStock:    { text: "In Stock",               color: "#2C5C50" },
        low:        { text: "Only {n} left",          color: "#e07b00" },
        outOfStock: { text: "Out of Stock",           color: "#cc0000" },
        btnDisabled: "Out of Stock",
    },
};

// Определяем язык страницы (de/ru/en), fallback → de
const PAGE_LANG = document.documentElement.lang || "de";
const STATUS = STATUS_TEXTS[PAGE_LANG] ?? STATUS_TEXTS["de"];

// ── ГЛАВНАЯ ЛОГИКА ───────────────────────────────────

document.addEventListener("DOMContentLoaded", async () => {
    const productEl = document.querySelector("[data-product-id]");
    if (!productEl) return;

    const productId = productEl.dataset.productId;
    const stockEl   = document.querySelector(".in-stock");
    if (!stockEl) return;

    stockEl.textContent = "...";
    stockEl.style.color = "#aaa";

    try {
        const stock = await fetchStock(productId);
        renderStockStatus(stockEl, stock);
    } catch (err) {
        console.warn("stock.js: не удалось загрузить остатки", err);
        stockEl.textContent = STATUS.inStock.text;
        stockEl.style.color  = STATUS.inStock.color;
    }
});

// ── ПОЛУЧЕНИЕ ОСТАТКА ────────────────────────────────

async function fetchStock(productId) {
    const url = `${SHEET_CSV_URL}&t=${Date.now()}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("CSV fetch failed");

    const text = await response.text();
    const rows = parseCSV(text);

    for (const row of rows) {
        if (!row[0]) continue;
        if (row[0].trim().toLowerCase() === productId.toLowerCase()) {
            const stock = parseInt(row[1], 10);
            return isNaN(stock) ? 999 : stock;
        }
    }

    console.warn(`stock.js: товар "${productId}" не найден в таблице`);
    return 999;
}

// ── ПАРСИНГ CSV ──────────────────────────────────────

function parseCSV(text) {
    return text
        .split("\n")
        .map(line => line.split(",").map(cell => cell.trim().replace(/^"|"$/g, "")))
        .filter(row => row.length >= 2);
}

// ── ОТРИСОВКА СТАТУСА ────────────────────────────────

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
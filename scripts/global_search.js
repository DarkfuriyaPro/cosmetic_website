// =============================================
//  global_search.js — поиск по всем товарам
//  Подключать на главной странице
// =============================================

const PRODUCT_DB = [
  // ── INSTRUMENTS ──────────────────────────────
  { title: "Nagelhautzange aus Edelstahl 10 cm - 7 mm",       price: "21,50", url: "/german/specialist_de/instruments_de/instruments_product_de/TR/TR106C.html" },
  { title: "Zangen 14 cm- Halbmondförmige Schneide",           price: "31,00", url: "/german/specialist_de/instruments_de/instruments_product_de/TR/TR111L.html" },
  { title: "Ergonomischer zangen-gerade Schneide 17 mm",       price: "51,00", url: "/german/specialist_de/instruments_de/instruments_product_de/TR/TR127R.html" },
  { title: "Excavator doppelendig aus Edelstahl",               price: "7,00",  url: "/german/specialist_de/instruments_de/instruments_product_de/RS1.html" },
  { title: "Edelstahl Pinzette - Feine Spitze",                 price: "6,00",  url: "/german/specialist_de/instruments_de/instruments_product_de/PZ103F.html" },
  { title: "Podologen-Set Basic",                               price: "116,50",url: "/german/specialist_de/instruments_de/instruments_product_de/podoset_basic.html" },
  { title: "Medizinische Mikroklingen n° 0 (st 50)",            price: "16,00", url: "/german/specialist_de/instruments_de/instruments_product_de/MICRO/micro-0.html" },
  { title: "Medizinische Mikroklingen n° 0,5 (st 50)",          price: "16,00", url: "/german/specialist_de/instruments_de/instruments_product_de/MICRO/micro-0,5.html" },
  { title: "Medizinische Mikroklingen n° 1 (st 50)",            price: "16,00", url: "/german/specialist_de/instruments_de/instruments_product_de/MICRO/micro-1.html" },
  { title: "Medizinische Mikroklingen n° 2 (st 50)",            price: "16,00", url: "/german/specialist_de/instruments_de/instruments_product_de/MICRO/micro-2.html" },
  { title: "Medizinische Mikroklingen n° 2,5 (st 50)",          price: "16,00", url: "/german/specialist_de/instruments_de/instruments_product_de/MICRO/micro-2,5.html" },
  { title: "Medizinische Mikroklingen n° 3 (st 50)",            price: "16,00", url: "/german/specialist_de/instruments_de/instruments_product_de/MICRO/micro-3.html" },
  { title: "Medizinische Mikroklingen n° 5 (st 25)",            price: "12,00", url: "/german/specialist_de/instruments_de/instruments_product_de/MICRO/micro-5.html" },
  { title: "Griff-kit -ästhetische klingen 0-1 MT1",            price: "44,00", url: "/german/specialist_de/instruments_de/instruments_product_de/KIT/KITSAB.html" },
  { title: "Griff-kit -ästhetische klingen 2-3 MT2",            price: "44,00", url: "/german/specialist_de/instruments_de/instruments_product_de/KIT/KITMAB.html" },
  { title: "Griff-kit -ästhetische mikroklingen 5+MT2",         price: "44,00", url: "/german/specialist_de/instruments_de/instruments_product_de/KIT/KITLAB.html" },
  { title: "Griff-kit – mikroklingen Größe 0-0,5-1",            price: "40,00", url: "/german/specialist_de/instruments_de/instruments_product_de/KT/KT101.html" },
  { title: "Griff-kit – mikroklingen Größe 2-2,5-3",            price: "40,00", url: "/german/specialist_de/instruments_de/instruments_product_de/KT/KT102.html" },
  { title: "Griff-kit – mikroklingen Größe 4-5",                price: "40,00", url: "/german/specialist_de/instruments_de/instruments_product_de/KT/KT103.html" },
  { title: "KIT Shark Handgriffe aus Aluminium 0-3",            price: "55,00", url: "/german/specialist_de/instruments_de/instruments_product_de/MA/MA125A.html" },
  { title: "KIT-Shark Handgriffe Edelstahlköpfe 0-3",           price: "98,00", url: "/german/specialist_de/instruments_de/instruments_product_de/MA/MA126I.html" },
  { title: "Edelstahlgriff Mikroklingen Größe 4-5",             price: "70,00", url: "/german/specialist_de/instruments_de/instruments_product_de/MA/MA107I.html" },
  { title: "Ästhetische Mischklingen 0-0,5-1 (st 23)",          price: "7,50",  url: "/german/specialist_de/instruments_de/instruments_product_de/MIX/MIX0-05-1.html" },
  { title: "Ästhetische Mischklingen 2-2,5-3 (st 24)",          price: "7,50",  url: "/german/specialist_de/instruments_de/instruments_product_de/MIX/MIX2-25-3.html" },
  { title: "Ästhetische Mischklingen 4-5 (st 15)",              price: "7,50",  url: "/german/specialist_de/instruments_de/instruments_product_de/MIX/MIX4-5.html" },
  { title: "Montagewerkzeug für Klingen Größen 0-2",            price: "3,00",  url: "/german/specialist_de/instruments_de/instruments_product_de/MT/MT1.html" },
  { title: "Montagewerkzeug für Klingen Größen 3-5",            price: "3,00",  url: "/german/specialist_de/instruments_de/instruments_product_de/MT/MT2.html" },

  // ── FOOT CARE ────────────────────────────────
  { title: "Medex Nano-emulsion - Vitamine C/E & Q10 - 5x20ml",          price: "224,55", url: "/german/specialist_de/foot_care_de/foot_product_de/V/V2092.html" },
  { title: "Medex Nano-emulsion - Vitamine C/E & Q10 - 20ml",             price: "49,90",  url: "/german/specialist_de/foot_care_de/foot_product_de/V/V2092A.html" },
  { title: "Maske Medex Cure Repair Mask - Acti-Desensible face & neck",  price: "98,40",  url: "/german/specialist_de/foot_care_de/foot_product_de/C/C1438.html" },
  { title: "Maske Medex Cure Repair Mask - Vit.C mit Hylauron",           price: "91,00",  url: "/german/specialist_de/foot_care_de/foot_product_de/C/C1197.html" },
  { title: "Medex Emulsion Highly concentrated Vit. B5 - 5x20ml",         price: "166,40", url: "/german/specialist_de/foot_care_de/foot_product_de/V/V2095.html" },
  { title: "Medex Emulsion Highly concentrated Vit. B5 - 20ml",           price: "35,60",  url: "/german/specialist_de/foot_care_de/foot_product_de/V/V2095A.html" },
  { title: "Serum Medex Blue Protection Vit.P",                            price: "55,90",  url: "/german/specialist_de/foot_care_de/foot_product_de/V/V2088.html" },
  { title: "Serum Medex Highly concentrated Vit. E",                       price: "134,60", url: "/german/specialist_de/foot_care_de/foot_product_de/C/C1183.html" },
  { title: "Medex Desensible Ampullen 6x5 ml",                             price: "57,60",  url: "/german/specialist_de/foot_care_de/foot_product_de/VC/VC2041.html" },
  { title: "Medex Desensible Ampullen 1x5 ml",                             price: "9,60",   url: "/german/specialist_de/foot_care_de/foot_product_de/VC/VC2041A.html" },
  { title: "Schutzcreme Medex Sun with Sence SPF 50",                      price: "35,40",  url: "/german/specialist_de/foot_care_de/foot_product_de/V/V3059.html" },
  { title: "Sanfter Scrubcreme Medex Deep Clean - 150 ml",                 price: "",       url: "/german/specialist_de/foot_care_de/foot_product_de/C/C1113.html" },
  { title: "Medex Cream Desensible - 150 ml",                              price: "66,60",  url: "/german/specialist_de/foot_care_de/foot_product_de/C/C1124.html" },
  { title: "Medex Cream Desensible - 50 ml",                               price: "43,70",  url: "/german/specialist_de/foot_care_de/foot_product_de/V/V2024.html" },
  { title: "Medex Creme Soin de Jour SPF 15 - 150 ml",                     price: "74,40",  url: "/german/specialist_de/foot_care_de/foot_product_de/C/C1136.html" },
  { title: "Medex Creme Soin de Jour SPF 15 - 50 ml",                      price: "48,60",  url: "/german/specialist_de/foot_care_de/foot_product_de/V/V2036.html" },
  { title: "Medex Cranberry Clay Scrub - 500 g",                           price: "44,40",  url: "/german/specialist_de/foot_care_de/foot_product_de/V/V1212.html" },
  { title: "Reinigungsmilch Medex Lait Elure - 250 ml",                    price: "46,50",  url: "/german/specialist_de/foot_care_de/foot_product_de/C/C1202.html" },
  { title: "Lotion für zarte Haut Medex Lotion Fragilis - 250 ml",         price: "44,10",  url: "/german/specialist_de/foot_care_de/foot_product_de/C/C1208.html" },

  // ── ACCESSORIES ──────────────────────────────
  { title: "Mikrokristalline Einweg-Wattestäbchen",                                       price: "1,68", url: "/german/specialist_de/accessories_de/accessories_products/Z/Z001.html" },
  { title: "Hölzerne Wattestäbchen für die Behandlung von Warzen 10 cm",                  price: "1,68", url: "/german/specialist_de/accessories_de/accessories_products/Z/Z002.html" },
  { title: "Hölzerne Wattestäbchen COTTON SWABS-175 20 cm",                               price: "1,68", url: "/german/specialist_de/accessories_de/accessories_products/Z/Z003.html" },
  { title: "Holz-Wattestäbchen, beidseitig, spitz zulaufend, 20 cm",                     price: "0,84", url: "/german/specialist_de/accessories_de/accessories_products/Z/Z004.html" },
  { title: "Kinesiotape 1 Rollen 5 cm x 5 m",                                             price: "4,16", url: "/german/specialist_de/accessories_de/accessories_products/Z/Z005.html" },
  { title: "Wattestäbchen aus Kunststoff zum Auftragen von Bonder",                       price: "1,68", url: "/german/specialist_de/accessories_de/accessories_products/Z/Z006.html" },
];

// ── UI ───────────────────────────────────────────────────────────────

(function () {
  // Ждём загрузки DOM
  document.addEventListener("DOMContentLoaded", () => {
    const input = document.querySelector(".search-input");
    const form  = document.querySelector(".search-form");
    if (!input) return;

    // Создаём выпадающий контейнер результатов
    const dropdown = document.createElement("div");
    dropdown.className = "global-search-dropdown";
    dropdown.style.cssText = `
      display: none;
      position: absolute;
      top: calc(100% + 6px);
      left: 0;
      right: 0;
      background: #ffffff;
      border: 1px solid #2C5C50;
      border-radius: 10px;
      max-height: 360px;
      overflow-y: auto;
      z-index: 200;
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    `;

    // Оборачиваем форму в position:relative чтобы dropdown позиционировался правильно
    const searchSection = document.querySelector(".search-section");
    searchSection.style.position = "relative";
    searchSection.appendChild(dropdown);

    // Блокируем стандартный сабмит формы
    form.addEventListener("submit", (e) => e.preventDefault());

    // Поиск при вводе
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();

      if (q.length < 2) {
        dropdown.style.display = "none";
        dropdown.innerHTML = "";
        return;
      }

      const results = PRODUCT_DB.filter(p =>
        p.title.toLowerCase().includes(q)
      ).slice(0, 8); // максимум 8 результатов

      if (results.length === 0) {
        dropdown.innerHTML = `<div style="padding:14px 18px; color:#2C5C50; font-family:'Roboto Serif',serif; font-size:14px;">Keine Ergebnisse gefunden</div>`;
        dropdown.style.display = "block";
        return;
      }

      dropdown.innerHTML = results.map(p => `
        <a href="${p.url}" style="
          display:flex;
          justify-content:space-between;
          align-items:center;
          padding:12px 18px;
          color:#2C5C50;
          font-family:'Roboto Serif',serif;
          font-size:14px;
          text-decoration:none;
          border-bottom:1px solid rgba(44,92,80,0.12);
          transition:background 0.15s;
        "
        onmouseover="this.style.background='rgba(44,92,80,0.07)'"
        onmouseout="this.style.background=''"
        >
          <span>${p.title}</span>

        </a>
      `).join("");

      dropdown.style.display = "block";
    });

    // Закрываем при клике вне
    document.addEventListener("click", (e) => {
      if (!searchSection.contains(e.target)) {
        dropdown.style.display = "none";
      }
    });

    // Закрываем при нажатии Escape
    input.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        dropdown.style.display = "none";
        input.blur();
      }
    });
  });
})();
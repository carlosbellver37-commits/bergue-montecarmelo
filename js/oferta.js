// "Lo que hacemos": rejilla de 3 × 2 productos (recortados, con su sombra). Al elegir uno,
// los demás se desvanecen, él se queda exactamente en su casilla y su texto y su carta
// aparecen en las casillas libres (la colocación depende de dónde esté; ver oferta.css).
// Se vuelve con "Todos", pulsando otra vez el producto, con Escape, o se pasa al anterior
// o siguiente con los botones o las flechas del teclado.
// Contenidos: los mismos que la web de Las Tablas (misma oferta en las dos tiendas).
// PENDIENTE: precios (cuando el cliente los facilite, van en "lado") y foto de Salados.

const IMG = "assets/img/oferta";
const COLUMNAS = 3;
const SALIDA_MS = 240;
const ENTRADA_MS = 650;
const ESCALONADO_MS = 26;
const RETRASO_ENTRADA_MS = 300;   // espera a que los demás productos se hayan desvanecido

const SERVICIOS = [
  {
    id: "cafeteria",
    nombre: "Cafetería",
    frase: "Café de Colombia, como en casa",
    lead: "El café de siempre, donde siempre. Por la mañana, desayunos con bollería del día y tostadas de nuestro pan; por la tarde, tortitas, gofres y chocolate con churros.",
    items: [
      { n: "Café de Colombia de la casa", d: "Seleccionado y servido como siempre" },
      { n: "Infusiones", d: "Té e infusiones variadas" },
      { n: "Tostada con aguacate", d: "Entera o media" },
      { n: "Tostada con aguacate y jamón ibérico", d: "Entera o media" },
      { n: "Bocadillo de tortilla de patatas", d: "En pan del obrador" },
      { n: "Bocadillo de jamón ibérico", d: "Con aceite de oliva virgen" },
      { n: "Bocadillo de bacon y queso", d: "En pan del obrador" },
      { n: "Croissants y napolitanas", d: "Bollería recién hecha" },
      { n: "Tortitas con nata", d: "Para merendar" },
      { n: "Gofres", d: "Para merendar" },
      { n: "Chocolate con churros", d: "Cuando aprieta el frío" },
      { n: "Refrescos, vinos y cavas", d: "Para acompañar" },
    ],
  },
  {
    id: "pasteleria",
    nombre: "Pastelería",
    tipoEncargo: "tarta",
    frase: "Para el mejor final de cualquier comida",
    lead: "Tartas, pasteles y dulces elaborados de forma tradicional: bizcochos horneados cada día, nata montada en el obrador y fruta fresca. Todas las tartas pueden ir dedicadas.",
    encargo: true,
    items: [
      { n: "San Marcos", d: "De nata o de trufa" },
      { n: "Sacher", d: "Tarta de la casa" },
      { n: "Selva Negra", d: "Chocolate, nata y cerezas" },
      { n: "Chocolate y arándanos", d: "Tarta de la casa" },
      { n: "Chocolate blanco con mango", d: "Tarta de la casa" },
      { n: "Trufa a la naranja", d: "Tarta de la casa" },
      { n: "Hojaldre con frambuesas", d: "Tarta de la casa" },
      { n: "Nata y fresón", d: "Tarta de la casa" },
      { n: "Petisús", d: "De chocolate, crema o café" },
      { n: "Milhojas", d: "Pastel individual" },
      { n: "Tartaletas de fruta", d: "Pastel individual" },
      { n: "Pastas de té", d: "Al peso o en bandeja" },
    ],
  },
  {
    id: "pan",
    nombre: "Pan y bollería",
    frase: "Fermentación lenta, corteza que cruje",
    lead: "Un buen pan necesita tiempo: amasado, fermentación lenta y reposo. Horneamos diecisiete panes varias veces cada mañana, y del mismo horno sale la bollería del día.",
    items: [
      { n: "Chapata", d: "Miga alveolada y corteza fina" },
      { n: "Baguette", d: "Crujiente por fuera, tierna por dentro" },
      { n: "Pistola", d: "La barra de siempre" },
      { n: "Barra gallega", d: "Corteza gruesa y miga húmeda" },
      { n: "Pan de pueblo", d: "Corteza dura y miga prieta" },
      { n: "Pan de cereales", d: "Semillas y harinas variadas" },
      { n: "Pan de espelta", d: "Cereal antiguo, aromático" },
      { n: "Hogaza de maíz e higo", d: "Dorada, con un punto dulce" },
      { n: "Pan de picos", d: "La corteza más crujiente de la casa" },
      { n: "Croissants", d: "De mantequilla" },
      { n: "Napolitanas y ensaimadas", d: "Bollería del día" },
      { n: "Palmeritas jugositas", d: "Lotus, Kinder, pistacho y seis sabores más" },
    ],
  },
  {
    id: "temporada",
    nombre: "Temporada",
    tipoEncargo: "temporada",
    frase: "Cada fiesta tiene su dulce",
    lead: "Seguimos el calendario de Madrid. Solo los hacemos unas semanas al año, así que conviene encargarlos con tiempo.",
    encargo: true,
    items: [
      { n: "Roscón de Reyes", d: "De nata, trufa o crema", lado: "Enero" },
      { n: "Torrijas", d: "Clásicas o con crema", lado: "Semana Santa" },
      { n: "Monas y huevos de Pascua", d: "Para los más pequeños", lado: "Pascua" },
      { n: "Rosquillas de San Isidro", d: "Tontas, listas y de Santa Clara", lado: "Mayo" },
      { n: "Huesos de santo y buñuelos", d: "Dulces de otoño", lado: "Noviembre" },
      { n: "Corona de la Almudena", d: "La de la patrona de Madrid", lado: "9 nov" },
      { n: "Turrones y polvorones", d: "Para la mesa de Navidad", lado: "Diciembre" },
    ],
  },
  {
    id: "heladeria",
    nombre: "Heladería",
    frase: "Para cuando aprieta el calor",
    lead: "Helado en cucurucho o en copa, granizados, batidos y frappelatte. Para tomar en la terraza o para llevar de paseo. Pregunta por los sabores del día.",
    items: [
      { n: "Copa Ibiza", d: "Montada al momento" },
      { n: "Copa Alicante", d: "Montada al momento" },
      { n: "Copa Fantasía", d: "Montada al momento" },
      { n: "Cucuruchos", d: "Para llevar de paseo" },
      { n: "Granizados", d: "Frescos y de temporada" },
      { n: "Batidos", d: "Para tomar o llevar" },
      { n: "Sorbetes", d: "Ligeros, de fruta" },
      { n: "Smoothies", d: "De fruta" },
      { n: "Yogur helado", d: "Para tomar o llevar" },
      { n: "Frappelatte", d: "Para el verano" },
    ],
  },
  {
    id: "gourmet",
    nombre: "Gourmet",
    frase: "Lo bueno, también para llevar",
    lead: "Nuestra despensa, elegida con el mismo cuidado que el obrador. Si buscas algo que no tenemos, pídenoslo e intentaremos conseguirlo.",
    items: [
      { n: "Vinos y cavas", d: "Para una comida o para regalar" },
      { n: "Foie", d: "De la despensa" },
      { n: "Quesos", d: "De la despensa" },
      { n: "Embutidos ibéricos", d: "De la despensa" },
      { n: "Conservas", d: "De la despensa" },
      { n: "Mermeladas Sabores del Guijo", d: "Artesanas, de Extremadura" },
      { n: "Miel La Virgen de Extremadura", d: "100 % pura, diez variedades" },
      { n: "Cafés de origen", d: "Colombia, Kenia y Guatemala" },
      { n: "Bombones", d: "Para regalar" },
      { n: "Bajo pedido", d: "Te buscamos lo que necesites" },
    ],
  },
];

const raiz = document.querySelector("[data-oferta]");
const vitrina = raiz.querySelector("[data-vitrina]");
const total = SERVICIOS.length;
const estrecha = window.matchMedia("(max-width: 860px)");

const escapar = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const dos = (n) => String(n).padStart(2, "0");

let abierto = -1;   // índice del producto elegido (-1: ninguno)
let cambio = 0;     // identifica el cambio en curso (para clics rápidos)

/* --- Productos --- */

const botones = SERVICIOS.map((s, i) => {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "vitrina__item";
  b.id = `vitrina-${s.id}`;
  b.setAttribute("aria-pressed", "false");
  b.style.setProperty("--c", (i % COLUMNAS) + 1);
  b.style.setProperty("--r", Math.floor(i / COLUMNAS) + 1);
  b.innerHTML = `<span class="vitrina__num">${dos(i + 1)}.</span>
      <span class="vitrina__foto"><img src="${IMG}/${s.id}-480.webp" srcset="${IMG}/${s.id}-480.webp 1x, ${IMG}/${s.id}-900.webp 2x" alt="" loading="lazy" /></span>
      <span class="vitrina__nombre">${escapar(s.nombre)}</span>`;
  b.addEventListener("click", () => (abierto === i ? cerrar() : abrir(i)));
  vitrina.append(b);
  return b;
});

/* --- Ficha: dos bloques que viven dentro de la propia rejilla --- */

const sobre = document.createElement("div");
sobre.className = "ficha__sobre";
sobre.setAttribute("aria-live", "polite");
sobre.hidden = true;
const carta = document.createElement("div");
carta.className = "ficha__carta";
carta.hidden = true;
vitrina.append(sobre, carta);

function htmlSobre(i) {
  const s = SERVICIOS[i];
  return `<div class="ficha__cab">
      <p class="ficha__etiqueta"><button type="button" class="ficha__todos" data-todos>← Todos</button><span>${dos(i + 1)} · El mostrador</span></p>
      <h3 class="ficha__titulo">${escapar(s.nombre)}</h3>
      <p class="ficha__frase">${escapar(s.frase)}</p>
    </div>
    <div class="ficha__cuerpo">
      <p class="ficha__lead">${escapar(s.lead)}</p>
      <div class="ficha__acciones">
        ${s.encargo ? `<a class="ficha__encargo" href="#encargos">Hacer un encargo →</a>` : ""}
        <span class="ficha__pasos">
          <button type="button" class="ficha__paso" data-paso="-1" aria-label="Producto anterior">← Anterior</button>
          <button type="button" class="ficha__paso" data-paso="1" aria-label="Producto siguiente">Siguiente →</button>
        </span>
      </div>
    </div>`;
}

function htmlCarta(i) {
  const s = SERVICIOS[i];
  const items = s.items.map((p, j) => {
    const dentro = `<span class="carta-lista__num">${dos(j + 1)}.</span>
      <span class="carta-lista__nombre">${escapar(p.n)}</span>
      <span class="carta-lista__lado">${p.lado ? escapar(p.lado) : ""}</span>
      ${s.encargo ? `<span class="carta-lista__ir" aria-hidden="true">Encargar →</span>` : ""}
      ${p.d ? `<span class="carta-lista__desc">${escapar(p.d)}</span>` : ""}`;
    return s.encargo
      ? `<li><button type="button" class="carta-item carta-item--encargo" data-encargar="${j}" aria-label="Encargar ${escapar(p.n)}">${dentro}</button></li>`
      : `<li><div class="carta-item">${dentro}</div></li>`;
  }).join("");
  return `<p class="ficha__etiqueta">La carta</p>
    <ol class="carta-lista${s.encargo ? " carta-lista--encargo" : ""}">${items}</ol>
    <p class="ficha__nota">${s.encargo ? "Pulsa un dulce para encargarlo. " : ""}Precios y disponibilidad en tienda.</p>`;
}

// Piezas que entran y salen escalonadas
const partes = () => [
  ...sobre.querySelectorAll(".ficha__cab > *, .ficha__cuerpo > *"),
  ...carta.querySelectorAll(".ficha__etiqueta, .carta-lista > li, .ficha__nota"),
];

const entrar = (els, retraso) => els.forEach((el, j) => el.animate(
  [{ opacity: 0, transform: "translateY(14px)", filter: "blur(3px)" },
    { opacity: 1, transform: "none", filter: "blur(0)" }],
  { duration: ENTRADA_MS, delay: retraso + j * ESCALONADO_MS, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "backwards" }));

const salir = (els) => Promise.all(els.map((el, j) => el.animate(
  [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(-8px)" }],
  { duration: SALIDA_MS, delay: Math.min(j, 8) * 10, easing: "ease-in", fill: "forwards" }).finished.catch(() => {})));

/* --- Abrir y cerrar --- */

async function abrir(i) {
  const id = ++cambio;
  const yaAbierto = abierto >= 0;
  if (yaAbierto) await salir(partes());
  if (id !== cambio) return;

  abierto = i;
  const c = (i % COLUMNAS) + 1;
  const r = Math.floor(i / COLUMNAS) + 1;
  vitrina.dataset.pos = `r${r}c${c}`;
  sobre.innerHTML = htmlSobre(i);
  carta.innerHTML = htmlCarta(i);
  sobre.hidden = false;
  carta.hidden = false;
  vitrina.classList.add("is-abierta");
  botones.forEach((b, j) => {
    b.classList.toggle("is-elegido", j === i);
    b.setAttribute("aria-pressed", String(j === i));
  });
  entrar(partes(), yaAbierto ? 120 : RETRASO_ENTRADA_MS);
  if (estrecha.matches) vitrina.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function cerrar() {
  if (abierto < 0) return;
  const id = ++cambio;
  await salir(partes());
  if (id !== cambio) return;
  abierto = -1;
  sobre.hidden = true;
  carta.hidden = true;
  delete vitrina.dataset.pos;
  vitrina.classList.remove("is-abierta");
  botones.forEach((b) => {
    b.classList.remove("is-elegido");
    b.setAttribute("aria-pressed", "false");
  });
  medirCelda();
}

vitrina.addEventListener("click", (e) => {
  const pieza = e.target.closest("[data-encargar]");
  if (pieza && abierto >= 0) {
    const s = SERVICIOS[abierto];
    const p = s.items[Number(pieza.dataset.encargar)];
    const detalle = [p.n, p.d && `(${p.d})`, p.lado && `· ${p.lado}`].filter(Boolean).join(" ");
    window.dispatchEvent(new CustomEvent("bergue:encargar", { detail: { tipo: s.tipoEncargo, texto: `${detalle}. Cantidad: ` } }));
    return;
  }
  if (e.target.closest("[data-todos]")) return cerrar();
  const paso = e.target.closest("[data-paso]");
  if (paso) abrir((abierto + Number(paso.dataset.paso) + total) % total);
});

document.addEventListener("keydown", (e) => {
  if (abierto < 0 || e.target.closest("input, textarea, select")) return;
  if (e.key === "Escape") cerrar();
  if (e.key === "ArrowRight") abrir((abierto + 1) % total);
  if (e.key === "ArrowLeft") abrir((abierto - 1 + total) % total);
});

/* --- Alto de fila: el elegido no debe moverse aunque el texto sea más corto --- */

function medirCelda() {
  if (abierto >= 0) return;
  vitrina.style.setProperty("--celda", "0px");
  if (estrecha.matches) return;
  vitrina.style.setProperty("--celda", `${Math.ceil(Math.max(...botones.map((b) => b.getBoundingClientRect().height)))}px`);
}

medirCelda();
document.fonts.ready.then(medirCelda);
window.addEventListener("resize", () => requestAnimationFrame(medirCelda));
// Portada de Bergue Montecarmelo: entrada letra a letra de "Bergue" y ajuste de su
// tamaño al hueco disponible. Las animaciones se ejecutan siempre, aunque el
// dispositivo pida "reducir movimiento".

const TITULO_ANCHO_MAX = 0.8;  // fracción del ancho del hero que puede ocupar "Bergue"
const TITULO_ALTO_MAX = 0.3;   // en escritorio, fracción del alto de pantalla

const hero = document.querySelector("[data-hero]");
const marca = hero.querySelector("[data-titulo]");
const titulo = marca.parentElement;

function partirLetras() {
  const texto = marca.textContent;
  marca.textContent = "";
  [...texto].forEach((letra, i) => {
    const span = document.createElement("span");
    span.textContent = letra;
    span.style.setProperty("--i", i);
    marca.append(span);
  });
}

function ajustarTitulo() {
  const disponible = hero.clientWidth * TITULO_ANCHO_MAX;
  titulo.style.fontSize = "100px";
  const ancho = marca.getBoundingClientRect().width;
  if (ancho === 0) return;
  const porAncho = (100 * disponible) / ancho;
  const porAlto = window.innerWidth > 680 ? window.innerHeight * TITULO_ALTO_MAX : Infinity;
  titulo.style.fontSize = `${Math.min(porAncho, porAlto)}px`;
}

partirLetras();
document.fonts.ready.then(ajustarTitulo);
new ResizeObserver(ajustarTitulo).observe(hero);

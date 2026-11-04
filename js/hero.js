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

// La imagen usa object-fit: contain: el vapor sigue sus dimensiones visibles,
// no las de la columna, para quedar siempre encima de la taza.
const producto = hero.querySelector(".hero__producto");
const imagen = producto.querySelector(".hero__img");
const vapor = producto.querySelector(".hero__vapor");

function ajustarVapor() {
  if (!imagen.naturalWidth || !imagen.naturalHeight) return;
  const escala = Math.min(imagen.clientWidth / imagen.naturalWidth, imagen.clientHeight / imagen.naturalHeight);
  const ancho = imagen.naturalWidth * escala;
  const alto = imagen.naturalHeight * escala;
  vapor.style.width = `${ancho}px`;
  vapor.style.height = `${alto}px`;
  vapor.style.left = `${imagen.offsetLeft + (imagen.clientWidth - ancho) / 2}px`;
  vapor.style.top = `${imagen.offsetTop + imagen.clientHeight - alto}px`;
}

new ResizeObserver(ajustarVapor).observe(producto);
imagen.addEventListener("load", ajustarVapor);
ajustarVapor();

// Vídeo del café: si el sistema bloquea la reproducción automática (p. ej. iPhone con ahorro de batería),
// se reintenta con el primer gesto de la persona. Mientras tanto se ve el primer fotograma, sin botón.
const videoCafe = document.querySelector(".hero__cafe-video");
if (videoCafe) {
  const marcar = () => videoCafe.classList.add("is-reproduciendo");
  videoCafe.addEventListener("playing", marcar);
  if (!videoCafe.paused && videoCafe.readyState > 2) marcar();
  const reproducir = () => videoCafe.play().catch(() => {});
  reproducir();
  ["touchstart", "pointerdown", "scroll", "keydown"].forEach((tipo) =>
    window.addEventListener(
      tipo,
      () => {
        if (videoCafe.paused) reproducir();
      },
      { once: true, passive: true },
    ),
  );
}

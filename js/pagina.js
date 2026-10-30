// Comportamiento común de la página: la cabecera se convierte en cápsula de cristal al
// bajar, marca la sección visible, y las piezas aparecen o se dibujan al entrar en pantalla.
// Todo se anima siempre, aunque el dispositivo pida "reducir movimiento".

const UMBRAL_CAPSULA_PX = 40;   // scroll a partir del cual la barra pasa a cápsula
const UMBRAL_APARICION = 0.2;   // fracción visible para que una pieza aparezca

const cabecera = document.querySelector("[data-cabecera]");
const zonasOscuras = [...document.querySelectorAll("[data-oscuro]")];

/* --- Cápsula de cristal --- */

let pendiente = false;

function actualizarCabecera() {
  pendiente = false;
  cabecera.classList.toggle("is-flotante", window.scrollY > UMBRAL_CAPSULA_PX);
  // Sobre una zona oscura (encargos, pie) el cristal se tiñe para seguir leyéndose
  const caja = cabecera.getBoundingClientRect();
  const centro = caja.top + caja.height / 2;
  const sobreOscuro = zonasOscuras.some((zona) => {
    const z = zona.getBoundingClientRect();
    return z.top <= centro && z.bottom >= centro;
  });
  cabecera.classList.toggle("sobre-oscuro", sobreOscuro);
}

window.addEventListener("scroll", () => {
  if (pendiente) return;
  pendiente = true;
  requestAnimationFrame(actualizarCabecera);
}, { passive: true });
actualizarCabecera();

/* --- Sección activa en el menú --- */

const enlaces = new Map(
  [...cabecera.querySelectorAll("[data-enlace]")].map((a) => [a.dataset.enlace, a]),
);

const observadorSecciones = new IntersectionObserver((entradas) => {
  entradas.forEach((e) => {
    const enlace = enlaces.get(e.target.id);
    if (!enlace) return;
    if (e.isIntersecting) {
      enlaces.forEach((a) => a.removeAttribute("aria-current"));
      enlace.setAttribute("aria-current", "true");
    } else if (enlace.hasAttribute("aria-current")) {
      enlace.removeAttribute("aria-current");
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });

enlaces.forEach((_, id) => {
  const seccion = document.getElementById(id);
  if (seccion) observadorSecciones.observe(seccion);
});

/* --- Apariciones y recuadros que se dibujan --- */

function alEntrar(selector, clase, umbral = UMBRAL_APARICION) {
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add(clase);
      observador.unobserve(e.target);
    });
  }, { threshold: umbral });
  document.querySelectorAll(selector).forEach((el) => observador.observe(el));
}

alEntrar("[data-reveal]", "is-visible");
alEntrar("[data-trazar]", "is-trazado", 0.4);

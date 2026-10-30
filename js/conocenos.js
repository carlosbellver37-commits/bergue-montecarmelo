// "Conócenos": profundidad y contorno, con la misma esencia que la web de Las Tablas.
//  · Sombras: cada objeto de la fachada (terraza, bolardos, cartel, focos, toldos) proyecta
//    una sombra que se aleja del ratón, como si fuera una luz. El objeto va encima.
//  · Contorno: una línea por encima del título y otra por debajo que baja hasta la
//    esquina del local; se dibujan a medida que la sección entra en pantalla.

import { OBJETOS } from "./fachada-datos.js";

const CARPETA = "assets/img/fachada";
const ALCANCE = 0.12;       // px de sombra por px de distancia al ratón
const MAXIMO = 46;          // desplazamiento máximo (px) antes de la profundidad
const RADIO_CONTORNO = 44;  // radio de las esquinas de la línea
const SEPARACION = 16;      // distancia entre el título y la línea de abajo

const seccion = document.querySelector("[data-conocenos]");
const fachada = seccion.querySelector("[data-fachada]");
const capaSombras = fachada.querySelector("[data-sombras]");
const capaRecortes = fachada.querySelector("[data-recortes]");

/* --- Sombras --- */

const colocar = (img, caja) => {
  img.style.left = `${caja.left}%`;
  img.style.top = `${caja.top}%`;
  img.style.width = `${caja.width}%`;
  img.style.height = `${caja.height}%`;
};

const sombras = Object.entries(OBJETOS).map(([nombre, o]) => {
  const sombra = new Image();
  sombra.src = `${CARPETA}/sombra-${nombre}.webp`;
  sombra.alt = "";
  sombra.loading = "lazy";
  sombra.style.setProperty("--prof", o.prof);
  colocar(sombra, o.sombra);
  capaSombras.append(sombra);

  const recorte = new Image();
  recorte.src = `${CARPETA}/pieza-${nombre}.webp`;
  recorte.alt = "";
  recorte.loading = "lazy";
  colocar(recorte, o.pieza);
  capaRecortes.append(recorte);

  return { el: sombra, prof: o.prof, cx: 0, cy: 0 };
});

// Centro de cada sombra en el documento, sin su desplazamiento (se mide al cambiar de tamaño)
function medirSombras() {
  const caja = capaSombras.getBoundingClientRect();
  const x0 = caja.left + window.scrollX;
  const y0 = caja.top + window.scrollY;
  sombras.forEach((s) => {
    const el = s.el;
    s.cx = x0 + el.offsetLeft + el.offsetWidth / 2;
    s.cy = y0 + el.offsetTop + el.offsetHeight / 2;
  });
}

let pendiente = null;

function moverLuz(x, y) {
  if (pendiente) cancelAnimationFrame(pendiente);
  pendiente = requestAnimationFrame(() => {
    const px = x + window.scrollX;
    const py = y + window.scrollY;
    sombras.forEach((s) => {
      const dx = s.cx - px;
      const dy = s.cy - py;
      const dist = Math.hypot(dx, dy) || 1;
      const mag = Math.min(dist * ALCANCE, MAXIMO) * s.prof;
      s.el.style.transform = `translate(${((dx / dist) * mag).toFixed(1)}px, ${((dy / dist) * mag).toFixed(1)}px)`;
    });
  });
}

// La luz sigue al ratón por toda la sección; solo con ratón (en táctil no hay cursor)
seccion.addEventListener("pointermove", (e) => {
  if (e.pointerType === "mouse") moverLuz(e.clientX, e.clientY);
});

/* --- Contorno --- */

const svg = seccion.querySelector("[data-contorno]");
const tramos = {
  arriba: svg.querySelector('[data-tramo="arriba"]'),
  abajo: svg.querySelector('[data-tramo="abajo"]'),
};
const titulo = seccion.querySelector(".titulo-seccion");
const desde = seccion.querySelector(".conocenos__desde");
const imagen = fachada.querySelector(".fachada__img");

/** Polilínea con las esquinas redondeadas (radio r, recortado si el tramo es corto). */
function redondeada(puntos, r) {
  const n = (v) => v.toFixed(1);
  let d = `M${n(puntos[0][0])} ${n(puntos[0][1])}`;
  for (let i = 1; i < puntos.length - 1; i++) {
    const [ax, ay] = puntos[i - 1];
    const [bx, by] = puntos[i];
    const [cx, cy] = puntos[i + 1];
    const l1 = Math.hypot(bx - ax, by - ay) || 1;
    const l2 = Math.hypot(cx - bx, cy - by) || 1;
    const k = Math.min(r, l1 / 2, l2 / 2);
    d += `L${n(bx - ((bx - ax) / l1) * k)} ${n(by - ((by - ay) / l1) * k)}`;
    d += `Q${n(bx)} ${n(by)} ${n(bx + ((cx - bx) / l2) * k)} ${n(by + ((cy - by) / l2) * k)}`;
  }
  const [ux, uy] = puntos[puntos.length - 1];
  return `${d}L${n(ux)} ${n(uy)}`;
}

function trazarContorno() {
  const base = seccion.getBoundingClientRect();
  const rel = (el) => {
    const r = el.getBoundingClientRect();
    return { l: r.left - base.left, r: r.right - base.left, t: r.top - base.top, b: r.bottom - base.top };
  };
  const t = rel(titulo);
  const d = rel(desde);
  const f = rel(imagen);
  svg.setAttribute("viewBox", `0 0 ${base.width} ${base.height}`);

  // Arriba: recta sobre el título, casi hasta el borde derecho
  const yArriba = Math.max(8, t.t - 10);
  tramos.arriba.setAttribute("d", `M${t.l} ${yArriba}H${(base.width * 0.965).toFixed(1)}`);

  // Abajo: bajo el título → hasta el borde derecho de la fachada → baja hasta su esquina
  const yAbajo = Math.max(t.b, d.b) + SEPARACION;
  tramos.abajo.setAttribute("d", redondeada([[t.l, yAbajo], [f.r, yAbajo], [f.r, f.t + 6]], RADIO_CONTORNO));
}

// El dibujo avanza con el scroll: empieza al asomar la sección y termina a media pantalla
function dibujarContorno() {
  const alto = window.innerHeight;
  const arriba = seccion.getBoundingClientRect().top;
  const avance = Math.min(1, Math.max(0, (alto * 0.85 - arriba) / (alto * 0.55)));
  const offset = (1000 * (1 - avance)).toFixed(1);
  tramos.arriba.style.strokeDashoffset = offset;
  tramos.abajo.style.strokeDashoffset = offset;
}

let pendienteScroll = false;
window.addEventListener("scroll", () => {
  if (pendienteScroll) return;
  pendienteScroll = true;
  requestAnimationFrame(() => {
    pendienteScroll = false;
    dibujarContorno();
  });
}, { passive: true });

/* --- Arranque --- */

function rehacer() {
  medirSombras();
  trazarContorno();
  dibujarContorno();
}

document.fonts.ready.then(rehacer);
imagen.addEventListener("load", rehacer);
new ResizeObserver(rehacer).observe(seccion);

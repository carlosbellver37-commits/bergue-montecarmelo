// Aviso informativo de cookies: se muestra hasta que la persona pulsa "Aceptar".
// Solo guarda en el navegador que se ha aceptado (no identifica a nadie ni se envía a ningún servidor).
const CLAVE = "cookies-aviso";

function yaAceptado() {
  try {
    return localStorage.getItem(CLAVE) === "ok";
  } catch {
    return false;
  }
}

function recordar() {
  try {
    localStorage.setItem(CLAVE, "ok");
  } catch {
    /* sin almacenamiento: el aviso simplemente volverá a salir en la próxima visita */
  }
}

function cerrar(aviso) {
  aviso.classList.add("is-saliendo");
  const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  setTimeout(() => aviso.remove(), sinMovimiento ? 0 : 260);
}

if (!yaAceptado()) {
  const aviso = document.createElement("div");
  aviso.className = "aviso-cookies";
  aviso.setAttribute("role", "region");
  aviso.setAttribute("aria-label", "Aviso de cookies");
  aviso.innerHTML =
    '<p class="aviso-cookies__etiqueta">Cookies</p>' +
    '<h2 class="aviso-cookies__titulo">Sin cookies de seguimiento</h2>' +
    '<p class="aviso-cookies__texto">Esta web no instala cookies de seguimiento ni de publicidad y no recoge datos personales sin tu conocimiento. ' +
    "Solo carga tipografías de Google y enlaza a WhatsApp y Google Maps, servicios de terceros con sus propias políticas de privacidad.</p>" +
    '<div class="aviso-cookies__acciones">' +
    '<a class="aviso-cookies__enlace" href="/cookies/">Política de cookies</a>' +
    '<button type="button" class="aviso-cookies__boton">Aceptar</button></div>';
  aviso.querySelector("button").addEventListener("click", () => {
    recordar();
    cerrar(aviso);
  });
  document.body.append(aviso);
}

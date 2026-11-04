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

if (!yaAceptado()) {
  const aviso = document.createElement("div");
  aviso.className = "aviso-cookies";
  aviso.setAttribute("role", "region");
  aviso.setAttribute("aria-label", "Aviso de cookies");
  aviso.innerHTML =
    '<p class="aviso-cookies__texto"><strong>Cookies.</strong> Esta web no instala cookies de seguimiento ni de publicidad y no recoge datos personales sin tu conocimiento. ' +
    "Carga tipografías de Google y contiene enlaces a WhatsApp y Google Maps, servicios de terceros con políticas de privacidad propias que tú decides si aceptas al usarlos. " +
    'Para más información consulta la <a href="/cookies/">política de cookies</a>.</p>' +
    '<button type="button" class="aviso-cookies__boton">Aceptar</button>';
  aviso.querySelector("button").addEventListener("click", () => {
    recordar();
    aviso.remove();
  });
  document.body.append(aviso);
}

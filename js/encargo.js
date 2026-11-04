// Formulario de encargos: valida, avisa de lo que falta y abre WhatsApp con el mensaje preparado.
import { validar, construirMensaje, enlaceWhatsApp, fechaMinima } from "./encargo-mensaje.js";
import { mejorarSelect } from "./selector.js";

const form = document.querySelector("[data-encargo]");

if (form) {
  const estado = form.querySelector("[data-estado]");
  const campos = [...form.querySelectorAll("[data-campo]")];
  const fecha = form.elements.fecha;
  fecha.min = fechaMinima();
  form.querySelectorAll("select").forEach(mejorarSelect);

  const leer = () => Object.fromEntries(campos.map((c) => [c.name, c.value]));

  function marcar(errores) {
    campos.forEach((c) => {
      const texto = errores[c.name] || "";
      const aviso = form.querySelector(`[data-error="${c.name}"]`);
      c.setAttribute("aria-invalid", texto ? "true" : "false");
      if (c.focusTarget) c.focusTarget.setAttribute("aria-invalid", texto ? "true" : "false");
      if (aviso) aviso.textContent = texto;
    });
  }

  // Quita el aviso de un campo en cuanto se corrige
  campos.forEach((c) => c.addEventListener("input", () => {
    if (c.getAttribute("aria-invalid") !== "true") return;
    marcar(validar(leer()).errores);
  }));

  // Panel de reserva: al pulsar un producto de la carta, el mismo formulario se abre en una ventana
  const panel = document.querySelector("[data-reserva]");
  const hueco = panel && panel.querySelector("[data-reserva-hueco]");
  const producto = panel && panel.querySelector("[data-reserva-producto]");
  const origen = document.createComment("formulario de encargo");
  let lanzador = null;

  function abrirPanel(texto) {
    form.before(origen);
    hueco.append(form);
    form.classList.add("is-visible");
    producto.textContent = texto ? "Tu encargo: " + texto.replace(/\.?\s*Cantidad:\s*$/, "") : "";
    if (!panel.open) panel.showModal();
  }

  function cerrarPanel() {
    if (panel.open) panel.close();
  }

  if (panel) {
    panel.addEventListener("close", () => {
      if (origen.parentNode) origen.replaceWith(form);   // el formulario vuelve a su sitio
      if (lanzador && lanzador.isConnected) lanzador.focus({ preventScroll: true });
    });
    // Escape cierra solo el panel, no el mostrador de la carta que hay detrás
    panel.addEventListener("keydown", (e) => { if (e.key === "Escape") e.stopPropagation(); });
    panel.querySelector("[data-reserva-cerrar]").addEventListener("click", cerrarPanel);
    // Clic fuera de la ventana: se cierra
    panel.addEventListener("click", (e) => { if (e.target === panel) cerrarPanel(); });
  }

  window.addEventListener("bergue:encargar", (evento) => {
    const { tipo, texto } = evento.detail || {};
    const tipoCampo = form.elements.tipo;
    if (tipo && [...tipoCampo.options].some((o) => o.value === tipo)) {
      tipoCampo.value = tipo;
      tipoCampo.dispatchEvent(new Event("change", { bubbles: true }));
    }
    const detalle = form.elements.detalle;
    detalle.value = texto || "";
    marcar({});
    estado.textContent = "";
    if (!panel) return;
    lanzador = document.activeElement;
    abrirPanel(texto);
    detalle.focus({ preventScroll: true });
    detalle.setSelectionRange(detalle.value.length, detalle.value.length);
  });

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const { ok, errores, datos } = validar(leer());
    marcar(errores);
    if (!ok) {
      estado.textContent = "Revisa los campos marcados.";
      estado.dataset.tipo = "error";
      const primero = campos.find((c) => errores[c.name]);
      if (primero) (primero.focusTarget || primero).focus();
      return;
    }
    const url = enlaceWhatsApp(construirMensaje(datos));
    estado.textContent = "Se abre WhatsApp con tu mensaje: pulsa Enviar para que nos llegue.";
    estado.dataset.tipo = "ok";
    // Dentro del gesto del usuario, para que el navegador no bloquee la ventana
    const ventana = window.open(url, "_blank", "noopener");
    if (!ventana) window.location.assign(url);
  });
}

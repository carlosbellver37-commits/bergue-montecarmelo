// Formulario de encargos: valida, avisa de lo que falta y abre WhatsApp con el mensaje preparado.
import { validar, construirMensaje, enlaceWhatsApp, fechaMinima } from "./encargo-mensaje.js";

const form = document.querySelector("[data-encargo]");

if (form) {
  const estado = form.querySelector("[data-estado]");
  const campos = [...form.querySelectorAll("[data-campo]")];
  const fecha = form.elements.fecha;
  fecha.min = fechaMinima();

  const leer = () => Object.fromEntries(campos.map((c) => [c.name, c.value]));

  function marcar(errores) {
    campos.forEach((c) => {
      const texto = errores[c.name] || "";
      const aviso = form.querySelector(`[data-error="${c.name}"]`);
      c.setAttribute("aria-invalid", texto ? "true" : "false");
      if (aviso) aviso.textContent = texto;
    });
  }

  // Quita el aviso de un campo en cuanto se corrige
  campos.forEach((c) => c.addEventListener("input", () => {
    if (c.getAttribute("aria-invalid") !== "true") return;
    marcar(validar(leer()).errores);
  }));

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const { ok, errores, datos } = validar(leer());
    marcar(errores);
    if (!ok) {
      estado.textContent = "Revisa los campos marcados.";
      estado.dataset.tipo = "error";
      const primero = campos.find((c) => errores[c.name]);
      if (primero) primero.focus();
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

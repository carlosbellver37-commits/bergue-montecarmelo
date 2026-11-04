import test from "node:test";
import assert from "node:assert/strict";
import { validar, construirMensaje, enlaceWhatsApp, telefonoValido, fechaMinima, WHATSAPP_TIENDA } from "../js/encargo-mensaje.js";

const HOY = new Date(2026, 10, 4);   // 4 nov 2026
const base = { tipo: "tarta", detalle: "Tarta de nata y fresón para 10", fecha: "2026-11-06", hora: "17:00", dedicatoria: "Felicidades, Lucía", nombre: "Lucía", apellidos: "Pérez Gómez", telefono: "612 34 56 78" };

test("el número de la tienda es el de WhatsApp del cliente", () => assert.equal(WHATSAPP_TIENDA, "34629444745"));
test("acepta teléfonos españoles con o sin prefijo", () => {
  for (const t of ["612345678", "612 34 56 78", "+34 612 34 56 78", "0034612345678", "911721853"]) assert.ok(telefonoValido(t), t);
});
test("rechaza teléfonos inválidos", () => {
  for (const t of ["", "12345", "212345678", "6123456789", "abc"]) assert.ok(!telefonoValido(t), t);
});
test("fecha mínima es mañana", () => assert.equal(fechaMinima(HOY), "2026-11-05"));
test("un encargo completo es válido", () => assert.equal(validar(base, HOY).ok, true));
test("pide nombre, apellidos y teléfono", () => {
  const r = validar({ ...base, nombre: "", apellidos: "", telefono: "" }, HOY);
  assert.deepEqual(Object.keys(r.errores).sort(), ["apellidos", "nombre", "telefono"]);
});
test("no admite recoger hoy (24 h de antelación)", () => assert.ok(validar({ ...base, fecha: "2026-11-04" }, HOY).errores.fecha));
test("el mensaje lleva pedido, recogida y datos del comprador", () => {
  const m = construirMensaje(validar(base, HOY).datos);
  for (const t of ["Encargo: Tarta", "Detalle: Tarta de nata y fresón para 10", "Recogida: viernes, 6 de noviembre, 17:00", "Dedicatoria: Felicidades, Lucía", "Nombre: Lucía", "Apellidos: Pérez Gómez", "Teléfono: 612 34 56 78"]) assert.ok(m.includes(t), t);
});
test("sin hora ni dedicatoria no deja líneas vacías de campo", () => {
  const m = construirMensaje(validar({ ...base, hora: "", dedicatoria: "" }, HOY).datos);
  assert.ok(m.includes("Recogida: viernes, 6 de noviembre\n"));
  assert.ok(!m.includes("Dedicatoria"));
});
test("el enlace va a wa.me con el texto codificado", () => {
  const u = enlaceWhatsApp("Hola ñ\nB");
  assert.ok(u.startsWith("https://wa.me/34629444745?text="));
  assert.equal(decodeURIComponent(u.split("text=")[1]), "Hola ñ\nB");
});
test("limpia espacios y saltos del texto del cliente", () => {
  assert.equal(validar({ ...base, detalle: "  tarta \n\n grande  " }, HOY).datos.detalle, "tarta grande");
});

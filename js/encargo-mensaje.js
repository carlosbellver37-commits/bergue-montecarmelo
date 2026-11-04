// Encargos por WhatsApp: valida el formulario y redacta el mensaje que le llega a la tienda.
// Sin DOM, para poder probarlo con node (tests/encargo-mensaje.test.mjs).

export const WHATSAPP_TIENDA = "34629444745";   // 629 44 47 45
export const ANTELACION_DIAS = 1;               // "al menos 24 horas de antelación"

const TELEFONO_ES = /^(?:\+?34|0034)?[6789]\d{8}$/;

export const TIPOS = {
  tarta: "Tarta",
  salados: "Bandeja de salados",
  pan: "Pan o bollería",
  otro: "Otro encargo",
};

const limpiar = (texto) => String(texto ?? "").replace(/\s+/g, " ").trim();

export function telefonoValido(texto) {
  return TELEFONO_ES.test(String(texto ?? "").replace(/[\s.\-()]/g, ""));
}

// "2026-11-06" -> Date local (sin el desfase de la zona horaria)
function fechaLocal(iso) {
  const [a, m, d] = String(iso).split("-").map(Number);
  return new Date(a, m - 1, d);
}

export function fechaMinima(hoy = new Date()) {
  const f = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + ANTELACION_DIAS);
  const dos = (n) => String(n).padStart(2, "0");
  return `${f.getFullYear()}-${dos(f.getMonth() + 1)}-${dos(f.getDate())}`;
}

function fechaLegible(iso) {
  return new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long" }).format(fechaLocal(iso));
}

// Devuelve { ok, errores: { campo: texto }, datos } con los textos ya limpios.
export function validar(entrada, hoy = new Date()) {
  const datos = {
    tipo: TIPOS[entrada.tipo] ? entrada.tipo : "",
    detalle: limpiar(entrada.detalle),
    fecha: limpiar(entrada.fecha),
    hora: limpiar(entrada.hora),
    dedicatoria: limpiar(entrada.dedicatoria),
    nombre: limpiar(entrada.nombre),
    apellidos: limpiar(entrada.apellidos),
    telefono: limpiar(entrada.telefono),
  };
  const errores = {};
  if (!datos.tipo) errores.tipo = "Elige qué quieres encargar.";
  if (datos.detalle.length < 3) errores.detalle = "Cuéntanos qué necesitas (tamaño, sabor, cantidad…).";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(datos.fecha)) errores.fecha = "Elige el día de recogida.";
  else if (datos.fecha < fechaMinima(hoy)) errores.fecha = "Necesitamos al menos 24 horas de antelación.";
  if (datos.nombre.length < 2) errores.nombre = "Escribe tu nombre.";
  if (datos.apellidos.length < 2) errores.apellidos = "Escribe tus apellidos.";
  if (!telefonoValido(datos.telefono)) errores.telefono = "Escribe un teléfono de 9 cifras.";
  return { ok: Object.keys(errores).length === 0, errores, datos };
}

export function construirMensaje(d) {
  const recogida = d.hora ? `${fechaLegible(d.fecha)}, ${d.hora}` : fechaLegible(d.fecha);
  const lineas = [
    "Hola, Bergue Montecarmelo. Quiero hacer un encargo:",
    "",
    `Encargo: ${TIPOS[d.tipo]}`,
    `Detalle: ${d.detalle}`,
    `Recogida: ${recogida}`,
  ];
  if (d.dedicatoria) lineas.push(`Dedicatoria: ${d.dedicatoria}`);
  lineas.push("", "Mis datos:", `Nombre: ${d.nombre}`, `Apellidos: ${d.apellidos}`, `Teléfono: ${d.telefono}`, "", "Gracias.");
  return lineas.join("\n");
}

export function enlaceWhatsApp(mensaje, numero = WHATSAPP_TIENDA) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

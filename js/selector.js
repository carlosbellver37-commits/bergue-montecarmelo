// Desplegable propio para un <select>: mismo valor y mismo evento "change", pero con el aspecto
// de la web y manejable con teclado (flechas, Inicio/Fin, Intro, Escape, letra inicial).
// El <select> original se queda oculto dentro del formulario y sigue siendo el que manda.

let contador = 0;

export function mejorarSelect(select) {
  if (!select || select.dataset.mejorado) return null;
  select.dataset.mejorado = "1";
  const id = `combo-${++contador}`;
  const opciones = [...select.options].filter((o) => o.value !== "");
  const marcador = select.options[0] && select.options[0].value === "" ? select.options[0].textContent : "Elige una opción";

  const raiz = document.createElement("div");
  raiz.className = "combo";

  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = "combo__boton";
  boton.id = `${id}-boton`;
  boton.setAttribute("aria-haspopup", "listbox");
  boton.setAttribute("aria-expanded", "false");
  boton.setAttribute("aria-controls", `${id}-lista`);
  const etiqueta = document.querySelector(`label[for="${select.id}"]`);
  if (etiqueta) boton.setAttribute("aria-labelledby", `${etiqueta.id || (etiqueta.id = `${id}-etiqueta`)} ${boton.id}`);
  const valor = document.createElement("span");
  valor.className = "combo__valor";
  const flecha = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  flecha.setAttribute("viewBox", "0 0 12 8");
  flecha.setAttribute("class", "combo__flecha");
  flecha.setAttribute("aria-hidden", "true");
  flecha.innerHTML = '<path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.6"/>';
  boton.append(valor, flecha);

  const lista = document.createElement("ul");
  lista.className = "combo__lista";
  lista.id = `${id}-lista`;
  lista.setAttribute("role", "listbox");
  lista.tabIndex = -1;
  lista.hidden = true;
  if (etiqueta) lista.setAttribute("aria-labelledby", etiqueta.id);

  const items = opciones.map((o, i) => {
    const li = document.createElement("li");
    li.className = "combo__opcion";
    li.id = `${id}-op-${i}`;
    li.setAttribute("role", "option");
    li.dataset.valor = o.value;
    li.textContent = o.textContent;
    lista.append(li);
    return li;
  });

  raiz.append(boton, lista);
  select.after(raiz);
  select.hidden = true;
  select.setAttribute("aria-hidden", "true");
  select.tabIndex = -1;
  select.focusTarget = boton;
  if (etiqueta) etiqueta.addEventListener("click", () => boton.focus());

  let activa = -1;

  function pintar() {
    const elegido = items.findIndex((li) => li.dataset.valor === select.value);
    valor.textContent = elegido >= 0 ? items[elegido].textContent : marcador;
    raiz.classList.toggle("is-vacio", elegido < 0);
    items.forEach((li, i) => li.setAttribute("aria-selected", String(i === elegido)));
  }

  function marcarActiva(i) {
    activa = Math.max(0, Math.min(items.length - 1, i));
    items.forEach((li, j) => li.classList.toggle("is-activa", j === activa));
    lista.setAttribute("aria-activedescendant", items[activa].id);
    items[activa].scrollIntoView({ block: "nearest" });
  }

  function abrir() {
    if (!lista.hidden) return;
    lista.hidden = false;
    raiz.classList.add("is-abierto");
    boton.setAttribute("aria-expanded", "true");
    const elegido = items.findIndex((li) => li.dataset.valor === select.value);
    marcarActiva(elegido >= 0 ? elegido : 0);
    lista.focus({ preventScroll: true });
  }

  function cerrar(devolverFoco) {
    if (lista.hidden) return;
    lista.hidden = true;
    raiz.classList.remove("is-abierto");
    boton.setAttribute("aria-expanded", "false");
    if (devolverFoco) boton.focus();
  }

  function elegir(i) {
    const cambio = select.value !== items[i].dataset.valor;
    select.value = items[i].dataset.valor;
    pintar();
    cerrar(true);
    if (cambio) {
      select.dispatchEvent(new Event("input", { bubbles: true }));
      select.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  boton.addEventListener("click", () => (lista.hidden ? abrir() : cerrar(false)));
  boton.addEventListener("keydown", (e) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      abrir();
    }
  });

  lista.addEventListener("keydown", (e) => {
    const teclas = {
      ArrowDown: () => marcarActiva(activa + 1),
      ArrowUp: () => marcarActiva(activa - 1),
      Home: () => marcarActiva(0),
      End: () => marcarActiva(items.length - 1),
      Enter: () => elegir(activa),
      " ": () => elegir(activa),
      Escape: () => cerrar(true),
    };
    if (teclas[e.key]) {
      e.preventDefault();
      teclas[e.key]();
    } else if (e.key === "Tab") {
      cerrar(false);
    } else if (e.key.length === 1) {
      const sig = items.findIndex((li, i) => i > activa && li.textContent.toLowerCase().startsWith(e.key.toLowerCase()));
      const alguna = sig >= 0 ? sig : items.findIndex((li) => li.textContent.toLowerCase().startsWith(e.key.toLowerCase()));
      if (alguna >= 0) marcarActiva(alguna);
    }
  });

  lista.addEventListener("click", (e) => {
    const li = e.target.closest(".combo__opcion");
    if (li) elegir(items.indexOf(li));
  });
  lista.addEventListener("pointermove", (e) => {
    const li = e.target.closest(".combo__opcion");
    if (li) marcarActiva(items.indexOf(li));
  });
  document.addEventListener("pointerdown", (e) => {
    if (!raiz.contains(e.target)) cerrar(false);
  });
  lista.addEventListener("focusout", (e) => {
    if (!raiz.contains(e.relatedTarget)) cerrar(false);
  });

  // Si otro código cambia el valor (p. ej. al pulsar un producto de la carta), se refleja aquí
  select.addEventListener("change", pintar);
  pintar();
  return { boton, pintar };
}

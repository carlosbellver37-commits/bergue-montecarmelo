

  const visor = document.querySelector('[data-visor]');
  const datos = document.getElementById('catalogos-datos');

  if (visor && datos) {
    const catalogos = JSON.parse(datos.textContent || '[]');
    const $ = sel => visor.querySelector(sel);
    const img = $('[data-visor-img]');
    const hoja = $('[data-visor-hoja]');
    const titulo = $('[data-visor-titulo]');
    const numero = $('[data-visor-pagina]');
    const pdf = $('[data-visor-pdf]');
    const minis = $('[data-visor-minis]');
    const ant = $('[data-visor-ant]');
    const sig = $('[data-visor-sig]');
    const modo = $('[data-visor-modo]');

    let actual = null;
    let pagina = 0;
    /** Miniatura de una página (herramientas/miniaturas_catalogos.py). */
    const mini = (src) => src;
    const precargadas = new Set();
    const precargar = (src) => {
      if (!src || precargadas.has(src)) return;
      precargadas.add(src);
      new Image().src = src;
    };

    const mostrar = (n) => {
      if (!actual) return;
      pagina = Math.max(0, Math.min(n, actual.paginas.length - 1));
      const src = new URL(actual.paginas[pagina], location.href).href;
      // Si ya es la página que se ve no habrá evento load: no marcarla como cargando
      if (img.src !== src) {
        img.classList.add('is-cargando');
        img.src = src;
      }
      // La siguiente y la anterior, listas para pasar de página sin esperas
      precargar(actual.paginas[pagina + 1]);
      precargar(actual.paginas[pagina - 1]);
      img.alt = `${actual.titulo}, página ${pagina + 1}`;
      numero.textContent = `${pagina + 1} / ${actual.paginas.length}`;
      ant.disabled = pagina === 0;
      sig.disabled = pagina === actual.paginas.length - 1;
      hoja.scrollTop = 0;
      minis.querySelectorAll('button').forEach((b, i) => {
        b.setAttribute('aria-current', String(i === pagina));
        if (i === pagina) b.scrollIntoView({ block: 'nearest' });
      });
    };
    img.addEventListener('load', () => img.classList.remove('is-cargando'));
    img.addEventListener('error', () => img.classList.remove('is-cargando'));

    const completa = (si) => {
      visor.classList.toggle('is-completa', si);
      modo.setAttribute('aria-pressed', String(si));
      modo.textContent = si ? 'Ajustar al ancho' : 'Ver página completa';
    };
    modo.addEventListener('click', () => completa(!visor.classList.contains('is-completa')));
    img.addEventListener('click', () => completa(!visor.classList.contains('is-completa')));

    const abrir = (id) => {
      actual = catalogos.find((c) => c.id === id) ?? null;
      if (!actual) return;
      titulo.textContent = actual.titulo;
      pdf.href = actual.pdf;
      minis.replaceChildren(
        ...actual.paginas.map((src, i) => {
          const li = document.createElement('li');
          const b = document.createElement('button');
          b.type = 'button';
          b.setAttribute('aria-label', `Ir a la página ${i + 1}`);
          const miniatura = document.createElement('img');
          miniatura.src = mini(src);
          miniatura.alt = '';
          miniatura.loading = 'lazy';
          miniatura.decoding = 'async';
          b.append(miniatura);
          b.addEventListener('click', () => mostrar(i));
          li.append(b);
          return li;
        }),
      );
      completa(false);
      visor.showModal();
      visor.dataset.previousOverflow = document.documentElement.style.overflow;
      document.documentElement.style.overflow = 'hidden';
      mostrar(0);
    };

    document.addEventListener('click', (e) => {
      const boton = e.target.closest('[data-abrir-catalogo]');
      if (boton) abrir(boton.dataset.abrirCatalogo);
    });
    ant.addEventListener('click', () => mostrar(pagina - 1));
    sig.addEventListener('click', () => mostrar(pagina + 1));
    $('[data-visor-cerrar]').addEventListener('click', () => visor.close());
    visor.addEventListener('close', () => { document.documentElement.style.overflow = visor.dataset.previousOverflow || '';  });
    visor.addEventListener('keydown', (e) => {
      e.stopPropagation();
      if (e.key === 'ArrowRight') mostrar(pagina + 1);
      if (e.key === 'ArrowLeft') mostrar(pagina - 1);
    });
  }

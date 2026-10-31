// El producto conserva su lugar en la rejilla. La presentación y la carta se componen
// por separado alrededor de su imagen, según el espacio visible al abrir la ficha.
// Se vuelve con "Todos", pulsando otra vez el producto, con Escape, o se pasa al anterior
// o siguiente con los botones o las flechas del teclado.
// Contenidos: los mismos que la web de Las Tablas (misma oferta en las dos tiendas).
// Precios y disponibilidad se consultan en tienda.

const IMG = "assets/img/oferta";
const ALBUM = "assets/img/las-tablas";
const COLUMNAS = 3;
const SALIDA_MS = 240;
const ENTRADA_MS = 650;
const ESCALONADO_MS = 26;
const RETRASO_ENTRADA_MS = 300;   // espera a que los demás productos se hayan desvanecido

const FRASES_SERVICIO = {
  "cafeteria": "Un café. Y que el mundo espere.",
  "pasteleria": "La excusa perfecta para celebrar.",
  "pan": "El olor de cada mañana.",
  "temporada": "Cada época tiene su dulce momento.",
  "heladeria": "Hoy apetece un capricho bien frío.",
  "gourmet": "Lo bueno sabe mejor cuando se comparte.",
  "salados": "Todo empieza con un buen bocado."
};

const TEXTOS_MOVIL = {
  "cafeteria": "Desayunos con bollería del día y tostadas de nuestro pan. Por la tarde, tortitas, gofres y chocolate con churros.",
  "pasteleria": "Tartas, pasteles y dulces de elaboración tradicional. Bizcochos del día, nata de obrador y fruta fresca. Tu tarta puede llevar una dedicatoria.",
  "pan": "Amasado, fermentación lenta y reposo. Horneamos diecisiete panes varias veces cada mañana, junto a la bollería del día.",
  "temporada": "Dulces que siguen el calendario de Madrid. Los preparamos unas semanas al año; encárgalos con tiempo.",
  "heladeria": "Cucuruchos, copas, granizados, batidos y frappelatte. Disfrútalos en la terraza o de paseo. Consulta los sabores del día.",
  "gourmet": "Una despensa elegida con el mismo cuidado que el obrador. Si buscas algo que no tenemos, pídelo e intentaremos conseguirlo.",
  "salados": "Empanadas, quiches y pequeños bocados de obrador. Para tomar aquí o encargar una bandeja para compartir."
};

const SERVICIOS = [
  {
    "id": "cafeteria",
    "nombre": "Cafetería",
    "frase": "El café de siempre, como en casa",
    "lead": "El café de siempre, donde siempre. Por la mañana, desayunos con bollería del día y tostadas de nuestro pan; por la tarde, tortitas, gofres y chocolate con churros.",
    "grupos": [
      {
        "titulo": "Café y bebidas",
        "items": [
          {
            "n": "Café de Colombia de la casa",
            "d": "Café preparado al momento"
          },
          {
            "n": "Infusiones",
            "d": ""
          },
          {
            "n": "Refrescos",
            "d": ""
          },
          {
            "n": "Vinos",
            "d": "Para tomar en el local"
          },
          {
            "n": "Cavas",
            "d": "Para tomar en el local"
          }
        ]
      },
      {
        "titulo": "Tostadas",
        "items": [
          {
            "n": "Tostada con aguacate",
            "d": "Entera o media"
          },
          {
            "n": "Tostada con atún",
            "d": "Entera o media"
          },
          {
            "n": "Tostada con aguacate y atún",
            "d": "Entera o media"
          },
          {
            "n": "Tostada con aguacate y jamón ibérico",
            "d": "Entera o media"
          }
        ]
      },
      {
        "titulo": "Bocadillos",
        "items": [
          {
            "n": "Bocadillo de tortilla de patatas",
            "d": "En pan del obrador"
          },
          {
            "n": "Bocadillo de bacon y queso",
            "d": "En pan del obrador"
          },
          {
            "n": "Bocadillo de jamón ibérico con aceite de oliva virgen",
            "d": "En pan del obrador"
          },
          {
            "n": "Bocadillo de jamón serrano con tomate",
            "d": "En pan del obrador"
          },
          {
            "n": "Bocadillo de atún con tomate",
            "d": "En pan del obrador"
          },
          {
            "n": "Bocadillo de jamón york y queso",
            "d": "En pan del obrador"
          }
        ]
      },
      {
        "titulo": "Desayunos y meriendas",
        "items": [
          {
            "n": "Bollería del obrador",
            "d": "Consulta el surtido en Pan y bollería"
          },
          {
            "n": "Tortitas con nata",
            "d": "Para desayunar o merendar"
          },
          {
            "n": "Gofres",
            "d": "Para desayunar o merendar"
          },
          {
            "n": "Chocolate con churros",
            "d": "Para desayunar o merendar"
          }
        ]
      }
    ]
  },
  {
    "id": "pasteleria",
    "nombre": "Pastelería",
    "frase": "Para el mejor final de cualquier comida",
    "lead": "Tartas, pasteles y dulces elaborados de forma tradicional: bizcochos horneados cada día, nata montada en el obrador y fruta fresca. Todas las tartas pueden ir dedicadas.",
    "encargo": true,
    "items": [
      {
        "n": "Tartas dedicadas",
        "d": "Elige el modelo, el tamaño y el mensaje. Consulta todos los modelos en la carta de tartas."
      },
      {
        "n": "Pasteles del día",
        "d": "Petisús, milhojas, tartaletas y bocaditos. Consulta el catálogo completo de pasteles."
      },
      {
        "n": "Pastas de té",
        "d": "Al peso o en bandeja, para acompañar el café o para regalar. Consulta el catálogo de pastas."
      }
    ],
    "catalogos": [
      {
        "id": "tartas",
        "nombre": "Carta de tartas"
      },
      {
        "id": "pasteles",
        "nombre": "Carta de pasteles"
      },
      {
        "id": "pastas",
        "nombre": "Pastas de té"
      }
    ]
  },
  {
    "id": "pan",
    "nombre": "Pan y bollería",
    "frase": "Fermentación lenta, corteza que cruje",
    "lead": "Un buen pan necesita tiempo: amasado, fermentación lenta y reposo. Horneamos diecisiete panes varias veces cada mañana, y del mismo horno sale la bollería del día.",
    "grupos": [
      {
        "titulo": "Panes",
        "items": [
          {
            "n": "Chapata",
            "d": "Miga alveolada y corteza fina, de larga fermentación."
          },
          {
            "n": "Baguette",
            "d": "La clásica francesa: crujiente por fuera, tierna por dentro."
          },
          {
            "n": "Pistola",
            "d": "La barra de siempre, la de la mesa de cada día."
          },
          {
            "n": "Barra gallega",
            "d": "Corteza gruesa y miga húmeda, como el pan gallego, en barra."
          },
          {
            "n": "Barra integral",
            "d": "Harina integral para una barra con más fibra y sabor a cereal."
          },
          {
            "n": "Pan de pueblo",
            "d": "Corteza dura y miga prieta, como el de los hornos de antes."
          },
          {
            "n": "Pan de cereales",
            "d": "Semillas y harinas variadas para un pan con carácter."
          },
          {
            "n": "Pan de trigo sarraceno",
            "d": "Harina de alforfón, de sabor tostado y ligeramente terroso."
          },
          {
            "n": "Pan con aceitunas",
            "d": "Con aceitunas en la masa, ideal para el aperitivo."
          },
          {
            "n": "Pan de pasas y nueces",
            "d": "Dulzor natural de la fruta y el crujido de la nuez."
          },
          {
            "n": "Pan de espelta",
            "d": "Cereal antiguo, aromático y fácil de digerir."
          },
          {
            "n": "Hogaza de maíz e higo",
            "d": "Una hogaza dorada con un punto dulce y afrutado."
          },
          {
            "n": "Bogavante",
            "d": "Pan rústico de cuatro picos, de fermentación natural."
          },
          {
            "n": "Bretón",
            "d": "Pan rústico de miga aireada y corteza crujiente."
          },
          {
            "n": "Pan rústico",
            "d": "Forma irregular, harina por encima y mucho sabor."
          },
          {
            "n": "Colón chato",
            "d": "Pieza tradicional de miga compacta y corteza lisa."
          },
          {
            "n": "Pan de picos",
            "d": "Corteza en puntas, la más crujiente de la casa."
          }
        ]
      },
      {
        "titulo": "Bollería del día",
        "items": [
          {
            "n": "Bizcochos artesanos"
          },
          {
            "n": "Croissants"
          },
          {
            "n": "Ensaimadas"
          },
          {
            "n": "Napolitanas"
          },
          {
            "n": "Sneken"
          },
          {
            "n": "Palmeras"
          },
          {
            "n": "Bayonesas"
          },
          {
            "n": "Donuts"
          }
        ]
      },
      {
        "titulo": "Palmeritas jugositas",
        "items": [
          {
            "n": "Chocolate Dubái"
          },
          {
            "n": "Lotus"
          },
          {
            "n": "Kinder"
          },
          {
            "n": "Oreo"
          },
          {
            "n": "Ferrero"
          },
          {
            "n": "Pistacho"
          },
          {
            "n": "Choco fondant"
          },
          {
            "n": "Chocolate blanco con frambuesa"
          },
          {
            "n": "Limón"
          }
        ]
      }
    ]
  },
  {
    "id": "temporada",
    "nombre": "Temporada",
    "frase": "Cada fiesta tiene su dulce",
    "lead": "Seguimos el calendario de Madrid. Solo los hacemos unas semanas al año, así que conviene encargarlos con tiempo.",
    "encargo": true,
    "items": [
      {
        "n": "Roscón de Reyes",
        "d": "De nata, trufa o crema",
        "lado": "Enero"
      },
      {
        "n": "Torrijas",
        "d": "Clásicas o con crema",
        "lado": "Semana Santa"
      },
      {
        "n": "Monas y huevos de Pascua",
        "d": "Para los más pequeños",
        "lado": "Pascua"
      },
      {
        "n": "Rosquillas de San Isidro",
        "d": "Tontas, listas y de Santa Clara",
        "lado": "Mayo"
      },
      {
        "n": "Huesos de santo y buñuelos",
        "d": "Dulces de otoño",
        "lado": "Noviembre"
      },
      {
        "n": "Corona de la Almudena",
        "d": "La de la patrona de Madrid",
        "lado": "9 nov"
      },
      {
        "n": "Turrones y polvorones",
        "d": "Para la mesa de Navidad",
        "lado": "Diciembre"
      }
    ]
  },
  {
    "id": "heladeria",
    "nombre": "Heladería",
    "frase": "Para cuando aprieta el calor",
    "lead": "Helado en cucurucho o en copa, granizados, batidos y frappelatte. Para tomar en la terraza o para llevar de paseo. Pregunta por los sabores del día.",
    "grupos": [
      {
        "titulo": "Helados y copas",
        "items": [
          {
            "n": "Copa Ibiza",
            "d": "Montada al momento"
          },
          {
            "n": "Copa Alicante",
            "d": "Montada al momento"
          },
          {
            "n": "Copa Fantasía",
            "d": "Montada al momento"
          },
          {
            "n": "Cucuruchos",
            "d": "Para llevar de paseo"
          }
        ]
      },
      {
        "titulo": "Fresco y ligero",
        "items": [
          {
            "n": "Granizados",
            "d": "Frescos y de temporada"
          },
          {
            "n": "Sorbetes",
            "d": "Ligeros, de fruta"
          },
          {
            "n": "Smoothies",
            "d": "De fruta"
          },
          {
            "n": "Yogur helado",
            "d": "Para tomar o llevar"
          }
        ]
      },
      {
        "titulo": "Batidos y café frío",
        "items": [
          {
            "n": "Batidos",
            "d": "Para tomar o llevar"
          },
          {
            "n": "Frappelatte",
            "d": "Para el verano"
          }
        ]
      }
    ]
  },
  {
    "id": "gourmet",
    "nombre": "Gourmet",
    "frase": "Lo bueno, también para llevar",
    "lead": "Nuestra despensa, elegida con el mismo cuidado que el obrador. Si buscas algo que no tenemos, pídenoslo e intentaremos conseguirlo.",
    "grupos": [
      {
        "titulo": "Bodega",
        "items": [
          {
            "n": "Vinos y cavas",
            "d": "Botellas para llevar o regalar"
          }
        ]
      },
      {
        "titulo": "Despensa",
        "items": [
          {
            "n": "Foie"
          },
          {
            "n": "Quesos"
          },
          {
            "n": "Embutidos ibéricos"
          },
          {
            "n": "Conservas"
          }
        ]
      },
      {
        "titulo": "Mermeladas y miel",
        "items": [
          {
            "n": "Mermeladas Sabores del Guijo",
            "d": "Artesanas, de Extremadura"
          },
          {
            "n": "Miel La Virgen de Extremadura",
            "d": "100 % pura. Azahar, Romero, Tomillo, Mil flores, Eucalipto, Sierra de Guadalupe, Brezo, Castaño, Encina, Roble"
          }
        ]
      },
      {
        "titulo": "Café y chocolate",
        "items": [
          {
            "n": "Cafés de origen",
            "d": "Colombia, Kenia y Guatemala. Para preparar en casa."
          },
          {
            "n": "Bombones",
            "d": "Para regalar o compartir"
          }
        ]
      }
    ]
  },
  {
    "id": "salados",
    "nombre": "Salados",
    "frase": "Para empezar con buen sabor",
    "lead": "Medias noches, sándwiches, empanadas de hojaldre y quiches de nuestro obrador. Para tomar en el momento o encargar una bandeja para tus celebraciones y reuniones.",
    "encargo": true,
    "grupos": [
      {
        "titulo": "Pequeños bocados",
        "items": [
          {
            "n": "Medias noches rellenas"
          },
          {
            "n": "Sándwiches"
          },
          {
            "n": "Petit pain"
          }
        ]
      },
      {
        "titulo": "Empanadas y empanadillas",
        "items": [
          {
            "n": "Empanadillas"
          },
          {
            "n": "Empanada de hojaldre de atún"
          },
          {
            "n": "Empanada de hojaldre de ternera"
          }
        ]
      },
      {
        "titulo": "Hojaldres y quiches",
        "items": [
          {
            "n": "Agujas de ternera"
          },
          {
            "n": "Pastel de queso"
          },
          {
            "n": "Quiches variados"
          }
        ]
      }
    ]
  }
];

// Galerías: solo fotografías propias de Bergue del material de Las Tablas.
// No se muestran imágenes de Pinterest ni generadas con IA en estas galerías.
const FOTOS = {
  salados: [],
  cafeteria: [
    [`${ALBUM}/pan/4.webp`, "Croissants en una vitrina", "Bollería"],
    [`${ALBUM}/pan/6.webp`, "Selección de bollería", "Para acompañar"],
  ],
  pasteleria: [
    [`${ALBUM}/pasteleria/1.webp`, "Selección de tartas", "Tartas"],
    [`${ALBUM}/pasteleria/2.webp`, "Pasteles variados en vitrina", "Pasteles"],
    [`${ALBUM}/pasteleria/3.webp`, "Dulces y pastas en vitrina", "Dulces de obrador"],
    [`${ALBUM}/pasteleria/4.webp`, "Surtido de pasteles", "Surtido"],
    [`${ALBUM}/pasteleria/5.webp`, "Tarta decorada", "Tartas para compartir"],
    [`${ALBUM}/pasteleria/6.webp`, "Pasteles individuales", "Pasteles individuales"],
    [`${ALBUM}/pasteleria/7.webp`, "Pasteles en vitrina", "Pasteles de la casa"],
  ],
  pan: [
    [`${ALBUM}/pan/1.webp`, "Surtido de panes y barras", "Panes"],
    [`${ALBUM}/pan/2.webp`, "Surtido de bollería", "Bollería"],
    [`${ALBUM}/pan/3.webp`, "Bollería en vitrina", "Recién horneado"],
    [`${ALBUM}/pan/4.webp`, "Croissants", "Croissants"],
    [`${ALBUM}/pan/5.webp`, "Bollería variada", "Del obrador"],
    [`${ALBUM}/pan/6.webp`, "Napolitanas y bollería", "Napolitanas"],
    [`${ALBUM}/pan/7.webp`, "Bollería y dulces", "Bollería del día"],
    [`${ALBUM}/pan/8.webp`, "Surtido de bollería", "Para compartir"],
    [`${ALBUM}/pan/9.webp`, "Bollería dorada", "Del horno"],
  ],
  temporada: [],
  heladeria: [],
  gourmet: [
    [`${ALBUM}/gourmet/1.webp`, "Selección de productos gourmet", "Nuestra despensa"],
    [`${ALBUM}/gourmet/3.webp`, "Selección de quesos y conservas", "Para compartir"],
  ],
};

const raiz = document.querySelector("[data-oferta]");
const vitrina = raiz.querySelector("[data-vitrina]");
const total = SERVICIOS.length;
const estrecha = window.matchMedia("(max-width: 860px)");

const escapar = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const dos = (n) => String(n).padStart(2, "0");

let abierto = -1;   // índice del producto elegido (-1: ninguno)
let cambio = 0;     // identifica el cambio en curso (para clics rápidos)

/* --- Productos --- */

const botones = SERVICIOS.map((s, i) => {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "vitrina__item";
  b.id = `vitrina-${s.id}`;
  b.setAttribute("aria-pressed", "false");
  b.style.setProperty("--c", s.id === "salados" ? 2 : (i % COLUMNAS) + 1);
  b.style.setProperty("--r", Math.floor(i / COLUMNAS) + 1);
  b.innerHTML = `<span class="vitrina__num">${dos(i + 1)}.</span>
      <span class="vitrina__foto"><img src="${IMG}/${s.id === 'salados' ? 'sandwich-480.png' : s.id + '-480.webp'}" srcset="${IMG}/${s.id === 'salados' ? 'sandwich-480.png' : s.id + '-480.webp'} 1x, ${IMG}/${s.id === 'salados' ? 'sandwich-900.png' : s.id + '-900.webp'} 2x" alt="" loading="lazy" /></span>
      <span class="vitrina__nombre">${escapar(s.nombre)}</span>`;
  b.addEventListener("click", (e) => {
    if (e.detail > 0) b.blur();
    return abierto === i ? cerrar() : abrir(i);
  });
  vitrina.append(b);
  return b;
});

/* --- Ficha: dos bloques que viven dentro de la propia rejilla --- */

const sobre = document.createElement("div");
sobre.className = "ficha__sobre";
sobre.setAttribute("aria-live", "polite");
sobre.hidden = true;
const carta = document.createElement("div");
carta.className = "ficha__carta";
carta.hidden = true;
const panel = document.createElement("div");
panel.className = "ficha__panel";
panel.hidden = true;
panel.append(sobre, carta);
vitrina.append(panel);
const reclamo = document.createElement("p");
reclamo.className = "ficha__reclamo";
reclamo.hidden = true;
const textoReclamo = document.createElement("span");
textoReclamo.className = "ficha__reclamo-texto";
const etiquetaReclamo = document.createElement("span");
etiquetaReclamo.className = "ficha__reclamo-etiqueta";
reclamo.append(textoReclamo, etiquetaReclamo);
raiz.append(reclamo);
// El contenido absoluto también reserva espacio de página: nunca invade Conócenos.
const reserva = document.createElement("div");
reserva.className = "oferta__reserva";
reserva.setAttribute("aria-hidden", "true");
raiz.append(reserva);
const muestra = document.createElement("section");
muestra.className = "muestra";
muestra.id = "fotos-servicio";
muestra.hidden = true;
raiz.append(muestra);

function htmlSobre(i) {
  const s = SERVICIOS[i];
  return `<span class="ficha__hueco-movil" aria-hidden="true"></span>
    <div class="ficha__cab">
      <h3 class="ficha__titulo">${escapar(s.nombre)}</h3>
      <p class="ficha__frase">${escapar(s.frase)}</p>
      <p class="ficha__etiqueta"><button type="button" class="ficha__todos" data-todos aria-label="Volver a todos los servicios"><span aria-hidden="true">←</span> Todos</button><span>${dos(i + 1)} · El mostrador</span></p>
    </div>
    <div class="ficha__cuerpo">
      <p class="ficha__lead"><span class="ficha__texto-escritorio">${escapar(s.lead)}</span><span class="ficha__texto-movil">${escapar(TEXTOS_MOVIL[s.id])}</span></p>
      <div class="ficha__volver-movil"><button type="button" class="ficha__todos" data-todos aria-label="Volver a todos los servicios"><span aria-hidden="true">←</span> Todos</button></div>
      <div class="ficha__acciones">
        ${s.encargo ? `<a class="ficha__encargo" href="#encargos">Hacer un encargo →</a>` : ""}
        ${FOTOS[s.id].length ? '<button type="button" class="ficha__paso ficha__ver-fotos" data-ver-fotos>Ver fotografías ↓</button>' : ""}
        <span class="ficha__pasos">
          <button type="button" class="ficha__paso" data-paso="-1" aria-label="Producto anterior">← Anterior</button>
          <button type="button" class="ficha__paso" data-paso="1" aria-label="Producto siguiente">Siguiente →</button>
        </span>
      </div>
    </div>`;
}

function htmlMuestra(i) {
  const servicio = SERVICIOS[i];
  const fotos = FOTOS[servicio.id];
  if (!fotos.length) return "";
  return `<header class="muestra__cab">
      <div><p class="muestra__etiqueta">Bergue · ${escapar(servicio.nombre)}</p><h3 class="muestra__titulo">En imágenes</h3></div>
      <div class="muestra__controles" aria-label="Controles de la galería">
        <button type="button" data-muestra-paso="-1" aria-label="Fotografías anteriores">←</button>
        <button type="button" data-muestra-paso="1" aria-label="Fotografías siguientes">→</button>
      </div>
    </header>
    <div class="muestra__pista" tabindex="0" role="region" aria-label="Fotografías de ${escapar(servicio.nombre)}">
      ${fotos.map(([src, alt, titulo, ilustracion], j) => `<figure class="muestra__foto${ilustracion ? " muestra__foto--ilustracion" : ""}">
        <div class="muestra__marco"><img src="${escapar(src)}" alt="${escapar(alt)}" loading="lazy" decoding="async"></div>
        <figcaption><span>${dos(j + 1)} / ${dos(fotos.length)}</span><span>${escapar(titulo)}</span></figcaption>
      </figure>`).join("")}
    </div>`;
}

function htmlCatalogos(s) {
  if (!s.catalogos) return "";
  return '<div class="ficha__catalogos" aria-label="Catálogos de pastelería">' + s.catalogos.map(c => `<button type="button" data-abrir-catalogo="${escapar(c.id)}"><span class="catalogo__hojas"><img class="catalogo__interior" src="assets/catalogos/${escapar(c.id)}/2.webp" alt="" width="440" height="622" loading="lazy"><img class="catalogo__portada" src="assets/catalogos/${escapar(c.id)}/1.webp" alt="" width="440" height="622" loading="lazy"></span><span>${escapar(c.nombre)}</span><span class="ficha__catalogo-tipo">Abrir carta ↗</span></button>`).join('') + '</div>';
}

function htmlCarta(i) {
  const s = SERVICIOS[i];
  const grupos = s.grupos || [{ titulo: '', items: s.items }];
  let numero = 0;
  const contenido = grupos.map(g => {
    const inicio = numero + 1;
    const items = g.items.map(p => {
      numero++;
      return `<li><span class="carta-lista__num">${dos(numero)}.</span><span class="carta-lista__nombre">${escapar(p.n)}</span><span class="carta-lista__lado">${p.lado ? escapar(p.lado) : ''}</span>${p.d ? `<span class="carta-lista__desc">${escapar(p.d)}</span>` : ''}</li>`;
    }).join('');
    return `<section class="carta-grupo">${g.titulo ? `<h4 class="carta-grupo__titulo">${escapar(g.titulo)}</h4>` : ''}<ol class="carta-lista" start="${inicio}">${items}</ol></section>`;
  }).join('');
  return `${htmlCatalogos(s)}<p class="ficha__etiqueta">${s.catalogos ? 'Nuestro obrador' : 'La carta'}</p>${contenido}<p class="ficha__nota">Precios y disponibilidad en tienda.</p>`;
}

// Piezas que entran y salen escalonadas
const partes = () => [
  ...sobre.querySelectorAll(".ficha__cab > *, .ficha__cuerpo > *"),
  ...carta.querySelectorAll(".ficha__catalogos, .ficha__etiqueta, .carta-grupo__titulo, .carta-lista > li, .ficha__nota"),
];

const entrar = (els, retraso) => els.forEach((el, j) => el.animate(
  [{ opacity: 0, transform: "translateY(14px)", filter: "blur(3px)" },
    { opacity: 1, transform: "none", filter: "blur(0)" }],
  { duration: ENTRADA_MS, delay: retraso + j * ESCALONADO_MS, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "backwards" }));

const salir = (els) => Promise.all(els.map((el, j) => el.animate(
  [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(-8px)" }],
  { duration: SALIDA_MS, delay: Math.min(j, 8) * 10, easing: "ease-in", fill: "forwards" }).finished.catch(() => {})));

/* --- Abrir y cerrar --- */

async function abrir(i) {
  const id = ++cambio;
  if (abierto < 0) medirCelda();
  const fotoElegida = botones[i].querySelector("img");
  const transformacion = getComputedStyle(fotoElegida).transform;
  const yaAbierto = abierto >= 0;
  if (yaAbierto) await salir(partes());
  if (id !== cambio) return;

  document.documentElement.classList.add("is-oferta-abierta");
  raiz.classList.add("is-detalle");
  raiz.querySelector(".oferta__cabeza").setAttribute("aria-hidden", "true");
  abierto = i;
  raiz.dataset.servicio = SERVICIOS[i].id;
  botones.forEach((b) => b.querySelector("img").removeAttribute("style"));
  fotoElegida.style.transition = "none";
  fotoElegida.style.transform = transformacion;
  const c = SERVICIOS[i].id === "salados" ? 2 : (i % COLUMNAS) + 1;
  const r = Math.floor(i / COLUMNAS) + 1;
  vitrina.dataset.pos = `r${r}c${c}`;
  sobre.innerHTML = htmlSobre(i);
  carta.innerHTML = htmlCarta(i);
  muestra.innerHTML = htmlMuestra(i);
  muestra.hidden = FOTOS[SERVICIOS[i].id].length === 0;
  sobre.hidden = false;
  carta.hidden = false;
  panel.hidden = false;
  vitrina.classList.add("is-abierta");
  botones.forEach((b, j) => {
    b.classList.toggle("is-elegido", j === i);
    b.setAttribute("aria-pressed", String(j === i));
    b.inert = j !== i;
  });
  colocarTexto();
  actualizarMuestra();
  entrar(partes(), yaAbierto ? 120 : RETRASO_ENTRADA_MS);

}

async function cerrar() {
  if (abierto < 0) return;
  const id = ++cambio;
  await salir(partes());
  if (id !== cambio) return;
  const anterior = abierto;
  abierto = -1;
  reclamo.hidden = true;
  delete raiz.dataset.servicio;
  sobre.hidden = true;
  carta.hidden = true;
  delete vitrina.dataset.pos;
  vitrina.classList.remove("is-abierta");
  panel.hidden = true;
  muestra.hidden = true;
  raiz.classList.remove("is-detalle");
  raiz.querySelector(".oferta__cabeza").removeAttribute("aria-hidden");
  reserva.style.height = "0px";
  botones.forEach((b) => {
    b.classList.remove("is-elegido");
    b.setAttribute("aria-pressed", "false");
    b.querySelector("img").removeAttribute("style");
    b.inert = false;
  });
  medirCelda();
  botones[anterior].focus({ preventScroll: true });
  // Se restablece el anclaje tras retirar la reserva, no durante el cambio de alto.
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (abierto < 0) document.documentElement.classList.remove("is-oferta-abierta");
  }));
}

vitrina.addEventListener("click", (e) => {
  if (e.target.closest("[data-todos]")) return cerrar();
  if (e.target.closest("[data-ver-fotos]")) return muestra.scrollIntoView({ behavior: "smooth", block: "start" });
  const paso = e.target.closest("[data-paso]");
  if (paso) abrir((abierto + Number(paso.dataset.paso) + total) % total);
});

function actualizarMuestra() {
  if (muestra.hidden) return;
  const pista = muestra.querySelector(".muestra__pista");
  const controles = muestra.querySelector(".muestra__controles");
  const limite = pista.scrollWidth - pista.clientWidth;
  controles.hidden = limite <= 1;
  controles.querySelector('[data-muestra-paso="-1"]').disabled = pista.scrollLeft <= 1;
  controles.querySelector('[data-muestra-paso="1"]').disabled = pista.scrollLeft >= limite - 1;
}

muestra.addEventListener("scroll", (e) => {
  if (e.target.classList.contains("muestra__pista")) actualizarMuestra();
}, true);

muestra.addEventListener("click", (e) => {
  const boton = e.target.closest("[data-muestra-paso]");
  if (!boton) return;
  const pista = muestra.querySelector(".muestra__pista");
  const primera = pista.querySelector(".muestra__foto");
  const gap = parseFloat(getComputedStyle(pista).columnGap) || 0;
  pista.scrollBy({ left: Number(boton.dataset.muestraPaso) * (primera.getBoundingClientRect().width + gap), behavior: "smooth" });
});

document.addEventListener("keydown", (e) => {
  if (abierto < 0 || e.target.closest("input, textarea, select")) return;
  if (e.key === "Escape") return cerrar();
  if (e.target.closest(".muestra")) return;
  if (e.key === "ArrowRight") abrir((abierto + 1) % total);
  if (e.key === "ArrowLeft") abrir((abierto - 1 + total) % total);
});

/* --- Alto de fila: el elegido no debe moverse aunque el texto sea más corto --- */

function medirCelda() {
  if (abierto >= 0) return;
  vitrina.style.setProperty("--celda", "0px");
  if (!estrecha.matches) {
    vitrina.style.setProperty("--celda", `${Math.ceil(Math.max(...botones.map((b) => b.getBoundingClientRect().height)))}px`);
  }
}

const limitar = (n, min, max) => Math.max(min, Math.min(n, max));

// object-fit: contain deja espacio vacío en la caja del img. Se rodea el producto,
// no esa caja: de lo contrario una copa estrecha separaría demasiado los textos.
function cajaProducto(img) {
  const caja = img.getBoundingClientRect();
  const proporcion = img.naturalWidth / (img.naturalHeight || 1);
  const ancho = Math.min(caja.width, caja.height * (proporcion || 1));
  const alto = ancho / (proporcion || 1);
  return {
    left: caja.left + (caja.width - ancho) / 2,
    right: caja.left + (caja.width + ancho) / 2,
    top: caja.top + (caja.height - alto) / 2,
    bottom: caja.top + (caja.height + alto) / 2,
    cx: caja.left + caja.width / 2,
    cy: caja.top + caja.height / 2,
  };
}

function colocarReclamoMovil(marco, foto) {
  const seccion = raiz.getBoundingClientRect();
  // Coordenadas del documento: el scroll y las barras de Safari no recolocan la frase.
  const inicio = seccion.top + 28;
  const hueco = foto.top - inicio - 40;
  reclamo.hidden = hueco < 100;
  if (reclamo.hidden) return;
  const altura = Math.min(hueco, 220);
  const servicio = SERVICIOS[abierto];
  textoReclamo.textContent = FRASES_SERVICIO[servicio.id];
  etiquetaReclamo.textContent = servicio.nombre + " · Bergue";
  reclamo.style.top = `${inicio + (hueco - altura) / 2 - seccion.top}px`;
  reclamo.style.left = `${marco.left - seccion.left}px`;
  reclamo.style.width = `${marco.width}px`;
  reclamo.style.height = `${altura}px`;
  reclamo.style.setProperty("--tamano-reclamo", `${Math.min(34, marco.width * .085, (altura - 28) / 3.4)}px`);
}

function colocarTexto() {
  if (abierto < 0) return;
  const marco = vitrina.getBoundingClientRect();
  const foto = cajaProducto(botones[abierto].querySelector("img"));
  // La foto original permanece en su celda. Un hueco invisible hace que el
  // texto fluya alrededor de sus coordenadas, sin duplicarla ni recolocarla.
  if (estrecha.matches) {
    for (const el of [sobre, carta]) {
      el.removeAttribute("style");
      delete el.dataset.alineacion;
    }
    const y = Math.max(0, foto.top - marco.top);
    const izquierda = foto.cx < marco.left + marco.width / 2;
    sobre.dataset.lado = izquierda ? "izquierda" : "derecha";
    sobre.style.setProperty("--zona-producto", `${Math.ceil((izquierda ? foto.right - marco.left : marco.right - foto.left) + 14)}px`);
    sobre.style.width = `${marco.width}px`;
    sobre.style.left = "0px";
    sobre.style.top = `${y}px`;
    carta.style.width = `${marco.width}px`;
    carta.style.left = "0px";
    const yCarta = y + sobre.offsetHeight + 28;
    carta.style.top = `${yCarta}px`;
    colocarReclamoMovil(marco, foto);
    reserva.style.height = `${Math.max(0, Math.ceil(yCarta + carta.offsetHeight + 48 - marco.height))}px`;
    return;
  }
  reclamo.hidden = true;
  const nav = document.querySelector(".cabecera").getBoundingClientRect();
  const margen = limitar(marco.width * 0.035, 20, 40);
  const arriba = Math.max(nav.bottom + 24, raiz.getBoundingClientRect().top + 48);
  const abajo = window.innerHeight - 28;
  const izquierda = { x: marco.left, w: foto.left - margen - marco.left, lado: "izquierda" };
  const derecha = { x: foto.right + margen, w: marco.right - foto.right - margen, lado: "derecha" };
  const candidatos = [];
  const medidas = new Map();

  function medir(tipo, ancho) {
    const w = Math.floor(ancho);
    const clave = `${tipo}-${w}`;
    if (medidas.has(clave)) return medidas.get(clave);
    const el = tipo === "sobre" ? sobre : carta;
    el.style.width = `${w}px`;
    const columnas = tipo === "carta" ? Math.max(1, Math.min(3, Math.floor((w + 24) / 195))) : 1;
    el.style.setProperty("--columnas-carta", columnas);
    const medida = { w, h: el.offsetHeight, columnas };
    medidas.set(clave, medida);
    return medida;
  }

  function juntoAlProducto(zona, medida) {
    return {
      ...medida,
      x: zona.lado === "izquierda" ? foto.left - margen - medida.w : zona.x,
      y: limitar(foto.cy - medida.h / 2, arriba, abajo - medida.h),
      alineacion: zona.lado === "izquierda" ? "end" : "start",
    };
  }

  function proponer(texto, menu, prioridad) {
    // El título introduce siempre la ficha; la lista no aparece antes que él.
    texto.y = Math.min(texto.y, menu.y);
    const solapan = texto.x < menu.x + menu.w + 16 && texto.x + texto.w + 16 > menu.x &&
      texto.y < menu.y + menu.h + 16 && texto.y + texto.h + 16 > menu.y;
    if (solapan) return;
    const exceso = Math.max(0, texto.y + texto.h - abajo) + Math.max(0, menu.y + menu.h - abajo);
    const distancia = Math.abs(texto.y + texto.h / 2 - foto.cy) + Math.abs(menu.y + menu.h / 2 - foto.cy);
    candidatos.push({ texto, menu, puntuacion: exceso * 20 + distancia * 0.12 + prioridad });
  }

  // Dos lados: la imagen es el centro de la composición. Cada bloque se alinea
  // con su centro óptico y se acerca a ella, en vez de ir al borde de la sección.
  for (const [zonaTexto, zonaCarta] of [[izquierda, derecha], [derecha, izquierda]]) {
    if (zonaTexto.w < 250 || zonaCarta.w < 280) continue;
    const texto = juntoAlProducto(zonaTexto, medir("sobre", Math.min(zonaTexto.w, 370)));
    const menu = juntoAlProducto(zonaCarta, medir("carta", Math.min(zonaCarta.w, 460)));
    proponer(texto, menu, zonaTexto === izquierda ? 0 : 8);
  }

  // En un extremo, presentación y carta abrazan el lateral libre del producto.
  for (const zona of [izquierda, derecha]) {
    if (zona.w < 285) continue;
    const ancho = Math.min(zona.w, 760);
    // Cuando el lateral es ancho, la presentación queda pegada a la foto y la
    // carta a continuación. Así el producto sigue dentro del mismo grupo visual.
    if (ancho >= 650) {
      const anchoTexto = Math.min(330, ancho * 0.43);
      const textoLateral = juntoAlProducto(zona, medir("sobre", anchoTexto));
      const menuLateral = juntoAlProducto(zona, medir("carta", ancho - anchoTexto - 28));
      menuLateral.x = zona.lado === "izquierda"
        ? textoLateral.x - 28 - menuLateral.w
        : textoLateral.x + textoLateral.w + 28;
      proponer(textoLateral, menuLateral, 30);
    }
    const texto = juntoAlProducto(zona, medir("sobre", ancho));
    const menu = juntoAlProducto(zona, medir("carta", ancho));
    const alto = texto.h + 24 + menu.h;
    texto.y = limitar(foto.cy - alto / 2, arriba, abajo - alto);
    menu.y = texto.y + texto.h + 24;
    proponer(texto, menu, 65);

    // Si hay aire encima, el título puede coronar la imagen y la carta quedarse
    // a su lado. Se admite solo cuando ambos bloques caben sin cruzarse.
    const corona = medir("sobre", Math.min(marco.width, 600));
    const yCorona = foto.top - margen - corona.h;
    if (yCorona >= arriba) {
      const titulo = {
        ...corona,
        x: limitar(foto.cx - corona.w / 2, marco.left, marco.right - corona.w),
        y: yCorona,
        alineacion: "center",
      };
      const lateral = juntoAlProducto(zona, medir("carta", ancho));
      lateral.y = Math.max(lateral.y, foto.top);
      proponer(titulo, lateral, 35);
    }
  }

  // En móviles muy estrechos el contenido mantiene un tamaño legible y aumenta
  // el alto real de esta sección. Nunca se reduce toda la ficha con scale().
  if (!candidatos.length) {
    const texto = medir("sobre", marco.width);
    const menu = medir("carta", marco.width);
    const cabeArriba = foto.top - margen - texto.h >= arriba;
    const yTexto = cabeArriba ? foto.top - margen - texto.h : Math.max(arriba, foto.bottom + margen);
    proponer(
      { ...texto, x: marco.left, y: yTexto, alineacion: "start" },
      { ...menu, x: marco.left, y: Math.max(foto.bottom + margen, yTexto + texto.h + 24), alineacion: "start" },
      100,
    );
  }

  const mejor = candidatos.sort((a, b) => a.puntuacion - b.puntuacion)[0];
  for (const [el, caja] of [[sobre, mejor.texto], [carta, mejor.menu]]) {
    el.style.width = `${caja.w}px`;
    el.style.left = `${caja.x - marco.left}px`;
    el.style.top = `${caja.y - marco.top}px`;
    el.style.setProperty("--columnas-carta", caja.columnas);
    el.dataset.alineacion = caja.alineacion;
  }
  const fondoContenido = Math.max(mejor.texto.y + mejor.texto.h, mejor.menu.y + mejor.menu.h);
  // La galería está después de la ficha: reservamos el alto necesario antes de ella.
  reserva.style.height = `${Math.max(0, Math.ceil(fondoContenido + 72 - marco.bottom))}px`;
}

medirCelda();
document.fonts.ready.then(() => abierto < 0 ? medirCelda() : colocarTexto());
let encuadrePendiente = false;
function actualizarEncuadre() {
  if (encuadrePendiente) return;
  encuadrePendiente = true;
  requestAnimationFrame(() => {
    encuadrePendiente = false;
    if (abierto >= 0) { colocarTexto(); actualizarMuestra(); }
    else medirCelda();
  });
}
let anchoEncuadre = window.innerWidth;
window.addEventListener("resize", () => {
  const ancho = window.innerWidth;
  // En móvil, un cambio de alto suele ser la barra del navegador, no un nuevo diseño.
  if (estrecha.matches && Math.abs(ancho - anchoEncuadre) < 1) return;
  anchoEncuadre = ancho;
  actualizarEncuadre();
}, { passive: true });
// Tras abrir, la composición queda unida al producto y se desplaza con él.
// Hacer scroll no vuelve a enviar los textos a otros huecos de la pantalla.
botones.forEach((b) => b.querySelector("img").addEventListener("load", actualizarEncuadre));

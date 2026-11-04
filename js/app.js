const CLAVE_SELECCION = 'artezza-seleccion';
const porId = (id) => document.getElementById(id);

const estado = {
  categoria: '',
  texto: '',
  acabado: '',
  seleccion: leerSeleccion(),
};

function leerSeleccion() {
  try {
    const guardada = JSON.parse(localStorage.getItem(CLAVE_SELECCION)) || [];
    return guardada.filter((id) => PRODUCTOS.some((p) => p.id === id));
  } catch {
    return [];
  }
}

function guardarSeleccion() {
  try {
    localStorage.setItem(CLAVE_SELECCION, JSON.stringify(estado.seleccion));
  } catch {
    // Sin almacenamiento la selección sigue funcionando durante la visita.
  }
}

function escapar(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

function normalizar(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

const nombreCategoria = (id) => CATEGORIAS.find((c) => c.id === id)?.nombre ?? '';

function textoPrecio(precio) {
  if (precio == null) return 'Consultar precio';
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(precio);
}

const GRADIENTES = {
  plateado: ['#f6f7f7', '#8b9297', '#e6e8e9', '#6e757a'],
  dorado: ['#f7e7b4', '#b98e3c', '#f3dc97', '#9a752c'],
};

const CADENA = 'M42 30C52 128 148 128 158 30';

const FORMAS = {
  aro: (t) => `<ellipse cx="100" cy="125" rx="46" ry="50" fill="none" stroke="${t}" stroke-width="9"/>`,
  ancho: (t) => `<ellipse cx="100" cy="125" rx="46" ry="50" fill="none" stroke="${t}" stroke-width="22"/>`,
  solitario: (t) => `<ellipse cx="100" cy="130" rx="46" ry="50" fill="none" stroke="${t}" stroke-width="6"/><path d="M100 58l15 18-15 18-15-18Z" fill="${t}"/>`,
  trenzado: (t) => `<ellipse cx="100" cy="125" rx="46" ry="50" fill="none" stroke="${t}" stroke-width="5" transform="rotate(14 100 125)"/><ellipse cx="100" cy="125" rx="46" ry="50" fill="none" stroke="${t}" stroke-width="5" transform="rotate(-14 100 125)"/>`,
  cadena: (t) => `<path d="${CADENA}" fill="none" stroke="${t}" stroke-width="5" stroke-dasharray="7 3"/>`,
  dije: (t) => `<path d="${CADENA}" fill="none" stroke="${t}" stroke-width="3" stroke-dasharray="5 2"/><circle cx="100" cy="124" r="17" fill="${t}"/>`,
  gota: (t) => `<path d="${CADENA}" fill="none" stroke="${t}" stroke-width="3" stroke-dasharray="5 2"/><path d="M100 104c-10 17-15 26-15 34a15 15 0 0 0 30 0c0-8-5-17-15-34Z" fill="${t}"/>`,
  argollas: (t) => `<circle cx="62" cy="122" r="30" fill="none" stroke="${t}" stroke-width="7"/><circle cx="138" cy="122" r="30" fill="none" stroke="${t}" stroke-width="7"/>`,
  colgantes: (t) => `<path d="M62 56v42M138 56v42" stroke="${t}" stroke-width="3"/><path d="M62 94c-9 16-14 24-14 32a14 14 0 0 0 28 0c0-8-5-16-14-32ZM138 94c-9 16-14 24-14 32a14 14 0 0 0 28 0c0-8-5-16-14-32Z" fill="${t}"/>`,
  broqueles: (t) => `<circle cx="68" cy="122" r="17" fill="${t}"/><circle cx="132" cy="122" r="17" fill="${t}"/>`,
  eslabon: (t) => `<ellipse cx="100" cy="122" rx="62" ry="44" fill="none" stroke="${t}" stroke-width="14" stroke-dasharray="15 5"/>`,
  rigida: (t) => `<path d="M126 82a62 46 0 1 1-52 0" fill="none" stroke="${t}" stroke-width="10" stroke-linecap="round"/>`,
};

let contadorArte = 0;

function arte(producto) {
  const id = `metal-${contadorArte++}`;
  const [a, b, c, d] = GRADIENTES[producto.acabado] ?? GRADIENTES.plateado;
  const dibujar = FORMAS[producto.forma] ?? FORMAS.aro;
  return `<svg viewBox="0 0 200 250" role="img" aria-label="Ilustración de ${escapar(producto.nombre)}">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${a}"/><stop offset=".45" stop-color="${b}"/><stop offset=".7" stop-color="${c}"/><stop offset="1" stop-color="${d}"/>
    </linearGradient></defs>
    ${dibujar(`url(#${id})`)}
  </svg>`;
}

function imagenPieza(producto) {
  if (producto.imagen) {
    return `<img src="${escapar(producto.imagen)}" alt="${escapar(producto.nombre)}" loading="lazy">`;
  }
  return arte(producto);
}

const estaSeleccionado = (id) => estado.seleccion.includes(id);

function textoBoton(producto) {
  if (!producto.disponible) return 'Agotado';
  return estaSeleccionado(producto.id) ? 'Quitar de mi selección' : 'Añadir a mi selección';
}

function productosFiltrados() {
  const buscado = normalizar(estado.texto.trim());
  return PRODUCTOS.filter((p) => {
    if (estado.categoria && p.categoria !== estado.categoria) return false;
    if (estado.acabado && p.acabado !== estado.acabado) return false;
    if (!buscado) return true;
    return normalizar(`${p.nombre} ${nombreCategoria(p.categoria)} ${p.descripcion}`).includes(buscado);
  });
}

function pintarChips() {
  const opciones = [{ id: '', nombre: 'Todo' }, ...CATEGORIAS];
  porId('chips').innerHTML = opciones
    .map((c) => `<button class="chip" type="button" data-categoria="${c.id}" aria-pressed="${estado.categoria === c.id}">${escapar(c.nombre)}</button>`)
    .join('');
}

function pintarCatalogo() {
  const lista = productosFiltrados();
  porId('rejilla').innerHTML = lista
    .map((p) => `<li class="tarjeta">
      <button class="tarjeta-abrir" type="button" data-abrir="${p.id}" aria-label="Ver detalle de ${escapar(p.nombre)}">
        <span class="marco" style="display:block">${imagenPieza(p)}${p.disponible ? '' : '<span class="agotado">Agotado</span>'}</span>
        <span class="tarjeta-nombre">${escapar(p.nombre)}</span>
        <span class="tarjeta-tipo">${escapar(nombreCategoria(p.categoria))} · ${escapar(p.acabado)}</span>
      </button>
      <p class="precio">${textoPrecio(p.precio)}</p>
      <button class="tarjeta-boton" type="button" data-alternar="${p.id}" aria-pressed="${estaSeleccionado(p.id)}" ${p.disponible ? '' : 'disabled'}>${textoBoton(p)}</button>
    </li>`)
    .join('');
  porId('resultados').textContent = `${lista.length} ${lista.length === 1 ? 'pieza' : 'piezas'}`;
  porId('vacio').hidden = lista.length > 0;
}

function mensajePedido() {
  const lineas = estado.seleccion
    .map((id) => PRODUCTOS.find((p) => p.id === id))
    .map((p) => `• ${p.nombre} (${nombreCategoria(p.categoria)}, ${p.acabado})`);
  return `Hola, ${CONFIG.marca}. Me interesan estas piezas del catálogo:\n${lineas.join('\n')}\n\n¿Me confirman disponibilidad y precio?`;
}

function enlaceWhatsapp(texto) {
  const consulta = texto ? `?text=${encodeURIComponent(texto)}` : '';
  return `https://wa.me/${CONFIG.whatsapp}${consulta}`;
}

function pintarSeleccion() {
  const piezas = estado.seleccion.map((id) => PRODUCTOS.find((p) => p.id === id));
  porId('contador').textContent = piezas.length;
  porId('abrirSeleccion').setAttribute('aria-label', `Mi selección, ${piezas.length} ${piezas.length === 1 ? 'pieza' : 'piezas'}`);
  porId('listaSeleccion').innerHTML = piezas
    .map((p) => `<li class="item-seleccion">
      <span class="marco" style="display:block">${imagenPieza(p)}</span>
      <p><strong>${escapar(p.nombre)}</strong>${textoPrecio(p.precio)}</p>
      <button class="quitar" type="button" data-alternar="${p.id}" aria-label="Quitar ${escapar(p.nombre)}">Quitar</button>
    </li>`)
    .join('');
  porId('seleccionVacia').hidden = piezas.length > 0;
  porId('seleccionAcciones').hidden = piezas.length === 0;
  if (piezas.length) porId('enviarPedido').href = enlaceWhatsapp(mensajePedido());
}

function alternar(id) {
  const producto = PRODUCTOS.find((p) => p.id === id);
  if (!producto?.disponible) return;
  estado.seleccion = estaSeleccionado(id)
    ? estado.seleccion.filter((otro) => otro !== id)
    : [...estado.seleccion, id];
  guardarSeleccion();
  pintarCatalogo();
  pintarSeleccion();
  pintarBotonDetalle(producto);
}

function pintarBotonDetalle(producto) {
  const boton = porId('detalleBoton');
  if (boton.dataset.alternar !== producto.id) return;
  boton.textContent = textoBoton(producto);
  boton.disabled = !producto.disponible;
}

function abrirDetalle(id) {
  const p = PRODUCTOS.find((producto) => producto.id === id);
  if (!p) return;
  porId('detalleImagen').innerHTML = imagenPieza(p);
  porId('detalleCategoria').textContent = nombreCategoria(p.categoria);
  porId('detalleNombre').textContent = p.nombre;
  porId('detallePrecio').textContent = textoPrecio(p.precio);
  porId('detalleDescripcion').textContent = p.descripcion;
  porId('detalleAcabado').textContent = p.acabado;
  porId('detalleBoton').dataset.alternar = p.id;
  pintarBotonDetalle(p);
  porId('detalle').showModal();
}

function limpiarFiltros() {
  estado.categoria = '';
  estado.texto = '';
  estado.acabado = '';
  porId('busqueda').value = '';
  porId('acabado').value = '';
  pintarChips();
  pintarCatalogo();
}

document.addEventListener('click', (evento) => {
  const objetivo = evento.target;

  const conAlternar = objetivo.closest('[data-alternar]');
  if (conAlternar) return alternar(conAlternar.dataset.alternar);

  const conAbrir = objetivo.closest('[data-abrir]');
  if (conAbrir) return abrirDetalle(conAbrir.dataset.abrir);

  const chip = objetivo.closest('[data-categoria]');
  if (chip) {
    estado.categoria = chip.dataset.categoria;
    pintarChips();
    pintarCatalogo();
    return;
  }

  if (objetivo.closest('[data-cerrar]')) return objetivo.closest('dialog').close();
  // Un clic directo sobre el <dialog> solo puede venir de su fondo o de su área sin contenido.
  if (objetivo.tagName === 'DIALOG') objetivo.close();
});

porId('busqueda').addEventListener('input', (e) => {
  estado.texto = e.target.value;
  pintarCatalogo();
});
porId('acabado').addEventListener('change', (e) => {
  estado.acabado = e.target.value;
  pintarCatalogo();
});
porId('limpiar').addEventListener('click', limpiarFiltros);
porId('abrirSeleccion').addEventListener('click', () => porId('seleccion').showModal());
porId('vaciar').addEventListener('click', () => {
  estado.seleccion = [];
  guardarSeleccion();
  pintarCatalogo();
  pintarSeleccion();
});

porId('avisoMuestra').hidden = !CONFIG.modoMuestra;
porId('enlaceInstagram').href = CONFIG.instagram;
if (CONFIG.whatsapp) {
  const enlace = porId('enlaceWhatsapp');
  enlace.href = enlaceWhatsapp();
  enlace.hidden = false;
}

pintarChips();
pintarCatalogo();
pintarSeleccion();

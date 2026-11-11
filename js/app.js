const CLAVE_BOLSA = 'artezza-bolsa';
const porId = (id) => document.getElementById(id);
const parametros = new URLSearchParams(location.search);

let bolsa = leerBolsa();
let esRegalo = false;
let mensajeTarjeta = '';

function leerBolsa() {
  try {
    const guardada = JSON.parse(localStorage.getItem(CLAVE_BOLSA)) || [];
    return guardada.filter((item) => buscarProducto(item.id) && item.cantidad > 0);
  } catch {
    return [];
  }
}

function guardarBolsa() {
  try {
    localStorage.setItem(CLAVE_BOLSA, JSON.stringify(bolsa));
  } catch {
    // Sin almacenamiento la bolsa sigue funcionando durante la visita.
  }
}

function escapar(texto) {
  const entidades = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(texto).replace(/[&<>"']/g, (c) => entidades[c]);
}

function buscarProducto(id) {
  return PRODUCTOS.find((p) => p.id === id);
}

const normalizar = (texto) => texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const nombreCategoria = (id) => CATEGORIAS.find((c) => c.id === id)?.nombre ?? '';
const nombreColeccion = (p) => (p.limitada ? 'Edición limitada' : COLECCIONES.find((c) => c.id === p.coleccion)?.nombre ?? '');
const plural = (n) => `${n} ${n === 1 ? 'pieza' : 'piezas'}`;
const dinero = (n) => `$${n.toLocaleString('es-MX')}`;
const enlaceProducto = (p) => `producto.html?id=${encodeURIComponent(p.id)}`;
const puntosPorCompra = (monto) => Math.floor(monto / 100) * 10;
const enlaceWhatsapp = (texto) => `https://wa.me/${CONFIG.whatsapp}${texto ? `?text=${encodeURIComponent(texto)}` : ''}`;

// Logotipo registrado de la marca: se usa tal cual, sin redibujarlo ni cambiar sus colores.
const LOGOTIPO = '<img class="logo-imagen" src="img/marca/logo-artezza.png" alt="" width="396" height="396">';

function etiquetaPieza(p) {
  if (p.limitada) return { texto: 'Edición limitada', clase: 'etiqueta-oscura' };
  if (p.disponibilidad === 'pocas') return { texto: 'Últimas piezas', clase: 'etiqueta-clara' };
  if (p.disponibilidad === 'pedido') return { texto: 'Bajo pedido', clase: 'etiqueta-clara' };
  return null;
}

function htmlEtiqueta(p) {
  const etiqueta = etiquetaPieza(p);
  return etiqueta ? `<span class="etiqueta ${etiqueta.clase}">${etiqueta.texto}</span>` : '';
}

function htmlTarjeta(p) {
  const segunda = p.imagenes[1] ? `<img class="foto-alterna" src="${escapar(p.imagenes[1])}" alt="" loading="lazy">` : '';
  return `<li class="tarjeta">
    <a class="tarjeta-enlace" href="${enlaceProducto(p)}">
      <span class="marco"><img src="${escapar(p.imagenes[0])}" alt="${escapar(p.nombre)}" loading="lazy">${segunda}${htmlEtiqueta(p)}</span>
      <span class="tarjeta-nombre">${escapar(p.nombre)}</span>
      <span class="tarjeta-meta">Acero inoxidable · ${escapar(p.tono)}</span>
    </a>
    <div class="tarjeta-pie">
      <span class="precio">${dinero(p.precio)}</span>
      <button class="btn-agregar" type="button" data-agregar="${p.id}" aria-label="Agregar ${escapar(p.nombre)} a mi bolsa">Agregar</button>
    </div>
  </li>`;
}

// Cabecera, pie y bolsa, compartidos por todas las páginas.

const ENLACES_MENU = [
  ...CATEGORIAS.map((c) => ({ href: `${c.id}.html`, nombre: c.nombre, id: c.id })),
  ...COLECCIONES.map((c) => ({ href: `${c.id}.html`, nombre: c.nombre, id: c.id })),
  { href: 'regalos.html', nombre: 'Para regalar', id: 'regalos' },
  { href: 'circulo.html', nombre: 'Círculo Artezza', id: 'circulo' },
  { href: 'tiendas.html', nombre: 'Tiendas', id: 'tiendas' },
];

function htmlEnlacesMenu() {
  const actual = document.body.dataset.seccion;
  return ENLACES_MENU
    .map((e) => `<a href="${e.href}"${e.id === actual ? ' aria-current="page"' : ''}>${e.nombre}</a>`)
    .join('');
}

function pintarCabecera() {
  const aviso = CONFIG.modoPrototipo
    ? '<p class="aviso-prototipo">Prototipo: los nombres, precios, medidas y existencias son de referencia.</p>'
    : '';
  porId('cabecera').innerHTML = `
    <a class="saltar" href="#contenido">Saltar al contenido</a>
    ${aviso}
    <p class="barra-envios">Envíos a domicilio y nacionales · Pide por WhatsApp en un solo paso</p>
    <header class="cabecera">
      <div class="cabecera-fila">
        <button class="btn-icono btn-menu" id="abrirMenu" type="button">Menú</button>
        <form class="buscador" action="catalogo.html" role="search">
          <label class="solo-lector" for="q">Buscar piezas</label>
          <input id="q" name="q" type="search" placeholder="Buscar: concha, perla…" value="${escapar(parametros.get('q') ?? '')}">
        </form>
        <a class="logo" href="index.html" aria-label="Artezza. Inicio">${LOGOTIPO}</a>
        <button class="btn-icono btn-bolsa" id="abrirBolsa" type="button">
          <span class="bolsa-texto">Mi bolsa</span> <span class="contador" id="contador">0</span>
        </button>
      </div>
      <nav class="menu" aria-label="Principal">${htmlEnlacesMenu()}</nav>
    </header>
    <dialog class="cajon cajon-izquierda" id="menuMovil" aria-label="Menú">
      <div class="cajon-cuerpo">
        <button class="cerrar" type="button" data-cerrar aria-label="Cerrar">×</button>
        <a class="logo logo-cajon" href="index.html" aria-label="Artezza. Inicio">${LOGOTIPO}</a>
        <form class="buscador buscador-movil" action="catalogo.html" role="search">
          <label class="solo-lector" for="qMovil">Buscar piezas</label>
          <input id="qMovil" name="q" type="search" placeholder="Buscar: concha, perla…">
        </form>
        <nav class="menu-movil" aria-label="Móvil">
          <a href="catalogo.html">Todo el catálogo</a>
          ${htmlEnlacesMenu()}
          <a href="materiales.html">Materiales y cuidados</a>
        </nav>
      </div>
    </dialog>
    <dialog class="cajon" id="bolsa" aria-labelledby="bolsaTitulo">
      <div class="cajon-cuerpo">
        <button class="cerrar" id="cerrarBolsa" type="button" data-cerrar aria-label="Cerrar">×</button>
        <h2 id="bolsaTitulo">Mi bolsa</h2>
        <ul class="lista-bolsa" id="listaBolsa"></ul>
        <p class="bolsa-vacia" id="bolsaVacia">Tu bolsa está vacía. Explora el catálogo y agrega tus piezas favoritas.</p>
        <div class="bolsa-acciones" id="bolsaAcciones">
          <label class="casilla"><input id="esRegalo" type="checkbox"> Es para regalo</label>
          <label class="campo-mensaje" id="campoMensaje" hidden>
            <span>Mensaje para la tarjeta</span>
            <textarea id="mensajeTarjeta" rows="2" maxlength="200"></textarea>
          </label>
          <p class="total"><span>Total</span><strong id="total">$0</strong></p>
          <p class="nota" id="puntosBolsa"></p>
          <a class="btn btn-primario" id="enviarPedido" href="#" target="_blank" rel="noopener">Enviar pedido por WhatsApp</a>
          <button class="btn-enlace" id="vaciar" type="button">Vaciar bolsa</button>
        </div>
      </div>
    </dialog>
    <p class="notificacion" id="notificacion" role="status"></p>`;
}

function pintarPie() {
  porId('pie').innerHTML = `
    <footer class="pie">
      <div class="pie-marca">
        <a class="logo logo-pie" href="index.html" aria-label="Artezza. Inicio">${LOGOTIPO}</a>
        <p>Hecha para quedarse.</p>
      </div>
      <nav aria-label="Catálogo">
        <h2>Catálogo</h2>
        <ul>
          <li><a href="catalogo.html">Todo el catálogo</a></li>
          ${CATEGORIAS.map((c) => `<li><a href="${c.id}.html">${c.nombre}</a></li>`).join('')}
        </ul>
      </nav>
      <nav aria-label="Colecciones">
        <h2>Colecciones</h2>
        <ul>
          ${COLECCIONES.map((c) => `<li><a href="${c.id}.html">${c.nombre}</a></li>`).join('')}
          <li><a href="regalos.html">Para regalar</a></li>
        </ul>
      </nav>
      <nav aria-label="Ayuda y contacto">
        <h2>Ayuda</h2>
        <ul>
          <li><a href="materiales.html">Materiales y cuidados</a></li>
          <li><a href="circulo.html">Círculo Artezza</a></li>
          <li><a href="tiendas.html">Tiendas</a></li>
          <li><a href="${enlaceWhatsapp()}" target="_blank" rel="noopener">WhatsApp ${CONFIG.whatsappVisible}</a></li>
          <li><a href="${CONFIG.instagram}" target="_blank" rel="noopener">Instagram @artezza.zza</a></li>
        </ul>
      </nav>
      <p class="pie-creditos">Algunas fotografías de ambiente son de <a href="https://www.pexels.com" target="_blank" rel="noopener">Pexels</a> y <a href="https://unsplash.com" target="_blank" rel="noopener">Unsplash</a>.</p>
    </footer>`;
}

function mensajePedido(total) {
  const lineas = bolsa.map(({ id, cantidad }) => {
    const p = buscarProducto(id);
    return `• ${cantidad} × ${p.nombre} (${p.tono}, ${dinero(p.precio)})`;
  });
  let mensaje = `Hola, ${CONFIG.marca}. Quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${dinero(total)}`;
  if (esRegalo) {
    mensaje += '\nEs para regalo.';
    if (mensajeTarjeta.trim()) mensaje += ` Mensaje para la tarjeta: "${mensajeTarjeta.trim()}"`;
  }
  return mensaje;
}

function pintarBolsa() {
  const piezas = bolsa.reduce((suma, item) => suma + item.cantidad, 0);
  const total = bolsa.reduce((suma, item) => suma + buscarProducto(item.id).precio * item.cantidad, 0);
  porId('contador').textContent = piezas;
  porId('abrirBolsa').setAttribute('aria-label', `Mi bolsa, ${plural(piezas)}`);
  porId('listaBolsa').innerHTML = bolsa
    .map(({ id, cantidad }) => {
      const p = buscarProducto(id);
      return `<li class="item-bolsa">
        <img src="${escapar(p.imagenes[0])}" alt="">
        <p><a href="${enlaceProducto(p)}">${escapar(p.nombre)}</a>${dinero(p.precio)} · ${escapar(p.tono)}</p>
        <div class="cantidad" role="group" aria-label="Cantidad de ${escapar(p.nombre)}">
          <button type="button" data-cantidad="-1" data-id="${p.id}" aria-label="Quitar una">−</button>
          <span>${cantidad}</span>
          <button type="button" data-cantidad="1" data-id="${p.id}" aria-label="Agregar una">+</button>
        </div>
      </li>`;
    })
    .join('');
  porId('bolsaVacia').hidden = bolsa.length > 0;
  porId('bolsaAcciones').hidden = bolsa.length === 0;
  porId('total').textContent = dinero(total);
  porId('puntosBolsa').textContent = `Acumulas ${puntosPorCompra(total)} puntos del Círculo Artezza.`;
  porId('enviarPedido').href = enlaceWhatsapp(mensajePedido(total));
}

function cambiarCantidad(id, cambio) {
  const item = bolsa.find((otro) => otro.id === id);
  if (item) item.cantidad += cambio;
  else if (cambio > 0) bolsa.push({ id, cantidad: cambio });
  bolsa = bolsa.filter((otro) => otro.cantidad > 0);
  guardarBolsa();
  pintarBolsa();
  if (cambio > 0) reiniciarAnimacion(porId('contador'), 'pulso');
}

// Efectos de movimiento. Todos se omiten si la persona pidió reducir el movimiento.

const reducirMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;
const SELECTOR_ENTRADA = '.seccion-encabezado, .tarjeta, .categoria, .look, .ventajas li, .pasos li, .beneficio, .tienda, .franja, .visita-texto, .bloque';
let observadorEntradas = null;

// Quitar y volver a poner la clase obliga al navegador a repetir la animación.
function reiniciarAnimacion(elemento, clase) {
  elemento.classList.remove(clase);
  void elemento.offsetWidth;
  elemento.classList.add(clase);
}

function animarEntradas(raiz) {
  if (reducirMovimiento || !('IntersectionObserver' in window)) return;
  observadorEntradas ??= new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add('visible');
      observadorEntradas.unobserve(entrada.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });

  [...raiz.querySelectorAll(SELECTOR_ENTRADA)]
    .filter((elemento) => !elemento.classList.contains('por-entrar'))
    .forEach((elemento, i) => {
      elemento.classList.add('por-entrar');
      elemento.style.setProperty('--retardo', `${(i % 4) * 80}ms`);
      observadorEntradas.observe(elemento);
    });
}

function confirmarEnBoton(boton) {
  if (!boton.classList.contains('btn-agregar')) return;
  boton.textContent = 'Agregada ✓';
  boton.classList.add('agregada');
  clearTimeout(Number(boton.dataset.temporizador));
  boton.dataset.temporizador = setTimeout(() => {
    boton.textContent = 'Agregar';
    boton.classList.remove('agregada');
  }, 1600);
}

function activarLupa(marco) {
  if (reducirMovimiento || !matchMedia('(hover: hover)').matches) return;
  marco.classList.add('con-lupa');
  marco.addEventListener('pointermove', (evento) => {
    const caja = marco.getBoundingClientRect();
    marco.style.setProperty('--lupa-x', `${((evento.clientX - caja.left) / caja.width) * 100}%`);
    marco.style.setProperty('--lupa-y', `${((evento.clientY - caja.top) / caja.height) * 100}%`);
  });
}

let temporizadorNotificacion;

function notificar(texto) {
  const nota = porId('notificacion');
  nota.textContent = texto;
  nota.classList.add('visible');
  clearTimeout(temporizadorNotificacion);
  temporizadorNotificacion = setTimeout(() => nota.classList.remove('visible'), 2200);
}

// Páginas de catálogo: categorías, colecciones, Para regalar y Todo.

function reglaDeSeccion(seccion) {
  if (seccion === 'regalos') return (p) => p.regalo;
  if (seccion === 'todo') return () => true;
  if (CATEGORIAS.some((c) => c.id === seccion)) return (p) => p.categoria === seccion;
  return (p) => p.coleccion === seccion;
}

function iniciarColeccion() {
  const seccion = document.body.dataset.seccion;
  const base = reglaDeSeccion(seccion);
  const esCategoria = CATEGORIAS.some((c) => c.id === seccion);
  const textoBuscado = (parametros.get('q') ?? '').trim();
  const buscado = normalizar(textoBuscado);
  const filtros = { categoria: '', tono: '', regalo: false, orden: 'destacados' };

  if (buscado) porId('tituloColeccion').textContent = `Resultados para “${textoBuscado}”`;

  function coincide(p) {
    if (!base(p)) return false;
    if (filtros.categoria && p.categoria !== filtros.categoria) return false;
    if (filtros.tono && p.tono !== filtros.tono) return false;
    if (filtros.regalo && !p.regalo) return false;
    if (!buscado) return true;
    return normalizar(`${p.nombre} ${p.descripcion} ${nombreCategoria(p.categoria)} ${nombreColeccion(p)} ${p.tono}`).includes(buscado);
  }

  function chips(tipo, etiqueta, opciones) {
    return `<div class="chips" role="group" aria-label="Filtrar por ${etiqueta}">
      ${opciones.map((o) => `<button class="chip" type="button" data-filtro="${tipo}" data-valor="${o.id}" aria-pressed="${filtros[tipo] === o.id}">${o.nombre}</button>`).join('')}
    </div>`;
  }

  function pintarFiltros() {
    const categorias = chips('categoria', 'categoría', [{ id: '', nombre: 'Todas' }, ...CATEGORIAS]);
    const tonos = chips('tono', 'tono', [{ id: '', nombre: 'Todos los tonos' }, { id: 'Dorado', nombre: 'Dorado' }, { id: 'Plateado', nombre: 'Plateado' }]);
    const regalo = seccion === 'regalos' ? '' : `<button class="chip" type="button" id="filtroRegalo" aria-pressed="${filtros.regalo}">Ideal para regalo</button>`;
    porId('filtros').innerHTML = (esCategoria ? '' : categorias) + `<div class="filtros-fila">${tonos}${regalo}</div>`;
  }

  function ordenar(lista) {
    if (filtros.orden === 'menor') return [...lista].sort((a, b) => a.precio - b.precio);
    if (filtros.orden === 'mayor') return [...lista].sort((a, b) => b.precio - a.precio);
    return lista;
  }

  function pintarPiezas() {
    const lista = ordenar(PRODUCTOS.filter(coincide));
    porId('rejilla').innerHTML = lista.map(htmlTarjeta).join('');
    porId('resultados').textContent = plural(lista.length);
    porId('vacio').hidden = lista.length > 0;
    animarEntradas(porId('rejilla'));
  }

  porId('filtros').addEventListener('click', (evento) => {
    if (evento.target.id === 'filtroRegalo') {
      filtros.regalo = !filtros.regalo;
      evento.target.setAttribute('aria-pressed', filtros.regalo);
      pintarPiezas();
      return;
    }
    const chip = evento.target.closest('[data-filtro]');
    if (!chip) return;
    filtros[chip.dataset.filtro] = chip.dataset.valor;
    porId('filtros').querySelectorAll(`[data-filtro="${chip.dataset.filtro}"]`).forEach((otro) => {
      otro.setAttribute('aria-pressed', otro === chip);
    });
    pintarPiezas();
  });

  porId('orden').addEventListener('change', (evento) => {
    filtros.orden = evento.target.value;
    pintarPiezas();
  });

  porId('limpiar').addEventListener('click', () => {
    if (buscado) {
      location.href = 'catalogo.html';
      return;
    }
    Object.assign(filtros, { categoria: '', tono: '', regalo: false });
    pintarFiltros();
    pintarPiezas();
  });

  pintarFiltros();
  pintarPiezas();
}

// Página de inicio.

function iniciarInicio() {
  porId('categorias').innerHTML = CATEGORIAS
    .map((c) => {
      const piezas = PRODUCTOS.filter((p) => p.categoria === c.id).length;
      return `<li><a class="categoria" href="${c.id}.html">
        <span class="marco marco-cuadrado"><img src="${escapar(c.imagen)}" alt="" loading="lazy"></span>
        <span class="categoria-nombre">${c.nombre}</span>
        <span class="categoria-total">${plural(piezas)}</span>
      </a></li>`;
    })
    .join('');
  iniciarCarrusel(document.querySelector('.carrusel'));
  iniciarPestanas();
}

function iniciarCarrusel(carrusel) {
  const diapositivas = [...carrusel.querySelectorAll('.diapositiva')];
  const puntos = [...carrusel.querySelectorAll('[data-ir]')];
  const botonPausa = carrusel.querySelector('[data-pausa]');
  let actual = 0;
  let temporizador = null;
  let pausadoPorUsuario = reducirMovimiento;
  let inicioDeslizamiento = null;

  function mostrar(indice) {
    actual = (indice + diapositivas.length) % diapositivas.length;
    diapositivas.forEach((diapositiva, i) => {
      const activa = i === actual;
      diapositiva.classList.toggle('activa', activa);
      diapositiva.inert = !activa;
      diapositiva.setAttribute('aria-hidden', String(!activa));
    });
    puntos.forEach((punto, i) => punto.setAttribute('aria-current', String(i === actual)));
  }

  function detener() {
    clearInterval(temporizador);
    temporizador = null;
  }

  function reproducir() {
    if (pausadoPorUsuario || temporizador) return;
    temporizador = setInterval(() => mostrar(actual + 1), 6500);
  }

  function pintarPausa() {
    botonPausa.textContent = pausadoPorUsuario ? 'Reproducir' : 'Pausar';
    // Mientras avanza solo, anunciar cada cambio sería molesto; en pausa sí se anuncia.
    porId('diapositivas').setAttribute('aria-live', pausadoPorUsuario ? 'polite' : 'off');
  }

  function irA(indice) {
    mostrar(indice);
    detener();
    reproducir();
  }

  carrusel.addEventListener('click', (evento) => {
    const punto = evento.target.closest('[data-ir]');
    if (punto) return irA(Number(punto.dataset.ir));
    const paso = evento.target.closest('[data-paso]');
    if (paso) return irA(actual + Number(paso.dataset.paso));
    if (evento.target.closest('[data-pausa]')) {
      pausadoPorUsuario = !pausadoPorUsuario;
      if (pausadoPorUsuario) detener();
      else reproducir();
      pintarPausa();
    }
  });

  carrusel.addEventListener('mouseenter', detener);
  carrusel.addEventListener('mouseleave', reproducir);
  carrusel.addEventListener('focusin', detener);
  carrusel.addEventListener('focusout', (evento) => {
    if (!carrusel.contains(evento.relatedTarget)) reproducir();
  });

  carrusel.addEventListener('pointerdown', (evento) => {
    inicioDeslizamiento = evento.clientX;
  });
  carrusel.addEventListener('pointerup', (evento) => {
    if (inicioDeslizamiento === null) return;
    const distancia = evento.clientX - inicioDeslizamiento;
    inicioDeslizamiento = null;
    if (Math.abs(distancia) > 50) irA(actual + (distancia < 0 ? 1 : -1));
  });

  mostrar(0);
  pintarPausa();
  reproducir();
}

function iniciarPestanas() {
  const pestanas = [...document.querySelectorAll('[role="tab"]')];
  const panel = porId('panelColeccion');
  const enlace = porId('enlaceColeccion');

  function activar(pestana) {
    pestanas.forEach((otra) => {
      const seleccionada = otra === pestana;
      otra.setAttribute('aria-selected', String(seleccionada));
      otra.tabIndex = seleccionada ? 0 : -1;
    });
    const coleccion = pestana.dataset.coleccion;
    panel.setAttribute('aria-labelledby', pestana.id);
    porId('rielColeccion').innerHTML = PRODUCTOS.filter((p) => p.coleccion === coleccion).slice(0, 4).map(htmlTarjeta).join('');
    enlace.href = `${coleccion}.html`;
    enlace.textContent = `Ver ${pestana.textContent}`;
    reiniciarAnimacion(panel, 'entrando');
  }

  document.querySelector('[role="tablist"]').addEventListener('click', (evento) => {
    const pestana = evento.target.closest('[role="tab"]');
    if (pestana) activar(pestana);
  });

  document.querySelector('[role="tablist"]').addEventListener('keydown', (evento) => {
    const indice = pestanas.indexOf(document.activeElement);
    const destinos = { ArrowRight: indice + 1, ArrowLeft: indice - 1, Home: 0, End: pestanas.length - 1 };
    if (!(evento.key in destinos)) return;
    evento.preventDefault();
    const pestana = pestanas[(destinos[evento.key] + pestanas.length) % pestanas.length];
    activar(pestana);
    pestana.focus();
  });

  activar(pestanas[0]);
}

// Página de producto.

function iniciarProducto() {
  const p = buscarProducto(parametros.get('id'));
  if (!p) {
    porId('vistaProducto').innerHTML = `<div class="no-encontrado">
      <h1>No encontramos esta pieza</h1>
      <p>Puede que ya no esté en el catálogo.</p>
      <a class="btn btn-primario" href="catalogo.html">Ver todo el catálogo</a>
    </div>`;
    return;
  }

  document.title = `${p.nombre} | ${CONFIG.marca}`;
  const categoria = nombreCategoria(p.categoria);
  const consulta = `Hola, ${CONFIG.marca}. Me interesa la pieza "${p.nombre}" (${dinero(p.precio)}). ¿Está disponible para entrega?`;
  const filasFicha = { ...p.ficha, Tono: p.tono, Estado: DISPONIBILIDAD[p.disponibilidad] };
  const miniaturas = p.imagenes.length > 1
    ? `<div class="miniaturas">${p.imagenes.map((ruta, i) => `<button type="button" data-foto="${escapar(ruta)}" aria-label="Ver foto ${i + 1}"><img src="${escapar(ruta)}" alt=""></button>`).join('')}</div>`
    : '';

  porId('vistaProducto').innerHTML = `
    <nav class="migas" aria-label="Ruta">
      <a href="index.html">Inicio</a> / <a href="${p.categoria}.html">${escapar(categoria)}</a> / <span aria-current="page">${escapar(p.nombre)}</span>
    </nav>
    <div class="producto">
      <div class="galeria">
        <div class="marco marco-cuadrado" id="fotoPrincipal"><img src="${escapar(p.imagenes[0])}" alt="${escapar(p.nombre)}">${htmlEtiqueta(p)}</div>
        ${miniaturas}
      </div>
      <div class="producto-info">
        <p class="antetitulo">${escapar(nombreColeccion(p))} · ${escapar(categoria)}</p>
        <h1>${escapar(p.nombre)}</h1>
        <p class="precio precio-grande">${dinero(p.precio)}</p>
        <p class="producto-descripcion">${escapar(p.descripcion)}</p>
        <dl class="ficha">
          ${Object.entries(filasFicha).map(([campo, valor]) => `<div><dt>${escapar(campo)}</dt><dd>${escapar(valor)}</dd></div>`).join('')}
        </dl>
        <div class="producto-acciones">
          <button class="btn btn-primario" type="button" data-agregar="${p.id}">Agregar a mi bolsa</button>
          <a class="btn btn-secundario" href="${enlaceWhatsapp(consulta)}" target="_blank" rel="noopener">Pedir por WhatsApp</a>
        </div>
        <p class="nota">Envíos a domicilio y nacionales. <a href="materiales.html">Guía de medidas y cuidados</a></p>
      </div>
    </div>`;

  porId('vistaProducto').addEventListener('click', (evento) => {
    const miniatura = evento.target.closest('[data-foto]');
    if (miniatura) porId('fotoPrincipal').querySelector('img').src = miniatura.dataset.foto;
  });
  activarLupa(porId('fotoPrincipal'));

  const relacionadas = PRODUCTOS.filter((otra) => otra.categoria === p.categoria && otra.id !== p.id).slice(0, 4);
  porId('relacionadas').hidden = relacionadas.length === 0;
  porId('rielRelacionadas').innerHTML = relacionadas.map(htmlTarjeta).join('');
}

// Página de Círculo Artezza.

function iniciarCirculo() {
  const monto = porId('montoCompra');
  monto.addEventListener('input', () => {
    porId('puntosCalculados').textContent = `${puntosPorCompra(Math.max(0, Number(monto.value) || 0))} puntos`;
  });
}

// Página de tiendas.

function iniciarTiendas() {
  porId('listaTiendas').innerHTML = TIENDAS
    .map((t) => `<li class="tienda">
      <p class="antetitulo">${escapar(t.ciudad)}</p>
      <h2>${escapar(t.nombre)}</h2>
      <p>${escapar(t.direccion)}</p>
      <a class="btn btn-secundario" href="${escapar(t.mapa)}" target="_blank" rel="noopener">Cómo llegar</a>
    </li>`)
    .join('');
}

// Arranque.

document.addEventListener('click', (evento) => {
  const objetivo = evento.target;

  const agregar = objetivo.closest('[data-agregar]');
  if (agregar) {
    cambiarCantidad(agregar.dataset.agregar, 1);
    notificar(`${buscarProducto(agregar.dataset.agregar).nombre} se agregó a tu bolsa`);
    confirmarEnBoton(agregar);
    return;
  }

  const boton = objetivo.closest('[data-cantidad]');
  if (boton) {
    const { id, cantidad } = boton.dataset;
    cambiarCantidad(id, Number(cantidad));
    // Pintar la bolsa reemplaza sus botones: el foco vuelve al equivalente o, si la pieza salió, a cerrar.
    (document.querySelector(`[data-id="${id}"][data-cantidad="${cantidad}"]`) ?? porId('cerrarBolsa')).focus();
    return;
  }

  if (objetivo.closest('[data-cerrar]')) {
    objetivo.closest('dialog').close();
    return;
  }

  // El contenido va dentro de .cajon-cuerpo, así que un clic directo en <dialog> es un clic en el fondo.
  if (objetivo.tagName === 'DIALOG') objetivo.close();
});

pintarCabecera();
pintarPie();

porId('abrirMenu').addEventListener('click', () => porId('menuMovil').showModal());
porId('abrirBolsa').addEventListener('click', () => porId('bolsa').showModal());
porId('esRegalo').addEventListener('change', (evento) => {
  esRegalo = evento.target.checked;
  porId('campoMensaje').hidden = !esRegalo;
  pintarBolsa();
});
porId('mensajeTarjeta').addEventListener('input', (evento) => {
  mensajeTarjeta = evento.target.value;
  pintarBolsa();
});
porId('vaciar').addEventListener('click', () => {
  bolsa = [];
  guardarBolsa();
  pintarBolsa();
  porId('cerrarBolsa').focus();
});

const cabecera = document.querySelector('.cabecera');
addEventListener('scroll', () => cabecera.classList.toggle('con-sombra', scrollY > 8), { passive: true });

const INICIOS = {
  inicio: iniciarInicio,
  coleccion: iniciarColeccion,
  producto: iniciarProducto,
  circulo: iniciarCirculo,
  tiendas: iniciarTiendas,
};
INICIOS[document.body.dataset.pagina]?.();
pintarBolsa();
animarEntradas(document);

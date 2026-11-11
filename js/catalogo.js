// Datos editables del sitio. Para actualizar el catálogo basta con cambiar este archivo.

const CONFIG = {
  marca: 'Artezza',
  instagram: 'https://www.instagram.com/artezza.zza/',
  // Número con lada de país y sin espacios ni signos.
  whatsapp: '529992364162',
  whatsappVisible: '999 236 4162',
  // Muestra el aviso de datos de referencia. Cambiar a false con el inventario real cargado.
  modoPrototipo: true,
};

const TIENDAS = [
  {
    nombre: 'Las Américas',
    ciudad: 'Mérida · desde 2026',
    direccion: 'Calle 108 #149J, local 2, fraccionamiento Las Américas 2, Mérida, Yucatán',
    mapa: 'https://www.google.com/maps/search/?api=1&query=Calle+108+149J+Las+Am%C3%A9ricas+2+M%C3%A9rida+Yucat%C3%A1n',
  },
  {
    nombre: 'Campeche',
    ciudad: 'Campeche · desde 2023',
    direccion: 'Nuestra primera tienda y el origen de la comunidad Artezza.',
    mapa: 'https://maps.google.com/?q=19.842625,-90.535683',
  },
];

// Cada categoría y colección tiene su propia página: su id coincide con el nombre del archivo .html.
const CATEGORIAS = [
  { id: 'aretes', nombre: 'Aretes', imagen: 'img/productos/aros_ola.jpg' },
  { id: 'collares', nombre: 'Collares', imagen: 'img/productos/collar_concha.jpg' },
  { id: 'pulseras', nombre: 'Pulseras', imagen: 'img/productos/brazaletes_plata.jpg' },
  { id: 'anillos', nombre: 'Anillos', imagen: 'img/productos/anillo_perla.jpg' },
];

const COLECCIONES = [
  { id: 'marea', nombre: 'Marea' },
  { id: 'esenciales', nombre: 'Esenciales' },
  { id: 'clasica', nombre: 'Clásica' },
];

const DISPONIBILIDAD = { ok: 'Disponible', pocas: 'Últimas piezas', pedido: 'Bajo pedido' };

// Campos de cada pieza:
//   precio:          número en pesos mexicanos.
//   tono:            'Dorado' o 'Plateado'.
//   coleccion:       id de una colección, o null para Edición limitada.
//   imagenes:        rutas de las fotos. La segunda aparece al pasar el cursor y todas en la ficha.
//   regalo:          aparece en Para regalar.
//   limitada:        lleva la etiqueta "Edición limitada".
//   disponibilidad:  clave de DISPONIBILIDAD.
//   ficha:           filas libres de la ficha de producto (material, medidas, cierre, sucursal).
const PRODUCTOS = [
  { id: 'aros-ola', nombre: 'Aros Ola', categoria: 'aretes', tono: 'Dorado', coleccion: 'marea', precio: 289, imagenes: ['img/productos/aros_ola.jpg'], regalo: true, disponibilidad: 'ok', descripcion: 'Arracadas acanaladas que recuerdan el movimiento del mar. Ligeras para usarse todo el día.', ficha: { Material: 'Acero inoxidable, acabado dorado', Medida: '2.5 cm de diámetro', Cierre: 'Bisagra de presión', 'Disponible en': 'Mérida y Campeche' } },
  { id: 'collar-concha', nombre: 'Collar Concha Marina', categoria: 'collares', tono: 'Dorado', coleccion: 'marea', precio: 299, imagenes: ['img/productos/collar_concha.jpg'], regalo: true, disponibilidad: 'ok', descripcion: 'Cadena fina con dije de concha y pequeñas estrellas de mar.', ficha: { Material: 'Acero inoxidable, acabado dorado', Largo: '45 cm + 5 cm de extensión', Dije: '2 cm', 'Disponible en': 'Mérida y Campeche' } },
  { id: 'anillo-perla', nombre: 'Anillo Perla Abierta', categoria: 'anillos', tono: 'Dorado', coleccion: 'esenciales', precio: 249, imagenes: ['img/productos/anillo_perla.jpg'], regalo: true, disponibilidad: 'ok', descripcion: 'Anillo abierto con una esfera pulida y un detalle perlado de forma orgánica.', ficha: { Material: 'Acero inoxidable, acabado dorado', Talla: 'Ajustable (5 a 8)', Detalle: 'Perla de forma irregular', 'Disponible en': 'Mérida' } },
  { id: 'aretes-destello', nombre: 'Aretes Destello', categoria: 'aretes', tono: 'Dorado', coleccion: null, precio: 229, imagenes: ['img/productos/aretes_destello.jpg'], regalo: false, limitada: true, disponibilidad: 'pocas', descripcion: 'Aretes asimétricos con rayos finos y perla. Una pieza para destacar en una ocasión especial.', ficha: { Material: 'Acero inoxidable', Largo: '6 cm', Colores: 'Dorado y azul', 'Disponible en': 'Mérida' } },
  { id: 'arracadas-perla', nombre: 'Arracadas Perla Libre', categoria: 'aretes', tono: 'Dorado', coleccion: 'marea', precio: 269, imagenes: ['img/productos/arracadas_lisas.jpg'], regalo: true, disponibilidad: 'ok', descripcion: 'Arracadas lisas con dijes de perla y cadena. Se pueden usar con o sin los dijes.', ficha: { Material: 'Acero inoxidable, acabado dorado', Medida: '4 cm de diámetro', Cierre: 'Bisagra de presión', 'Disponible en': 'Mérida y Campeche' } },
  { id: 'anillo-trenza', nombre: 'Anillo Trenza Brillo', categoria: 'anillos', tono: 'Dorado', coleccion: 'esenciales', precio: 199, imagenes: ['img/productos/anillo_doble.jpg'], regalo: true, disponibilidad: 'ok', descripcion: 'Doble línea trenzada con una fila de brillos al centro. Elegante sin ser pesado.', ficha: { Material: 'Acero inoxidable, acabado dorado', Talla: 'Ajustable (5 a 8)', Ancho: '1 cm', 'Disponible en': 'Mérida y Campeche' } },
  { id: 'anillo-espiral', nombre: 'Anillo Espiral', categoria: 'anillos', tono: 'Dorado', coleccion: 'marea', precio: 219, imagenes: ['img/productos/anillo_espiral.jpg'], regalo: false, disponibilidad: 'ok', descripcion: 'Espirales que evocan el caracol de mar. Un anillo protagonista para todos los días.', ficha: { Material: 'Acero inoxidable, acabado dorado', Talla: 'Ajustable (5 a 8)', Ancho: '2 cm', 'Disponible en': 'Mérida' } },
  { id: 'anillo-burbujas', nombre: 'Anillo Burbujas', categoria: 'anillos', tono: 'Dorado', coleccion: 'esenciales', precio: 159, imagenes: ['img/productos/anillo_burbujas.jpg'], regalo: true, disponibilidad: 'ok', descripcion: 'Esferas pequeñas unidas en un aro abierto. Ideal para combinar con otros anillos.', ficha: { Material: 'Acero inoxidable, acabado dorado', Talla: 'Ajustable (5 a 8)', Ancho: '0.5 cm', 'Disponible en': 'Mérida y Campeche' } },
  { id: 'brazaletes-luna', nombre: 'Brazaletes Luna, set de 3', categoria: 'pulseras', tono: 'Plateado', coleccion: 'esenciales', precio: 279, imagenes: ['img/productos/pulseras_trio.jpg'], regalo: true, disponibilidad: 'ok', descripcion: 'Tres brazaletes rígidos de acabado pulido. Se usan juntos o por separado.', ficha: { Material: 'Acero inoxidable, acabado plateado', Medida: '6.5 cm de diámetro interior', Piezas: '3 brazaletes', 'Disponible en': 'Mérida y Campeche' } },
  { id: 'brazaletes-rayo-oro', nombre: 'Brazaletes Rayo', categoria: 'pulseras', tono: 'Dorado', coleccion: 'esenciales', precio: 259, imagenes: ['img/productos/brazaletes_oro.jpg'], regalo: true, disponibilidad: 'pocas', descripcion: 'Set de brazaletes finos con textura rayada que reflejan la luz al moverse.', ficha: { Material: 'Acero inoxidable, acabado dorado', Medida: '6 cm de diámetro interior', Piezas: 'Set multivuelta', 'Disponible en': 'Mérida' } },
  { id: 'brazaletes-rayo-plata', nombre: 'Brazaletes Rayo plateado', categoria: 'pulseras', tono: 'Plateado', coleccion: 'esenciales', precio: 259, imagenes: ['img/productos/brazaletes_plata.jpg'], regalo: true, disponibilidad: 'ok', descripcion: 'La versión plateada del set Rayo: un tono más formal, fácil de combinar con reloj.', ficha: { Material: 'Acero inoxidable, acabado plateado', Medida: '6 cm de diámetro interior', Piezas: 'Set multivuelta', 'Disponible en': 'Mérida y Campeche' } },
  { id: 'aretes-miel', nombre: 'Aretes Ojo de Miel', categoria: 'aretes', tono: 'Dorado', coleccion: 'clasica', precio: 239, imagenes: ['img/productos/aretes_ojo.jpg'], regalo: true, disponibilidad: 'ok', descripcion: 'Aretes de botón con piedra color miel enmarcada en dorado. Sofisticados y atemporales.', ficha: { Material: 'Acero inoxidable, acabado dorado', Medida: '2.2 cm', Cierre: 'Poste con tope', 'Disponible en': 'Mérida' } },
  { id: 'aretes-moneda', nombre: 'Aretes Perla Moneda', categoria: 'aretes', tono: 'Plateado', coleccion: 'clasica', precio: 249, imagenes: ['img/productos/aretes_moneda.jpg'], regalo: false, disponibilidad: 'pedido', descripcion: 'Perla plana con cascada de cadenas finas. Movimiento ligero para ocasiones especiales.', ficha: { Material: 'Acero inoxidable, acabado plateado', Largo: '5 cm', Cierre: 'Poste con tope', 'Disponible en': 'Bajo pedido, de 3 a 5 días' } },
  { id: 'collar-gota', nombre: 'Collar Gota de Miel', categoria: 'collares', tono: 'Plateado', coleccion: 'clasica', precio: 269, imagenes: ['img/productos/collar_tigre.jpg'], regalo: true, disponibilidad: 'ok', descripcion: 'Cadena tipo serpiente con dije de gota en piedra color miel. Una pieza que no se enreda.', ficha: { Material: 'Acero inoxidable, acabado plateado', Largo: '45 cm + 5 cm de extensión', Dije: '2.5 cm', 'Disponible en': 'Mérida y Campeche' } },
];

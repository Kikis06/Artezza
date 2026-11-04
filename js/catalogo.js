// Datos editables del sitio. Para actualizar el catálogo basta con cambiar este archivo.

const CONFIG = {
  marca: 'Artezza',
  instagram: 'https://www.instagram.com/artezza.zza/',
  // Número con lada de país y sin espacios ni signos. Ejemplo: '5219991234567'
  whatsapp: '',
  // Cambiar a false cuando el catálogo tenga las piezas reales.
  modoMuestra: true,
};

const CATEGORIAS = [
  { id: 'collares', nombre: 'Collares' },
  { id: 'aretes', nombre: 'Aretes' },
  { id: 'pulseras', nombre: 'Pulseras' },
  { id: 'anillos', nombre: 'Anillos' },
];

// Campos de cada pieza:
//   imagen: ruta de la foto, como 'img/productos/collar-1.jpg'. Si es null se muestra una ilustración.
//   forma:  ilustración usada mientras no hay foto.
//   precio: número en pesos mexicanos. Si es null se muestra "Consultar precio".
const PRODUCTOS = [
  { id: 'm01', nombre: 'Collar Cenote', categoria: 'collares', acabado: 'dorado', forma: 'gota', precio: null, imagen: null, disponible: true, descripcion: 'Cadena fina con dije en forma de gota.' },
  { id: 'm02', nombre: 'Collar Luna', categoria: 'collares', acabado: 'plateado', forma: 'dije', precio: null, imagen: null, disponible: true, descripcion: 'Cadena fina con dije circular.' },
  { id: 'm03', nombre: 'Cadena Sisal', categoria: 'collares', acabado: 'dorado', forma: 'cadena', precio: null, imagen: null, disponible: true, descripcion: 'Cadena sencilla para usar sola o en capas.' },
  { id: 'm04', nombre: 'Argollas Izamal', categoria: 'aretes', acabado: 'dorado', forma: 'argollas', precio: null, imagen: null, disponible: true, descripcion: 'Argollas clásicas de uso diario.' },
  { id: 'm05', nombre: 'Aretes Rocío', categoria: 'aretes', acabado: 'plateado', forma: 'colgantes', precio: null, imagen: null, disponible: true, descripcion: 'Aretes colgantes con terminación en gota.' },
  { id: 'm06', nombre: 'Broqueles Sal', categoria: 'aretes', acabado: 'plateado', forma: 'broqueles', precio: null, imagen: null, disponible: true, descripcion: 'Broqueles pequeños y discretos.' },
  { id: 'm07', nombre: 'Pulsera Eslabón', categoria: 'pulseras', acabado: 'plateado', forma: 'eslabon', precio: null, imagen: null, disponible: true, descripcion: 'Pulsera de eslabones marcados.' },
  { id: 'm08', nombre: 'Brazalete Malecón', categoria: 'pulseras', acabado: 'dorado', forma: 'rigida', precio: null, imagen: null, disponible: true, descripcion: 'Brazalete rígido y abierto.' },
  { id: 'm09', nombre: 'Anillo Duna', categoria: 'anillos', acabado: 'dorado', forma: 'ancho', precio: null, imagen: null, disponible: true, descripcion: 'Anillo de banda ancha.' },
  { id: 'm10', nombre: 'Anillo Destello', categoria: 'anillos', acabado: 'plateado', forma: 'solitario', precio: null, imagen: null, disponible: true, descripcion: 'Anillo delgado con detalle central.' },
  { id: 'm11', nombre: 'Anillo Trenza', categoria: 'anillos', acabado: 'plateado', forma: 'trenzado', precio: null, imagen: null, disponible: true, descripcion: 'Anillo de líneas entrelazadas.' },
  { id: 'm12', nombre: 'Anillo Aro', categoria: 'anillos', acabado: 'dorado', forma: 'aro', precio: null, imagen: null, disponible: false, descripcion: 'Anillo liso para combinar.' },
];

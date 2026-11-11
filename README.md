# Artezza: catálogo digital

Sitio estático en HTML, CSS y JavaScript. No necesita instalación ni compilación.
El sitio usa el logotipo registrado de Artezza (`img/marca/logo-artezza.png`): no se redibuja, no se recolorea
ni se sustituye. El resto del diseño del sitio toma su paleta nude de ese logotipo.

## Ver el sitio

Abre la carpeta en VS Code, instala la extensión recomendada Live Server y elige **Go Live**.
También puedes abrir `index.html` directamente en el navegador.

## Páginas

- `index.html`: inicio.
- `catalogo.html`: todo el catálogo y resultados de búsqueda.
- `aretes.html`, `collares.html`, `pulseras.html`, `anillos.html`: categorías.
- `marea.html`, `esenciales.html`, `clasica.html`: colecciones.
- `regalos.html`, `materiales.html`, `circulo.html`, `tiendas.html`: páginas de apoyo.
- `producto.html?id=...`: ficha de cada pieza.

## Editar el catálogo

Las piezas, tiendas, categorías y colecciones se editan en `js/catalogo.js`, y las fotos van en `img/productos/`.

Para agregar una categoría o colección, añádela a `CATEGORIAS` o `COLECCIONES` y copia una página existente,
como `aretes.html`, con el nombre del nuevo `id`. Cambia su `data-seccion` y sus textos.

## Antes de publicar

1. Reemplaza los datos de referencia con el inventario real: nombres, precios, medidas y existencias.
2. Pide a la dueña el archivo original del logotipo y reemplaza `img/marca/logo-artezza.png`, que se recortó de un documento.
3. Confirma que el Círculo Artezza y el empaque de regalo ya estén disponibles para las clientas.
4. No uses términos como «hipoalergénico» sin la ficha técnica del proveedor.
5. Cambia `CONFIG.modoPrototipo` a `false` para quitar el aviso de prototipo.
6. Sustituye las fotos de ambiente por fotos propias cuando las haya (ver abajo).

## Fotos

- `img/productos/`: fotos reales de las piezas, tomadas del prototipo del catálogo.
- `img/marca/`: fotos reales de la marca (tienda y piezas), tomadas de la presentación institucional.
- `img/ambiente/`: fotos de ambiente de bancos libres. Muestran joyería que no es de Artezza,
  así que solo se usan como inspiración, nunca como foto de un producto.

| Archivo | Fuente | Página original |
|---|---|---|
| aretes-argollas.jpg | Pexels | https://www.pexels.com/photo/golden-hoops-in-ear-18075559/ |
| aretes-oreja.jpg | Pexels | https://www.pexels.com/photo/elegant-close-up-of-woman-wearing-stylish-earrings-33936420/ |
| sombrero-verano.jpg | Pexels | https://www.pexels.com/photo/a-woman-wearing-sun-hat-and-gold-loop-earing-8058602/ |
| collar-perlas.jpg | Pexels | https://www.pexels.com/photo/a-woman-wearing-necklaces-9645737/ |
| conchas-arena.jpg | Pexels | https://www.pexels.com/photo/close-up-of-seashells-and-a-pearl-lying-on-sand-17190564/ |
| clasica-arete.jpg | Pexels | https://www.pexels.com/photo/person-holding-an-ear-of-a-woman-6924156/ |
| collares-capas.jpg | Pexels | https://www.pexels.com/photo/close-up-shot-of-a-person-wearing-gold-necklaces-13924051/ |
| collar-camisa.jpg | Unsplash | https://unsplash.com/photos/-GhLgB-oXNw |
| argollas-piedra.jpg | Unsplash | https://unsplash.com/photos/5ngCICAXiH0 |
| regalo-argollas.jpg | Unsplash | Por confirmar: archivo `photo-1608508644127-ba99d7732fee`; la página anotada, https://unsplash.com/photos/oWFPDjxuyUM, se describía como otra foto |

Las licencias de Pexels y Unsplash permiten el uso comercial sin atribución obligatoria; el pie de página las menciona como cortesía.

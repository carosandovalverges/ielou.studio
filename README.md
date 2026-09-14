# ielou.studio — sitio web

Sitio estático en HTML/CSS/JS puro (sin backend), pensado como base visual para:
1. Previsualizarse directo desde GitHub Pages mientras se pule el diseño.
2. Servir de handoff limpio a un developer que lo recree en **WordPress + Elementor**.

## Estructura

```
Ielou.studio/
├── index.html        Home
├── tienda.html         Catálogo completo (buscador + filtro por categoría)
├── portafolio.html       Portafolio / artes visuales
├── producto.html           Detalle de producto (plantilla genérica)
├── checkout.html             Checkout / solicitud de compra
├── contacto.html                Contacto
├── proyecto.html                   Detalle de proyecto (plantilla genérica)
├── css/
│   └── tokens.css     Variables de diseño (fuente única de verdad)
├── js/
│   └── main.js        Comportamiento compartido (menú mobile, galería, checkout, carrusel, filtros de tienda)
└── img/
    ├── productos/      Fotos de piezas a la venta
    ├── portafolio/      Fotos de obras del portafolio
    ├── proyecto/          Fotos del detalle de proyecto
    ├── home/                Banner sección "hecho a mano"
    └── contacto/              Foto del estudio
```

Cada página es **autocontenida**: trae su propio header y footer marcados con
comentarios `<!-- ============ HEADER ============ -->` / `<!-- ============ FOOTER ============ -->`
para que sea fácil de copiar tal cual al Theme Builder de Elementor
(Header / Footer / Single Templates).

## Sistema de diseño (fuente única de verdad)

Ver [`css/tokens.css`](css/tokens.css). Resumen:

| Token | Valor | Uso |
|---|---|---|
| `--color-primary` | `#000000` | Texto principal, botones |
| `--color-accent` | `#ffe16d` | Amarillo de marca — **único**, no usar variantes |
| `--color-background` | `#f9f9f9` | Fondo de página |
| `--color-surface` | `#ffffff` | Tarjetas, header, footer |
| `--font-heading` | Montserrat | Títulos |
| `--font-body` | Inter | Texto, labels |

El mismo objeto `tailwind.config` (con estos mismos hex) está duplicado en el
`<head>` de cada página porque Tailwind CDN no lee `:root` de forma
confiable. **Si cambias un color, actualízalo en `tokens.css` Y en las 6
páginas.**

Breakpoints usados (compatibles con Elementor sin plugins): `px-6` (mobile) →
`md:px-16` (768px, tablet) → `lg:px-24` (1024px+, desktop).

## Qué se corrigió del diseño original de Stitch

El diseño llegó como 6 páginas exportadas por separado, cada una con su
propio `tailwind.config` (3 sistemas de color distintos, un acento amarillo
que cambiaba de hex según la página) y algunos bugs de interacción. Se
unificó todo a un solo sistema y se corrigió:

- Menú mobile de Home no tenía JS asociado (no abría).
- Botones "Comprar" en Home eran `<button>` sin acción; ahora son `<a>` como
  en el resto del sitio.
- El trigger "Tienda" del menú era `<a href="#">` en la mayoría de páginas
  (saltaba al inicio de la página al hacer clic); se dejó como `<button>`
  mientras no existía una página de tienda real, y ahora que `tienda.html`
  existe, es un `<a href="tienda.html">` en las 6 páginas.
- Checkout usaba un set de íconos SVG propio distinto al resto (Material
  Symbols); se unificó a Material Symbols.
- Contacto tenía contenido en inglés y un bug que duplicaba las 8 preguntas
  frecuentes (`document.write` + HTML estático de las mismas preguntas). Se
  tradujo y se dejó una sola sección de FAQ (en Home), con un enlace desde
  Contacto.
- El footer de Contacto usaba `id="contacto-footer"` en vez de `id="contacto"`,
  rompiendo el ancla que usan los demás links "Contacto".
- Las imágenes venían hotlinkeadas al CDN privado de Stitch/Google
  (`lh3.googleusercontent.com/aida-public/...`); se descargaron a `/img/`
  para que el sitio funcione de forma autónoma y sea fácil reemplazarlas por
  fotografía real a futuro (mismo nombre de archivo, mismo lugar).
- Se definió una arquitectura de compra en 2 pasos: `producto.html` (botón
  "Solicitar compra") → `checkout.html` (formulario completo con selección
  de envío/región/comuna). La versión anterior con formulario embebido +
  `mailto:` se descartó.
- Faltaba la página de Tienda: los links "Tienda" del menú, el botón "Ver
  tienda" del hero, las tarjetas de categorías de Home y el footer apuntaban
  a `#tienda` (un ancla dentro de Home) o a `portafolio.html`, sin destino
  real. Se creó `tienda.html` (catálogo completo con buscador y filtro por
  categoría, adaptado desde un diseño de Stitch pero llevado a nuestro
  sistema de tipografía/espaciado/color) y se corrigieron **77 links** rotos
  en las 6 páginas para que apunten ahí. El dropdown "Tienda" del menú y las
  tarjetas de categoría ahora deep-linkean a la categoría correcta
  (`tienda.html#pinturas`, `#prints`, `#timbres`, `#objetos`).
- El trigger "Tienda" del menú era un `<button>` sin destino propio (a
  propósito, mientras no existía la página); ahora que `tienda.html` existe,
  es un `<a>` real en las 6 páginas.

## Pendientes / cosas a confirmar con Caro antes de producción

- [ ] **Fotografía real**: hoy todas las imágenes son el banco de Stitch
  (placeholders de IA), guardadas en `/img/` con nombres descriptivos.
  Reemplazar manteniendo el mismo nombre de archivo para no tener que tocar
  el HTML.
- [ ] **Email de contacto**: el formulario de `contacto.html` apunta a
  `hola@ielou.studio` vía `mailto:` (fallback estático, sin backend). En
  WordPress, reemplazar por el widget de formulario nativo de **Elementor
  Pro** o por **WPForms** (gratis) — confirmar cuál tiene el cliente.
  Confirmar también si esa casilla existe o si debe ir a otro correo.
  Considerar también reCAPTCHA/Turnstile si el formulario recibe spam.
- [ ] **`producto.html` / `proyecto.html`** son plantillas genéricas de una
  sola pieza ("Vasija Escultural 'Silencio'" / "Resonancia Estática"). Todos
  los botones "Comprar" del sitio (incluidos los 16 de `tienda.html`) apuntan
  hoy a esa misma plantilla genérica — el developer deberá duplicarla por
  cada pieza real en venta (o generarla dinámicamente vía WooCommerce si el
  proyecto crece a catálogo real).
- [ ] **Checkout no procesa pagos**: es un formulario que arma un resumen y
  muestra un mensaje de éxito simulado (sin backend). Definir con Caro si el
  flujo real será manual (transferencia + WhatsApp/email) o si se integrará
  Webpay/MercadoPago — el copy del botón ya menciona ambos como opción
  futura.
- [ ] **Redes sociales**: Facebook apunta a `#` (no se proporcionó URL).

## Dependencias de Elementor a tener en cuenta

Según el sitio use Elementor Free o Pro:

- **Formulario de contacto**: nativo en Pro, o plugin **WPForms** (gratis).
- **Slider/carrusel de detalle de proyecto**: nativo en Pro, o **Smart
  Slider 3** (gratis) — el carrusel actual es JS vanilla (`js/main.js`), así
  que también puede quedar tal cual si el developer prefiere no depender de
  un plugin.
- **Acordeón de FAQ**: usa `<details>/<summary>` nativo de HTML, no requiere
  ningún plugin ni widget especial — cualquier widget de Accordion de
  Elementor (Free) lo replica 1:1.

## Cómo previsualizar

Este es un sitio 100% estático — no requiere build ni backend. Basta con:

- Abrir cualquier `.html` directo en el navegador, o
- Publicarlo en **GitHub Pages** (repo público o privado con Pages
  habilitado) para tener una URL compartible mientras se pule el diseño.

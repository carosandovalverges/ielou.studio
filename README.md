# ielou.studio — sitio web

Sitio estático en HTML/CSS/JS puro (sin backend), pensado como base visual para:
1. Previsualizarse directo desde GitHub Pages mientras se pule el diseño.
2. Servir de handoff limpio a un developer que lo recree en **WordPress + Elementor**.

## Estructura

```
Ielou.studio/
├── index.html                    Home
├── tienda.html                   Catálogo completo (Grabados/Pinturas/Serigrafías + Próximamente; buscador + filtro)
├── producto-<obra>.html          25 páginas de detalle, una por obra real (ver catálogo real más abajo)
├── portafolio.html               Portafolio / artes visuales
├── producto.html                 Plantilla genérica sin uso (quedó de la etapa de mockups; ver Pendientes)
├── checkout.html                 Checkout / solicitud de compra (recibe la obra por parámetros de URL)
├── contacto.html                 Contacto
├── proyecto.html                 Detalle de proyecto (plantilla genérica)
├── cambios-y-devoluciones.html   Política de cambios y devoluciones
├── politica-envios.html          Política de envíos
├── politica-privacidad.html      Política de privacidad
├── terminos-y-condiciones.html   Términos y condiciones (⚠️ ver pendientes)
├── EMAILJS-SETUP.md              Guía paso a paso para activar el envío automático de correos
├── css/
│   └── tokens.css     Variables de diseño (fuente única de verdad)
├── js/
│   ├── main.js               Comportamiento compartido (menú mobile, galería, checkout, carrusel, filtros de tienda)
│   ├── chile-regiones.js     Datos Región→Ciudad→Comuna para el checkout (16 regiones, ~343 comunas)
│   └── emailjs-config.js     IDs de EmailJS para el checkout (⚠️ completar, ver EMAILJS-SETUP.md)
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

## Copy de Checkout, FAQ y páginas legales (2026-09-16)

Se reescribió el copy de `checkout.html` para reflejar el flujo real del
negocio (coordinación manual por correo, sin pasarela de pago automática ni
cobro por tarjeta):

- El formulario dejó de tener paneles condicionales por método de envío
  (mostrar/ocultar campos de dirección según Starken o domicilio). Ahora
  "Dirección de envío", "Región", "Ciudad" y "Comuna" son campos fijos
  dentro de "Tus datos" (independientes del método elegido), y "Entrega" es
  solo la preferencia de método (envío a domicilio, retiro en sucursal, o
  retiro presencial en Plaza Ñuñoa).
- Región → Ciudad → Comuna es un selector en cascada con **las 16 regiones
  de Chile completas** (`js/chile-regiones.js`, ~343 comunas agrupadas en 52
  ciudades/conurbaciones). "Ciudad" no es una unidad administrativa oficial
  de Chile (la división real es Región → Provincia → Comuna) — se agrupó así
  para que el selector sea más fácil de usar que una lista plana de 343
  comunas. Si falta alguna comuna, se agrega directo en ese archivo.
- El botón "Solicitar compra" intenta enviar **2 correos automáticos** vía
  [EmailJS](https://www.emailjs.com) (gratis, sin backend propio): uno te
  avisa a ti de la nueva solicitud, y otro le llega **al cliente** como
  confirmación (con espacio para tus datos de transferencia). Mientras no
  hayas completado tu cuenta en `js/emailjs-config.js`, el sitio sigue
  funcionando con el `mailto:` de respaldo de antes (abre el correo del
  comprador dirigido a ti). Guía completa de activación:
  [`EMAILJS-SETUP.md`](EMAILJS-SETUP.md).
- El mensaje de éxito en pantalla ahora compromete un plazo: "Nos pondremos
  en contacto contigo dentro de las próximas 24 horas..." — confirmado por
  Caro. Si en la práctica no logras responder siempre dentro de ese plazo,
  avísame y lo suavizamos.
- El bloque de confianza de Checkout (antes "Envíos a todo Chile / Hecho a
  mano / Compra segura / ¿Necesitas ayuda?", genérico y compartido con el
  resto del sitio) se reemplazó por uno específico de 3 ítems: **Pago
  coordinado y seguro**, **Comprobante y certificado**, **Embalaje cuidado**.
- Se corrigió texto que insinuaba una pasarela de pago automática
  ("pasarela protegida y encriptada", "Webpay / MercadoPago", "Pago online
  mediante plataformas protegidas y encriptadas") en `checkout.html`,
  `producto.html`, `tienda.html` e `index.html` — el negocio real es
  transferencia bancaria o link de pago coordinado por correo, nunca
  automático.
- Las 9 preguntas frecuentes de `index.html` se reemplazaron por completo
  (embalaje, firma/autenticidad, envíos, plazos, comprobante, compras desde
  el extranjero, cuidado de piezas, encargos, colaboraciones).
- Se crearon las 4 páginas legales/de ayuda (`cambios-y-devoluciones.html`,
  `politica-envios.html`, `politica-privacidad.html`,
  `terminos-y-condiciones.html`) y se enlazaron desde el footer de las 11
  páginas del sitio.

⚠️ **Antes de publicar, revisar con una abogada o contador:**
- `terminos-y-condiciones.html` es una base aterrizada pero **no es
  asesoría legal** — tiene un comentario HTML al inicio con el mismo aviso.
  Falta completar el RUT de Carola (punto 1, hoy dice
  `[pendiente — completar antes de publicar]`).
- La cláusula de derecho a retracto en `cambios-y-devoluciones.html` (Ley
  19.496, 10 días corridos) es el punto más delicado del set legal — conviene
  que la revise alguien con conocimiento legal para el caso específico del
  negocio.
- El sitio hoy usa **dos correos de contacto distintos**:
  `hola@ielou.studio` (formulario de `contacto.html`, definido en una
  sesión anterior) y `carola.sandoval@hotmail.com` (usado en el FAQ y las
  4 páginas legales, tal como lo especificó Caro). Confirmar cuál es el
  correo real de atención y unificarlo en todo el sitio.

## Pendientes / cosas a confirmar con Caro antes de producción

- [x] **Fotografía real (obras a la venta)**: las 25 piezas reales del
  catálogo (`producto-*.html`, cargadas desde el PDF de catálogo de Caro)
  ya usan fotografías reales en `img/productos/`. Los 16 productos de
  muestra originales (Stitch/IA) siguen en `tienda.html` bajo la sección
  "Próximamente", marcados como no disponibles — reemplazar sus imágenes o
  quitarlos cuando haya piezas reales para esas categorías (pintura en
  lienzo, timbres, cerámica).
- [ ] **Email de contacto**: el formulario de `contacto.html` apunta a
  `hola@ielou.studio` vía `mailto:` (fallback estático, sin backend). En
  WordPress, reemplazar por el widget de formulario nativo de **Elementor
  Pro** o por **WPForms** (gratis) — confirmar cuál tiene el cliente.
  Confirmar también si esa casilla existe o si debe ir a otro correo.
  Considerar también reCAPTCHA/Turnstile si el formulario recibe spam.
- [x] **Páginas de producto por obra**: las 25 piezas reales ya tienen su
  propia página (`producto-<slug>.html`), generadas desde
  `Ielou.studio/../.../scratchpad/productos/build_catalog.py` (script de
  referencia, no forma parte del sitio). `producto.html` /
  `proyecto.html` quedan como plantillas genéricas sin usar — se pueden
  eliminar o reutilizar como base para futuras piezas. El checkout recibe
  nombre/precio/imagen/categoría por parámetros de URL
  (`checkout.html?nombre=...&precio=...&img=...&categoria=...`), poblados
  por JS en `js/main.js` (`applyCheckoutProductFromUrl`).
- [ ] **Falta activar EmailJS**: `js/emailjs-config.js` todavía tiene los 4
  valores de ejemplo (`TU_...`). Hasta que Caro siga los pasos de
  [`EMAILJS-SETUP.md`](EMAILJS-SETUP.md), el checkout sigue funcionando con
  el `mailto:` de respaldo (depende de que el comprador tenga un cliente de
  correo configurado en su dispositivo — en computadores con solo Gmail web
  puede no abrir nada visible). Una vez activado EmailJS, ese límite
  desaparece.
- [ ] **Checkout no procesa pagos**: no hay pasarela de pago ni cobro
  automático — es intencional, coincide con el copy ("coordinación por
  correo"). El correo de confirmación al cliente (plantilla de EmailJS) es
  donde Caro debe escribir sus datos de transferencia reales.
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

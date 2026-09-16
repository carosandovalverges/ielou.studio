# Configurar el envío automático de correos del Checkout

Cuando alguien completa el formulario de `checkout.html` y hace clic en
**"Solicitar compra"**, hoy el sitio abre un borrador de correo en el programa
de correo de esa persona, dirigido a ti (usando `mailto:`). Funciona, pero
depende de que esa persona tenga un cliente de correo configurado en su
computador, y **tú no recibes nada automático**, ni el cliente recibe una
confirmación.

Siguiendo esta guía (una sola vez, ~15 minutos), el checkout va a:

1. Enviarte **a ti** un correo avisándote de la nueva solicitud, con todos
   los datos — y puedes responder directo desde ahí, la respuesta le llega
   al cliente.
2. Enviarle **al cliente**, automáticamente, un correo de confirmación con
   el resumen de su pedido y (si quieres) tus datos de transferencia.

Usamos **[EmailJS](https://www.emailjs.com)**, un servicio gratuito pensado
justo para esto: enviar correos reales desde un sitio sin backend. El plan
gratis permite ~200 correos al mes (100 solicitudes, ya que cada una manda 2
correos) — de sobra para partir.

> **Importante sobre seguridad**: el contenido de los correos (incluyendo
> tus datos de transferencia bancaria, si decides incluirlos) se escribe
> **dentro de tu cuenta de EmailJS**, nunca en los archivos del sitio. El
> repositorio de GitHub es público, así que jamás pongas datos bancarios
> directamente en el código — solo en las plantillas de EmailJS, a las que
> solo tú tienes acceso.

## Paso 1 — Crear tu cuenta

1. Ve a [emailjs.com](https://www.emailjs.com) → **Sign Up** (gratis, con tu
   correo o cuenta de Google).

## Paso 2 — Conectar tu correo real

1. En el panel, ve a **Email Services** → **Add New Service**.
2. Elige **Gmail** (o Outlook, según cuál uses) y sigue el flujo para
   autorizar tu cuenta. Así los correos salen realmente desde tu dirección.
3. Anota el **Service ID** que te genera (algo como `service_abc1234`).

## Paso 3 — Crear la plantilla para TI (aviso de nueva solicitud)

1. Ve a **Email Templates** → **Create New Template**.
2. Nómbrala, por ejemplo, `Nueva solicitud — ielou.studio`.
3. En **Settings** de la plantilla:
   - **To Email**: tu propio correo (el mismo que conectaste).
   - **Reply To**: `{{buyer_email}}` — así, si le respondes directo a este
     correo, la respuesta le llega al cliente, no a ti mismo.
4. En **Content**, pega esto como cuerpo:

```
Llegó una nueva solicitud desde ielou.studio.

PIEZA
{{product_name}} — {{product_price}}

COMPRADOR
Nombre: {{buyer_name}}
Correo: {{buyer_email}}
Teléfono: {{buyer_phone}}
RUT: {{buyer_rut}}

DIRECCIÓN DE ENVÍO
{{shipping_address}}, {{shipping_comuna}}, {{shipping_city}}, {{shipping_region}}

MÉTODO DE ENTREGA
{{shipping_method}}

NOTAS
{{order_notes}}

Responde directo a este correo para escribirle a {{buyer_name}}.
```

5. Guarda y anota el **Template ID** (algo como `template_xyz789`).

## Paso 4 — Crear la plantilla para el CLIENTE (confirmación)

1. **Create New Template** de nuevo. Nómbrala `Confirmación de compra —
   ielou.studio`.
2. En **Settings**:
   - **To Email**: `{{buyer_email}}` — clave, es lo que hace que le llegue
     al cliente y no a ti.
   - **Reply To**: tu correo, para que si el cliente responde, te llegue a ti.
3. En **Content**, un punto de partida (ajusta el tono a tu gusto, y
   completa la parte de datos de transferencia con los tuyos reales):

```
Hola {{buyer_name}},

¡Gracias por tu solicitud! Recibimos el pedido de tu pieza:

{{product_name}} — {{product_price}}

Nos pondremos en contacto contigo dentro de las próximas 24 horas para
coordinar el pago y la entrega.

DATOS PARA TRANSFERENCIA
[Completa aquí: nombre, banco, tipo de cuenta, número de cuenta, RUT y
correo para enviar el comprobante. Este texto vive solo acá, en tu cuenta
de EmailJS — nunca en el código público del sitio.]

Resumen de tu pedido:
Dirección: {{shipping_address}}, {{shipping_comuna}}, {{shipping_city}}, {{shipping_region}}
Método de entrega: {{shipping_method}}

Cualquier duda, responde directo a este correo.

Gracias por apoyar el trabajo hecho a mano,
Carola — ielou.studio
```

4. Guarda y anota el **Template ID** de esta segunda plantilla.

## Paso 5 — Obtener tu Public Key

1. Ve a **Account** → **General**.
2. Copia el **Public Key** (es pública a propósito, está pensada para vivir
   en el código del sitio — no es una contraseña).

## Paso 6 — Completar `js/emailjs-config.js`

Abre [`js/emailjs-config.js`](js/emailjs-config.js) y reemplaza los 4
valores con lo que anotaste en los pasos anteriores:

```js
const EMAILJS_CONFIG = {
  publicKey: 'tu_public_key_real',
  serviceId: 'service_abc1234',
  templateOwnerId: 'template_xyz789',      // la plantilla del Paso 3
  templateCustomerId: 'template_qrs456',   // la plantilla del Paso 4
};
```

Guarda, sube el cambio a GitHub, y listo — el checkout empieza a enviar los
2 correos automáticos. Mientras los valores digan `TU_...`, el sitio sigue
funcionando con el `mailto:` de respaldo, así que no hay apuro ni riesgo de
romper nada mientras configuras esto.

## Cómo probarlo

1. Completa el formulario de `checkout.html` con un correo tuyo de prueba
   en "Correo electrónico".
2. Envía la solicitud.
3. Deberías recibir el correo de aviso en tu bandeja, y el correo de
   confirmación debería llegar a la casilla que pusiste como comprador.

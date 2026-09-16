/*
  ielou.studio — Configuración de EmailJS para el checkout.
  Mientras estos valores tengan el prefijo "TU_", el sitio sigue funcionando
  con el mailto: de respaldo (ver js/main.js). En cuanto los reemplaces por
  tus IDs reales de emailjs.com, el checkout empieza a enviar los 2 correos
  automáticos (aviso para ti + confirmación para el cliente) sin tocar nada
  más del código.

  Instrucciones completas: ver EMAILJS-SETUP.md
*/
const EMAILJS_CONFIG = {
  publicKey: 'TU_PUBLIC_KEY_AQUI',            // Account → General → Public Key
  serviceId: 'TU_SERVICE_ID_AQUI',            // Email Services → tu servicio conectado (Gmail/Outlook)
  templateOwnerId: 'TU_TEMPLATE_OWNER_ID_AQUI',       // Plantilla "Nueva solicitud" (te llega a ti)
  templateCustomerId: 'TU_TEMPLATE_CUSTOMER_ID_AQUI', // Plantilla "Confirmación" (le llega al cliente)
};

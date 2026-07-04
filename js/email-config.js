/* INSARA Foundation — EmailJS auto-reply (sends from insarafoundation@gmail.com)
 *
 * One-time setup:
 * 1. Sign up at https://www.emailjs.com (free tier is enough to start)
 * 2. Email Services → Add New Service → Gmail → connect insarafoundation@gmail.com
 * 3. Email Templates → Create New Template:
 *      To Email:    {{email}}
 *      From Name:   INSARA Foundation
 *      Reply To:    insarafoundation@gmail.com
 *      Subject:     Thank you — INSARA Foundation
 *      Message:     {{reply_message}}
 * 4. Account → API Keys → copy your Public Key
 * 5. Paste the three values below, then deploy the site
 * 6. Account → Security → add your domain (e.g. insarafoundation.org) to Allowed Origins
 */
window.EMAILJS_CONFIG = {
  publicKey: 'Ppep9K-t9MVciuYxl',
  serviceId: 'service_rtoohxr',
  templateId: 'template_yhknzu8',
};

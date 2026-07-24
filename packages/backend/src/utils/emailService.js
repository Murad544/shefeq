const { Resend } = require('resend');
const logger = require('./logger');

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

if (!resend) {
  logger.warn('RESEND_API_KEY is missing. emailService running in mock mode.');
}

async function sendActivationEmail(toEmail, activationUrl, options = {}) {
  const subject = options.subject || 'Hesabınızı Aktivləşdirin';
  const html =
    options.html ||
    `
    <p>Salam,</p>

    <p>Hesabınızı aktivləşdirmək üçün aşağıdakı linkə klikləyin:</p>

    <p><a href="${activationUrl}" target="_blank">Hesabınızı Aktivləşdirin</a></p>

    <p>Əgər siz bu əməliyyatı özünüz etməmisinizsə, zəhmət olmasa bu e-məktubu nəzərdən keçirin.</p>

    <p>Təşəkkürlər,<br>Sizin Komandanız</p>
    `;

  if (!resend) {
    logger.info('[MOCK EMAIL] RESEND_API_KEY missing. Activation link generated:', {
      toEmail,
      activationUrl,
    });
    return { ok: true, info: { id: 'mock-email-id-success' } };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: 'murad544@proton.me', // toEmail,
      subject,
      html,
    });

    if (error) {
      logger.error('Failed to send activation email', error);
      throw error;
    }

    logger.info('Activation email sent', { toEmail, messageId: data.id });
    return { ok: true, info: data };
  } catch (err) {
    logger.error('Failed to send activation email', err);
    throw err;
  }
}

module.exports = { sendActivationEmail };

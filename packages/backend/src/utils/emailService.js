const { Resend } = require('resend');
const logger = require('./logger');

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

if (!resend) {
  logger.warn('RESEND_API_KEY is missing. emailService running in mock mode.');
}

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
})[character]);

function activationEmailContent(activationUrl) {
  const safeUrl = escapeHtml(activationUrl);
  const text = [
    'Salam,',
    '',
    'FPV Tədris Alt Sisteminə müraciətiniz təsdiqlənib.',
    'Hesabınızı aktivləşdirmək üçün aşağıdakı linkə keçin və özünüzə parol təyin edin:',
    activationUrl,
    '',
    'Linkin istifadə müddəti məhduddur. Açılmırsa, ünvanı brauzerinizə köçürün.',
    'Bu müraciəti siz etməmisinizsə, məktubu nəzərə almayın.',
    '',
    'Hörmətlə,',
    'FPV Tədris Alt Sistemi',
  ].join('\n');

  const html = `<!doctype html>
<html lang="az">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Hesabınızı aktivləşdirin</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f3f0e6;font-family:Arial,Helvetica,sans-serif;color:#1c2117;">
    <div style="display:none;font-size:1px;line-height:1px;color:#f3f0e6;max-height:0;max-width:0;opacity:0;overflow:hidden;">Müraciətiniz təsdiqlənib. Hesabınızı aktivləşdirib parol təyin edin.</div>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f3f0e6;">
      <tr><td align="center" style="padding:32px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;background-color:#fbfaf5;border:1px solid #d6cfb8;">
          <tr><td style="height:4px;background-color:#4b5320;font-size:0;line-height:0;">&nbsp;</td></tr>
          <tr><td style="padding:30px 36px 22px;background-color:#151b13;">
            <p style="margin:0;color:#e0c675;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">FPV</p>
            <p style="margin:7px 0 0;color:#e8e4d4;font-size:19px;font-weight:bold;line-height:1.35;">Tədris Alt Sistemi</p>
          </td></tr>
          <tr><td style="padding:36px 36px 34px;">
            <p style="margin:0 0 12px;color:#5c6152;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;">Müraciət təsdiqləndi</p>
            <h1 style="margin:0 0 20px;color:#1c2117;font-size:27px;line-height:1.25;">Hesabınızı aktivləşdirin</h1>
            <p style="margin:0 0 16px;font-size:16px;line-height:1.65;">Salam,</p>
            <p style="margin:0 0 16px;font-size:16px;line-height:1.65;">FPV Tədris Alt Sisteminə müraciətiniz təsdiqlənib. Hesabınızı aktivləşdirmək üçün aşağıdakı düyməyə keçin və özünüzə parol təyin edin.</p>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0;">
              <tr><td align="center" bgcolor="#4b5320" style="background-color:#4b5320;">
                <a href="${safeUrl}" style="display:inline-block;padding:15px 25px;color:#ffffff;font-size:15px;font-weight:bold;line-height:1.3;text-decoration:none;">Hesabı aktivləşdirin</a>
              </td></tr>
            </table>
            <p style="margin:0 0 8px;color:#5c6152;font-size:14px;line-height:1.6;">Düymə açılmırsa, bu linki brauzerinizə köçürün:</p>
            <p style="margin:0;word-break:break-all;font-size:13px;line-height:1.6;"><a href="${safeUrl}" style="color:#343a16;text-decoration:underline;">${safeUrl}</a></p>
          </td></tr>
          <tr><td style="padding:22px 36px 28px;border-top:1px solid #d6cfb8;background-color:#f3f0e6;">
            <p style="margin:0 0 8px;color:#5c6152;font-size:13px;line-height:1.6;">Linkin istifadə müddəti məhduddur. Bu müraciəti siz etməmisinizsə, məktubu nəzərə almayın.</p>
            <p style="margin:0;color:#1c2117;font-size:13px;line-height:1.6;">Hörmətlə,<br><strong>FPV Tədris Alt Sistemi</strong></p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

  return { html, text };
}

async function sendActivationEmail(toEmail, activationUrl, options = {}) {
  const subject = options.subject || 'Müraciətiniz təsdiqləndi — hesabınızı aktivləşdirin';
  const content = activationEmailContent(activationUrl);
  const html = options.html || content.html;
  const text = options.text || content.text;

  if (!resend) {
    logger.info('[MOCK EMAIL] RESEND_API_KEY missing. Activation link generated:', {
      toEmail,
      activationUrl,
    });
    return { ok: true, info: { id: 'mock-email-id-success' } };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@fpv.az',
      to: 'murad.bayramov259@gmail.com',
      subject,
      html,
      text,
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

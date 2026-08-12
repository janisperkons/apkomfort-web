import nodemailer from 'nodemailer'

let transporter

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT || 587),
      secure: process.env.MAIL_SECURE === 'true',
      auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASSWORD },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 15000,
    })
  }
  return transporter
}

export async function sendMail({ to, subject, html, text, attachments }) {
  return getTransporter().sendMail({
    from: `"AP Komforts" <${process.env.MAIL_USER}>`,
    to, subject, html, text, attachments,
  })
}

const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
export function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => HTML_ESCAPES[c])
}

// Colors match the app's --text/--line/--muted2 design tokens (app/globals.css) —
// email clients can't read CSS custom properties, so the literal hex values are
// duplicated here and must be kept in sync with those tokens by hand.
export function wrapEmailHtml(bodyHtml) {
  return `<div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto;color:#26251f;line-height:1.6">
    <div style="font-family:Georgia,serif;font-size:20px;letter-spacing:.08em;margin-bottom:18px">AP KOMFORTS</div>
    ${bodyHtml}
    <p style="margin-top:32px;padding-top:16px;border-top:1px solid #e4ddcc;font-size:12.5px;color:#726c59">
      AP Komforts · Rīga, Latvija · +371 26 275 983
    </p>
  </div>`
}

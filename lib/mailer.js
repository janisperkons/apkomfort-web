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

export function wrapEmailHtml(bodyHtml) {
  return `<div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto;color:#2b2f28;line-height:1.6">
    <div style="font-family:Georgia,serif;font-size:20px;letter-spacing:.08em;margin-bottom:18px">AP KOMFORTS</div>
    ${bodyHtml}
    <p style="margin-top:32px;padding-top:16px;border-top:1px solid #e5e0d3;font-size:12.5px;color:#8a8578">
      AP Komforts · Rīga, Latvija · +371 26 275 983
    </p>
  </div>`
}

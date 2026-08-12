import nodemailer from 'nodemailer'

let transporter

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
    })
  }
  return transporter
}

export async function sendMail({ to, subject, html, text }) {
  return getTransporter().sendMail({
    from: `"AP Komforts" <${process.env.GMAIL_USER}>`,
    to, subject, html, text,
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

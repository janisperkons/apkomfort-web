import React from 'react'
import path from 'path'
import { Document, Page, Text, View, StyleSheet, Font, renderToBuffer } from '@react-pdf/renderer'

// This file deliberately avoids JSX. Next.js applies its React Server
// Components module condition to JSX compiled anywhere under app/ (even in a
// lib/ helper only ever imported by a Route Handler), which produces element
// objects @react-pdf/renderer's custom reconciler doesn't recognize (fails
// with "Minified React error #31"). React.createElement bypasses that
// conditional jsx-runtime resolution entirely — confirmed working in
// isolated testing where the JSX version reliably failed under `next dev`
// and `next start` alike, but succeeded outside Next's module graph.
const e = React.createElement

// The built-in Helvetica standard font has no Latvian diacritics (āēīū etc.)
// — missing glyphs silently corrupt surrounding text ("Saņēmējs" -> "SAE M
// JS"). Noto Sans (latin + latin-ext subset) covers the full Latvian
// alphabet, so it's registered here instead of relying on the PDF base fonts.
Font.register({
  family: 'Noto Sans',
  fonts: [
    { src: path.join(process.cwd(), 'assets/fonts/NotoSans-Regular.woff'), fontWeight: 'normal' },
    { src: path.join(process.cwd(), 'assets/fonts/NotoSans-Bold.woff'), fontWeight: 'bold' },
  ],
})

const INVOICE_STATUS_LABEL = { draft: 'Melnraksts', sent: 'Nosūtīts', paid: 'Apmaksāts', cancelled: 'Atcelts' }
const PAYMENT_TERMS_LABEL = {
  full_on_completion: 'Pilna apmaksa pēc darbu pabeigšanas.',
  partial_upfront: 'Nepieciešama daļēja apmaksa pirms darbu sākuma, atlikums pēc pabeigšanas.',
}

const styles = StyleSheet.create({
  page: { padding: 44, fontSize: 10, fontFamily: 'Noto Sans', color: '#26251F' },
  brand: { fontSize: 20, fontFamily: 'Noto Sans', fontWeight: 'bold', letterSpacing: 2 },
  brandSub: { fontSize: 9, color: '#7A756A', marginTop: 4 },
  divider: { borderBottomWidth: 1, borderBottomColor: '#E5E0D3', marginVertical: 18 },
  title: { fontSize: 15, fontFamily: 'Noto Sans', fontWeight: 'bold', marginBottom: 10 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 22 },
  metaBlock: { flexDirection: 'column' },
  label: { fontSize: 8, color: '#8A8578', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 },
  value: { fontSize: 10.5, marginBottom: 8 },
  billTo: { marginBottom: 22 },
  table: { display: 'flex', flexDirection: 'column', width: '100%' },
  tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#26251F', paddingBottom: 6, marginBottom: 4 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#E5E0D3', paddingVertical: 7 },
  thDesc: { flex: 1, fontSize: 8.5, textTransform: 'uppercase', letterSpacing: 0.5, color: '#7A756A' },
  thNum: { width: 70, fontSize: 8.5, textTransform: 'uppercase', letterSpacing: 0.5, color: '#7A756A', textAlign: 'right' },
  tdDesc: { flex: 1, fontSize: 10 },
  tdNum: { width: 70, fontSize: 10, textAlign: 'right' },
  totals: { marginTop: 16, alignSelf: 'flex-end', width: 220 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  totalLabel: { fontSize: 10, color: '#5B584D' },
  totalValue: { fontSize: 10, textAlign: 'right' },
  grandRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 7, marginTop: 4, borderTopWidth: 1, borderTopColor: '#26251F' },
  grandLabel: { fontSize: 12, fontFamily: 'Noto Sans', fontWeight: 'bold' },
  grandValue: { fontSize: 12, fontFamily: 'Noto Sans', fontWeight: 'bold', textAlign: 'right' },
  notes: { marginTop: 28, fontSize: 9.5, color: '#5B584D', lineHeight: 1.5 },
  footer: { position: 'absolute', bottom: 34, left: 44, right: 44, fontSize: 8.5, color: '#8A8578', borderTopWidth: 1, borderTopColor: '#E5E0D3', paddingTop: 10, textAlign: 'center' },
})

function eurFmt(n) { return '€' + Number(n || 0).toFixed(2).replace('.', ',') }
function dateFmt(v) {
  if (!v) return '—'
  const dt = new Date(v)
  const dd = String(dt.getDate()).padStart(2, '0')
  const mm = String(dt.getMonth() + 1).padStart(2, '0')
  return `${dd}.${mm}.${dt.getFullYear()}`
}

export function InvoiceDocument({ invoice, items, customer, property }) {
  const statusLabel = INVOICE_STATUS_LABEL[invoice.status] || invoice.status
  const address = property ? [property.address_line, property.municipality].filter(Boolean).join(', ') : null
  const hasDiscounts = items.some(it => Number(it.discount_percent) > 0)

  const billTo = customer.customer_type === 'commercial' && customer.company_name
    ? e(View, null,
        e(Text, { style: styles.value }, customer.company_name),
        customer.registration_number && e(Text, { style: [styles.value, { marginTop: -6 }] }, 'Reģ. Nr. ' + customer.registration_number),
        customer.legal_address && e(Text, { style: [styles.value, { marginTop: -6 }] }, customer.legal_address),
        customer.vat_number && e(Text, { style: [styles.value, { marginTop: -6 }] }, 'PVN ' + customer.vat_number),
        e(Text, { style: [styles.value, { marginTop: -6 }] }, customer.full_name),
      )
    : e(Text, { style: styles.value }, customer.full_name)

  return e(Document, null,
    e(Page, { size: 'A4', style: styles.page },
      e(Text, { style: styles.brand }, 'AP KOMFORTS'),
      e(Text, { style: styles.brandSub }, 'Rīga, Latvija · +371 26 275 983'),

      e(View, { style: styles.divider }),

      e(Text, { style: styles.title }, 'RĒĶINS Nr. ' + invoice.invoice_number),

      e(View, { style: styles.metaRow },
        e(View, { style: styles.metaBlock },
          e(Text, { style: styles.label }, 'Izrakstīts'),
          e(Text, { style: styles.value }, dateFmt(invoice.issue_date)),
          invoice.due_date && e(View, null,
            e(Text, { style: styles.label }, 'Apmaksas termiņš'),
            e(Text, { style: styles.value }, dateFmt(invoice.due_date)),
          ),
          e(Text, { style: styles.label }, 'Statuss'),
          e(Text, { style: styles.value }, statusLabel),
        ),
        e(View, { style: [styles.metaBlock, styles.billTo] },
          e(Text, { style: styles.label }, 'Saņēmējs'),
          billTo,
          address && e(Text, { style: [styles.value, { marginTop: -6 }] }, address),
          customer.email && e(Text, { style: [styles.value, { marginTop: -6 }] }, customer.email),
        ),
      ),

      e(View, { style: styles.table },
        e(View, { style: styles.tableHeader },
          e(Text, { style: styles.thDesc }, 'Apraksts'),
          e(Text, { style: styles.thNum }, 'Daudzums'),
          e(Text, { style: styles.thNum }, 'Cena'),
          hasDiscounts && e(Text, { style: styles.thNum }, 'Atlaide'),
          e(Text, { style: styles.thNum }, 'Summa'),
        ),
        items.map(it => e(View, { style: styles.tableRow, key: it.id },
          e(Text, { style: styles.tdDesc }, it.description),
          e(Text, { style: styles.tdNum }, Number(it.quantity)),
          e(Text, { style: styles.tdNum }, eurFmt(it.unit_price)),
          hasDiscounts && e(Text, { style: styles.tdNum }, Number(it.discount_percent) > 0 ? `-${Number(it.discount_percent)}%` : '—'),
          e(Text, { style: styles.tdNum }, eurFmt(it.line_total)),
        )),
      ),

      e(View, { style: styles.totals },
        e(View, { style: styles.totalRow },
          e(Text, { style: styles.totalLabel }, 'Starpsumma'),
          e(Text, { style: styles.totalValue }, eurFmt(invoice.subtotal)),
        ),
        invoice.vat_enabled && e(View, { style: styles.totalRow },
          e(Text, { style: styles.totalLabel }, `PVN (${Number(invoice.vat_rate)}%)`),
          e(Text, { style: styles.totalValue }, eurFmt(invoice.vat_amount)),
        ),
        e(View, { style: styles.grandRow },
          e(Text, { style: styles.grandLabel }, 'Kopā'),
          e(Text, { style: styles.grandValue }, eurFmt(invoice.total)),
        ),
      ),

      PAYMENT_TERMS_LABEL[invoice.payment_terms] && e(View, { style: styles.notes },
        e(Text, { style: styles.label }, 'Apmaksas nosacījumi'),
        e(Text, null, PAYMENT_TERMS_LABEL[invoice.payment_terms]),
      ),

      invoice.notes && e(View, { style: styles.notes },
        e(Text, { style: styles.label }, 'Piezīmes'),
        e(Text, null, invoice.notes),
      ),

      e(Text, { style: styles.footer }, 'AP Komforts · Rīga, Latvija · +371 26 275 983'),
    ),
  )
}

export async function renderInvoicePdf({ invoice, items, customer, property }) {
  return renderToBuffer(e(InvoiceDocument, { invoice, items, customer, property }))
}

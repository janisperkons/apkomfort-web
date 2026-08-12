import React from 'react'
import path from 'path'
import { Document, Page, Text, View, StyleSheet, Font, renderToBuffer } from '@react-pdf/renderer'

// See lib/invoice-pdf.js for why createElement (not JSX) and why a
// registered Unicode font (not the Helvetica base font) are both required.
const e = React.createElement

Font.register({
  family: 'Noto Sans',
  fonts: [
    { src: path.join(process.cwd(), 'assets/fonts/NotoSans-Regular.woff'), fontWeight: 'normal' },
    { src: path.join(process.cwd(), 'assets/fonts/NotoSans-Bold.woff'), fontWeight: 'bold' },
  ],
})

const QUOTE_STATUS_LABEL = { draft: 'Melnraksts', sent: 'Nosūtīts', accepted: 'Pieņemts', declined: 'Noraidīts', expired: 'Beidzies derīguma termiņš' }

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

export function QuoteDocument({ quote, items }) {
  const statusLabel = QUOTE_STATUS_LABEL[quote.status] || quote.status

  return e(Document, null,
    e(Page, { size: 'A4', style: styles.page },
      e(Text, { style: styles.brand }, 'AP KOMFORTS'),
      e(Text, { style: styles.brandSub }, 'Rīga, Latvija · +371 26 275 983'),

      e(View, { style: styles.divider }),

      e(Text, { style: styles.title }, 'CENAS PIEDĀVĀJUMS Nr. ' + quote.quote_number),

      e(View, { style: styles.metaRow },
        e(View, { style: styles.metaBlock },
          e(Text, { style: styles.label }, 'Izveidots'),
          e(Text, { style: styles.value }, dateFmt(quote.created_at)),
          quote.valid_until && e(View, null,
            e(Text, { style: styles.label }, 'Derīgs līdz'),
            e(Text, { style: styles.value }, dateFmt(quote.valid_until)),
          ),
          e(Text, { style: styles.label }, 'Statuss'),
          e(Text, { style: styles.value }, statusLabel),
        ),
        e(View, { style: [styles.metaBlock, styles.billTo] },
          e(Text, { style: styles.label }, 'Piedāvājums adresāts'),
          e(Text, { style: styles.value }, quote.contact_name),
          quote.property_address && e(Text, { style: [styles.value, { marginTop: -6 }] }, quote.property_address),
          quote.contact_email && e(Text, { style: [styles.value, { marginTop: -6 }] }, quote.contact_email),
          quote.contact_phone && e(Text, { style: [styles.value, { marginTop: -6 }] }, quote.contact_phone),
        ),
      ),

      e(View, { style: styles.table },
        e(View, { style: styles.tableHeader },
          e(Text, { style: styles.thDesc }, 'Apraksts'),
          e(Text, { style: styles.thNum }, 'Daudzums'),
          e(Text, { style: styles.thNum }, 'Cena'),
          e(Text, { style: styles.thNum }, 'Summa'),
        ),
        items.map(it => e(View, { style: styles.tableRow, key: it.id },
          e(Text, { style: styles.tdDesc }, it.description),
          e(Text, { style: styles.tdNum }, Number(it.quantity)),
          e(Text, { style: styles.tdNum }, eurFmt(it.unit_price)),
          e(Text, { style: styles.tdNum }, eurFmt(it.line_total)),
        )),
      ),

      e(View, { style: styles.totals },
        e(View, { style: styles.totalRow },
          e(Text, { style: styles.totalLabel }, 'Starpsumma'),
          e(Text, { style: styles.totalValue }, eurFmt(quote.subtotal)),
        ),
        quote.vat_enabled && e(View, { style: styles.totalRow },
          e(Text, { style: styles.totalLabel }, `PVN (${Number(quote.vat_rate)}%)`),
          e(Text, { style: styles.totalValue }, eurFmt(quote.vat_amount)),
        ),
        e(View, { style: styles.grandRow },
          e(Text, { style: styles.grandLabel }, 'Kopā'),
          e(Text, { style: styles.grandValue }, eurFmt(quote.total)),
        ),
      ),

      quote.notes && e(View, { style: styles.notes },
        e(Text, { style: styles.label }, 'Piezīmes'),
        e(Text, null, quote.notes),
      ),

      e(Text, { style: styles.footer }, 'AP Komforts · Rīga, Latvija · +371 26 275 983 · Šis ir cenas piedāvājums, nevis rēķins.'),
    ),
  )
}

export async function renderQuotePdf({ quote, items }) {
  return renderToBuffer(e(QuoteDocument, { quote, items }))
}

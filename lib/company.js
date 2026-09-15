// Official company details — single source of truth for every place the
// business identifies itself (PDFs, footer, emails, structured data, terms).
// Reģ. Nr. from the Uzņēmumu reģistra lēmums Nr. 6-12/65229/1 (03.09.2026).
// NOTE: full legal (street) address not yet provided by the owner —
// invoices show city only until that's supplied. Do not invent.

export const COMPANY = {
  legalName: 'SIA "AP KOMFORTS"',
  brand: 'AP Komforts',
  regNr: '43603024222',
  city: 'Rīga, Latvija',
  phone: '+371 26 275 983',
  phoneHref: 'tel:+37126275983',
  email: 'aleksejs.perkons@apkomforts.lv',
  // Swedbank Latvia — IBAN prefix HABA confirms the bank; SWIFT/BIC is
  // Swedbank's public routing code, not derived or guessed.
  bankName: 'AS "Swedbank"',
  bankSwift: 'HABALV22',
  iban: 'LV65HABA0551066429491',
}

export const COMPANY_LINE = `${COMPANY.legalName} · Reģ. Nr. ${COMPANY.regNr} · ${COMPANY.city}`

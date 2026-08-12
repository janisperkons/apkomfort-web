function stripDiacritics(str) {
  return (str || '').normalize('NFD').replace(/[̀-ͯ]/g, '')
}

function streetPrefix(addressLine) {
  const letters = stripDiacritics(addressLine).replace(/[^a-zA-Z]/g, '')
  return (letters.slice(0, 3) || 'XXX').toUpperCase()
}

function postcodeDigits(postcode) {
  return (postcode || '').replace(/\D/g, '') || '0000'
}

function nameInitials(fullName) {
  const parts = (fullName || '').trim().split(/\s+/).filter(Boolean)
  const first = parts[0]?.[0] || ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return stripDiacritics((first + last).toUpperCase())
}

// Registration/contract number: first 3 letters of the street or house name,
// the postcode's digits only, then the client's initials — e.g. BRI1010AP.
export function generateClientCode({ addressLine, postcode, fullName }) {
  return `${streetPrefix(addressLine)}${postcodeDigits(postcode)}${nameInitials(fullName)}`
}

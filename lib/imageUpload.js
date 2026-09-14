// Shared client-side image preparation for equipment photo uploads.
// Phones hand us 8-15MB HEIC/huge JPEGs; we downscale to a sane JPEG in the
// browser before upload. Fixes three real problems at once: slow/failing
// uploads on mobile connections, HEIC files that Chrome/Android can't
// display later, and storage bloat. If the browser can't decode the file
// (e.g. HEIC on Chrome), we fall back to uploading the original bytes —
// never block the upload because optimization failed.

const MAX_DIMENSION = 2000
const JPEG_QUALITY = 0.82

export async function prepareImage(file) {
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
    const w = Math.round(bitmap.width * scale)
    const h = Math.round(bitmap.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h)
    bitmap.close()

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY))
    if (!blob) throw new Error('toBlob failed')

    // Only use the converted version if it actually helped (or changed a
    // non-JPEG format into JPEG) — tiny images can grow slightly.
    if (blob.size < file.size || !/jpe?g$/i.test(file.type)) {
      const base = file.name.replace(/\.[^.]+$/, '') || 'foto'
      return { blob, filename: `${base}.jpg`, contentType: 'image/jpeg' }
    }
    return { blob: file, filename: file.name, contentType: file.type }
  } catch {
    return { blob: file, filename: file.name, contentType: file.type || 'application/octet-stream' }
  }
}

export function safeStorageName(filename) {
  return filename.replace(/[^a-zA-Z0-9.\-]/g, '_')
}

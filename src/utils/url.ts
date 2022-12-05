export function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url)
    return u.protocol.startsWith('http') || u.protocol.startsWith('https')
  } catch (e) {
    return false
  }
}

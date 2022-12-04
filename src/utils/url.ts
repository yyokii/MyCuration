export function isValidUrl(url: string): boolean {
  try {
    console.log('📝 isValidURL 1: ', url)
    const u = new URL(url)
    console.log('📝 isValidURL 2')
    return u.protocol.startsWith('http') || u.protocol.startsWith('https')
  } catch (e) {
    return false
  }
}

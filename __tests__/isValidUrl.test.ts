import { isValidUrl } from '../src/utils/url'

describe('Check valid url test.', () => {
  test('https://www.google.com is valid', () => {
    // Given
    let url = 'https://www.google.com'

    // When
    let result = isValidUrl(url)

    // Then
    expect(result).toBe(true)
  })

  test('www.google.com is not valid', () => {
    // Given
    let url = 'www.google.com'

    // When
    let result = isValidUrl(url)

    // Then
    expect(result).toBe(false)
  })

  test('aaabbb is not valid', () => {
    // Given
    let url = 'aaabbb'

    // When
    let result = isValidUrl(url)

    // Then
    expect(result).toBe(false)
  })
})

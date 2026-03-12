import { matchesRegexPatterns } from './matches-regex-patterns.js'

describe('matchesRegexPatterns', () => {
  it('should return false for empty patterns array', () => {
    expect(matchesRegexPatterns('https://github.com', [])).toBe(false)
  })

  it('should return false for null patterns', () => {
    expect(matchesRegexPatterns('https://github.com', null as any)).toBe(false)
  })

  it('should return true when URL matches a pattern', () => {
    const patterns = [String.raw`^https://github\.com`]

    expect(matchesRegexPatterns('https://github.com/user/repo', patterns)).toBe(
      true,
    )
  })

  it('should return false when URL does not match any pattern', () => {
    const patterns = [String.raw`^https://github\.com`, String.raw`^https://stackoverflow\.com`]

    expect(matchesRegexPatterns('https://google.com', patterns)).toBe(false)
  })

  it('should ignore empty strings in patterns', () => {
    const patterns = ['', String.raw`^https://github\.com`, '']

    expect(matchesRegexPatterns('https://github.com', patterns)).toBe(true)
  })

  it('should handle multiple patterns with OR logic', () => {
    const patterns = [String.raw`^https://github\.com`, '^https://stackoverflow']

    expect(matchesRegexPatterns('https://stackoverflow.com/questions', patterns)).toBe(
      true,
    )
  })

  it('should handle complex regex patterns', () => {
    const patterns = [String.raw`.*\.example\..*`]

    expect(matchesRegexPatterns('https://api.example.com', patterns)).toBe(true)
    expect(matchesRegexPatterns('https://example.com', patterns)).toBe(false)
  })

  it('should gracefully handle invalid regex patterns', () => {
    const patterns = ['[unclosed', String.raw`^https://github\.com`]

    // Should not throw, just skip invalid pattern and check valid one
    expect(
      matchesRegexPatterns('https://github.com/user/repo', patterns),
    ).toBe(true)
  })

  it('should be case-sensitive by default', () => {
    const patterns = [String.raw`^HTTPS://GITHUB\.COM`]

    expect(matchesRegexPatterns('https://github.com', patterns)).toBe(false)
  })

  it('should handle patterns with flags', () => {
    const patterns = [String.raw`^https://github\.com.*`]

    expect(matchesRegexPatterns('https://github.com/user/repo', patterns)).toBe(
      true,
    )
  })

  it('should return false when all patterns are invalid', () => {
    const patterns = ['[unclosed', '{invalid}']

    expect(matchesRegexPatterns('https://github.com', patterns)).toBe(false)
  })

  it('should handle whitespace in URL and patterns', () => {
    const patterns = ['example.*com']

    expect(matchesRegexPatterns('https://example.com/path with spaces', patterns)).toBe(
      true,
    )
  })
})

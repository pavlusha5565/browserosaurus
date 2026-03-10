/**
 * Matches a URL against an array of regex patterns
 * @param url - The URL to check
 * @param patterns - Array of regex pattern strings
 * @returns true if URL matches at least one pattern, false otherwise
 */
export const matchesRegexPatterns = (
  url: string,
  patterns: string[],
): boolean => {
  if (!patterns || patterns.length === 0) {
    return false
  }

  const validPatterns = patterns.filter((p) => p && typeof p === 'string')

  if (validPatterns.length === 0) {
    return false
  }

  for (const pattern of validPatterns) {
    try {
      const regex = new RegExp(pattern, 'u')
      if (regex.test(url)) {
        return true
      }
    } catch {
      // Ignore invalid regex patterns and keep checking the rest.
    }
  }

  return false
}

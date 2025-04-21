import { getLetterSanitizer } from './letterSanitizer'
import { describe, it, expect } from '@jest/globals'

describe('getLetterSanitizer', () => {
  it('removes non-English letters for "en"', () => {
    const regex = getLetterSanitizer('en')
    const cleaned = 't3st%word!'.replace(regex, '')
    expect(cleaned).toBe('tstword')
  })

  it('allows åäö for "sv"', () => {
    const regex = getLetterSanitizer('sv')
    const cleaned = 'åäöÅÄÖtest%123'.replace(regex, '')
    expect(cleaned).toBe('åäöÅÄÖtest')
  })
})

import { describe, it, expect } from '@jest/globals'
import { buildScoreFilters } from './leaderboardFilters'

describe('buildScoreFilters()', () => {
  it('returns correct filters and activeFilters for valid input', () => {
    const input = { length: '5', unique: 'true' }
    const result = buildScoreFilters(input)

    expect(result.filters).toEqual({
      'rules.wordLength': 5,
      'rules.noLetterDuplicate': true,
    })

    expect(result.activeFilters).toEqual({
      length: '5',
      unique: 'true',
    })
  })

  it('parses only length if unique is missing', () => {
    const input = { length: '6' }
    const result = buildScoreFilters(input)

    expect(result.filters).toEqual({
      'rules.wordLength': 6,
    })

    expect(result.activeFilters).toEqual({
      length: '6',
      unique: undefined,
    })
  })

  it('parses only unique if length is missing', () => {
    const input = { unique: 'false' }
    const result = buildScoreFilters(input)

    expect(result.filters).toEqual({
      'rules.noLetterDuplicate': false,
    })

    expect(result.activeFilters).toEqual({
      length: undefined,
      unique: 'false',
    })
  })

  it('returns empty filters for empty input', () => {
    const result = buildScoreFilters({})

    expect(result.filters).toEqual({})
    expect(result.activeFilters).toEqual({
      length: undefined,
      unique: undefined,
    })
  })

  it('ignores invalid unique value', () => {
    const input = { length: '4', unique: 'maybe' }
    const result = buildScoreFilters(input)

    expect(result.filters).toEqual({
      'rules.wordLength': 4,
    })

    expect(result.activeFilters).toEqual({
      length: '4',
      unique: 'maybe',
    })
  })
})

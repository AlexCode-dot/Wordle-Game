import { ScoreFilterQuery, ScoreFilterResult } from '../types'

export function buildScoreFilters(query: ScoreFilterQuery): ScoreFilterResult {
  const { length, unique } = query

  const filters: Record<string, any> = {}

  if (length) {
    filters['rules.wordLength'] = parseInt(length)
  }

  if (unique === 'true' || unique === 'false') {
    filters['rules.noLetterDuplicate'] = unique === 'true'
  }

  return {
    filters,
    activeFilters: { length, unique },
  }
}

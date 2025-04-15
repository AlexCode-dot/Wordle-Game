export function buildScoreFilters(query: { length?: string; unique?: string }) {
  const { length, unique } = query

  const filters: { [key: string]: any } = {}

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

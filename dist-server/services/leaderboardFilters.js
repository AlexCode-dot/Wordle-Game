'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.buildScoreFilters = buildScoreFilters
function buildScoreFilters(query) {
  const { length, unique } = query
  const filters = {}
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

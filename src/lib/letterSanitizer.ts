import { WordLanguage } from '../types'

export function getLetterSanitizer(lang: WordLanguage): RegExp {
  return lang === 'sv' ? /[^\p{L}]/gu : /[^a-zA-Z]/g
}

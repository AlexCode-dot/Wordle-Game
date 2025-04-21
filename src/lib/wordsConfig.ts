import englishRaw from '../data/words-en.json'
import swedishRaw from '../data/words-sv.json'
import { WordLanguage, WordSourceConfig } from '../types'

const localWordsEn = englishRaw as string[]
const localWordsSv = swedishRaw as string[]

export const wordsConfig: Record<WordLanguage, WordSourceConfig> = {
  en: {
    local: localWordsEn,
    remote:
      process.env.REMOTE_WORDS_EN ||
      'https://raw.githubusercontent.com/dwyl/english-words/master/words_dictionary.json',
    isPlainText: false,
  },
  sv: {
    local: localWordsSv,
    remote:
      process.env.REMOTE_WORDS_SV ||
      'https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/sv/sv_50k.txt',
    isPlainText: true,
  },
}

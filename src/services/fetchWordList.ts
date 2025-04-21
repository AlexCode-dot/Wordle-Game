import { wordsConfig } from '../lib/wordsConfig'
import { parsePlainText, parseJsonWords } from '../lib/parseWords'
import { WordLanguage, WordSource } from '../types'

export async function loadWords(
  source: WordSource = (process.env.WORD_SOURCE as WordSource) || 'local',
  lang: WordLanguage
): Promise<string[]> {
  const config = wordsConfig[lang]

  if (source === 'local') {
    console.log(`📦 Loaded words from LOCAL source (${lang})`)
    return config.local
  }

  try {
    const res = await fetch(config.remote)
    if (!res.ok) throw new Error('Remote fetch failed')

    console.log(`🌐 Loaded words from REMOTE source (${lang})`)

    return config.isPlainText ? parsePlainText(await res.text()) : parseJsonWords(await res.json())
  } catch {
    console.warn(`⚠️ Remote fallback to local (${lang})`)
    return config.local
  }
}

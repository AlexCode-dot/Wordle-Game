import { fetch } from 'undici'

export default async function loadWords(): Promise<string[]> {
  const res = await fetch(
    'https://raw.githubusercontent.com/dwyl/english-words/refs/heads/master/words_dictionary.json'
  )
  const payload = (await res.json()) as Record<string, number>
  return Object.keys(payload)
}

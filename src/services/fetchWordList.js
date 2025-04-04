import fetch from 'node-fetch'

export default async function loadWords() {
  const res = await fetch(
    'https://raw.githubusercontent.com/dwyl/english-words/refs/heads/master/words_dictionary.json'
  )
  const payload = await res.json()
  return Object.keys(payload)
}

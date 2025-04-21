export async function fetchWordLengths(lang = 'en') {
  const res = await fetch(`/api/words/lengths?lang=${lang}`)
  if (!res.ok) throw new Error('Failed to load word lengths')
  return await res.json()
}

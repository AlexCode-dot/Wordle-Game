export default async function fetchCorrectWord() {
  try {
    const response = await fetch('/api/games/correct-word')
    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error('Error fetching correct word:', error)
    return { success: false, error }
  }
}

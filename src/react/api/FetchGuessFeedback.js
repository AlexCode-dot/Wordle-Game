export default async function validateGuessApi(guessedWord) {
  try {
    const response = await fetch('/api/games/guesses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guessedWord }),
    })

    const data = await response.json()

    if (!response.ok) {
      return { success: false, error: data.error || 'Something went wrong, please ry again later.' }
    }

    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message || 'Could not connect to the server.' }
  }
}

export async function startGameApi(rules) {
  try {
    const response = await fetch('/api/start-game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rules),
    })

    const data = await response.json()

    if (!response.ok) {
      return { success: false, error: data.error || 'Something went wrong.' }
    }

    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message || 'Could not connect to the server.' }
  }
}

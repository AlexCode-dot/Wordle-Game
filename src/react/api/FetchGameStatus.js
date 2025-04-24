export async function startGameApi(rules) {
  try {
    const response = await fetch('/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rules),
    })

    const data = await response.json()

    if (!response.ok) {
      return { success: false, error: data.message || 'Something went wrong, please ry again later.' }
    }

    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message || 'Could not connect to the server.' }
  }
}

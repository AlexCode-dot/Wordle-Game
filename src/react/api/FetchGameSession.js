export async function getGameStatus() {
  try {
    const res = await fetch('/api/games/status', {
      method: 'GET',
      credentials: 'include',
    })
    const data = await res.json()
    return { success: true, data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

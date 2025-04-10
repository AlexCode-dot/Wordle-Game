export default async function removeGameApi() {
  try {
    const res = await fetch('/api/games', {
      method: 'DELETE',
      credentials: 'include',
    })
    const data = await res.json()
    return { success: true, data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

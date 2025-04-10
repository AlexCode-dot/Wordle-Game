async function postScore(name) {
  try {
    const response = await fetch('/api/submit-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
      credentials: 'include',
    })

    const data = await response.json()
    console.log(data)

    if (!response.ok) {
      return { success: false, error: data.message || 'Something went wrong.' }
    }

    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message || 'Could not connect to the server.' }
  }
}

export default postScore

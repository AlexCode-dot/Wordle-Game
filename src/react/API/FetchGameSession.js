export async function getGameStatus() {
    try {
      const res = await fetch('/api/games/status');
      if (!res.ok) throw new Error('No active game session');
      const data = await res.json();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
  
  
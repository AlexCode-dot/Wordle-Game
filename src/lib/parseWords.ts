export function parsePlainText(text: string): string[] {
  return Array.from(
    new Set(
      text
        .split('\n')
        .map((line) => line.trim().toLowerCase())
        .filter(Boolean)
    )
  )
}

export function parseJsonWords(json: Record<string, number>): string[] {
  return Object.keys(json)
}

export type WordLanguage = 'en' | 'sv'

export type WordSource = 'local' | 'remote'

export type WordSourceConfig = {
  local: string[]
  remote: string
  isPlainText: boolean
}

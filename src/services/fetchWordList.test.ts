import { wordsConfig } from '../lib/wordsConfig'
import { loadWords } from './fetchWordList'
import { describe, it, expect } from '@jest/globals'

describe('loadWords', () => {
  it('loads English words from local source', async () => {
    const words = await loadWords('local', 'en')
    expect(words).toEqual(wordsConfig.en.local)
    expect(words.length).toBeGreaterThan(0)
  })

  it('loads Swedish words from local source', async () => {
    const words = await loadWords('local', 'sv')
    expect(words).toEqual(wordsConfig.sv.local)
    expect(words.length).toBeGreaterThan(0)
  })

  it('falls back to local if remote fails (English)', async () => {
    const words = await loadWords('remote', 'en')
    expect(words.length).toBeGreaterThan(0)
  })

  it('falls back to local if remote fails (Swedish)', async () => {
    const words = await loadWords('remote', 'sv')
    expect(words.length).toBeGreaterThan(0)
  })
})

'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.default = loadWords
const undici_1 = require('undici')
async function loadWords() {
  const res = await (0, undici_1.fetch)(
    'https://raw.githubusercontent.com/dwyl/english-words/refs/heads/master/words_dictionary.json'
  )
  const payload = await res.json()
  return Object.keys(payload)
}

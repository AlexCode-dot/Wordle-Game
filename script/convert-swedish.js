// scripts/convert-english.js
const fs = require('fs')

const payload = require('../src/data/words.json') // Object format
const words = Object.keys(payload) // Convert to array

fs.writeFileSync('src/data/words-en.json', JSON.stringify(words, null, 2))
console.log(`✅ Converted ${words.length} English words`)

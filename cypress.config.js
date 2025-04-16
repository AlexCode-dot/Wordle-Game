import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5080',
    setupNodeEvents(on, config) {},
  },
})

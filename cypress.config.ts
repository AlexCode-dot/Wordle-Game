import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5080',
    supportFile: false,
    specPattern: 'cypress/e2e/**/*.cy.{js,ts}',
  },
})

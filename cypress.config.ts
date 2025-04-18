import { defineConfig } from 'cypress'
import { spawn, execSync } from 'child_process'
import waitOn from 'wait-on'

let backendProcess: ReturnType<typeof spawn> | undefined

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5080',
    async setupNodeEvents(on) {
      // ✅ Build synchronously before starting backend
      console.log('🏗️  Building backend and frontend...')
      execSync('npm run build', { stdio: 'inherit' })

      // ✅ Start only the backend server (not full chain)
      console.log('🚀 Starting backend server...')
      backendProcess = spawn('npm', ['start'], {
        env: { ...process.env, NODE_ENV: 'test' },
        stdio: 'inherit',
        shell: true,
      })

      // ✅ Cleanup logic
      const cleanup = () => {
        if (backendProcess) {
          console.log('🧹 Killing backend process...')
          backendProcess.kill('SIGTERM')
          backendProcess = undefined
        }
      }

      process.on('exit', cleanup)
      process.on('SIGINT', () => {
        cleanup()
        process.exit()
      })

      // ✅ Wait for the server to be ready
      await waitOn({
        resources: ['http://localhost:5080'],
        timeout: 20000,
        interval: 500,
      })

      console.log('✅ Backend ready at http://localhost:5080')

      on('after:run', cleanup)
    },
  },
})

import { defineConfig } from 'cypress'
import { spawn, execSync } from 'child_process'
import waitOn from 'wait-on'

let backendProcess: ReturnType<typeof spawn> | undefined

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5080',
    async setupNodeEvents(on) {
      try {
        const pid = execSync('lsof -t -i:5080 || true').toString().trim()
        if (pid) {
          execSync(`kill -9 ${pid}`)
        }
      } catch {}

      execSync('npm run build', { stdio: 'inherit' })

      backendProcess = spawn('npm', ['start'], {
        env: { ...process.env, NODE_ENV: 'test' },
        stdio: 'inherit',
        shell: true,
      })

      const cleanup = () => {
        if (backendProcess) {
          backendProcess.kill('SIGTERM')
          backendProcess = undefined
        }
      }

      process.on('exit', cleanup)
      process.on('SIGINT', () => {
        cleanup()
        process.exit()
      })

      await waitOn({
        resources: ['http://localhost:5080'],
        timeout: 20000,
        interval: 500,
      })

      on('after:run', cleanup)
    },
  },
})

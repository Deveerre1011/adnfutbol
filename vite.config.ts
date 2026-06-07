import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { ViteDevServer } from 'vite'

const stateFilePath = path.resolve(__dirname, 'data', 'adnfutbol-state.json')

function localStatePlugin() {
  return {
    name: 'adnfutbol-local-state',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/api/state', (request: IncomingMessage, response: ServerResponse) => {
        response.setHeader('Content-Type', 'application/json')

        if (request.method === 'GET') {
          if (!fs.existsSync(stateFilePath)) {
            response.end(JSON.stringify(null))
            return
          }

          response.end(fs.readFileSync(stateFilePath, 'utf-8'))
          return
        }

        if (request.method === 'POST') {
          let body = ''

          request.on('data', (chunk: Buffer) => {
            body += chunk
          })
          request.on('end', () => {
            fs.mkdirSync(path.dirname(stateFilePath), { recursive: true })
            fs.writeFileSync(stateFilePath, body)
            response.end(JSON.stringify({ ok: true }))
          })
          return
        }

        response.statusCode = 405
        response.end(JSON.stringify({ error: 'Metodo no permitido' }))
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), localStatePlugin()],
})

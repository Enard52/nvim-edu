import { defineConfig } from 'vite'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'

const require = createRequire(import.meta.url)
const vimWasmDir = dirname(require.resolve('vim-wasm/package.json'))
const coiDir = dirname(require.resolve('coi-serviceworker/package.json'))

// 진짜 Vim(WASM) 모드에 필요한 정적 파일. 워커가 자기 위치 기준으로 vim.wasm/vim.data 를 불러와서 같은 폴더에 둔다
const STATIC = {
  'real/vim-wasm/vim.js': join(vimWasmDir, 'vim.js'),
  'real/vim-wasm/vim.wasm': join(vimWasmDir, 'vim.wasm'),
  'real/vim-wasm/vim.data': join(vimWasmDir, 'vim.data'),
  // GitHub Pages 는 COOP/COEP 헤더를 못 붙여서, 이 서비스 워커가 /real/ 아래에서만 헤더를 대신 붙임
  'real/coi-serviceworker.js': join(coiDir, 'coi-serviceworker.min.js'),
}
const TYPES = { '.js': 'text/javascript', '.wasm': 'application/wasm', '.data': 'application/octet-stream' }

const vimWasmFiles = {
  name: 'vim-wasm-files',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const path = req.url.split('?')[0].replace(/^\//, '')
      if (!STATIC[path]) return next()
      res.setHeader('Content-Type', TYPES[path.slice(path.lastIndexOf('.'))])
      res.end(readFileSync(STATIC[path]))
    })
  },
  generateBundle() {
    for (const [fileName, src] of Object.entries(STATIC)) this.emitFile({ type: 'asset', fileName, source: readFileSync(src) })
  },
}

// 상대 경로: GitHub Pages(/nvim-edu/) 어디에 올려도 동작
export default defineConfig({
  base: './',
  plugins: [vimWasmFiles],
  build: { rollupOptions: { input: { main: 'index.html', real: 'real/index.html' } } },
})

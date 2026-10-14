import { defineConfig } from 'vite'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'

const require = createRequire(import.meta.url)
const vimWasmDir = dirname(require.resolve('vim-wasm/package.json'))
const coiDir = dirname(require.resolve('coi-serviceworker/package.json'))

// vim.data 는 Vim 런타임(문법 강조·들여쓰기 등 1000여 개 파일, 5.9MB)을 통째로 묶은 것.
// 레벨 파일 형식(src/real.js 의 ext: js·py·yaml·txt)에 필요한 것만 남기고 vim.js 의 파일 목록도 맞춰 고친다
const LANGS = ['javascript', 'python', 'yaml', 'text']
const KEEP = new RegExp(`/(syntax/(syntax|synload|syncolor|nosyntax|manual)|(syntax|indent|ftplugin)/(${LANGS.join('|')})|autoload/dist/ft)\\.vim$`)
function slimVimPackage() {
  const js = readFileSync(join(vimWasmDir, 'vim.js'), 'utf8')
  const data = readFileSync(join(vimWasmDir, 'vim.data'))
  const re = /loadPackage\(\{files:(\[.*?\]),remote_package_size:(\d+),/
  const m = js.match(re)
  if (!m || Number(m[2]) !== data.length) throw new Error('vim-wasm 패키지 형식이 바뀜: vite.config.js 의 slimVimPackage 확인')
  const chunks = []
  let at = 0
  const files = []
  for (const f of new Function(`return ${m[1]}`)()) {
    if (/\/(syntax|indent|ftplugin|autoload)\//.test(f.filename) && !KEEP.test(f.filename)) continue
    if (f.filename.startsWith('/tutor/')) continue
    chunks.push(data.subarray(f.start, f.end))
    files.push({ ...f, start: at, end: (at += f.end - f.start) })
  }
  if (files.filter((f) => KEEP.test(f.filename)).length < LANGS.length * 2) throw new Error('vim 런타임 파일을 찾지 못함')
  return {
    js: js.replace(re, `loadPackage({files:${JSON.stringify(files)},remote_package_size:${at},`),
    data: Buffer.concat(chunks),
  }
}
const slim = slimVimPackage()

// 진짜 Vim(WASM) 모드에 필요한 정적 파일. 워커가 자기 위치 기준으로 vim.wasm/vim.data 를 불러와서 같은 폴더에 둔다
const STATIC = {
  'real/vim-wasm/vim.js': slim.js,
  'real/vim-wasm/vim.wasm': readFileSync(join(vimWasmDir, 'vim.wasm')),
  'real/vim-wasm/vim.data': slim.data,
  // GitHub Pages 는 COOP/COEP 헤더를 못 붙여서, 이 서비스 워커가 /real/ 아래에서만 헤더를 대신 붙임
  'real/coi-serviceworker.js': readFileSync(join(coiDir, 'coi-serviceworker.min.js')),
}
const TYPES = { '.js': 'text/javascript', '.wasm': 'application/wasm', '.data': 'application/octet-stream' }

const vimWasmFiles = {
  name: 'vim-wasm-files',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const path = req.url.split('?')[0].replace(/^\//, '')
      if (!STATIC[path]) return next()
      res.setHeader('Content-Type', TYPES[path.slice(path.lastIndexOf('.'))])
      res.end(STATIC[path])
    })
  },
  generateBundle() {
    for (const [fileName, src] of Object.entries(STATIC)) this.emitFile({ type: 'asset', fileName, source: src })
  },
}

// 상대 경로: GitHub Pages(/nvim-edu/) 어디에 올려도 동작
export default defineConfig({
  base: './',
  plugins: [vimWasmFiles],
  build: { rollupOptions: { input: { main: 'index.html', real: 'real/index.html' } } },
})

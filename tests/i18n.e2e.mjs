// 영어 화면에 한글이 하나도 남지 않았는지: 모든 페이지·레벨·미션을 열고, 메시지·클리어 알림까지 띄워 본 뒤 검사
// (언어 전환 버튼의 '한국어' 글자만 예외)
import { preview } from 'vite'
import * as pw from 'playwright-core'
import { levels, tokenize } from '../src/levels.js'
import { missions } from '../src/drill.js'

const KEY = { '<Esc>': 'Escape', '<CR>': 'Enter', '<C-a>': 'Control+a', '<C-v>': 'Control+v', '<C-b>': 'Control+b', '<C-u>': 'Control+u', '<Left>': 'ArrowLeft', '<Right>': 'ArrowRight' }
const BASE = process.env.BASE_URL ?? 'http://localhost:4168/'
const server = process.env.BASE_URL ? null : await preview({ preview: { port: 4168 } })
const browser = await pw[process.env.BROWSER ?? 'chromium'].launch()
const page = await browser.newPage()
const HANGUL = /[ㄱ-ㅎㅏ-ㅣ가-힣]/
const problems = []

async function scan(where) {
  const found = await page.evaluate((re) => {
    const rx = new RegExp(re)
    const out = []
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    for (let n; (n = walker.nextNode());) {
      if (n.parentElement.closest('#lang, script, style')) continue
      if (rx.test(n.textContent) && n.parentElement.offsetParent !== null) out.push(n.textContent.trim().slice(0, 60))
    }
    for (const el of document.querySelectorAll('[aria-label],[title]')) {
      if (el.id === 'lang') continue
      for (const a of ['aria-label', 'title']) if (rx.test(el.getAttribute(a) ?? '')) out.push(`${a}=${el.getAttribute(a)}`)
    }
    return out
  }, HANGUL.source)
  if (found.length) problems.push({ where, found })
}
async function typeKeys(keys) {
  for (const k of tokenize(keys)) KEY[k] ? await page.keyboard.press(KEY[k]) : await page.keyboard.type(k)
}
const open = async (url) => { await page.goto('about:blank'); await page.goto(url); await page.waitForFunction(() => window.__edu); await page.waitForTimeout(250) }

await open(`${BASE}?lang=en`)
await scan('dashboard')

for (const l of levels) {
  await open(`${BASE}?lang=en#${l.id}`)
  await scan(`level ${l.id}`)
  if (!l.kind) { await page.keyboard.press('ArrowLeft'); await scan(`level ${l.id} (arrow key message)`) }
  await page.reload(); await page.waitForFunction(() => window.__edu); await page.waitForTimeout(250)
  await typeKeys(l.solution)
  await page.waitForTimeout(150)
  await scan(`level ${l.id} (cleared)`)
}

for (const m of missions) {
  await open(`${BASE}?lang=en#${m.id}`)
  await scan(`drill ${m.id}`)
  for (let r = 0; r < 10; r++) { await typeKeys(await page.evaluate(() => window.__edu.level.solution)); await page.waitForTimeout(320) }
  await scan(`drill ${m.id} (finished)`)
}

await open(`${BASE}?lang=en#sandbox`)
for (const cmd of [':q<CR>', ':w<CR>', ':colo nope<CR>', ':m nope<CR>']) { await typeKeys(cmd); await scan(`sandbox ${cmd}`) }

// 진짜 Vim 페이지 (서비스 워커 설치로 한 번 새로고침됨)
await page.goto(`${BASE}real/?lang=en#x`)
await page.waitForFunction(() => window.__real?.ready, null, { timeout: 30000 }).catch(() => {})
await page.goto('about:blank'); await page.goto(`${BASE}real/?lang=en#x`)
// Safari 계열은 Vim 대신 안내 문구가 뜰 수 있음 — 그 문구도 영어여야 함
await page.waitForFunction(() => (window.__real?.ready && window.__real.state) || document.querySelector('.fallback'), null, { timeout: 30000 })
await scan('real #x')
if (await page.evaluate(() => window.__real.ready)) {
  await page.focus('#vim-input')
  for (const k of tokenize('3lxfmx')) { await page.keyboard.press(k); await page.waitForTimeout(40) }
  await page.waitForFunction(() => window.__real.done, null, { timeout: 5000 }).catch(() => {})
  await scan('real #x (cleared)')
}

// 한국어 모드는 여전히 한국어인지 (반대 방향 회귀)
await open(`${BASE}?lang=ko`)
const ko = await page.locator('.tagline').innerText()
if (!HANGUL.test(ko)) problems.push({ where: 'ko dashboard', found: [ko] })

await browser.close()
server?.httpServer.close()
for (const p of problems) console.log(`FAIL ${p.where}\n  ${p.found.join('\n  ')}`)
console.log(`i18n: ${problems.length ? `${problems.length} FAIL` : 'ALL PASS'}`)
process.exit(problems.length ? 1 : 0)

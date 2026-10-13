// 모든 레벨의 모범 답안을 실제 브라우저에서 입력해 클리어되는지, 타수가 par와 같은지 검증
import { preview } from 'vite'
import { chromium } from 'playwright-core'
import { levels, tokenize } from '../src/levels.js'

const KEY = { '<Esc>': 'Escape', '<CR>': 'Enter', '<C-a>': 'Control+a', '<C-v>': 'Control+v' }

const server = await preview({ preview: { port: 4179 } })
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined })
const page = await browser.newPage()
let failed = 0

async function typeKeys(tokens) {
  for (const t of tokens) {
    if (KEY[t]) await page.keyboard.press(KEY[t])
    else if (t.startsWith('<')) throw new Error(`unknown key ${t}`)
    else await page.keyboard.type(t)
  }
}

for (const level of levels) {
  await page.goto(`http://localhost:4179/#${level.id}`)
  await page.reload() // hash만 바뀌면 이전 레벨 상태가 남을 수 있어 새로 로드
  const tokens = tokenize(level.solution)
  await typeKeys(tokens)
  await page.waitForTimeout(50)
  const { done, count, text } = await page.evaluate(() => ({
    done: window.__edu.done, count: window.__edu.count,
    text: document.querySelector('.cm-content').innerText,
  }))
  const ok = done && count === tokens.length
  if (!ok) failed++
  console.log(`${ok ? 'PASS' : 'FAIL'} ${level.id} done=${done} count=${count}/${tokens.length}${ok ? '' : `\n${text}`}`)
}

// 미션: 라운드마다 생성된 답안을 입력해 10라운드 완주 (랜덤이라 미션당 3회)
for (const m of ['mission-move', 'mission-delete', 'mission-change', 'mission-daily']) {
  for (let run = 0; run < 3; run++) {
    await page.goto(`http://localhost:4179/#${m}`)
    await page.reload()
    let stuck = null
    for (let r = 0; r < 10 && !stuck; r++) {
      const sol = await page.evaluate(() => window.__edu.level.solution)
      await typeKeys(tokenize(sol))
      await page.waitForTimeout(r < 9 ? 350 : 50) // 다음 라운드 전환 대기
      const s = await page.evaluate(() => ({ done: window.__edu.done, ...window.__edu.session }))
      if (r < 9 ? s.round !== r + 1 : !(s.done && s.round === 10)) stuck = `round ${r + 1}: ${sol}`
    }
    const banner = await page.locator('#banner').innerText()
    const ok = !stuck && banner.includes('한 번 더')
    if (!ok) failed++
    console.log(`${ok ? 'PASS' : 'FAIL'} ${m} #${run + 1}${ok ? '' : ` ${stuck}\n${await page.locator('.cm-content').innerText()}`}`)
  }
}

await browser.close()
server.httpServer.close()
process.exit(failed ? 1 : 0)

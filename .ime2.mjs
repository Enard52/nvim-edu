import { chromium } from 'playwright-core'
const BASE = process.argv[2]
const b = await chromium.launch()
const p = await b.newPage()
const cdp = await p.context().newCDPSession(p)
const key229 = () => cdp.send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Process', code: 'KeyJ', windowsVirtualKeyCode: 229, nativeVirtualKeyCode: 229 })
// 실제 2벌식처럼: ㅓ(조합 중) → ㅓ(앞 글자 확정 + 새 조합) → ㅣ(ㅓ+ㅣ=ㅔ 로 조합, 확정 안 된 상태로 끝)
async function korean() {
  await key229(); await cdp.send('Input.imeSetComposition', { text: 'ㅓ', selectionStart: 1, selectionEnd: 1 })
  await key229(); await cdp.send('Input.insertText', { text: 'ㅓ' }); await cdp.send('Input.imeSetComposition', { text: 'ㅓ', selectionStart: 1, selectionEnd: 1 })
  await key229(); await cdp.send('Input.imeSetComposition', { text: 'ㅔ', selectionStart: 1, selectionEnd: 1 })
}
const state = () => p.evaluate(() => ({ doc: document.querySelector('.cm-content').innerText, head: document.querySelector('#pos').textContent }))
await p.goto(BASE + '#x'); await p.waitForTimeout(500)
console.log('시작        ', await state())
await p.keyboard.type('dfdf'); console.log('dfdf 후     ', await state())
await korean(); await p.waitForTimeout(200); console.log('ㅓㅓㅣ 후   ', await state(), '| cmdline:', await p.locator('#cmdline').innerText())
await p.keyboard.press('Escape'); await p.keyboard.type('l'); await p.waitForTimeout(100); console.log('영문 l 후   ', await state())
await b.close()

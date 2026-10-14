// 풀이 해설: 키 입력을 Vim 명령 단위로 끊고(splitCommands), 뜻을 붙이고(describe),
// 에디터를 보이지 않게 하나 더 띄워 명령마다 다시 실행해 결과를 보여 줌(replay)
import { t } from './i18n.js'

const MOTION = {
  h: ['왼쪽으로', 'left'], j: ['아래로', 'down'], k: ['위로', 'up'], l: ['오른쪽으로', 'right'],
  w: ['다음 단어 시작으로', 'to the next word'], b: ['이전 단어 시작으로', 'back to the previous word'], e: ['단어 끝으로', 'to the end of the word'],
  W: ['다음 WORD(공백 기준)로', 'to the next WORD'], B: ['이전 WORD로', 'back to the previous WORD'], E: ['WORD 끝으로', 'to the end of the WORD'],
  0: ['줄 맨 앞으로', 'to the start of the line'], '^': ['줄의 첫 글자로', 'to the first non-blank'], $: ['줄 끝으로', 'to the end of the line'],
  gg: ['파일 맨 위로', 'to the top of the file'], G: ['파일 맨 아래로', 'to the bottom of the file'],
  '%': ['짝 괄호로', 'to the matching bracket'], n: ['다음 검색 결과로', 'to the next match'], N: ['이전 검색 결과로', 'to the previous match'],
  '*': ['커서 밑 단어를 단어 단위로 검색 (다음)', 'search the word under the cursor (forward)'], '#': ['커서 밑 단어를 단어 단위로 검색 (이전)', 'search the word under the cursor (backward)'],
  ';': ['f/t 를 같은 방향으로 반복', 'repeat f/t'], ',': ['f/t 를 반대 방향으로 반복', 'repeat f/t backwards'],
  '{': ['이전 빈 줄로', 'to the previous blank line'], '}': ['다음 빈 줄로', 'to the next blank line'],
  H: ['화면 맨 위 줄로', 'to the top of the screen'], M: ['화면 가운데 줄로', 'to the middle of the screen'], L: ['화면 맨 아래 줄로', 'to the bottom of the screen'],
}
const FIND = { f: ['까지 이동 (글자 위)', 'find'], t: ['바로 앞까지 이동', 'till'], F: ['를 거꾸로 찾아 이동', 'find backwards'], T: ['바로 뒤까지 거꾸로 이동', 'till backwards'] }
const OBJECT = {
  w: ['단어', 'word'], W: ['WORD', 'WORD'], s: ['문장', 'sentence'], p: ['문단', 'paragraph'],
  '"': ['큰따옴표', 'double quotes'], "'": ['작은따옴표', 'single quotes'], '`': ['백틱', 'backticks'],
  '(': ['괄호', 'parentheses'], ')': ['괄호', 'parentheses'], b: ['괄호', 'parentheses'],
  '{': ['중괄호', 'braces'], '}': ['중괄호', 'braces'], B: ['중괄호', 'braces'],
  '[': ['대괄호', 'brackets'], ']': ['대괄호', 'brackets'], '<': ['꺾쇠', 'angle brackets'], '>': ['꺾쇠', 'angle brackets'], t: ['태그', 'tag'],
}
const OPERATOR = {
  d: ['삭제', 'delete'], c: ['바꾸기 (지우고 입력)', 'change (delete and type)'], y: ['복사', 'yank (copy)'],
  '>': ['들여쓰기', 'indent'], '<': ['내어쓰기', 'unindent'], '=': ['자동 들여쓰기', 'auto-indent'],
  gU: ['대문자로', 'uppercase'], gu: ['소문자로', 'lowercase'], 'g~': ['대소문자 뒤집기', 'toggle case'],
}
const LINEWISE = { dd: ['줄 삭제', 'delete the line'], cc: ['줄 전체 바꾸기', 'change the whole line'], yy: ['줄 복사', 'yank the line'], '>>': ['줄 들여쓰기', 'indent the line'], '<<': ['줄 내어쓰기', 'unindent the line'] }
const ACTION = {
  x: ['커서 글자 삭제', 'delete the character'], X: ['앞 글자 삭제', 'delete the character before'],
  p: ['커서 뒤(줄이면 아래)에 붙여넣기', 'paste after (below for lines)'], P: ['커서 앞(줄이면 위)에 붙여넣기', 'paste before (above for lines)'],
  u: ['되돌리기', 'undo'], '<C-r>': ['다시 하기', 'redo'], '.': ['마지막 변경 반복', 'repeat the last change'],
  J: ['아래 줄과 합치기', 'join with the next line'], D: ['줄 끝까지 삭제', 'delete to the end of the line'], Y: ['줄 끝까지 복사', 'yank to the end of the line'],
  '~': ['대소문자 바꾸고 다음 글자로', 'toggle case and move right'], '<C-a>': ['숫자 1 올리기', 'increment the number'], '<C-x>': ['숫자 1 내리기', 'decrement the number'],
  '@@': ['마지막 매크로 다시 실행', 'replay the last macro'], q: ['매크로 녹화 끝', 'stop recording'], gv: ['마지막 선택 다시', 'reselect'],
}
const INSERT = {
  i: ['커서 앞에서 입력', 'insert before the cursor'], a: ['커서 뒤에서 입력', 'append after the cursor'],
  I: ['줄 맨 앞에서 입력', 'insert at the start of the line'], A: ['줄 끝에서 입력', 'append at the end of the line'],
  o: ['아래 새 줄에서 입력', 'open a line below'], O: ['위 새 줄에서 입력', 'open a line above'],
  s: ['글자 지우고 입력', 'substitute the character'], S: ['줄 지우고 입력', 'substitute the line'], C: ['줄 끝까지 지우고 입력', 'change to the end of the line'],
}
const VISUAL = { v: ['글자 단위 선택', 'select characters'], V: ['줄 단위 선택', 'select lines'], '<C-v>': ['세로 블록 선택', 'select a block'] }
const VISUAL_END = new Set(['d', 'x', 'c', 's', 'y', '>', '<', '=', 'J', '~', 'u', 'U', 'I', 'A', 'r', ':', 'p', 'P', '<Esc>'])
const VISUAL_INSERT = new Set(['c', 's', 'I', 'A'])

const tr = (pair) => t(pair[0], pair[1])
const isCount = (k, first) => /^[0-9]$/.test(k) && !(first && k === '0')

// tokens(['d','i','w',...]) → [{ keys: [...], kind }]. 한 번에 실행되는 단위로 묶음
export function splitCommands(tokens) {
  const out = []
  let i = 0
  const take = (n = 1) => tokens.slice(i, (i += n))
  const untilEsc = () => { const s = i; while (i < tokens.length && tokens[i] !== '<Esc>') i++; if (i < tokens.length) i++; return tokens.slice(s, i) }
  const untilCR = () => { const s = i; while (i < tokens.length && tokens[i] !== '<CR>') i++; if (i < tokens.length) i++; return tokens.slice(s, i) }
  // count/레지스터 뒤의 이동·오브젝트 하나 (operator 인자나 단독 이동)
  const motion = () => {
    const s = i
    while (isCount(tokens[i], i === s)) i++
    const k = tokens[i]
    if (k === undefined) return tokens.slice(s, i)
    if ('fFtT'.includes(k) || k === "'" || k === '`') i += 2
    else if ((k === 'i' || k === 'a') && tokens[i + 1] !== undefined) i += 2
    else if (k === 'g') i += 2
    else if (k === '/' || k === '?') { untilCR(); return tokens.slice(s, i) }
    else i++
    return tokens.slice(s, i)
  }
  while (i < tokens.length) {
    const s = i
    if (tokens[i] === '"') i += 2
    while (isCount(tokens[i], i === s || tokens[s] === '"')) i++
    const k = tokens[i]
    const two = k + (tokens[i + 1] ?? '')
    let kind = 'action'
    if (k === ':' || k === '/' || k === '?') { untilCR(); kind = k === ':' ? 'ex' : 'motion' }
    else if (k === 'q' && tokens[i + 1] && /^[a-z]$/.test(tokens[i + 1])) { i += 2; kind = 'record' }
    else if (k === '@') i += 2
    else if (k === 'r' || k === 'm') i += 2
    else if (VISUAL[k]) {
      i++; kind = 'visual'
      while (i < tokens.length && !VISUAL_END.has(tokens[i])) motion()
      const end = tokens[i]
      if (end === ':') untilCR()
      else if (end === 'r') i += 2
      else if (end !== undefined) { i++; if (VISUAL_INSERT.has(end)) untilEsc() }
    } else if (INSERT[k]) { i++; untilEsc(); kind = 'insert' }
    else if (two === 'gU' || two === 'gu' || two === 'g~' || 'dcy<>='.includes(k)) {
      const op = k === 'g' ? two : k
      i += op.length
      const rest = tokens.slice(i, i + op.length).join('')
      if (rest === op || (op.length === 2 && tokens[i] === op[1])) i += rest === op ? op.length : 1
      else motion()
      kind = 'operator'
      if (op === 'c') untilEsc()
    } else if (two === 'gg' || two === 'gv' || two === 'gJ' || two === 'gi') { i += 2; if (two === 'gi') untilEsc(); kind = two === 'gg' ? 'motion' : 'action' }
    else if (ACTION[k] !== undefined || ACTION[two] !== undefined) { i += ACTION[two] ? 2 : 1 }
    else { i = s; motion(); kind = 'motion' }
    if (i === s) i++ // 모르는 키도 하나씩은 넘어감
    const keys = tokens.slice(s, i)
    const prev = out.at(-1)
    // j j → 한 줄로 (같은 한 글자 이동 연속)
    if (kind === 'motion' && keys.length === 1 && MOTION[keys[0]] && prev?.kind === 'motion' && prev.keys.every((x) => x === keys[0])) prev.keys.push(keys[0])
    else out.push({ keys, kind })
  }
  return out
}

const quote = (s) => `<code>${s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))}</code>`
const typed = (keys) => keys.filter((k) => k !== '<Esc>').map((k) => (k === '<CR>' ? '⏎' : k)).join('')

// target: operator 의 대상일 때 ('…까지 삭제'), 아니면 이동 ('…로')
function describeMotion(keys, target = false, op = '') {
  if (keys.length > 1 && keys.every((k) => k === keys[0]) && MOTION[keys[0]]) return `${describeMotion([keys[0]], target, op)} ×${keys.length}`
  const j = keys.findIndex((k) => !/^[0-9]$/.test(k))
  const n = j > 0 ? Number(keys.slice(0, j).join('')) : null
  const [k, arg] = [keys[j], keys[j + 1]]
  const nth = n ? `${n}번째 ` : ''
  if (k === 'G' && n) return t(target ? `${n}번째 줄까지` : `${n}번째 줄로`, `to line ${n}`)
  if (FIND[k]) {
    const en = `${n ? `the ${n}th ` : ''}${quote(arg)}`
    if (target) return t({ f: `${nth}${quote(arg)} 까지(포함)`, t: `${nth}${quote(arg)} 바로 앞까지`, F: `거꾸로 ${nth}${quote(arg)} 까지(포함)`, T: `거꾸로 ${nth}${quote(arg)} 바로 뒤까지` }[k],
      { f: `up to and including ${en}`, t: `up to ${en}`, F: `back to and including ${en}`, T: `back to just after ${en}` }[k])
    return t(`${nth}${quote(arg)} ${FIND[k][0]}`, `${FIND[k][1]} ${n ? `the ${n}th ` : ''}${quote(arg)}`)
  }
  if (k === '/' || k === '?') {
    const q = quote(typed(keys.slice(j + 1).filter((x) => x !== '<CR>')))
    return t(target ? `${q} 검색 결과 앞까지` : `${q} 검색해서 이동`, `${target ? 'up to' : 'search for'} ${q}`)
  }
  if ((k === 'i' || k === 'a') && OBJECT[arg]) {
    const o = OBJECT[arg]
    return k === 'i' ? t(`${o[0]} 안`, `inside the ${o[1]}`) : t(`${o[0]} 전체(감싼 것 포함)`, `around the ${o[1]}`)
  }
  // cw 는 실제로 ce 처럼 단어 끝까지만 (Vim 의 오래된 예외)
  if (target && op === 'c' && (k === 'w' || k === 'W')) return t(n ? `${n}번째 단어 끝까지` : '단어 끝까지', n ? `to the end of word ${n}` : 'to the end of the word')
  const m = MOTION[k === 'g' ? k + arg : k]
  if (!m) return quote(keys.join(''))
  const ko = target ? m[0].replace(/(으로|로)$/, '까지') : m[0]
  return n ? t(`${n}번 ${ko}`, `${m[1]} ×${n}`) : t(ko, m[1])
}

function describeEx(cmd) {
  let m
  if ((m = cmd.match(/^(%|\d*,?\d*)?s(\/.*)$/))) {
    const [, pat, rep, flags = ''] = m[2].split('/')
    const where = m[1] === '%' ? t('파일 전체에서 ', 'everywhere: ') : t('현재 줄에서 ', 'on this line: ')
    return where + t(`${quote(pat)} → ${quote(rep ?? '')} 치환${flags.includes('g') ? ' (줄마다 전부)' : ''}`, `replace ${quote(pat)} with ${quote(rep ?? '')}${flags.includes('g') ? ' (all per line)' : ''}`)
  }
  if ((m = cmd.match(/^(g|v|g!)\/(.*?)\/(.*)$/))) {
    const inv = m[1] !== 'g'
    const keys = quote(m[3].replace(/^norm(al)?!? ?/, ''))
    const what = m[3] === 'd' ? t(' 삭제', 'delete') : m[3].startsWith('norm') ? t(`마다 NORMAL 키 ${keys} 실행`, `run NORMAL keys ${keys}`) : t(`마다 ${quote(m[3])}`, quote(m[3]))
    return t(`${quote(m[2])} 가 ${inv ? '없는' : '있는'} 줄${what}`, `on lines ${inv ? 'without' : 'with'} ${quote(m[2])}: ${what}`)
  }
  if ((m = cmd.match(/^sor(t)? ?(u)?$/))) return m[2] ? t('줄 정렬 + 중복 삭제', 'sort lines and drop duplicates') : t('줄 정렬', 'sort lines')
  if (/^\d+$/.test(cmd)) return t(`${cmd}번째 줄로`, `to line ${cmd}`)
  return t(`Ex 명령 ${quote(cmd)} 실행`, `run the Ex command ${quote(cmd)}`)
}

// 명령 하나의 뜻 (HTML)
export function describe({ keys, kind }) {
  let s = 0
  let reg = ''
  if (keys[0] === '"') { reg = keys[1]; s = 2 }
  let e = s
  while (/^[0-9]$/.test(keys[e]) && !(e === s && keys[e] === '0')) e++
  const n = e > s ? Number(keys.slice(s, e).join('')) : null
  const rest = keys.slice(e)
  const k = rest[0]
  const times = (x) => (n ? t(`${x} ×${n}`, `${x} ×${n}`) : x)
  const withReg = (x) => (reg ? t(`${x} (레지스터 ${quote(reg)})`, `${x} (register ${quote(reg)})`) : x)
  switch (kind) {
    case 'ex': return describeEx(typed(keys).slice(1).replace(/⏎$/, ''))
    case 'record': return t(`매크로 녹화 시작 (레지스터 ${quote(rest[1])})`, `start recording a macro into ${quote(rest[1])}`)
    case 'insert': {
      const text = typed(rest.slice(1))
      return t(`${tr(INSERT[k])}: ${quote(text)} 입력 후 Esc`, `${tr(INSERT[k])}: type ${quote(text)}, then Esc`)
    }
    case 'visual': {
      const end = rest.findIndex((x, idx) => idx > 0 && VISUAL_END.has(x))
      const moves = splitCommands(rest.slice(1, end < 0 ? undefined : end)).map((c) => describeMotion(c.keys)).join(', ')
      const op = end < 0 ? '' : rest[end]
      const after = op === 'I' || op === 'A' ? t(`${op === 'I' ? '앞' : '뒤'}에 ${quote(typed(rest.slice(end + 1)))} 입력 (모든 줄)`, `${op === 'I' ? 'insert' : 'append'} ${quote(typed(rest.slice(end + 1)))} on every line`)
        : op === ':' ? describeEx(typed(rest.slice(end + 1)).replace(/^'<,'>/, '').replace(/⏎$/, ''))
        : OPERATOR[op] ? tr(OPERATOR[op]) : ACTION[op] ? tr(ACTION[op]) : op ? quote(op) : ''
      return `${tr(VISUAL[k])}${moves ? ` → ${moves}` : ''}${after ? ` → ${after}` : ''}`
    }
    case 'operator': {
      const op = k === 'g' ? k + rest[1] : k
      const tail = rest.slice(op.length)
      // dd · yy · >> · gUU · gUgU 는 줄 단위
      const lineLen = tail.slice(0, op.length).join('') === op ? op.length : op.length === 2 && tail[0] === op[1] ? 1 : 0
      const len = lineLen || motionLength(tail)
      const target = lineLen ? null : describeMotion(tail.slice(0, len), true, op)
      const base = lineLen ? (LINEWISE[op + op] ? tr(LINEWISE[op + op]) : t(`줄 ${tr(OPERATOR[op])}`, `${tr(OPERATOR[op])} the line`))
        : t(`${target} ${tr(OPERATOR[op])}`, `${tr(OPERATOR[op])} ${target}`)
      return withReg(times(base)) + (op === 'c' ? t(` → ${quote(typed(tail.slice(len)))} 입력`, ` → type ${quote(typed(tail.slice(len)))}`) : '')
    }
    case 'motion': return describeMotion(keys)
    default: {
      if (k === '@') return times(t(`매크로 ${quote(rest[1])} 실행`, `replay macro ${quote(rest[1])}`))
      if (k === 'r') return t(`글자를 ${quote(rest[1])} 로 바꾸기`, `replace the character with ${quote(rest[1])}`)
      if (k === 'm') return t(`위치를 ${quote(rest[1])} 로 표시`, `set mark ${quote(rest[1])}`)
      const two = rest.slice(0, 2).join('')
      const a = ACTION[two] ?? ACTION[k]
      return a ? withReg(times(tr(a))) : quote(keys.join(''))
    }
  }
}

// operator 뒤 이동/오브젝트의 키 수 (count 포함)
function motionLength(tail) {
  let i = 0
  while (/^[0-9]$/.test(tail[i]) && !(i === 0 && tail[i] === '0')) i++
  const k = tail[i]
  if (k === '/' || k === '?') { const cr = tail.indexOf('<CR>', i); return cr < 0 ? tail.length : cr + 1 }
  if ('fFtTia'.includes(k) || k === 'g' || k === "'" || k === '`') return i + 2
  return i + 1
}

// 입력 모드의 글자는 사람이 친 것처럼 문서에 직접 넣음 (Vim 키로 해석하지 않음)
function insertKey(cm, key) {
  if (key === '<BS>') {
    const c = cm.getCursor()
    if (c.ch > 0) cm.replaceRange('', { line: c.line, ch: c.ch - 1 }, c)
  } else if (key === '<CR>') cm.replaceSelection('\n')
  else if (key === '<Tab>') cm.replaceSelection('\t')
  else if (key.length === 1) cm.replaceSelection(key)
}

// 명령 하나 실행. 키는 실제 타이핑과 같은 경로(handleKey)로 넣어야 매크로 녹화(qa…q)에 남음.
// : 와 / 는 입력창이 필요해서 :normal 로 (가상 입력창)
function run(cm, cmd, Vim) {
  const prompt = (k) => cmd.keys.includes(k)
  if (cmd.kind === 'ex' || ((cmd.kind === 'motion' || cmd.kind === 'operator') && (prompt('/') || prompt('?'))) || (cmd.kind === 'visual' && prompt(':'))) {
    return Vim.handleEx(cm, 'normal ' + cmd.keys.join(''))
  }
  const vim = cm.state.vim
  for (const key of cmd.keys) {
    if (vim.insertMode && key !== '<Esc>' && !key.startsWith('<C-')) insertKey(cm, key)
    else if (!Vim.handleKey(cm, key, 'user') && vim.insertMode) insertKey(cm, key)
  }
}

// 보이지 않는 에디터에서 명령마다 다시 실행 → [{ keys, html, text, cursor, mode }]
// makeView(text, cursor) 는 main.js 가 실제 에디터와 같은 확장으로 만들어 줌
// shortcut: 레지스터·검색어·매크로는 Vim 전역 상태라 리플레이가 덮어씀. 해설은 클리어 뒤나 답안 보기 때만 돌려서 영향이 작음
export function replay(tokens, makeView, Vim, getCM) {
  const { view, start } = makeView()
  const cm = getCM(view)
  const steps = []
  try {
    for (const cmd of splitCommands(tokens)) {
      try { run(cm, cmd, Vim) } catch { /* 실패한 명령은 결과만 그대로 */ }
      const head = view.state.selection.main.head
      const line = view.state.doc.lineAt(head)
      steps.push({ ...cmd, html: describe(cmd), text: view.state.doc.toString(), cursor: [line.number - 1, head - line.from] })
    }
  } finally {
    view.destroy()
  }
  return { start, steps }
}

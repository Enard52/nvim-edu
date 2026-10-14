// 레벨 정의
// cursor: 시작 커서 [line, col] (0-based)
// goal: { text } → 텍스트가 일치하고 NORMAL 모드면 클리어
//       { cursor: [line, col] } → 커서가 해당 위치면 클리어 (텍스트 수정 불가)
// solution: 모범 답안 키 시퀀스. <Esc>, <CR>, <C-x> 표기. par(기준 타수) = 답안 키 수
// lang: 'js' | 'py' | 'yaml' | undefined

import { AGENT_LOG, win, pane, session, shape, paneIds } from './tmux.js'
import { lang, t } from './i18n.js'
import { EN } from './levels.en.js'

export const chapters = [
  { id: 'move', title: '1. 이동' },
  { id: 'edit', title: '2. 편집' },
  { id: 'object', title: '3. 텍스트 오브젝트' },
  { id: 'power', title: '4. 비주얼 · 매크로' },
  { id: 'real', title: '5. 실전: AI 코드 다듬기' },
  { id: 'tmux', title: '6. tmux: AI 터미널 필수 키' },
  { id: 'guru', title: '7. 구루: 상황별 콤보' },
]

export const levels = [
  // ── 1. 이동 ──
  {
    id: 'hjkl', chapter: 'move', title: 'hjkl로 움직이기',
    desc: '방향키 대신 <b>h</b>(←) <b>j</b>(↓) <b>k</b>(↑) <b>l</b>(→)로 움직입니다. 숫자를 앞에 붙이면 반복됩니다 (<b>4l</b> = 오른쪽 4칸). 표시된 칸까지 가세요.',
    keys: ['h', 'j', 'k', 'l', '숫자+이동'],
    start: '안녕하세요 vim\nhjkl로 움직여요\n방향키는 금지\n초록 칸까지 가보세요',
    cursor: [0, 0], goal: { cursor: [2, 5] }, solution: 'jj5l',
  },
  {
    id: 'word', chapter: 'move', title: '단어 단위 점프 w b e',
    desc: '<b>w</b> 다음 단어 시작, <b>b</b> 이전 단어 시작, <b>e</b> 단어 끝. 한 글자씩 가는 것보다 훨씬 빠릅니다. <code>getUser</code>로 가세요.',
    keys: ['w', 'b', 'e'], lang: 'js',
    start: 'const userName = getUser(id);',
    cursor: [0, 0], goal: { cursor: [0, 17] }, solution: '3w',
  },
  {
    id: 'line-ends', chapter: 'move', title: '줄의 처음과 끝 0 ^ $',
    desc: '<b>0</b> 줄 맨 앞, <b>^</b> 첫 글자(공백 제외), <b>$</b> 줄 끝. 줄 끝으로 가세요.',
    keys: ['0', '^', '$'], lang: 'js',
    start: '    return result;  // TODO',
    cursor: [0, 10], goal: { cursor: [0, 26] }, solution: '$',
  },
  {
    id: 'file-jump', chapter: 'move', title: '파일 점프 gg G',
    desc: '<b>gg</b> 파일 처음, <b>G</b> 파일 끝, <b>9G</b> 9번째 줄. 9번째 줄로 가세요.',
    keys: ['gg', 'G', '{n}G'],
    start: Array.from({ length: 12 }, (_, i) => `line ${i + 1}`).join('\n'),
    cursor: [0, 0], goal: { cursor: [8, 0] }, solution: '9G',
  },
  {
    id: 'find-char', chapter: 'move', title: '글자 찾기 f t',
    desc: '<b>f(</b> 는 줄에서 다음 <code>(</code>로 점프, <b>t(</b> 는 그 바로 앞까지. <b>;</b> 다음 반복, <b>2f(</b> 두 번째. <code>isAdmin(</code>의 괄호로 가세요.',
    keys: ['f', 't', ';', ','], lang: 'js',
    start: 'if (user && user.isAdmin()) {',
    cursor: [0, 0], goal: { cursor: [0, 24] }, solution: '2f(',
  },
  {
    id: 'match', chapter: 'move', title: '짝 괄호 %',
    desc: '<b>%</b> 는 짝이 맞는 괄호로 점프합니다. 함수 블록의 끝으로 가세요.',
    keys: ['%'], lang: 'js',
    start: 'function sum(a, b) {\n  const total = a + b;\n  return total;\n}',
    cursor: [0, 19], goal: { cursor: [3, 0] }, solution: '%',
  },
  {
    id: 'search', chapter: 'move', title: '검색 / n',
    desc: '<b>/단어</b> 후 <b>Enter</b>로 검색, <b>n</b> 다음 결과, <b>N</b> 이전 결과. <code>TODO</code>로 가세요.',
    keys: ['/', 'n', 'N', '*'], lang: 'js',
    start: 'import { db } from "./db";\n\nexport async function getUser(id) {\n  const row = await db.find(id);\n  // TODO: handle not found\n  return row;\n}',
    cursor: [0, 0], goal: { cursor: [4, 5] }, solution: '/TODO<CR>',
  },

  // ── 2. 편집 ──
  {
    id: 'x', chapter: 'edit', title: '한 글자 삭제 x',
    desc: '<b>x</b> 는 커서 아래 글자를 지웁니다. 오타 두 개를 고치세요.',
    keys: ['x', 'f'],
    start: 'Helllo, Vimm!', cursor: [0, 0],
    goal: { text: 'Hello, Vim!' }, solution: '3lxfmx',
  },
  {
    id: 'insert', chapter: 'edit', title: '입력 모드 i a A o',
    desc: '<b>i</b> 커서 앞, <b>a</b> 커서 뒤, <b>A</b> 줄 끝, <b>o</b> 아래 새 줄에서 입력. <b>Esc</b>로 NORMAL 모드 복귀. 세미콜론을 붙이고 아래 줄에 로그를 추가하세요.',
    keys: ['i', 'a', 'A', 'I', 'o', 'O', 'Esc'], lang: 'js',
    start: 'const x = 1', cursor: [0, 0],
    goal: { text: 'const x = 1;\nconsole.log(x);' }, solution: 'A;<Esc>oconsole.log(x);<Esc>',
  },
  {
    id: 'dd', chapter: 'edit', title: '줄 삭제 dd',
    desc: '<b>dd</b> 는 한 줄을 통째로 지웁니다. 디버그 로그 두 줄을 지우세요.',
    keys: ['dd', 'j'], lang: 'js',
    start: 'function load() {\n  console.log("debug 1");\n  const data = fetch();\n  console.log("debug 2");\n  return data;\n}',
    cursor: [0, 0],
    goal: { text: 'function load() {\n  const data = fetch();\n  return data;\n}' }, solution: 'jddjdd',
  },
  {
    id: 'cw-dot', chapter: 'edit', title: '단어 바꾸기 cw 와 반복 .',
    desc: '<b>cw</b> 는 단어를 지우고 입력 모드로. <b>.</b> 은 마지막 변경을 그대로 반복합니다. 오타 <code>lenght</code> 두 개를 고치세요.',
    keys: ['cw', '.', 'w'], lang: 'js',
    start: 'const lenght = arr.lenght;', cursor: [0, 0],
    goal: { text: 'const length = arr.length;' }, solution: 'wcwlength<Esc>4w.',
  },
  {
    id: 'yank', chapter: 'edit', title: '복사 yy · 붙여넣기 p · Ctrl-a',
    desc: '<b>yy</b> 줄 복사, <b>p</b> 아래에 붙여넣기. <b>Ctrl-a</b> 는 커서 근처 숫자를 1 올립니다.',
    keys: ['yy', 'p', 'Ctrl-a'],
    start: 'worker1', cursor: [0, 0],
    goal: { text: 'worker1\nworker2\nworker3' }, solution: 'yyp<C-a>yyp<C-a>',
  },

  // ── 3. 텍스트 오브젝트 ──
  {
    id: 'ci-quote', chapter: 'object', title: '따옴표 안 바꾸기 ci"',
    desc: '<b>c</b>(변경) + <b>i"</b>(따옴표 안쪽). 커서가 따옴표 앞에 있어도 같은 줄이면 동작합니다. 문자열을 <code>Hello Vim</code>으로 바꾸세요.',
    keys: ['ci"', "ci'", 'ca"'], lang: 'js',
    start: 'const msg = "Hello World";', cursor: [0, 0],
    goal: { text: 'const msg = "Hello Vim";' }, solution: 'ci"Hello Vim<Esc>',
  },
  {
    id: 'di-paren', chapter: 'object', title: '괄호 안 지우기 di(',
    desc: '<b>di(</b> 는 괄호 안쪽을 모두 지웁니다. <b>f(</b> 로 괄호까지 간 뒤 써보세요.',
    keys: ['di(', 'da(', 'ci{'], lang: 'js',
    start: 'callApi(oldUrl, oldToken, true);', cursor: [0, 0],
    goal: { text: 'callApi();' }, solution: 'f(di(',
  },
  {
    id: 'df', chapter: 'object', title: '어디까지 지우기 df dt',
    desc: '<b>df.</b> 는 다음 <code>.</code>까지(포함) 지웁니다. <b>dt.</b> 는 그 앞까지. 동사 + 이동 = 명령이라는 Vim 문법의 핵심입니다.',
    keys: ['df', 'dt', 'ct'], lang: 'js',
    start: 'user.getProfile().getName()', cursor: [0, 5],
    goal: { text: 'user.getName()' }, solution: 'df.',
  },
  {
    id: 'dap', chapter: 'object', title: '문단 지우기 dap',
    desc: '<b>ap</b> 는 "문단 하나(빈 줄 포함)". <b>dap</b> 로 가운데 문단을 지우세요.',
    keys: ['dap', 'yap', 'vip'],
    start: '# 소개\nVim은 모드 기반 에디터입니다.\n\n# 폐기된 내용\n이 섹션은 오래됐어요.\n지워주세요.\n\n# 사용법\nnvim 을 실행하세요.',
    cursor: [4, 0],
    goal: { text: '# 소개\nVim은 모드 기반 에디터입니다.\n\n# 사용법\nnvim 을 실행하세요.' }, solution: 'dap',
  },

  // ── 4. 비주얼 · 매크로 ──
  {
    id: 'visual-indent', chapter: 'power', title: '줄 선택 V 와 들여쓰기 >',
    desc: '<b>V</b> 로 줄 단위 선택 후 <b>></b> 로 들여쓰기. YAML 들여쓰기를 고치세요.',
    keys: ['V', '>', '<', 'v'], lang: 'yaml',
    start: 'spec:\ncontainers:\n- name: app\n  image: app:1.0',
    cursor: [0, 0],
    goal: { text: 'spec:\n  containers:\n  - name: app\n    image: app:1.0' }, solution: 'jVjj>',
  },
  {
    id: 'block-insert', chapter: 'power', title: '블록 선택 Ctrl-v 로 한 번에 주석',
    desc: '<b>Ctrl-v</b> 로 세로 블록 선택, <b>I</b> 로 입력하고 <b>Esc</b> 하면 모든 줄에 들어갑니다.',
    keys: ['Ctrl-v', 'I', 'A'], lang: 'js',
    start: 'step1();\nstep2();\nstep3();', cursor: [0, 0],
    goal: { text: '// step1();\n// step2();\n// step3();' }, solution: '<C-v>jjI// <Esc>',
  },
  {
    id: 'macro', chapter: 'power', title: '매크로 qa … q, @a',
    desc: '<b>qa</b> 로 녹화 시작, <b>q</b> 로 끝. <b>@a</b> 로 재생, <b>2@a</b> 로 두 번. 한 줄을 가공하고 다음 줄로 내려가는 것까지 녹화하는 게 요령입니다.',
    keys: ['qa', 'q', '@a', 'I', 'A'], lang: 'js',
    start: 'apple\nbanana\ncherry', cursor: [0, 0],
    goal: { text: '"apple",\n"banana",\n"cherry",' }, solution: 'qaI"<Esc>A",<Esc>jq2@a',
  },

  // ── 5. 실전 ──
  {
    id: 'substitute', chapter: 'real', title: '전체 치환 :%s',
    desc: '<b>:%s/old/new/g</b> 는 파일 전체 치환. AI가 쓴 낡은 <code>var</code> 를 <code>const</code> 로 바꾸세요.',
    keys: [':%s', '/g', ':s'], lang: 'js',
    start: 'var host = "localhost";\nvar port = 8080;\nvar url = host + ":" + port;', cursor: [0, 0],
    goal: { text: 'const host = "localhost";\nconst port = 8080;\nconst url = host + ":" + port;' },
    solution: ':%s/var/const/g<CR>',
  },
  {
    id: 'global-delete', chapter: 'real', title: '패턴 줄 일괄 삭제 :g',
    desc: '<b>:g/패턴/d</b> 는 패턴이 있는 모든 줄을 지웁니다. AI가 잔뜩 남긴 <code>console.log</code> 를 정리하세요.',
    keys: [':g', ':v'], lang: 'js',
    start: 'async function main() {\n  console.log("start");\n  const cfg = await load();\n  console.log("cfg", cfg);\n  await run(cfg);\n  console.log("done");\n}',
    cursor: [0, 0],
    goal: { text: 'async function main() {\n  const cfg = await load();\n  await run(cfg);\n}' },
    solution: ':g/console/d<CR>',
  },
  {
    id: 'boss', chapter: 'real', title: '보스: AI 코드 리뷰 반영',
    desc: '리뷰 코멘트: ① DEBUG print 제거 ② <code>tot</code> → <code>total</code> 이름 변경. 지금까지 배운 무엇을 써도 됩니다.',
    keys: [':g', ':%s', 'dd', 'cw', '.'], lang: 'py',
    start: 'def calc(items):\n    print("DEBUG", items)\n    tot = 0\n    for i in items:\n        tot += i\n    print("DEBUG", tot)\n    return tot',
    cursor: [0, 0],
    goal: { text: 'def calc(items):\n    total = 0\n    for i in items:\n        total += i\n    return total' },
    solution: ':g/DEBUG/d<CR>:%s/tot/total/g<CR>',
  },
  // ── 6. tmux ── (kind: 'tmux' → 터미널 시뮬레이터. init() 이 초기 상태, checks 가 모두 참이면 클리어)
  {
    id: 'tmux-new', chapter: 'tmux', kind: 'tmux', title: '세션 만들기 tmux new',
    desc: 'AI 에이전트는 오래 돕니다. 터미널 창이 닫혀도 살아 있게 <b>tmux 세션</b> 안에서 돌리세요. <code>tmux new -s agent</code> 를 입력하고 Enter.',
    keys: ['tmux new -s 이름', 'tmux ls'],
    init: () => ({ outer: [t('# 에이전트를 돌릴 세션을 만들어 봅시다', '# Create a session to run your agent in')] }),
    checks: [{ label: '<code>agent</code> 세션에 들어가기', test: (s) => s.attached === 'agent' }],
    solution: 'tmux new -s agent<CR>',
  },
  {
    id: 'tmux-split', chapter: 'tmux', kind: 'tmux', title: '화면 나누기 C-b % 와 C-b "',
    desc: 'tmux 키는 모두 <b>prefix</b> <kbd>Ctrl-b</kbd> 를 먼저 누르고 손을 뗀 뒤 다음 키를 누릅니다. <b>C-b %</b> 좌우 분할, <b>C-b "</b> 위아래 분할. 왼쪽엔 에이전트, 오른쪽엔 쉘 두 개를 만드세요.',
    keys: ['C-b %', 'C-b "'],
    init: () => ({ attached: 'agent', sessions: [{ name: 'agent', windows: [{ panes: [{ program: 'claude', lines: AGENT_LOG }] }] }] }),
    checks: [{ label: '에이전트 | 쉘 위아래 두 개 레이아웃', test: (s) => !!s.attached && shape(win(s).layout) === 'h(p,v(p,p))' }],
    solution: '<C-b>%<C-b>"',
  },
  {
    id: 'tmux-nav', chapter: 'tmux', kind: 'tmux', title: 'pane 이동 C-b 방향키',
    desc: '<b>C-b ←↑↓→</b> 로 옆 pane 으로 이동합니다. <b>C-b o</b> 는 다음 pane, <b>C-b ;</b> 는 직전 pane, <b>C-b q</b> 는 번호를 띄워 숫자로 이동. 에이전트 pane 으로 가세요.',
    keys: ['C-b ←↑↓→', 'C-b o', 'C-b ;', 'C-b q'],
    init: () => ({ attached: 'agent', sessions: [{ name: 'agent', windows: [{ split: 'hv', active: 2, panes: [{ program: 'claude', lines: AGENT_LOG }, {}, {}] }] }] }),
    checks: [{ label: '에이전트 pane 이 활성', test: (s) => !!s.attached && pane(s).program === 'claude' }],
    solution: '<C-b><Left>',
  },
  {
    id: 'tmux-zoom', chapter: 'tmux', kind: 'tmux', title: '크게 보기 C-b z',
    desc: '좁은 pane 에서 에이전트 출력을 읽기 힘들 때 <b>C-b z</b> 로 그 pane 만 화면 전체로 키웁니다. 한 번 더 누르면 원래대로. 에이전트 pane 으로 가서 zoom 하세요.',
    keys: ['C-b z'],
    init: () => ({ attached: 'agent', sessions: [{ name: 'agent', windows: [{ split: 'hv', active: 2, panes: [{ program: 'claude', lines: AGENT_LOG }, {}, {}] }] }] }),
    checks: [
      { label: '에이전트 pane 이 활성', test: (s) => !!s.attached && pane(s).program === 'claude' },
      { label: 'zoom 상태 (상태줄에 Z)', test: (s) => !!s.attached && win(s).zoomed },
    ],
    solution: '<C-b><Left><C-b>z',
  },
  {
    id: 'tmux-scroll', chapter: 'tmux', kind: 'tmux', title: '출력 위로 올려보기 C-b [',
    desc: 'tmux 안에서는 마우스 휠 스크롤이 기본으로 안 됩니다. <b>C-b [</b> 로 <b>copy mode</b> 에 들어가면 vim 키로 출력을 돌아다닐 수 있어요: <b>k j</b>, <b>C-u C-d</b>, <b>g</b> 맨 위, <b>G</b> 맨 아래, <b>q</b> 나가기. 에이전트 출력 맨 위로 가세요.',
    keys: ['C-b [', 'g', 'G', 'C-u', 'C-d', 'q'],
    init: () => ({ attached: 'agent', sessions: [{ name: 'agent', windows: [{ split: 'h', active: 0, panes: [{ program: 'claude', lines: AGENT_LOG }, {}] }] }] }),
    checks: [{ label: '에이전트 pane 의 copy mode 에서 첫 줄에 커서', test: (s) => !!s.attached && pane(s).program === 'claude' && pane(s).copy?.line === 0 }],
    solution: '<C-b>[g',
  },
  {
    id: 'tmux-copy', chapter: 'tmux', kind: 'tmux', title: '에러 복사해서 옆 쉘에 붙여넣기',
    desc: '에이전트가 뱉은 에러를 직접 검색해 보려면 복사가 필요합니다. <b>C-b [</b> → <b>?Error</b> Enter (위로 검색) → <b>Space</b> 선택 시작 → <b>$</b> 줄 끝 → <b>Enter</b> 복사. 오른쪽 쉘로 가서 <b>C-b ]</b> 로 붙여넣으세요. (<code>v</code>/<code>y</code> 도 됩니다. 많이 쓰는 .tmux.conf 설정)',
    keys: ['C-b [', '?', '/', 'Space', '$', 'Enter', 'C-b ]'],
    init: () => ({ attached: 'agent', sessions: [{ name: 'agent', windows: [{ split: 'h', active: 0, panes: [{ program: 'claude', lines: AGENT_LOG }, {}] }] }] }),
    checks: [{ label: "오른쪽 쉘 입력줄에 <code>Cannot find module 'zod'</code>", test: (s) => Object.values(s.panes).some((p) => p.program === 'zsh' && p.input.includes("Cannot find module 'zod'")) }],
    solution: '<C-b>[?Error<CR> $<CR><C-b><Right><C-b>]',
  },
  {
    id: 'tmux-window', chapter: 'tmux', kind: 'tmux', title: '윈도우 = 탭 C-b c, C-b ,',
    desc: 'pane 이 너무 많아지면 <b>윈도우</b>(탭)를 추가합니다. <b>C-b c</b> 새 윈도우, <b>C-b ,</b> 이름 바꾸기 (기존 이름은 <b>C-u</b> 로 지우기). 테스트용 윈도우 <code>test</code> 를 만드세요.',
    keys: ['C-b c', 'C-b ,', 'C-u', 'C-b n', 'C-b p'],
    init: () => ({ attached: 'agent', sessions: [{ name: 'agent', windows: [{ panes: [{ program: 'claude', lines: AGENT_LOG }] }] }] }),
    checks: [
      { label: '윈도우 2개', test: (s) => !!s.attached && session(s).windows.length === 2 },
      { label: '현재 윈도우 이름이 <code>test</code>', test: (s) => !!s.attached && win(s).renamed && win(s).name === 'test' },
    ],
    solution: '<C-b>c<C-b>,<C-u>test<CR>',
  },
  {
    id: 'tmux-window-jump', chapter: 'tmux', kind: 'tmux', title: '번호로 윈도우 점프 C-b 0~9',
    desc: '상태줄의 <code>0:claude 1:nvim 2:test</code> 숫자가 윈도우 번호입니다. <b>C-b 0</b> 처럼 바로 갈 수 있어요. 에이전트가 있는 0번으로 가세요.',
    keys: ['C-b 0~9', 'C-b n', 'C-b p'],
    init: () => ({ attached: 'agent', sessions: [{ name: 'agent', activeWindow: 2, windows: [
      { panes: [{ program: 'claude', lines: AGENT_LOG }] },
      { name: 'nvim', panes: [{ lines: ['$ nvim src/config.ts'] }] },
      { name: 'test', panes: [{ lines: ['$ npm test', 'FAIL  src/config.test.ts', "Error: Cannot find module 'zod'"] }] },
    ] }] }),
    checks: [{ label: '0번 윈도우', test: (s) => !!s.attached && session(s).active === 0 }],
    solution: '<C-b>0',
  },
  {
    id: 'tmux-detach', chapter: 'tmux', kind: 'tmux', title: 'detach 하고 다시 붙기',
    desc: '<b>C-b d</b> 로 빠져나와도(detach) 세션 안의 에이전트는 계속 일합니다. SSH 가 끊겨도 마찬가지. <code>tmux a</code> (또는 <code>tmux a -t agent</code>) 로 다시 붙으세요.',
    keys: ['C-b d', 'tmux a', 'tmux ls'],
    init: () => ({ attached: 'agent', sessions: [{ name: 'agent', windows: [{ panes: [{ program: 'claude', lines: AGENT_LOG }] }] }] }),
    checks: [
      { label: 'detach 하기', test: (s) => s.flags.detachedOnce },
      { label: '다시 <code>agent</code> 에 attach', test: (s) => s.flags.detachedOnce && s.attached === 'agent' },
    ],
    solution: '<C-b>dtmux a<CR>',
  },
  {
    id: 'tmux-session', chapter: 'tmux', kind: 'tmux', title: '세션 전환 C-b s · C-b ( )',
    desc: '프로젝트마다 세션을 따로 두면 에이전트 여러 개를 나란히 돌릴 수 있습니다. <b>C-b s</b> 목록에서 고르거나, <b>C-b )</b> 다음 · <b>C-b (</b> 이전 세션. <code>blog</code> 세션으로 가세요.',
    keys: ['C-b s', 'C-b (', 'C-b )'],
    init: () => ({ attached: 'agent', sessions: [
      { name: 'agent', windows: [{ panes: [{ program: 'claude', lines: AGENT_LOG }] }] },
      { name: 'blog', windows: [{ panes: [{ lines: ['$ npm run dev', '  ➜  Local:   http://localhost:5173/'] }] }] },
    ] }),
    checks: [{ label: '<code>blog</code> 세션', test: (s) => s.attached === 'blog' }],
    solution: '<C-b>)',
  },
  {
    id: 'tmux-kill', chapter: 'tmux', kind: 'tmux', title: 'pane 닫기 C-b x',
    desc: '다 쓴 pane 은 <b>C-b x</b> 후 <b>y</b> 로 닫습니다 (쉘에서 <code>exit</code> 도 됩니다). 오른쪽 아래 pane 을 닫으세요.',
    keys: ['C-b x', 'y', 'exit', 'C-b &'],
    init: () => ({ attached: 'agent', sessions: [{ name: 'agent', windows: [{ split: 'hv', active: 2, panes: [{ program: 'claude', lines: AGENT_LOG }, {}, {}] }] }] }),
    checks: [
      { label: 'pane 2개', test: (s) => !!s.attached && paneIds(win(s).layout).length === 2 },
      { label: '에이전트 pane 은 살아 있음', test: (s) => Object.values(s.panes).some((p) => p.program === 'claude') },
    ],
    solution: '<C-b>xy',
  },
  {
    id: 'tmux-boss', chapter: 'tmux', kind: 'tmux', title: '보스: 에이전트 작업판 세팅',
    desc: '처음부터 혼자: <code>work</code> 세션을 만들고, 거기서 에이전트를 실행(<code>claude</code>)한 뒤, 오른쪽에 쉘 pane 을 띄워 그쪽에 커서를 두세요.',
    keys: ['tmux new -s', 'claude', 'C-b %'],
    init: () => ({ outer: [t('# 출근했습니다. 작업판을 세팅하세요', '# Morning! Set up your workspace')] }),
    checks: [
      { label: '<code>work</code> 세션', test: (s) => s.attached === 'work' },
      { label: '왼쪽 pane 에서 에이전트 실행 중', test: (s) => s.attached === 'work' && shape(win(s).layout) === 'h(p,p)' && s.panes[paneIds(win(s).layout)[0]].program === 'claude' },
      { label: '오른쪽 쉘 pane 이 활성', test: (s) => s.attached === 'work' && win(s).active === paneIds(win(s).layout)[1] },
    ],
    solution: 'tmux new -s work<CR>claude<CR><C-b>%',
  },
  // ── 7. 구루 ── 상황(코드·로그·설정·문서)별로 여러 기술을 엮는 콤보. par 가 빡빡함
  {
    id: 'guru-rename', chapter: 'guru', title: '[코드] 단어만 골라 이름 바꾸기 * n .',
    desc: '<code>user</code> 를 <code>member</code> 로 바꾸되 <code>getUser</code>, <code>username</code> 은 그대로 두세요. <b>*</b> 는 커서 밑 단어를 <em>단어 단위</em>로 검색합니다. <b>ciw</b> 로 한 번 고치고 <b>n</b> 다음, <b>.</b> 반복.',
    keys: ['*', 'ciw', 'n', '.'], lang: 'js',
    start: 'const user = await getUser(id);\nif (!user) return null;\nreturn user.username;', cursor: [0, 6],
    goal: { text: 'const member = await getUser(id);\nif (!member) return null;\nreturn member.username;' },
    solution: '*ciwmember<Esc>n.n.',
  },
  {
    id: 'guru-log', chapter: 'guru', title: '[로그] 에러 줄만 남기기 :v',
    desc: '<b>:v/패턴/d</b> 는 <b>:g</b> 의 반대. 패턴이 <em>없는</em> 줄을 지웁니다. 에이전트 로그에서 <code>ERROR</code> 줄만 남기세요.',
    keys: [':v', ':g!'],
    start: '10:01 INFO  server started\n10:02 ERROR db timeout\n10:02 INFO  retry 1\n10:03 WARN  slow query\n10:04 ERROR db timeout\n10:05 INFO  healthy',
    cursor: [0, 0],
    goal: { text: '10:02 ERROR db timeout\n10:04 ERROR db timeout' },
    solution: ':v/ERROR/d<CR>',
  },
  {
    id: 'guru-sort', chapter: 'guru', title: '[설정] 정렬하고 중복 지우기 :sort u',
    desc: '<b>:sort</b> 는 줄 정렬, <b>u</b> 를 붙이면 중복도 지웁니다. 여러 번 덧붙여 엉망이 된 <code>.gitignore</code> 를 정리하세요.',
    keys: [':sort', ':sort u'],
    start: 'node_modules/\ndist/\n.env\ndist/\ncoverage/\n.env', cursor: [0, 0],
    goal: { text: '.env\ncoverage/\ndist/\nnode_modules/' },
    solution: ':sort u<CR>',
  },
  {
    id: 'guru-norm', chapter: 'guru', title: '[설정] 골라서 일괄 편집 :g + :norm',
    desc: '<b>:g/패턴/norm 키</b> 는 패턴이 있는 줄마다 NORMAL 키를 실행합니다. 주석·빈 줄은 두고 <code>=</code> 가 있는 줄에만 <code>export </code> 를 붙이세요.',
    keys: [':g', ':norm', 'I'],
    start: '# database\nDB_HOST=localhost\nDB_PORT=5432\n\n# logging\nLOG_LEVEL=debug', cursor: [0, 0],
    goal: { text: '# database\nexport DB_HOST=localhost\nexport DB_PORT=5432\n\n# logging\nexport LOG_LEVEL=debug' },
    solution: ':g/=/norm Iexport <CR>',
  },
  {
    id: 'guru-capture', chapter: 'guru', title: '[코드] 정규식 그룹으로 구조 바꾸기 \\( \\) \\1',
    desc: '<b>\\(…\\)</b> 로 잡은 부분을 바꿀 말에서 <b>\\1</b> <b>\\2</b> 로 다시 씁니다. 옛 테스트 문법 <code>assertEqual(a, b)</code> 를 <code>expect(a).toBe(b)</code> 로 옮기세요.',
    keys: [':%s', '\\( \\)', '\\1 \\2', '.*'], lang: 'js',
    start: 'assertEqual(sum(1, 2), 3);\nassertEqual(user.name, "kim");\nassertEqual(list.length, 0);', cursor: [0, 0],
    goal: { text: 'expect(sum(1, 2)).toBe(3);\nexpect(user.name).toBe("kim");\nexpect(list.length).toBe(0);' },
    solution: ':%s/assertEqual(\\(.*\\), \\(.*\\))/expect(\\1).toBe(\\2)/<CR>',
  },
  {
    id: 'guru-counter', chapter: 'guru', title: '[문서] 번호 목록 자동 생성 매크로 + Ctrl-a',
    desc: '<b>yyp</b> 로 줄을 복제하고 <b>Ctrl-a</b> 로 번호를 올리는 걸 매크로로 녹화해 반복하면 번호가 저절로 붙습니다. 5단계 목록을 만드세요.',
    keys: ['qa', 'yyp', 'Ctrl-a', '@a'],
    start: '1. step', cursor: [0, 0],
    goal: { text: '1. step\n2. step\n3. step\n4. step\n5. step' },
    solution: 'qayyp<C-a>q3@a',
  },
  {
    id: 'guru-boss', chapter: 'guru', title: '보스: 커밋 메시지 한 번에 고치기',
    desc: '에이전트가 쓴 커밋 메시지: ① 오타 <code>hanlde</code> → <code>handle</code> (<b>xp</b> 는 두 글자 자리 바꾸기) ② 이슈 번호 <code>#41</code> → <code>#42</code> ③ <code>Closes</code> 줄을 맨 아래로 (<b>ddp</b> 는 줄 자리 바꾸기). 적은 타수로 끝내 보세요.',
    keys: ['f', 'xp', 'Ctrl-a', 'ddp'],
    start: 'fix: hanlde empty input\n- add guard in parser\nCloses #41\n- update tests', cursor: [0, 0],
    goal: { text: 'fix: handle empty input\n- add guard in parser\n- update tests\nCloses #42' },
    solution: 'flxpjj<C-a>ddp',
  },
]


// 영어: 같은 id 의 필드를 levels.en.js 값으로 바꿈 (checks 는 라벨만)
if (lang === 'en') {
  for (const c of chapters) c.title = EN.chapters[c.id] ?? c.title
  for (const l of levels) {
    const { checks, ...rest } = EN.levels[l.id] ?? {}
    Object.assign(l, rest)
    if (checks) l.checks = l.checks.map((c, i) => ({ ...c, label: checks[i] ?? c.label }))
  }
}

// '<Esc>jj' → ['<Esc>', 'j', 'j']
export function tokenize(keys) {
  return keys.match(/<[^>]+>|./gs) ?? []
}

export function stars(count, par) {
  if (count <= par) return 3
  if (count <= Math.ceil(par * 1.5)) return 2
  return 1
}

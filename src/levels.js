// 레벨 정의
// cursor: 시작 커서 [line, col] (0-based)
// goal: { text } → 텍스트가 일치하고 NORMAL 모드면 클리어
//       { cursor: [line, col] } → 커서가 해당 위치면 클리어 (텍스트 수정 불가)
// solution: 모범 답안 키 시퀀스. <Esc>, <CR>, <C-x> 표기. par(기준 타수) = 답안 키 수
// lang: 'js' | 'py' | 'yaml' | undefined

export const chapters = [
  { id: 'move', title: '1. 이동' },
  { id: 'edit', title: '2. 편집' },
  { id: 'object', title: '3. 텍스트 오브젝트' },
  { id: 'power', title: '4. 비주얼 · 매크로' },
  { id: 'real', title: '5. 실전: AI 코드 다듬기' },
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
]

// '<Esc>jj' → ['<Esc>', 'j', 'j']
export function tokenize(keys) {
  return keys.match(/<[^>]+>|./gs) ?? []
}

export function stars(count, par) {
  if (count <= par) return 3
  if (count <= Math.ceil(par * 1.5)) return 2
  return 1
}

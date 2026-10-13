// 실제 Neovim 과 비교할 키 입력 모음. :help 의 자주 쓰는 명령 위주 (motion.txt, change.txt, visual.txt, undo.txt, repeat.txt ...)
// [이름, 텍스트, [줄, 열] (0-based), 키]  키 표기: <Esc> <CR> <BS> <C-a> <C-x> <C-r> <C-v> <C-w>
import { levels } from '../../src/levels.js'

const CODE = `const userName = getUser(id);
if (user && user.isAdmin()) {
  return "Hello World";
}
let total = count + 10;`
const PROSE = `# Title
first paragraph line one
first paragraph line two

second paragraph here
and more words

third one`
const NUMS = 'worker1 item-1 0x0f 007 port 8080'
const LIST = 'apple\nbanana\ncherry'

export const cases = [
  // ── motion.txt ──
  ['3l', CODE, [0, 0], '3l'], ['2j', CODE, [0, 6], '2j'], ['j$k (curswant)', CODE, [0, 0], 'j$k'],
  ['w', CODE, [0, 0], 'w'], ['3w', CODE, [0, 0], '3w'], ['W', CODE, [1, 0], 'WW'], ['b', CODE, [0, 20], 'b'],
  ['e', CODE, [0, 0], 'ee'], ['E', CODE, [1, 0], 'EE'], ['ge', CODE, [0, 20], 'ge'], ['w 줄 넘김', CODE, [0, 26], 'ww'],
  ['0 ^ $', CODE, [2, 8], '^'], ['$', CODE, [2, 0], '$'], ['0', CODE, [2, 8], '0'],
  ['gg', CODE, [3, 0], 'gg'], ['G', CODE, [0, 0], 'G'], ['3G', CODE, [0, 0], '3G'], [':3', CODE, [0, 0], ':3<CR>'],
  ['f', CODE, [0, 0], 'fU'], ['F', CODE, [0, 20], 'Fe'], ['t', CODE, [0, 0], 'tU'], ['T', CODE, [0, 20], 'Te'],
  ['f ; ,', CODE, [1, 0], 'fs;;,'], ['2f(', CODE, [1, 0], '2f('], ['f 실패', CODE, [0, 0], 'fZ'],
  ['%', CODE, [1, 28], '%'], ['% 괄호 밖', CODE, [1, 0], '%'], ['}', PROSE, [0, 0], '}'], ['{', PROSE, [5, 3], '{'],
  ['*', CODE, [1, 4], '*'], ['#', CODE, [1, 13], '#'], ['/ n N', CODE, [0, 0], '/user<CR>nN'], ['? 위로', CODE, [4, 0], '?user<CR>'],

  // ── change.txt: 삭제/변경 ──
  ['x', CODE, [0, 0], 'x'], ['3x', CODE, [0, 0], '3x'], ['X', CODE, [0, 5], 'X'], ['x 줄 끝', CODE, [0, 28], 'x'],
  ['dw', CODE, [0, 0], 'dw'], ['dW', CODE, [1, 0], 'wdW'], ['de', CODE, [0, 0], 'de'], ['db', CODE, [0, 10], 'db'],
  ['d$ D', CODE, [0, 6], 'D'], ['d0', CODE, [0, 6], 'd0'], ['dd', CODE, [1, 3], 'dd'], ['2dd', CODE, [1, 3], '2dd'],
  ['dj', CODE, [1, 0], 'dj'], ['dk', CODE, [1, 0], 'dk'], ['dG', CODE, [2, 0], 'dG'], ['dgg', CODE, [1, 0], 'dgg'],
  ['dw 줄 끝 단어', CODE, [0, 25], 'dw'], ['df 실패', CODE, [0, 0], 'dfZ'], ['dt(', CODE, [0, 17], 'dt('],
  ['cw (= ce)', CODE, [0, 6], 'cwname<Esc>'], ['cw 공백 위', CODE, [0, 5], 'cwX<Esc>'], ['cc', CODE, [2, 5], 'ccnew<Esc>'],
  ['C', CODE, [0, 6], 'CX;<Esc>'], ['s', CODE, [0, 0], 'sC<Esc>'], ['S', CODE, [2, 4], 'Sx<Esc>'], ['r', CODE, [0, 0], 'rC'],
  ['3r', CODE, [0, 0], '3rx'], ['~', CODE, [0, 0], '~~~'], ['g~w', CODE, [0, 6], 'g~w'], ['gUiw', CODE, [0, 6], 'gUiw'],
  ['guu', CODE, [2, 0], 'guu'], ['J', CODE, [1, 0], 'J'], ['3J', CODE, [1, 0], '3J'], ['gJ', CODE, [1, 0], 'gJ'],
  ['>>', CODE, [0, 0], '>>'], ['<<', CODE, [2, 0], '<<'], ['3>>', CODE, [0, 0], '3>>'],

  // ── 입력 모드 ──
  ['i', CODE, [0, 6], 'ihi <Esc>'], ['a', CODE, [0, 4], 'a!<Esc>'], ['A', CODE, [0, 0], 'A // ok<Esc>'], ['I', CODE, [2, 6], 'I# <Esc>'],
  ['o', CODE, [1, 0], 'ofoo();<Esc>'], ['O', CODE, [2, 0], 'Obar();<Esc>'], ['3i', CODE, [0, 0], '3iab<Esc>'],
  ['<BS>', CODE, [0, 0], 'Axyz<BS><BS><Esc>'], ['<C-w> 입력 중 단어 지우기', CODE, [0, 0], 'A foo bar<C-w><Esc>'],

  // ── 복사/붙여넣기 · 레지스터 ──
  ['yyp', CODE, [0, 0], 'yyp'], ['yyP', CODE, [1, 0], 'yyP'], ['Y (nvim: y$)', CODE, [0, 6], 'Y$p'], ['yiwP', CODE, [0, 6], 'yiwP'],
  ['ddp', LIST, [0, 0], 'ddp'], ['xp', CODE, [0, 0], 'xp'], ['dwP', CODE, [0, 0], 'dwwP'], ['"a', LIST, [0, 0], '"ayyj"ap'],
  ['"_d 블랙홀', LIST, [0, 0], 'yyj"_ddp'], ['3p', LIST, [0, 0], 'yy3p'],

  // ── 텍스트 오브젝트 ──
  ['diw', CODE, [0, 8], 'diw'], ['daw', CODE, [0, 8], 'daw'], ['ciw', CODE, [0, 8], 'ciwname<Esc>'], ['di(', CODE, [0, 25], 'di('],
  ['da(', CODE, [0, 25], 'da('], ['dib', CODE, [0, 25], 'dib'], ['di" 앞에서', CODE, [2, 0], 'di"'], ['da"', CODE, [2, 12], 'da"'],
  ['ci"', CODE, [2, 12], 'ci"Hi<Esc>'], ['di{ 여러 줄', CODE, [2, 4], 'di{'], ['da{', CODE, [2, 4], 'da{'], ['dap', PROSE, [4, 0], 'dap'],
  ['dip', PROSE, [1, 0], 'dip'], ['yap P', PROSE, [4, 0], 'yapP'], ["di'", "x = 'abc'", [0, 6], "di'"],

  // ── visual.txt ──
  ['vjd', CODE, [0, 6], 'vjd'], ['Vjd', CODE, [0, 6], 'Vjd'], ['vey P', CODE, [0, 6], 'veyP'], ['v$d', CODE, [0, 6], 'v$d'],
  ['Vj>', CODE, [0, 0], 'Vj>'], ['v~', CODE, [0, 0], 'vee~'], ['vU', CODE, [0, 0], 'veU'], ['vip d', PROSE, [1, 0], 'vipd'],
  ['<C-v>jjd', LIST, [0, 0], '<C-v>jjd'], ['<C-v>I', LIST, [0, 0], '<C-v>jjI// <Esc>'], ['<C-v>$A', LIST, [0, 0], '<C-v>jj$A;<Esc>'],
  ['gv', CODE, [0, 0], 'vey<Esc>jgvd'], ['o (반대쪽 끝)', CODE, [0, 6], 'veohd'],

  // ── undo.txt · repeat.txt ──
  ['u', CODE, [0, 0], 'xxxu'], ['uu', CODE, [0, 0], 'xxuu'], ['<C-r>', CODE, [0, 0], 'xxuu<C-r>'], ['U 대신 u 여러 번', CODE, [0, 0], 'dwdwuuu'],
  ['insert 한 번 = undo 한 번', CODE, [0, 0], 'Aabc<Esc>u'], ['.', CODE, [0, 0], 'dw..'], ['3.', CODE, [0, 0], 'x3.'],
  ['A . j', LIST, [0, 0], 'A;<Esc>j.j.'], ['ciw .', CODE, [0, 6], 'ciwX<Esc>w.'], ['qa @a', LIST, [0, 0], 'qaA,<Esc>jq2@a'],
  ['@@', LIST, [0, 0], 'qaI-<Esc>jq@a@@'], ['5<C-a>', NUMS, [0, 0], '5<C-a>'], ['<C-a> 음수', NUMS, [0, 8], '<C-a>'],
  ['<C-x>', NUMS, [0, 30], '<C-x>'], ['<C-a> 16진수', NUMS, [0, 15], '<C-a>'], ['<C-a> 0 시작(nvim 은 10진수)', NUMS, [0, 20], '<C-a>'],

  // ── Ex 명령 ──
  [':s', CODE, [0, 0], ':s/e/E/<CR>'], [':s g', CODE, [0, 0], ':s/e/E/g<CR>'], [':%s', CODE, [0, 0], ':%s/user/u/g<CR>'],
  [':%s 대소문자', CODE, [0, 0], ':%s/\\cUSER/x/g<CR>'], [':g/d', CODE, [0, 0], ':g/return/d<CR>'], [':v/d', CODE, [0, 0], ':v/u/d<CR>'],
  [':2,3d', CODE, [0, 0], ':2,3d<CR>'], [':m0', LIST, [2, 0], ':m0<CR>'], [':t.', LIST, [0, 0], ':t.<CR>'],
  [':%norm', LIST, [0, 0], ':%norm A;<CR>'], [':sort', 'b\nc\na', [0, 0], ':sort<CR>'], ['&', CODE, [0, 0], ':s/e/E/<CR>j&'],

  // ── 마크 ──
  ['j 마지막 줄', LIST, [2, 2], 'j'], ['k 첫 줄', LIST, [0, 2], 'k'], ['5j 끝 넘김', LIST, [0, 2], '5j'],
  ['매크로는 실패하면 멈춤', LIST, [0, 0], 'qaI-<Esc>jq5@a'],
  ["ma d'a", LIST, [0, 0], "majjd'a"], ['ma d`a', CODE, [0, 6], 'mawwd`a'],
]

// 레벨 모범 답안도 실제 Neovim 에서 같은 결과인지 (이동 레벨은 커서, 나머지는 텍스트)
for (const l of levels.filter((x) => !x.kind)) cases.push([`레벨:${l.id}`, l.start, l.cursor, l.solution])

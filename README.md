# nvim-edu

브라우저에서 바로 하는 Vim / Neovim 단축키 연습장.
[LearnGitBranching](https://learngitbranching.js.org/) 처럼 **목표 상태를 보고 그 차이를 키보드로 메우는** 방식입니다.

**▶ https://s3onghyun.github.io/nvim-edu/**

AI 에이전트(Claude Code, Codex …)를 tmux · 터미널에서 돌리다 보면 결국 손이 가는 건 Neovim입니다.
설치나 설정 없이 손가락에 모션을 익히는 게 목표입니다.

## 무엇을 할 수 있나

| 모드 | 내용 |
|------|------|
| **레벨** (22개) | 이동 → 편집 → 텍스트 오브젝트 → 비주얼·매크로 → 실전(`:%s`, `:g`, AI 코드 리뷰 반영). 모범 답안 타수(par) 대비 ★1~3 |
| **미션** | 이동·삭제·변경 과제를 랜덤으로 10라운드 연속. 시간·타수 최고 기록 |
| **오늘의 미션** | 날짜 시드라 모두 같은 문제. 연속 일수(🔥) 기록 |
| **자유 연습장** | 목표 없이 아무거나 |

Neovim 같은 화면: neo-tree 사이드바, bufferline, lualine, cmdline 메시지, 상대 줄 번호, `~`,
`:colorscheme tokyonight | catppuccin | gruvbox | tokyonight-day`.

습관 교정: 방향키·마우스 차단, NORMAL 모드에서 한글 IME 로 입력하면 "한/영 전환" 안내.

## 개발

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # 빌드 후 모든 레벨/미션을 실제 Chromium 으로 풀어서 검증
```

`npm test` 는 Playwright 브라우저가 필요합니다: `npx playwright-core install chromium`
(이미 받아 둔 Chrome 이 있으면 `CHROME_PATH=/path/to/chrome npm test`).

## 구조

| 파일 | 역할 |
|------|------|
| `src/levels.js` | 레벨 데이터. `solution` 이 모범 답안이자 par(기준 타수) |
| `src/drill.js` | 미션 라운드 생성기 (이동/줄 삭제/단어 삭제/단어 변경/괄호·따옴표 안 비우기) |
| `src/main.js` | 에디터([CodeMirror 6](https://codemirror.net/) + [@replit/codemirror-vim](https://github.com/replit/codemirror-vim)), 채점, UI |
| `src/style.css` | 컬러스킴 토큰 + nvim 스타일 레이아웃 |
| `tests/levels.e2e.mjs` | 모든 레벨 답안·미션 120라운드를 실제 키 입력으로 검증 |

## 레벨 추가하기

`src/levels.js` 에 객체 하나를 추가하면 됩니다.

```js
{
  id: 'my-level', chapter: 'edit', title: '제목',
  desc: '설명 (HTML 가능)', keys: ['dd'], lang: 'js',
  start: '시작 텍스트', cursor: [0, 0],
  goal: { text: '목표 텍스트' },      // 또는 { cursor: [줄, 열] }
  solution: 'jdd',                     // <Esc> <CR> <C-a> 표기, 길이가 곧 par
}
```

`npm test` 가 그 답안으로 실제로 클리어되는지 확인해 줍니다. PR 환영합니다.

## 알려진 한계

- Vim 동작은 `@replit/codemirror-vim` 에뮬레이션이라 실제 Neovim 과 일부 다를 수 있습니다.
- 물리 키보드가 필요합니다 (모바일 터치 입력 미지원).
- 진행 상황은 브라우저 localStorage 에만 저장됩니다.

## License

MIT

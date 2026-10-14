# Contributing to nvim-edu / 기여 가이드

[한국어](#한국어) | [English](#english)

---

## 한국어

`nvim-edu`에 새로운 연습 레벨이나 기능을 제안하고 기여해주셔서 감사합니다!

### 새로운 레벨 추가하기

모든 레벨은 `src/levels.js`와 `src/levels.en.js`에 정의됩니다.

1. **레벨 정의 (`src/levels.js`):**
   `levels` 배열에 새 객체를 추가합니다:
   ```javascript
   {
     id: 'unique-level-id',       // 고유한 kebab-case 식별자
     chapter: 'edit',             // 'move' | 'edit' | 'object' | 'power' | 'real' | 'tmux' | 'guru'
     title: '레벨 제목',
     desc: '설명 문구 (HTML 태그 <b>, <code> 사용 가능)',
     keys: ['ciw', 'C'],          // 연습할 핵심 키 목록
     lang: 'js',                  // 'js' | 'py' | 'yaml' | undefined (코드 하이라이팅)
     start: 'const old = "value";', // 시작 버퍼 텍스트
     cursor: [0, 13],             // 시작 커서 위치 [line, col] (0-based)
     goal: {                      // 목표 상태
       text: 'const new = "value";', // 텍스트 목표
       // 또는 cursor: [0, 20]     // 이동 목표
     },
     solution: 'ciw<Esc>',        // 모범 답안 키 시퀀스 (<Esc>, <CR>, <C-x> 등 표기)
   }
   ```

2. **영어 번역 추가 (`src/levels.en.js`):**
   `EN.levels` 객체에 동일한 `id`로 영문 텍스트를 등록합니다:
   ```javascript
   'unique-level-id': {
     title: 'Level title in English',
     desc: 'Description in English',
   }
   ```

3. **Par(기준 타수) 규칙:**
   - 레벨의 기준 타수(`par`)는 모범 답안 `solution`의 토큰 수로 자동 계산됩니다.
   - 불필요한 이동이나 잉여 키 입력 없이 Neovim 0.11 및 Vim에서 가장 간결하고 정확한 키 시퀀스를 작성해야 합니다.

4. **검증 및 테스트:**
   - 로컬 개발 서버: `npm run dev`
   - 브라우저 E2E 검증: `npm test`
   - Neovim 실제 실행 검증: `npm run test:nvim` (또는 `node tests/nvim-diff.mjs`)

---

## English

Thank you for contributing new levels and improvements to `nvim-edu`!

### Adding a New Level

1. **Add level definition in `src/levels.js`:**
   Add a new entry to the `levels` array specifying `id`, `chapter`, `title`, `desc`, `keys`, `lang`, `start`, `cursor`, `goal`, and `solution`.
2. **Add English translation in `src/levels.en.js`:**
   Add the matching `id` under `EN.levels` with English `title` and `desc`.
3. **Par rules:**
   The level's par is automatically determined by the token length of the `solution` key sequence. Ensure the solution is the canonical, optimal key combination.
4. **Automated Verification:**
   Run `node tests/nvim-diff.mjs` and `npm test` to verify your solution against real Neovim and the browser editor.

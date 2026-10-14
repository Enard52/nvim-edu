// English text for levels. Same ids as src/levels.js; only the fields listed here are replaced.
// start/goal/cursor are overridden only where the Korean practice text would make no sense in English.
// checks: labels only, in the same order as levels.js (the test functions stay the same).

export const EN = {
  chapters: {
    move: '1. Motions',
    edit: '2. Editing',
    object: '3. Text objects',
    power: '4. Visual · Macros',
    real: '5. Real world: cleaning up AI code',
    tmux: '6. tmux: must-know keys for AI terminals',
    guru: '7. Guru: real-world combos',
  },
  levels: {
    hjkl: {
      title: 'Move with hjkl',
      desc: 'Use <b>h</b>(←) <b>j</b>(↓) <b>k</b>(↑) <b>l</b>(→) instead of the arrow keys. A number in front repeats the motion (<b>4l</b> = 4 to the right). Go to the highlighted cell.',
      keys: ['h', 'j', 'k', 'l', 'count + motion'],
      start: 'hello vim\nmove with hjkl\nno arrow keys\nreach the green cell',
      goal: { cursor: [2, 5] },
    },
    word: {
      title: 'Jump by word: w b e',
      desc: '<b>w</b> next word start, <b>b</b> previous word start, <b>e</b> word end. Much faster than one character at a time. Go to <code>getUser</code>.',
    },
    'line-ends': {
      title: 'Line start and end: 0 ^ $',
      desc: '<b>0</b> very start of the line, <b>^</b> first non-blank character, <b>$</b> end of the line. Go to the end of the line.',
    },
    'file-jump': {
      title: 'Jump in the file: gg G',
      desc: '<b>gg</b> top of the file, <b>G</b> bottom, <b>9G</b> line 9. Go to line 9.',
    },
    'find-char': {
      title: 'Find a character: f t',
      desc: '<b>f(</b> jumps to the next <code>(</code> on the line, <b>t(</b> stops just before it. <b>;</b> repeats, <b>2f(</b> goes to the second one. Go to the parenthesis of <code>isAdmin(</code>.',
    },
    match: {
      title: 'Matching bracket: %',
      desc: '<b>%</b> jumps to the matching bracket. Go to the end of the function block.',
    },
    search: {
      title: 'Search: / n',
      desc: '<b>/word</b> then <b>Enter</b> searches, <b>n</b> next match, <b>N</b> previous match. Go to <code>TODO</code>.',
    },
    x: {
      title: 'Delete a character: x',
      desc: '<b>x</b> deletes the character under the cursor. Fix the two typos.',
    },
    insert: {
      title: 'Insert mode: i a A o',
      desc: '<b>i</b> before the cursor, <b>a</b> after it, <b>A</b> at the end of the line, <b>o</b> on a new line below. <b>Esc</b> goes back to NORMAL mode. Add a semicolon and a log line below.',
    },
    dd: {
      title: 'Delete a line: dd',
      desc: '<b>dd</b> deletes a whole line. Delete the two debug log lines.',
    },
    'cw-dot': {
      title: 'Change a word with cw, repeat with .',
      desc: '<b>cw</b> deletes the word and enters insert mode. <b>.</b> repeats the last change exactly. Fix both <code>lenght</code> typos.',
    },
    yank: {
      title: 'Copy yy · paste p · Ctrl-a',
      desc: '<b>yy</b> copies (yanks) the line, <b>p</b> pastes it below. <b>Ctrl-a</b> increments the number under or after the cursor.',
    },
    'ci-quote': {
      title: 'Change inside quotes: ci"',
      desc: '<b>c</b> (change) + <b>i"</b> (inside quotes). It works even if the cursor is before the quotes on the same line. Change the string to <code>Hello Vim</code>.',
    },
    'di-paren': {
      title: 'Delete inside parentheses: di(',
      desc: '<b>di(</b> deletes everything inside the parentheses. Jump to them with <b>f(</b> first.',
    },
    df: {
      title: 'Delete up to: df dt',
      desc: '<b>df.</b> deletes up to and including the next <code>.</code>; <b>dt.</b> stops just before it. Verb + motion = command: the heart of Vim grammar.',
    },
    dap: {
      title: 'Delete a paragraph: dap',
      desc: '<b>ap</b> means "a paragraph (with its blank line)". Delete the middle section with <b>dap</b>.',
      start: '# Intro\nVim is a modal editor.\n\n# Deprecated\nThis section is outdated.\nPlease remove it.\n\n# Usage\nRun nvim.',
      goal: { text: '# Intro\nVim is a modal editor.\n\n# Usage\nRun nvim.' },
    },
    'visual-indent': {
      title: 'Line select V and indent >',
      desc: 'Select lines with <b>V</b>, indent with <b>></b>. Fix the YAML indentation.',
    },
    'block-insert': {
      title: 'Comment many lines with Ctrl-v',
      desc: '<b>Ctrl-v</b> selects a vertical block. Type with <b>I</b>, press <b>Esc</b>, and the text appears on every line.',
    },
    macro: {
      title: 'Macros: qa … q, @a',
      desc: '<b>qa</b> starts recording, <b>q</b> stops. <b>@a</b> replays, <b>2@a</b> twice. The trick: edit one line and move down to the next while recording.',
    },
    substitute: {
      title: 'Replace everywhere: :%s',
      desc: '<b>:%s/old/new/g</b> replaces in the whole file. Turn the outdated <code>var</code> the AI wrote into <code>const</code>.',
    },
    'global-delete': {
      title: 'Delete matching lines: :g',
      desc: '<b>:g/pattern/d</b> deletes every line that matches. Clean up the <code>console.log</code> lines the AI left everywhere.',
    },
    boss: {
      title: 'Boss: apply an AI code review',
      desc: 'Review comments: ① remove the DEBUG prints ② rename <code>tot</code> → <code>total</code>. Use anything you have learned.',
    },

    'tmux-new': {
      title: 'Start a session: tmux new',
      desc: 'AI agents run for a long time. Run them inside a <b>tmux session</b> so they survive when the terminal closes. Type <code>tmux new -s agent</code> and press Enter.',
      keys: ['tmux new -s name', 'tmux ls'],
      checks: ['Attach to the <code>agent</code> session'],
    },
    'tmux-split': {
      title: 'Split the screen: C-b % and C-b "',
      desc: 'Every tmux key starts with the <b>prefix</b> <kbd>Ctrl-b</kbd>: press it, let go, then press the next key. <b>C-b %</b> splits left/right, <b>C-b "</b> splits top/bottom. Put the agent on the left and two shells on the right.',
      checks: ['Layout: agent | two shells stacked'],
    },
    'tmux-nav': {
      title: 'Move between panes: C-b + arrows',
      desc: '<b>C-b ←↑↓→</b> moves to the neighbouring pane. <b>C-b o</b> next pane, <b>C-b ;</b> last pane, <b>C-b q</b> shows numbers you can type. Go to the agent pane.',
      checks: ['The agent pane is active'],
    },
    'tmux-zoom': {
      title: 'Zoom in: C-b z',
      desc: 'When agent output is hard to read in a narrow pane, <b>C-b z</b> makes that pane fill the screen. Press it again to go back. Go to the agent pane and zoom.',
      checks: ['The agent pane is active', 'Zoomed (Z in the status line)'],
    },
    'tmux-scroll': {
      title: 'Scroll up through output: C-b [',
      desc: 'Mouse-wheel scrolling does not work inside tmux by default. <b>C-b [</b> enters <b>copy mode</b>, where you move with vim keys: <b>k j</b>, <b>C-u C-d</b>, <b>g</b> top, <b>G</b> bottom, <b>q</b> quit. Go to the top of the agent output.',
      checks: ['Cursor on the first line, in copy mode of the agent pane'],
    },
    'tmux-copy': {
      title: 'Copy an error into the other shell',
      desc: 'To look up an error the agent printed, you need to copy it. <b>C-b [</b> → <b>?Error</b> Enter (search up) → <b>Space</b> start selection → <b>$</b> end of line → <b>Enter</b> copy. Go to the right shell and paste with <b>C-b ]</b>. (<code>v</code>/<code>y</code> also work, a popular .tmux.conf setup.)',
      checks: ["<code>Cannot find module 'zod'</code> on the right shell's prompt"],
    },
    'tmux-window': {
      title: 'Windows are tabs: C-b c, C-b ,',
      desc: 'When there are too many panes, add a <b>window</b> (a tab). <b>C-b c</b> new window, <b>C-b ,</b> rename it (clear the old name with <b>C-u</b>). Create a window named <code>test</code>.',
      checks: ['Two windows', 'Current window is named <code>test</code>'],
    },
    'tmux-window-jump': {
      title: 'Jump to a window: C-b 0–9',
      desc: 'The numbers in the status line (<code>0:claude 1:nvim 2:test</code>) are window numbers. <b>C-b 0</b> jumps straight there. Go to window 0, where the agent runs.',
      checks: ['Window 0'],
    },
    'tmux-detach': {
      title: 'Detach and come back',
      desc: 'After <b>C-b d</b> (detach), the agent inside the session keeps working, even if SSH drops. Come back with <code>tmux a</code> (or <code>tmux a -t agent</code>).',
      checks: ['Detach', 'Attach to <code>agent</code> again'],
    },
    'tmux-session': {
      title: 'Switch sessions: C-b s · C-b ( )',
      desc: 'One session per project lets you run several agents side by side. Pick from the list with <b>C-b s</b>, or <b>C-b )</b> next · <b>C-b (</b> previous session. Go to the <code>blog</code> session.',
      checks: ['The <code>blog</code> session'],
    },
    'tmux-kill': {
      title: 'Close a pane: C-b x',
      desc: 'Close a pane you are done with: <b>C-b x</b> then <b>y</b> (or type <code>exit</code> in its shell). Close the bottom-right pane.',
      checks: ['Two panes', 'The agent pane is still alive'],
    },
    'tmux-boss': {
      title: 'Boss: set up your agent workspace',
      desc: 'On your own from scratch: create a <code>work</code> session, start the agent there (<code>claude</code>), then open a shell pane on the right and leave the cursor in it.',
      checks: ['The <code>work</code> session', 'The agent runs in the left pane', 'The right shell pane is active'],
    },
    'guru-rename': {
      title: '[Code] Rename a whole word only: * n .',
      desc: 'Rename <code>user</code> to <code>member</code>, but leave <code>getUser</code> and <code>username</code> alone. <b>*</b> searches for the word under the cursor as a <em>whole word</em>. Fix one with <b>ciw</b>, then <b>n</b> next and <b>.</b> repeat.',
    },
    'guru-log': {
      title: '[Logs] Keep only the error lines: :v',
      desc: '<b>:v/pattern/d</b> is the opposite of <b>:g</b>: it deletes lines that do <em>not</em> match. Keep only the <code>ERROR</code> lines of this agent log.',
    },
    'guru-sort': {
      title: '[Config] Sort and dedupe: :sort u',
      desc: '<b>:sort</b> sorts lines; add <b>u</b> to drop duplicates too. Clean up a <code>.gitignore</code> that got appended to one too many times.',
    },
    'guru-norm': {
      title: '[Config] Edit matching lines: :g + :norm',
      desc: '<b>:g/pattern/norm keys</b> runs NORMAL-mode keys on every matching line. Leave comments and blank lines alone and add <code>export </code> only to the lines with <code>=</code>.',
    },
    'guru-capture': {
      title: '[Code] Restructure with regex groups: \\( \\) \\1',
      desc: 'Whatever <b>\\(…\\)</b> captures can be reused in the replacement as <b>\\1</b> <b>\\2</b>. Migrate the old <code>assertEqual(a, b)</code> tests to <code>expect(a).toBe(b)</code>.',
    },
    'guru-counter': {
      title: '[Docs] Auto-numbered list: macro + Ctrl-a',
      desc: 'Record <b>yyp</b> (duplicate the line) and <b>Ctrl-a</b> (increment the number) as a macro, replay it, and the numbers fill themselves in. Make a 5-step list.',
    },
    'guru-boss': {
      title: 'Boss: fix a commit message in one go',
      desc: 'A commit message written by an agent: ① typo <code>hanlde</code> → <code>handle</code> (<b>xp</b> swaps two characters) ② issue number <code>#41</code> → <code>#42</code> ③ move the <code>Closes</code> line to the bottom (<b>ddp</b> swaps two lines). Finish in as few keys as you can.',
    },
  },
}

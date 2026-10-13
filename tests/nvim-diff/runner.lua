-- nvim --clean --headless -l runner.lua in.json out.json
-- 각 케이스를 새 버퍼에서 실행하고 결과(텍스트, 커서, 모드)를 기록
local cases = vim.json.decode(table.concat(vim.fn.readfile(arg[1]), '\n'))
-- 에디터(CodeMirror) 쪽 들여쓰기 단위가 공백 2칸이라 맞춰 둠
vim.o.shiftwidth = 2
vim.o.expandtab = true
local out = {}
for _, c in ipairs(cases) do
  vim.cmd('enew!')
  vim.bo.undolevels = -1 -- 초기 텍스트는 undo 대상이 아니게
  vim.api.nvim_buf_set_lines(0, 0, -1, false, vim.split(c.text, '\n', { plain = true }))
  vim.bo.undolevels = 1000
  for _, r in ipairs({ '"', 'a', '0', '-' }) do vim.fn.setreg(r, '') end
  vim.api.nvim_win_set_cursor(0, { c.cursor[1] + 1, c.cursor[2] })
  local ok, err = pcall(vim.api.nvim_feedkeys, vim.api.nvim_replace_termcodes(c.keys, true, false, true), 'xtn', false)
  local pos = vim.api.nvim_win_get_cursor(0)
  local mode = vim.api.nvim_get_mode().mode
  table.insert(out, {
    text = table.concat(vim.api.nvim_buf_get_lines(0, 0, -1, false), '\n'),
    cursor = { pos[1] - 1, vim.fn.charcol('.') - 1 }, -- 바이트가 아니라 글자 단위 열
    mode = mode:sub(1, 1) == 'n' and 'n' or mode,
    err = not ok and tostring(err) or nil,
  })
  vim.cmd('silent! normal! \27') -- 혹시 남은 모드 정리
end
vim.fn.writefile({ vim.json.encode(out) }, arg[2])

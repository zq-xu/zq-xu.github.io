---
paths:
  - "docs/**"
  - "DOCUMENT_GUIDE.md"
---

# 文档生成规则（本仓库）

本仓库的写作与结构规范见根目录 `DOCUMENT_GUIDE.md`；涉及文档增删改时遵循它，并同时遵守全局 Token 节约规则。

- 新增/重写文档：先给目录级大纲（Plan 模式，≤300 token）待确认，再切 Act 模式用 `write_to_file` 一次性落盘，不在对话框预印正文。
- 局部修改：只用 `replace_in_file` 做最小范围替换，不整文件重写。
- 不批量整篇读取系列文档；按需定位（`search_codebase` + 行范围读取）。
- 交付检查只执行与本次改动相关的 `DOCUMENT_GUIDE.md` 第 9 节条目，跑命令取结论，不复述规则原文。
- 完成后回复格式：`路径 —— 变更点`，一句话。

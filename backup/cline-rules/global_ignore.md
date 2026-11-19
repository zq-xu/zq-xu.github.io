# 全局文件读取与忽略规则

在进行任何文件检索、扫描或代码修改时，请强制跳过以下目录和文件，绝不要读取它们的内容：

1. **依赖与构建产物**：
   - node_modules/
   - dist/
   - bin/
   - build/
   - .next/
   - target/
   - __pycache__/
   - venv/ / .venv/

2. **锁定与日志大文件**：
   - package-lock.json
   - yarn.lock
   - pnpm-lock.yaml
   - *.log

3. **敏感文件**：
   - .env
   - .env.*
   - *.pem
   - *.key

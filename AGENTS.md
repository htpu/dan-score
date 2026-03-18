# AGENTS.md - 开发指南

## 项目概述

这是一个基于 **Vite 和 React 19** 开发的掼蛋计分器应用。使用 React Hooks 进行状态管理，采用 Tailwind CSS 进行样式设计。项目遵循移动端优先的设计原则。

---

## 常用命令

### 开发
- **启动开发服务器**: `npm run dev`
- **构建生产版本**: `npm run build`
- **预览构建结果**: `npm run preview`

### 测试
- **手动测试**: 在移动端浏览器或模拟器中打开应用。测试完整的游戏流程（计分、撤销、重置、主题切换、队伍预设）。
- **逻辑验证**: 确保“过 A”逻辑和“三次不过 A”处罚机制按预期运行。

### 代码检查
- **运行 ESLint**: `npm run lint`
- **配置**: `eslint.config.js` 遵循标准的 React 和 Vite 规则。

---

## 代码风格指南

### 通用原则
- 使用 **函数组件** 和 React Hooks (`useState`, `useEffect`, `useMemo`)。
- 使用 **Tailwind CSS** 处理所有样式。除非是动态值，否则避免使用内联样式。
- 遵循 **移动端优先** (Mobile First) 的设计原则。

### 命名规范
- **组件**: PascalCase (`App`, `PokerBackground`)
- **常量**: UPPER_SNAKE_CASE (`LEVELS`, `TEAM_PRESETS`)
- **函数/变量**: camelCase (`handleRankSelect`, `gameState`)
- **事件处理**: 以 `handle` 为前缀 (`handleUndo`, `handleFullReset`)
- **状态设置**: 以 `set` 为前缀 (`setGameState`, `setSettings`)

### 格式要求
- 缩进: **2 个空格**
- 行宽: 尽量保持单行在 120 字符以内
- JSX 属性: 当存在多个属性时，建议每行一个以提高可读性。
- 使用尾随逗号 (Trailing commas)。

### 状态管理
- 使用 `useState` 处理组件局部状态。
- 使用 `localStorage` 进行数据持久化，采用版本化键名（如 `guandan_game_state_v8`）。
- 同时在 `localStorage` 中存储游戏状态和用户设置。

### 错误处理
- 在事件处理器中验证输入有效性。
- 访问深层属性时使用可选链 (`?.`)。
- 在解析 `localStorage` 数据时使用 `try-catch` 包裹 `JSON.parse`。

---

## 关键文件

| 文件 | 用途 |
|------|---------|
| `src/App.jsx` | 主应用逻辑和 UI |
| `src/main.jsx` | 入口文件 |
| `index.html` | 根 HTML 模板 |
| `vite.config.js` | Vite 配置文件 |
| `掼蛋计分器需求文档.md` | 需求文档 |

---

## 游戏逻辑参考

- **级别**: `['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']`
- **升级规则**: 双下 (+3), 单下 (+2), 小胜 (+1 或 0), 平局 (0)
- **过 A 判定**: 在 A 级时必须拿第一且队友不是最后一名。
- **惩罚机制**: 可选“三次冲 A 失败回退至 2 级”。

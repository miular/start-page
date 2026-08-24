# Start Page — 第二阶段开发阶段报告

**报告日期:** 2026-08-24
**项目版本:** v0.4 → v0.5（工作区 + 终端 + 书签分类）
**下一阶段目标:** v1.0 MVP 冻结 / 质量收口（测试、错误恢复、可访问性）

---

## 一、本轮已完成功能清单

| 功能 | 来源 | 状态 |
|------|------|------|
| 书签分类/分组（侧边栏分类栏 + 分类增删改） | v1.1 个性化 | ✅ 完成 |
| 书签拖拽排序（HTML5 Drag & Drop） | v1.1 个性化 | ✅ 完成 |
| 最近使用书签（`lastUsedAt` 追踪 + 首屏「最近」区） | 用户新增 | ✅ 完成 |
| Workspace 工作区（Markdown 编辑器 + 终端 双页签） | 用户新增 | ✅ 完成 |
| Markdown 编辑器（CodeMirror 6，实时预览，滚动同步，GFM） | 用户新增 | ✅ 完成 |
| 本地终端（xterm.js + node-pty 守护进程） | 用户新增 | ✅ 完成 |
| 终端会话管理（多会话 / 空闲回收 / 断线恢复） | 用户新增 | ✅ 完成 |
| 终端安全（Origin 校验 + 恒定时间 Token 比对） | 用户新增 | ✅ 完成 |
| 图标系统扩展（lucide-react + 分类图标选择器） | 用户新增 | ✅ 完成 |
| 壁纸扩充（5 张 → 12 张） | 用户新增 | ✅ 完成 |
| 书签数据迁移（`category` → `categoryId`，兼容旧数据） | 数据兼容 | ✅ 完成 |
| 单元测试补充（`color-extract` 7 个用例） | 质量 | ✅ 完成 |

---

## 二、核心实现说明

### 2.1 侧边栏 + 分类（`src/features/sidebar/Sidebar.tsx`）
- 左侧分类「抽屉栏」（rail）+ 右侧分类面板（panel）双栏结构
- 分类与书签均支持增删改；书签通过 HTML5 拖拽在分类内重排
- 数据模型扩展：`Bookmark.categoryId` / `lastUsedAt`，`Category`（`src/types/domain.ts`）
- `AppShell.tsx` 内实现旧数据迁移（`category` → `categoryId`）与默认分类/默认书签合并逻辑

### 2.2 最近使用（`src/features/recent/RecentBookmarks.tsx`）
- 每次打开书签写入 `lastUsedAt`，按时间倒序取前 5 条展示于首屏

### 2.3 Workspace（`src/features/workspace/`）
- 第二屏「工作区」：`Markdown` 与 `PowerShell` 两个页签切换
- **MarkdownPane**：CodeMirror 6（`@uiw/react-codemirror`）编辑 + `react-markdown` + `remark-gfm` 实时预览，双栏滚动比例同步（`syncingRef` 防止回环），自定义标题行装饰插件，内容 500ms 防抖持久化到 localStorage
- **TerminalPane**：xterm.js（`@xterm/xterm` + `fit` + `web-links`），`ResizeObserver` 自适应尺寸并回传列/行，支持会话恢复

### 2.4 终端守护进程（`server/`）
- `daemon.mjs` — WS 服务 + 首次 `hello` 握手认证，10 秒认证超时
- `security.mjs` — Origin 白名单（localhost/127.0.0.1）+ 常量时间 Token 比对（防时序攻击）
- `session.mjs` — 基于 `node-pty` 的会话池：最大 4 会话、30 分钟空闲回收、断线后按 `sessionId` 恢复
- `config.mjs` — 端口 5517、Shell 固定 `powershell.exe`、Origin 白名单集中配置
- 前端 `src/lib/terminal/` — `client.ts`（WS 客户端 + 30s ping 心跳）、`token.ts`、`session.ts`（Token/会话/Markdown 持久化）

### 2.5 图标系统（`src/ui/icon/Icon.tsx`）
- 由手绘 SVG 切换为 `lucide-react`，内置 30+ 图标，导出 `iconRegistry` 供分类图标选择器使用

---

## 三、未完成 / 偏离项

### 未开始（沿用上轮债务）
- **E2E 测试** — Playwright 已安装、`test:e2e` 脚本已配，仍无任何 e2e 用例
- **Visual regression** — 未配置
- **WCAG 2.2 AA 完整审计** — 仍仅键盘导航 + focus-visible
- **ADR 文档化** — 仍未记录（本轮新增终端/工作区为重大架构决策）

### 本轮新增偏离 / 取舍
- **终端依赖本地守护进程**：前端无法独立运行，需 `node server/daemon.mjs` 常驻；原生模块 `node-pty` 需按平台编译（Windows 依赖 build tools）
- **Shell 硬编码 `powershell.exe`**：未做跨平台 shell 探测，macOS/Linux 需改 `config.mjs`
- **Workspace 与「开始页」定位偏离**：Markdown/终端使产品从「轻量导航页」转向「桌面工作台」，功能边界扩大，需在下轮确认产品定位

---

## 四、技术债务

### 代码质量（新增）
1. **`BookmarkList.tsx` 成为死代码** — AppShell 改用 Sidebar 后，`features/bookmarks/BookmarkList/BookmarkItem` 已无引用（`index.ts` 仍导出），应删除
2. **`AppShell.tsx`（275 行）继续膨胀** — 数据迁移/合并逻辑（`loadBookmarks`/`loadCategories`）内联在组件文件，应提取到 `lib/storage/migrations.ts` 或自定义 hook
3. **`app.css`（26KB，本轮 +717 行）** — 仍单文件，侧边栏/最近/首屏布局样式未拆分
4. **`server/config.mjs` 端口/Shell 写死** — 无环境变量覆盖，无图形化引导（用户需手动 `node server/daemon.mjs` 并在设置粘贴 Token）

### 代码质量（沿用上轮，未解决）
5. **`set-state-in-effect` 警告** — `use-wallpaper.ts` 仍 3 处警告（必要模式，需重构或显式 suppress）
6. **`use-wallpaper-color.ts` / `use-wallpaper.ts` 未防御 SSR/无 DOM 环境**
7. **`import.meta.glob` 壁纸路径硬编码** — 无法动态扩展，且与 `selected-wallpaper` 存储的内部路径耦合

### 测试缺口
8. **终端全链路（client + daemon + session）无测试** — `node-pty`/WebSocket 依赖真实进程，需 mock
9. **Sidebar 拖拽重排、分类 CRUD 无测试**
10. **MarkdownPane / TerminalPane 无测试**
11. **`extractWallpaperColor`（Canvas 依赖）仍无法在 Vitest 下测试**（已测 `rgbToHsl`/`deriveGlassTokens`）

### 数据层
12. **无 schema version 迁移机制** — `Persisted<T>` 已定义仍未使用；`category`→`categoryId` 迁移是手写了一次性代码，未来字段变更无版本化保障
13. **终端 Token 明文存 localStorage** — 无加密/过期机制，XSS 下可被读取（与「仅回环地址 + Origin 校验」配合可接受，但需记录风险）

---

## 五、架构边界检查

### 模块状态良好
- `src/lib/terminal/` — 客户端/Token/会话三文件职责清晰，`client.ts` 与 UI 解耦（事件回调）
- `server/` — 四文件单一职责（config / security / session / daemon），无框架依赖，可独立测试
- `src/features/workspace/` — Workspace(容器) / Tabs / MarkdownPane / TerminalPane 拆分合理
- `src/lib/wallpaper/` — 导出面收敛（`index.ts`），颜色/列表/注入已初步模块化

### 需要重构
- 删除 `features/bookmarks/` 死代码
- `AppShell.tsx` 数据迁移/合并逻辑外提
- `app.css` 拆分（`sidebar.css`、`recent.css`、`workspace.css` 已独立，其余待拆）
- `server/config.mjs` 引入环境变量 + 交互式引导（首次运行自动打印/引导 Token 配置）

---

## 六、下一轮可选方向（优先级排序）

| 优先级 | 方向 | 类型 | 预估工作量 |
|--------|------|------|-----------|
| P0 | 删除死代码 BookmarkList + AppShell 逻辑外提 | 技术债 | 0.5d |
| P0 | ErrorBoundary + 错误恢复 | v1.0 稳定 | 0.5d |
| P0 | E2E 测试（首屏 + 侧边栏 + 设置核心路径） | v1.0 质量 | 2d |
| P1 | 终端跨平台 Shell 探测 + 配置化 | v1.1 个性化 | 0.5d |
| P1 | 书签导入/导出 JSON | v1.1 个性化 | 1d |
| P1 | 自定义主题色（accent） | v1.1 个性化 | 1.5d |
| P1 | schema version 迁移机制落地 | 数据稳健 | 1d |
| P2 | Markdown 多文档/文件管理 | 工作区增强 | 1.5d |
| P2 | 终端分屏 / 多会话 UI | 工作区增强 | 2d |
| P2 | 壁纸轮换策略（每日/每次/手动） | 未规划 | 1d |
| P3 | 高级玻璃效果（SVG 折射） | v1.2 高级玻璃 | 2d |

---

## 附：项目统计

| 指标 | 数值 |
|------|------|
| 源文件数 | 69（`src/`）+ 4（`server/`）= 73 |
| 测试文件 / 用例 | 6 / 23（全部通过，100%） |
| Lint | oxlint 0 error / 3 warning（均为 `set-state-in-effect`） |
| CSS 行数 | app.css 26KB + workspace.css 5.8KB + glass/themes/tokens/globals |
| 壁纸数量 | 12 张图片 |
| 新增依赖 | CodeMirror 6、@uiw/react-codemirror、xterm、react-markdown、remark-gfm、node-pty、ws、lucide-react |
| 终端架构 | WS `ws://127.0.0.1:5517`，最多 4 会话，30min 空闲回收 |
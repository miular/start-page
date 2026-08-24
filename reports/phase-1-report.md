# Start Page — 第一阶段开发阶段报告

**报告日期:** 2026-08-23
**项目版本:** v0.2 → v0.4 规范实现
**下一阶段目标:** v1.0 MVP 冻结 / v1.1 个性化扩展

---

## 一、已完成功能清单

| 功能 | 对应规范 | 状态 |
|------|----------|------|
| 实时时钟/日期 | v0.2 MVP | ✅ 完成 |
| 每日诗词（随机） | v0.2 MVP | ✅ 完成（改为随机，非按日期） |
| 网页搜索 + 搜索引擎切换 | v0.2 MVP | ✅ 完成 |
| 书签 CRUD（添加/编辑/删除/排序） | v0.2 MVP | ✅ 完成 |
| 书签持久化（localStorage） | v0.2 MVP | ✅ 完成 |
| Light/Dark/System 主题切换 | v0.2 MVP | ✅ 完成 |
| 设置对话框 | v0.2 MVP | ✅ 完成 |
| GlassSurface 毛玻璃组件 | v0.2 MVP | ✅ 完成 |
| 能力检测 + 渐进降级 | v0.2 MVP | ✅ 完成 |
| 全局快捷键（/ 和 ⌘K 聚焦搜索） | v0.2 MVP | ✅ 完成 |
| 键盘导航 + focus-visible | v0.2 MVP | ✅ 完成 |
| 响应式布局（桌面/平板/手机） | v0.2 MVP | ✅ 完成 |
| reduced-motion 支持 | v0.2 MVP | ✅ 完成 |
| reduced-transparency 支持 | v0.2 MVP | ✅ 完成 |
| 壁纸功能（随机图片/视频） | 用户新增 | ✅ 完成 |
| 壁纸感知材质（颜色采样） | 用户新增 | ✅ 完成 |
| 壁纸径向渐变遮罩 | 用户新增 | ✅ 完成 |
| 自定义壁纸选择（设置面板） | 用户新增 | ✅ 完成 |
| Liquid Glass 图标组件 | 用户新增 | ✅ 完成 |
| 统一 UI 控件风格（Radio/Toggle/Scrollbar） | 用户新增 | ✅ 完成 |
| 底部引用毛玻璃 + 边缘渐隐 | 用户新增 | ✅ 完成 |
| 单元测试（25 个） | v0.2 规范 | ✅ 完成 |

---

## 二、未完成 / 偏离规范

### 未开始
- **E2E 测试** — Playwright 已安装但未配置，未编写任何 e2e 测试
- **Visual regression 测试** — 未配置
- **Accessibility 完整 audit** — 仅做了键盘导航和 focus-visible，未做 WCAG 2.2 AA 完整审计
- **ADRs 文档化** — 实际实现中做了若干偏离 v0.3 决策的修改（如添加了壁纸功能），未记录 ADR

### 偏离规范
- 壁纸功能不在 v0.2 MVP 范围内，属于用户新增需求
- 引用改为随机而非按日期确定性选择（规范要求 deterministic）
- 壁纸感知材质使用了 Canvas 采样，规范中未提及此实现方式
- 项目未使用 pnpm workspace 特性（v0.3 建议 pnpm，但未用 workspace）

---

## 三、技术债务

### 代码质量
1. **`use-wallpaper.ts`** — oxlint 始终报 `set-state-in-effect` 警告（必要模式，但需消除警告）
2. **`app.css`** — 718 行，单一文件过大，应拆分（`settings.css`、`wallpaper.css`、`bookmark.css`）
3. **`wallpaper/` 模块** — 职责膨胀：列表管理、随机选择、颜色采样、CSS 变量注入，应拆分
4. **`color-extract.ts`** — Canvas 采样在 SSR/无 DOM 环境会抛错，未做防御
5. **`import.meta.glob` 硬编码路径** — 壁纸路径 `/wallpaper/*.{jpg,...}` 不可配置，无法动态扩展

### 测试缺口
6. **`color-extract.ts`** 的 `extractWallpaperColor` 函数（依赖 Canvas）未测试
7. **`use-wallpaper-color.ts`** hook 未测试（依赖 DOM API）
8. **`use-wallpaper.ts`** hook 未测试（依赖 Image 加载）
9. **`wallpaper-list.ts`** 的 `import.meta.glob` 无法在 Vitest 环境下测试

### 数据层
10. **无 schema version 迁移** — `storage/adapter.ts` 有 `Persisted<T>` 类型但未在 storage key 中实际使用
11. **`selected-wallpaper`** 存储 raw path，但路径是 `import.meta.glob` 的内部格式，更换构建工具可能失效
12. **无错误边界（ErrorBoundary）** — 任何组件崩溃会导致整个页面白屏

---

## 四、用户反馈总结（设计偏好提炼）

本轮开发中用户反复调整的设计方向，总结为下轮无需再试错的偏好：

| 偏好 | 说明 |
|------|------|
| 核心文字保持纯文本 | 时钟/日期不使用玻璃容器，直接文字显示 |
| 玻璃用于交互层 | 搜索框、书签、设置选项、图标使用毛玻璃 |
| 引用底部 + 边缘渐隐 | 毛玻璃 + `mask` 径向渐变，四边自然融合 |
| 壁纸遮罩柔和 | 径向渐变从中心极淡到边缘完全覆盖，不割裂 |
| 控件风格统一 | 所有 radio/toggle/button/input 使用同一套玻璃设计语言 |
| 滚动条不显示 | 隐藏滚动条但保留滚轮滚动 |
| 高对比度优先 | 文字用 `--text-primary` + `text-shadow`，不用降低对比度换取视觉效果 |
| 壁纸随机 | 每次刷新随机选，视频壁纸与图片壁纸同等待遇 |

---

## 五、架构边界检查

### 模块状态良好
- `src/lib/storage/adapter.ts` — 接口隔离干净，替换实现不影响上层
- `src/lib/search/search-service.ts` — 纯函数，无副作用，可测试
- `src/ui/glass/GlassSurface.tsx` — 组件单一职责，消费方不感知渲染实现
- `src/ui/glass/use-glass-renderer.ts` — 能力检测逻辑集中，不散落

### 需要重构
- `src/app.css`（718 行）→ 拆分为 `features/settings/settings.css`、`wallpaper.css` 等
- `src/lib/wallpaper/`（5 个文件，职责交叉）→ 拆分颜色/列表/注入为独立模块
- `src/app/AppShell.tsx`（159 行）→ 状态管理逻辑可提取自定义 hook
- `src/features/settings/SettingsDialog.tsx`（107 行）→ 壁纸选择器可拆为子组件

---

## 六、下一轮可选方向（优先级排序）

| 优先级 | 方向 | 对应 roadmap | 预估工作量 |
|--------|------|-------------|-----------|
| P0 | E2E 测试 + Playwright 配置 | v1.0 质量 | 2d |
| P0 | ErrorBoundary + 错误恢复 | v1.0 稳定 | 0.5d |
| P1 | 书签分类/分组 + 拖拽排序 | v1.1 个性化 | 2d |
| P1 | 数据导入/导出 JSON | v1.1 个性化 | 1d |
| P1 | 自定义主题色（accent） | v1.1 个性化 | 1.5d |
| P2 | 本地搜索历史/联想 | 未规划 | 1.5d |
| P2 | 便签/临时草稿 | 未规划 | 1d |  #原本计划，用户认为没有必要因此不做了
| P2 | 引用语言切换（中/英） | 未规划 | 0.5d |
| P3 | 壁纸轮换策略（每日/每次/手动） | 未规划 | 1d |
| P3 | 高级玻璃效果（SVG 折射） | v1.2 高级玻璃 | 2d |

---

## 附：项目统计

| 指标 | 数值 |
|------|------|
| 源文件数 | 57 |
| 测试数 | 25 |
| 测试通过率 | 100% |
| CSS 行数 | 718（app.css）+ 212（glass.css） |
| 壁纸数量 | 5 张图片 + 1 个视频 |
| 依赖数 | 135 |
| 构建产物大小 | CSS: 21KB / JS: 211KB / 壁纸: ~45MB |
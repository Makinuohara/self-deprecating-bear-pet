# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

## 5. Output Quality

- Don't repeat the same conclusion or content twice in one reply — outline before writing.
- Avoid mixing Chinese and English in the same table — pick one language for consistent column alignment.

## 6. Superpowers Skills

**在开始任何任务前，必须检查是否有相关技能可用。**

技能库路径: `~/.claude/skills/superpowers/`

**使用流程：**
1. 用 `find-skills [关键词]` 搜索相关技能
2. 如果找到相关技能，用 Read 工具读取完整的 SKILL.md
3. 宣布: "我正在使用 [技能名称] 技能来 [目的]"
4. 严格按照技能说明执行

**常用技能：**
- `brainstorming` — 头脑风暴，将想法转化为设计
- `systematic-debugging` — 系统化调试，找到根本原因
- `test-driven-development` — 测试驱动开发
- `writing-plans` — 编写实施计划
- `verification-before-completion` — 完成前验证
- `when-stuck` — 卡住时的突破方法
- `root-cause-tracing` — 根因分析
- `receiving-code-review` — 接受代码审查
- `requesting-code-review` — 请求代码审查

**关键规则：**
- 技能存在时必须使用，不能跳过
- 有 checklist 的技能必须用 TodoWrite 跟踪每个步骤
- 不要凭记忆使用技能，每次都要读取最新版本

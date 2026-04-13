# Timeout - Break Reminder Plugin for Claude Code

A lightweight plugin that estimates how long your tasks will take and reminds you to step away while Claude works. Reduce passive screen time during AI-assisted coding.

## Install

```bash
# Add the marketplace
claude plugin marketplace add timeout-plugin --source github --repo almandsky/timeout

# Install the plugin
claude plugin install timeout@timeout-plugin --scope user
```

Then restart your Claude Code session.

## How It Works

**Task estimation** — Every time you send a prompt, Claude estimates how long the task will take. If it's 3+ minutes, Claude tells you the estimate and suggests stepping away.

**Timer** — When you confirm a task, Claude opens a Google timer in your browser so you know when to come back.

**Work-in-progress reminders** — A `PostToolUse` hook monitors how long Claude has been working. If it's been 3+ minutes since your last message, you'll see a reminder in the terminal to step away.

**Session duration reminders** — After 30 and 60 minutes of continuous session time, Claude suggests a break.

## Skills

| Skill | Description |
|-------|-------------|
| `/break [minutes]` | Open a break timer in the browser (default: 5 min) |
| `/timeout-status` | Show session duration, prompt count, and break history |
| `/timeout-settings` | View or modify plugin configuration |

## Configuration

Settings are stored in `~/.timeout-plugin/config.json` and can be modified via `/timeout-settings`.

| Setting | Default | Description |
|---------|---------|-------------|
| `enabled` | `true` | Enable/disable the plugin |
| `reminder_thresholds_minutes` | `[30, 60]` | Session durations that trigger break reminders |
| `default_break_minutes` | `5` | Default break duration |
| `complexity_warning_cooldown_seconds` | `300` | Cooldown between session duration reminders |

## Architecture

```
.claude-plugin/
  plugin.json             — Plugin manifest
  marketplace.json        — Marketplace metadata
hooks/
  hooks.json              — Wires SessionStart, UserPromptSubmit, PostToolUse, Stop
scripts/
  lib.js                  — Shared state/config utilities
  session_start.js        — Initialize session tracking
  on_prompt.js            — Task estimation + session duration reminders
  on_tool_use.js          — Work-in-progress reminders (fires during active work)
  on_stop.js              — Update turn count after each response
  session_status.js       — Display session stats
  record_break.js         — Record break and reset reminders
skills/
  break/SKILL.md          — /break command
  timeout-status/SKILL.md — /timeout-status command
  timeout-settings/SKILL.md — /timeout-settings command
```

## Hooks

| Hook | Event | Purpose |
|------|-------|---------|
| `SessionStart` | Session begins | Initialize tracking state |
| `UserPromptSubmit` | User sends prompt | Estimate task duration, suggest breaks |
| `PostToolUse` | After each tool call | Remind user to step away during long tasks |
| `Stop` | Claude finishes | Update turn count |

## Uninstall

```bash
claude plugin uninstall timeout@timeout-plugin
```

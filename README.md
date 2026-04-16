# Timeout - Break Reminder Plugin for Claude Code

A lightweight plugin that estimates task duration, automatically opens a timer, and reminds you to step away while Claude works. Reduce passive screen time during AI-assisted coding.

## Install

```bash
claude plugin marketplace add timeout-plugin --source github --repo almandsky/timeout
claude plugin install timeout@timeout-plugin --scope user
```

Restart your Claude Code session to activate.

## How It Works

1. **You send a task** — Claude estimates how long it will take.
2. **Auto timer** — If 3+ minutes, Claude opens a Google timer in your browser and starts working immediately. No confirmation needed.
3. **Terminal reminders** — While Claude works, you'll see `⏰ [Timeout]` reminders every 3 minutes in your terminal if you're still watching.
4. **Session reminders** — After 30 and 60 minutes of continuous session time, you'll get a nudge to take a break.

## Skills

| Skill | Description |
|-------|-------------|
| `/break [minutes]` | Manually open a break timer (default: 5 min) |
| `/timeout-status` | Show session stats |
| `/timeout-settings` | Configure the plugin |

## Configuration

Run `/timeout-settings` or edit `~/.timeout-plugin/config.json`:

| Setting | Default | Description |
|---------|---------|-------------|
| `enabled` | `true` | Enable/disable the plugin |
| `reminder_thresholds_minutes` | `[30, 60]` | Session duration reminders |
| `default_break_minutes` | `5` | Default break duration |

## Uninstall

```bash
claude plugin uninstall timeout@timeout-plugin
```

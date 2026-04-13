---
name: timeout-settings
description: View or configure timeout plugin settings (thresholds, timer behavior, break duration)
allowed-tools: Bash Read Write
argument-hint: "[setting value]"
---

Help the user view or configure the timeout plugin.

## Current config

```!
cat ~/.timeout-plugin/config.json 2>/dev/null || echo "No config found - using defaults"
```

## Available settings

| Setting | Type | Description |
|---------|------|-------------|
| `enabled` | bool | Enable or disable the plugin entirely |
| `reminder_thresholds_minutes` | list of ints | Session durations that trigger reminders (default: [30, 60]) |
| `default_break_minutes` | int | Default break duration in minutes |
| `complexity_warning_cooldown_seconds` | int | Minimum seconds between task estimation prompts |

## Instructions

User request: $ARGUMENTS

- If no arguments provided, display the current settings in a readable format and explain each briefly.
- If the user wants to change a setting, read the config file at `~/.timeout-plugin/config.json`, modify the requested value, and write it back.
- Validate inputs: thresholds should be positive integers, booleans should be true/false, etc.
- After making changes, confirm what was updated.

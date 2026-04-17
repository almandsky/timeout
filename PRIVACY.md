# Privacy Policy — Timeout Plugin

## Overview

The Timeout plugin runs entirely on your local machine. It does not collect, transmit, or share any data with external servers or third parties.

## Data Stored Locally

All data is stored in `~/.timeout-plugin/` on your filesystem:

| File | Contents |
|------|----------|
| `session_state.json` | Current session ID, start time, last activity timestamp, prompt count, turn count, tool use count, breaks taken, and reminder levels |
| `config.json` | Your plugin settings (enabled flag, reminder thresholds, default break duration, cooldown interval) |

No conversation content, code, prompts, or personal information is stored. Only numeric counters and timestamps are persisted.

## Network Activity

The plugin itself makes **no network requests**. The only external interaction is opening a Google Search timer URL (`https://www.google.com/search?q=timer+for+N+minutes`) in your default browser when a break timer is triggered. This is a standard browser navigation subject to your browser's own privacy settings.

## Data Retention

- **Session state** is overwritten at the start of each new Claude Code session. No historical session data is retained.
- **Config** persists until you change or delete it.

## Uninstall & Data Removal

To remove all plugin data:

```bash
rm -rf ~/.timeout-plugin
```

## Changes

Any changes to this policy will be reflected in this file and noted in the plugin's release notes.

---
name: timeout-status
description: Show current session duration, prompt count, and break history
allowed-tools: Bash Read
---

Show the user their current timeout plugin session statistics.

## Current stats

```!
node ${CLAUDE_SKILL_DIR}/../../scripts/session_status.js
```

## Instructions

Display the stats above in a clean, readable format. Keep it concise - just the facts.

If the session has been going for a while (30+ minutes), gently mention they could use `/break` to start a timer.

---
name: break
description: Start a break timer and step away from the screen. Use when the user wants to take a break, or when the timeout plugin suggests one.
allowed-tools: Bash Read
argument-hint: "[minutes]"
---

The user wants to take a break from their coding session.

## Current session stats

```!
node ${CLAUDE_SKILL_DIR}/../../scripts/session_status.js
```

## Instructions

1. Show the user a brief summary of their session (duration and prompt count from the stats above).

2. Determine break duration:
   - If the user provided a number as an argument, use that: $ARGUMENTS
   - Otherwise suggest 5 minutes as default and ask if that works, or just go with it.

3. Open a timer in their browser:
   ```
   open "https://www.google.com/search?q=timer+for+N+minutes"
   ```
   Replace N with the break duration.

4. Record the break:
   ```
   node ${CLAUDE_SKILL_DIR}/../../scripts/record_break.js
   ```

5. Send them off with a brief, warm message. Let them know their session will be here when they get back.

Keep the tone supportive and casual. Don't lecture about health. Just make stepping away feel easy and natural.

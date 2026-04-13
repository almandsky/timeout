#!/usr/bin/env node
const { readHookInput, loadState, saveState, loadConfig, formatDuration } = require("./lib");

try {
  readHookInput();
  const state = loadState();

  if (!state) {
    process.stdout.write(JSON.stringify({ continue: true }));
    process.exit(0);
  }

  const config = loadConfig();
  if (!config.enabled) {
    process.stdout.write(JSON.stringify({ continue: true }));
    process.exit(0);
  }

  const now = Date.now() / 1000;
  state.last_activity = now;

  // Track time since last user prompt (i.e., how long Claude has been working)
  const taskStart = state.last_prompt_time || state.session_start || now;
  const taskElapsed = now - taskStart;
  const taskMinutes = taskElapsed / 60;

  const result = { continue: true };

  // If Claude has been working for 3+ minutes and we haven't reminded yet for this task
  if (taskMinutes >= 3 && !state.task_reminder_shown) {
    const rounded = Math.round(taskMinutes);
    result.systemMessage =
      `[Timeout] Claude has been working for ${rounded} minutes. ` +
      `You can step away — use /break ${rounded + 2} to set a timer.`;

    result.hookSpecificOutput = {
      hookEventName: "PostToolUse",
      additionalContext:
        `[Timeout Plugin] You have been working on this task for ${rounded} minutes. ` +
        `Briefly remind the user they can step away while you continue — mention /break. One sentence max.`,
    };

    state.task_reminder_shown = true;
  }

  saveState(state);
  process.stdout.write(JSON.stringify(result));
} catch {
  process.stdout.write(JSON.stringify({ continue: true }));
}

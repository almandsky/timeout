#!/usr/bin/env node
const { readHookInput, loadState, saveState, loadConfig, output } = require("./lib");

try {
  readHookInput();
  const state = loadState();

  if (!state) {
    output({ continue: true });
    process.exit(0);
  }

  const config = loadConfig();
  if (!config.enabled) {
    output({ continue: true });
    process.exit(0);
  }

  // Show a one-time reminder per prompt when Claude creates tasks
  if (!state.task_reminder_shown_this_prompt) {
    state.task_reminder_shown_this_prompt = true;
    saveState(state);
    output({
      systemMessage:
        `⏰ [Timeout] Claude is planning multi-step work. ` +
        `Step away and use /break to set a timer.`,
    });
  } else {
    output({ continue: true });
  }
} catch {
  output({ continue: true });
}

#!/usr/bin/env node
const { readHookInput, saveState, ensureConfig, output } = require("./lib");

try {
  const input = readHookInput();

  saveState({
    session_id: input.session_id || "",
    session_start: Date.now() / 1000,
    last_activity: Date.now() / 1000,
    prompt_count: 0,
    turn_count: 0,
    last_reminder_level: 0,
    last_complexity_warning: 0,
    breaks_taken: 0,
  });

  ensureConfig();
  output({ continue: true });
} catch {
  output({ continue: true });
}

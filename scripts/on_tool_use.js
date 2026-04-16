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
  state.tool_use_count = (state.tool_use_count || 0) + 1;
  state.last_activity = now;

  const result = { continue: true };

  // --- Task-level reminder: time since last user prompt ---
  const taskStart = state.last_prompt_time || state.session_start || now;
  const taskMinutes = (now - taskStart) / 60;
  const lastTaskReminder = state.last_task_reminder_time || 0;
  const taskReminderCooldown = 3; // remind every 3 minutes of continuous work

  if (taskMinutes >= 3 && (now - lastTaskReminder) / 60 >= taskReminderCooldown) {
    const rounded = Math.round(taskMinutes);
    // systemMessage shows directly in the user's terminal — no Claude dependency
    result.systemMessage =
      `⏰ [Timeout] Claude has been working for ${rounded} minutes. ` +
      `Step away — use /break ${Math.min(rounded + 2, 15)} to set a timer.`;

    state.last_task_reminder_time = now;
  }

  // --- Session-level reminder: total session time ---
  const sessionMinutes = (now - (state.session_start || now)) / 60;
  const thresholds = config.reminder_thresholds_minutes || [30, 60];
  let lastLevel = state.session_reminder_level || 0;

  for (let i = 0; i < thresholds.length; i++) {
    const level = i + 1;
    if (sessionMinutes >= thresholds[i] && lastLevel < level) {
      const duration = formatDuration(now - state.session_start);
      result.systemMessage =
        `⏰ [Timeout] Session active for ${duration}. ` +
        `Time for a break — use /break to set a timer.`;
      state.session_reminder_level = level;
    }
  }

  saveState(state);
  process.stdout.write(JSON.stringify(result));
} catch {
  process.stdout.write(JSON.stringify({ continue: true }));
}

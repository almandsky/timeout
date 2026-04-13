#!/usr/bin/env node
const { readHookInput, loadState, saveState, loadConfig, output, formatDuration } = require("./lib");

try {
  const input = readHookInput();
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

  const now = Date.now() / 1000;
  state.prompt_count = (state.prompt_count || 0) + 1;
  state.last_activity = now;
  state.last_prompt_time = now;
  state.task_reminder_shown = false;

  const messages = [];
  const prompt = input.prompt || "";

  // --- Primary: Let Claude estimate task duration on every prompt ---
  if (prompt.length > 0) {
    messages.push(
      `[Timeout Plugin] Before responding, quickly estimate how long this task will take you to complete. ` +
      `If your estimate is 3 minutes or more: ` +
      `(1) Tell the user your estimate in one sentence, ` +
      `(2) clarify any requirements if needed, ` +
      `(3) tell the user you'll start a timer with /break <minutes> once they confirm and you begin working. ` +
      `When the user confirms and you start the actual work, open the timer by running: open "https://www.google.com/search?q=timer+for+N+minutes" (replace N with your estimate). ` +
      `If the task is quick (under 3 minutes), say nothing about breaks and just do the work.`
    );
  }

  // --- Secondary: Session duration reminders ---
  const elapsed = now - (state.session_start || now);
  const elapsedMinutes = elapsed / 60;
  const thresholds = config.reminder_thresholds_minutes || [30, 60];
  let lastLevel = state.last_reminder_level || 0;

  for (let i = 0; i < thresholds.length; i++) {
    const level = i + 1;
    if (elapsedMinutes >= thresholds[i] && lastLevel < level) {
      const duration = formatDuration(elapsed);
      if (level === 1) {
        messages.push(
          `[Timeout Plugin] This session has been active for ${duration}. ` +
          `Gently mention it might be a good time for a short break. ` +
          `Mention /break. Keep it brief.`
        );
      } else {
        const breakMin = config.default_break_minutes || 5;
        messages.push(
          `[Timeout Plugin] This session has been active for ${duration}. ` +
          `Recommend a ${breakMin}-minute break. Suggest /break.`
        );
      }
      state.last_reminder_level = level;
    }
  }

  saveState(state);

  const hookOutput = { hookEventName: "UserPromptSubmit" };
  if (messages.length) hookOutput.additionalContext = messages.join("\n\n");
  output({ hookSpecificOutput: hookOutput });
} catch {
  output({ continue: true });
}

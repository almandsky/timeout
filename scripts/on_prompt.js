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
  state.last_task_reminder_time = 0; // reset task reminder for new prompt
  state.task_reminder_shown_this_prompt = false; // reset TaskCreated reminder
  state.tool_use_count = 0;

  const prompt = input.prompt || "";
  const hookOutput = { hookEventName: "UserPromptSubmit" };
  let systemMsg = null;

  if (prompt.length > 0) {
    // Best-effort: ask Claude to estimate and auto-launch timer
    hookOutput.additionalContext =
      `[Timeout Plugin — IMPORTANT] Before doing ANYTHING else, estimate how long this task will take. ` +
      `If 3+ minutes: (1) tell the user your estimate in one sentence, ` +
      `(2) immediately open a timer by running: open "https://www.google.com/search?q=timer+for+N+minutes" (replace N with your estimate), ` +
      `(3) then proceed with the work. Do NOT ask for confirmation — just start the timer and begin working. ` +
      `If quick (under 3 min), say nothing about breaks. ` +
      `This is your FIRST priority before any other action.`;

    // Reliable: always show a visible reminder for non-trivial prompts
    if (prompt.length > 30) {
      systemMsg =
        `⏰ [Timeout] New task received. If this takes a while, use /break to set a timer.`;
    }
  }

  saveState(state);
  const result = { hookSpecificOutput: hookOutput };
  if (systemMsg) result.systemMessage = systemMsg;
  output(result);
} catch {
  output({ continue: true });
}

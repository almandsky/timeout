#!/usr/bin/env node
const { loadState, loadConfig, formatDuration } = require("./lib");

const state = loadState();
if (!state) {
  console.log("No active session tracked.");
  process.exit(0);
}

const config = loadConfig();
const elapsed = Date.now() / 1000 - (state.session_start || Date.now() / 1000);
const thresholds = config.reminder_thresholds_minutes || [30, 60];

console.log(`Session Duration: ${formatDuration(elapsed)}`);
console.log(`Prompts: ${state.prompt_count || 0}`);
console.log(`Turns: ${state.turn_count || 0}`);
console.log(`Breaks Taken: ${state.breaks_taken || 0}`);
console.log(`Reminder Level: ${state.last_reminder_level || 0}/${thresholds.length}`);
console.log(`Thresholds: ${thresholds.map((t) => t + "min").join(", ")}`);
console.log(`Plugin Enabled: ${config.enabled !== false}`);

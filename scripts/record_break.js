#!/usr/bin/env node
const { loadState, saveState } = require("./lib");

const state = loadState();
if (!state) {
  console.log("No active session to record break for.");
  process.exit(0);
}

state.breaks_taken = (state.breaks_taken || 0) + 1;
state.last_reminder_level = 0;
state.last_activity = Date.now() / 1000;
saveState(state);

console.log(`Break #${state.breaks_taken} recorded. Reminder level reset.`);

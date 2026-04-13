#!/usr/bin/env node
const { readHookInput, loadState, saveState, output } = require("./lib");

try {
  readHookInput();
  const state = loadState();

  if (state) {
    state.turn_count = (state.turn_count || 0) + 1;
    state.last_activity = Date.now() / 1000;
    saveState(state);
  }

  output({ continue: true });
} catch {
  output({ continue: true });
}

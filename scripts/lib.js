const fs = require("fs");
const path = require("path");
const os = require("os");

const DATA_DIR = path.join(os.homedir(), ".timeout-plugin");

const DEFAULT_CONFIG = {
  enabled: true,
  reminder_thresholds_minutes: [30, 60],
  default_break_minutes: 5,
  complexity_warning_cooldown_seconds: 300,
};

function ensureDataDir() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  return DATA_DIR;
}

function statePath() {
  return path.join(ensureDataDir(), "session_state.json");
}

function configPath() {
  return path.join(ensureDataDir(), "config.json");
}

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(statePath(), "utf8"));
  } catch {
    return null;
  }
}

function saveState(state) {
  fs.writeFileSync(statePath(), JSON.stringify(state, null, 2));
}

function loadConfig() {
  try {
    return JSON.parse(fs.readFileSync(configPath(), "utf8"));
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

function saveConfig(config) {
  fs.writeFileSync(configPath(), JSON.stringify(config, null, 2));
}

function ensureConfig() {
  const p = configPath();
  if (!fs.existsSync(p)) saveConfig(DEFAULT_CONFIG);
  return loadConfig();
}

function readHookInput() {
  return JSON.parse(fs.readFileSync("/dev/stdin", "utf8"));
}

function output(result) {
  process.stdout.write(JSON.stringify(result));
}

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  if (minutes < 1) return "less than a minute";
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (remaining === 0) return `${hours} hour${hours !== 1 ? "s" : ""}`;
  return `${hours}h ${remaining}m`;
}

module.exports = {
  DATA_DIR, DEFAULT_CONFIG,
  loadState, saveState, loadConfig, saveConfig, ensureConfig,
  readHookInput, output, formatDuration,
};

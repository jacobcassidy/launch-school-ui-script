/**
 * LOG HELPERS
 */

export const colorLog = {
  alert: (msg, ...args) => console.log(`%c${msg}`, "color: #f00; font-weight: 700;", ...args),
  debug: (msg, ...args) => console.log(`%c${msg}`, "color: #f80;", ...args),
  detail: (msg, ...args) => console.log(`%c${msg}`, "color: #999;", ...args),
  info: (msg, ...args) => console.log(`%c${msg}`, "color: #007acc;", ...args),
  notice: (msg, ...args) => console.log(`%c${msg}`, "color: #f08; font-weight: 700;", ...args),
  run: (msg, ...args) => console.log(`%c${msg}`, "color: #28a745;", ...args),
};

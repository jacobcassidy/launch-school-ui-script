/**
 * PLATFORM SHORTCUTS
 * @module utils/helpers/shortcuts
 */

const modifierLabels = { meta: "Cmd", ctrl: "Ctrl", alt: "Alt", shift: "Shift" };
const modifierSymbols = { meta: "⌘", ctrl: "⌃", alt: "⎇", shift: "⇧" };
const macModifiers = { cmdOnly: ["meta"], cmdShift: ["meta", "shift"], cmdCtrl: ["meta", "ctrl"] };
const controlModifiers = { cmdOnly: ["ctrl"], cmdShift: ["ctrl", "shift"], cmdCtrl: ["ctrl", "alt"] };

function getPlatformModifiers() {
  const browser = globalThis.navigator;
  const platform = browser?.userAgentData?.platform || browser?.platform || browser?.userAgent || "";
  return /Mac|iPhone|iPad|iPod/i.test(platform) ? macModifiers : controlModifiers;
}

/**
 * Returns the keys shown for a logical shortcut on the current platform.
 * @param {string} modifier Logical shortcut group.
 * @param {string|number} symbol Non-modifier key.
 * @param {object} options Display options.
 * @param {boolean} options.symbols Use modifier symbols instead of names.
 * @returns {Array<string>} Key labels.
 */
export function getShortcutKeys(modifier, symbol, { symbols = true } = {}) {
  const modifiers = getPlatformModifiers()[modifier] || [];
  const labels = symbols ? modifierSymbols : modifierLabels;
  return [...modifiers.map((key) => labels[key]), String(symbol)];
}

/**
 * Matches a keyboard event to a logical shortcut group using exact modifiers.
 * @param {KeyboardEvent} event Keyboard event.
 * @returns {string|null} Matching shortcut group, or null.
 */
export function getShortcutModifier(event) {
  for (const [modifier, keys] of Object.entries(getPlatformModifiers())) {
    if (Object.keys(modifierLabels).every((key) => Boolean(event[`${key}Key`]) === keys.includes(key))) {
      return modifier;
    }
  }
  return null;
}

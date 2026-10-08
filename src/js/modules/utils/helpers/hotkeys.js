/**
 * PLATFORM SHORTCUTS
 * @module utils/helpers/hotkeys
 */

const modifierLabels = { meta: "Cmd", ctrl: "Ctrl", alt: "Alt", shift: "Shift" };
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
 * @returns {Array<string>} Key labels.
 */
export function getHotkeyKeys(modifier, symbol) {
  const modifiers = getPlatformModifiers()[modifier] || [];
  return [...modifiers.map((key) => modifierLabels[key]), String(symbol)];
}

/**
 * Matches a keyboard event to a logical shortcut group using exact modifiers.
 * @param {KeyboardEvent} event Keyboard event.
 * @returns {string|null} Matching shortcut group, or null.
 */
export function getHotkeyModifier(event) {
  for (const [modifier, keys] of Object.entries(getPlatformModifiers())) {
    if (Object.keys(modifierLabels).every((key) => Boolean(event[`${key}Key`]) === keys.includes(key))) {
      return modifier;
    }
  }
  return null;
}

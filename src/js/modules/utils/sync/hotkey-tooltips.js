/**
 * HOTKEY TOOLTIPS
 * @module utils/sync/hotkey-tooltips
 */

import { hotkeys } from "../state/hotkeys.js";
const modifierLabels = { enterOnly: "", cmdOnly: "CMD+", cmdShift: "CMD+SHIFT+", cmdCtrl: "CMD+CTRL+" };

const previousTooltips = new Map();

/**
 * Shows currently registered shortcuts while preserving buttons' aria-labels.
 */
export function syncHotkeyTooltips() {
  // Restore only text we added, preserving any native label changes.
  previousTooltips.forEach(({ tooltip, originalTitle, label, text }, button) => {
    if (tooltip) {
      if (tooltip.textContent === text) tooltip.textContent = label;
    } else if (button.getAttribute("title") === text) {
      if (originalTitle === null) button.removeAttribute("title");
      else button.setAttribute("title", originalTitle);
    }
  });
  previousTooltips.clear();

  const buttonShortcuts = new Map();
  for (const [modifier, shortcuts] of Object.entries(hotkeys)) {
    for (const { symbol, label, buttons = [] } of Object.values(shortcuts)) {
      const shortcut = `${modifierLabels[modifier]}${symbol}`;
      buttons.forEach((button) => {
        if (!button) return;
        if (!buttonShortcuts.has(button)) buttonShortcuts.set(button, { label, shortcuts: new Set() });
        buttonShortcuts.get(button).shortcuts.add(shortcut);
      });
    }
  }

  buttonShortcuts.forEach(({ label: fallbackLabel, shortcuts }, button) => {
    const isTab = button.classList.contains("tab-button");
    const tooltip = isTab ? document.querySelector(`.tab-tooltip-${button.getAttribute("data-tab")}`) : null;
    if (isTab && !tooltip) return;

    const originalTitle = button.getAttribute("title")?.replace(/ \((?:(?:CMD|CTRL)\+[^)]*|Enter)\)$/, "") ?? null;
    const label = originalTitle || button.getAttribute("aria-label") || button.textContent.trim() || fallbackLabel;
    const text = `${label} (${[...shortcuts].join(" / ")})`;
    if (tooltip) tooltip.textContent = text;
    else button.setAttribute("title", text);
    previousTooltips.set(button, { tooltip, originalTitle, label, text });
  });
}

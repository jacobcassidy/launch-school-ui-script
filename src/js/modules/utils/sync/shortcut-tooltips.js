/**
 * SHORTCUT TOOLTIPS
 * @module utils/sync/shortcut-tooltips
 */

import { shortcuts } from "../state/shortcuts.js";
import { getShortcutKeys } from "../helpers/shortcuts.js";

const previousTooltips = new Map();

/**
 * Shows currently registered shortcuts while preserving buttons' aria-labels.
 */
export function syncShortcutTooltips() {
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
  for (const [modifier, modifierShortcuts] of Object.entries(shortcuts)) {
    for (const { symbol, label, buttons = [] } of Object.values(modifierShortcuts)) {
      const keys = getShortcutKeys(modifier, symbol);
      const shortcut = modifier === "enterOnly" ? keys.join("") : keys.join("").toUpperCase();
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

    const originalTitle =
      button.getAttribute("title")?.replace(/ \((?:(?:CMD|CTRL)\+[^)]*|[⌘⌃⇧⎇][^)]*|Enter)\)$/, "") ?? null;
    const label = originalTitle || button.getAttribute("aria-label") || button.textContent.trim() || fallbackLabel;
    const shortcutText = `(${[...shortcuts].join(" / ")})`;
    const text = `${label} ${shortcutText}`;
    if (tooltip) {
      const labelEl = document.createElement("span");
      labelEl.className = "tooltip-label";
      labelEl.textContent = `${label} `;
      const shortcutEl = document.createElement("span");
      shortcutEl.className = "tooltip-shortcut";
      shortcutEl.textContent = shortcutText;
      tooltip.replaceChildren(labelEl, shortcutEl);
    } else button.setAttribute("title", text);
    previousTooltips.set(button, { tooltip, originalTitle, label, text });
  });
}

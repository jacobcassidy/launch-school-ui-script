/**
 * SHORTCUTS
 * @module components/shortcuts
 */

// Import components
import { createNewSettingsSection } from "./settings-menu.js";

// Import utils
import { shortcuts } from "../utils/state/shortcuts.js";
import { getShortcutKeys } from "../utils/helpers/shortcuts.js";

/**
 * INJECT SHORTCUTS SECTION
 * Injects the shortcuts as a section of the settings menu.
 */
export function injectShortcutsSection() {
  const settingsMenu = document.querySelector(".settings-container");
  if (!settingsMenu) return;

  settingsMenu.querySelectorAll(".current-page-added-shortcuts-section").forEach((section) => section.remove());
  settingsMenu.appendChild(createShortcutsSection());
}

/**
 * CREATE SHORTCUTS SECTION
 *
 * @returns {HTMLElement} The shortcuts settings section element
 */
function createShortcutsSection() {
  const shortcutsSectionEl = createNewSettingsSection("Current Page Added Shortcuts");
  const shortcutsListEl = shortcutsSectionEl.querySelector(".settings-list");

  for (const [modifierListKey, modifierListObj] of Object.entries(shortcuts)) {
    for (const shortcutObj of Object.values(modifierListObj)) {
      const shortcutItemEl = document.createElement("li");
      shortcutItemEl.className = "settings-list__item";

      const shortcutItemKeyEl = document.createElement("div");
      shortcutItemKeyEl.className = "setting-status shortcut-keys";

      const keys = getShortcutKeys(modifierListKey, shortcutObj.symbol);
      const keyNames = getShortcutKeys(modifierListKey, shortcutObj.symbol, { symbols: false });
      shortcutItemKeyEl.setAttribute("role", "img");
      shortcutItemKeyEl.setAttribute("aria-label", keyNames.join(" "));

      keys.forEach((key) => {
        const keySpan = document.createElement("span");
        keySpan.className = "key";
        if (Array.from(key).length > 1) keySpan.classList.add("key--text");
        keySpan.innerText = key;
        shortcutItemKeyEl.appendChild(keySpan);
      });

      shortcutItemEl.appendChild(shortcutItemKeyEl);

      const shortcutItemLabelEl = document.createElement("div");
      shortcutItemLabelEl.className = "setting-desc shortcut-label";
      shortcutItemLabelEl.innerText = shortcutObj.label;
      shortcutItemEl.appendChild(shortcutItemLabelEl);

      shortcutsListEl.appendChild(shortcutItemEl);
    }
  }

  return shortcutsSectionEl;
}

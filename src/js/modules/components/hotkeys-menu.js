/**
 * HOTKEYS
 * @module components/hotkeys
 */

// Import components
import { createNewSettingsSection } from "./settings-menu.js";

// Import utils
import { hotkeys } from "../utils/state/hotkeys.js";

/**
 * INJECT HOTKEYS SECTION
 * Injects the hotkeys as a section of the settings menu.
 */
export function injectHotkeysSection() {
  const settingsMenu = document.querySelector(".settings-container");
  if (!settingsMenu) return;

  settingsMenu.querySelectorAll(".current-page-added-hotkeys-section").forEach((section) => section.remove());
  settingsMenu.appendChild(createHotkeysSection());
}

/**
 * CREATE HOTKEYS SECTION
 *
 * @returns {HTMLElement} The hotkeys settings section element
 */
function createHotkeysSection() {
  const hotkeysSectionEl = createNewSettingsSection("Current Page Added Hotkeys");
  const hotkeysListEl = hotkeysSectionEl.querySelector(".settings-list");

  for (const [modifierListKey, modifierListObj] of Object.entries(hotkeys)) {
    let modifierKey;
    if (modifierListKey === "enterOnly") modifierKey = "Enter";
    if (modifierListKey === "cmdOnly") modifierKey = null;
    if (modifierListKey === "cmdShift") modifierKey = "Shift";
    if (modifierListKey === "cmdCtrl") modifierKey = "Ctrl";

    for (const hotkeyObj of Object.values(modifierListObj)) {
      const hotkeyItemEl = document.createElement("li");
      hotkeyItemEl.className = "settings-list__item";

      const hotkeyItemKeyEl = document.createElement("div");
      hotkeyItemKeyEl.className = "setting-status hotkey-shortcut";

      let keys;

      if (modifierKey === "Enter") {
        keys = [hotkeyObj.symbol];
      } else if (modifierKey) {
        keys = ["Cmd", modifierKey, hotkeyObj.symbol];
      } else {
        keys = ["Cmd", hotkeyObj.symbol];
      }

      keys.forEach((key, index) => {
        const keySpan = document.createElement("span");
        keySpan.className = "key";
        keySpan.innerText = key;
        hotkeyItemKeyEl.appendChild(keySpan);

        // Add a `+` symbol after each key, except the last key.
        const isLast = index === keys.length - 1;
        if (isLast) return;
        const plusSpan = document.createElement("span");
        plusSpan.className = "plus";
        plusSpan.innerText = "+";
        hotkeyItemKeyEl.appendChild(plusSpan);
      });

      hotkeyItemEl.appendChild(hotkeyItemKeyEl);

      const hotkeyItemLabelEl = document.createElement("div");
      hotkeyItemLabelEl.className = "setting-desc hotkey-label";
      hotkeyItemLabelEl.innerText = hotkeyObj.label;
      hotkeyItemEl.appendChild(hotkeyItemLabelEl);

      hotkeysListEl.appendChild(hotkeyItemEl);
    }
  }

  return hotkeysSectionEl;
}

/**
 * HOTKEYS
 * @module hotkeys
 */

// import { colorLog } from "./helpers/log.js";
import { states } from "./helpers/state.js";

/**
 * INJECT HOTKEYS MENU
 * Injects the hotkeys menu as a section of the settings menu.
 */
export function injectHotkeysMenu() {
  const settingsMenu = document.querySelector(".settings-menu");
  if (!settingsMenu) return;

  const createHotkeysMenu = () => {
    const hotkeysMenuEl = document.createElement("section");
    hotkeysMenuEl.classList.add("hotkeys-section");

    const hotkeysMenuTitleEl = document.createElement("h3");
    hotkeysMenuTitleEl.classList.add("section-title");
    hotkeysMenuTitleEl.innerText = "Current Page Hotkeys";
    hotkeysMenuEl.append(hotkeysMenuTitleEl);

    for (const [modifierListKey, modifierListObj] of Object.entries(states.hotkeys)) {
      let modifierKey;
      if (modifierListKey === "cmdShift") modifierKey = "Shift";
      if (modifierListKey === "cmdCtrl") modifierKey = "Ctrl";

      const modifierListEl = document.createElement("ul");
      modifierListEl.classList.add("settings-list");
      const modifierListTitleEl = document.createElement("li");
      modifierListTitleEl.classList.add("settings-list__title");
      modifierListTitleEl.innerText = `Cmd ${modifierKey} Shortcuts`;
      modifierListEl.append(modifierListTitleEl);

      for (const hotkeyObj of Object.values(modifierListObj)) {
        const hotkeyItemEl = document.createElement("li");
        hotkeyItemEl.classList.add("settings-list__item");

        const hotkeyItemKeyContainerEl = document.createElement("div");
        hotkeyItemKeyContainerEl.classList.add("setting-status", "hotkey-shortcut");

        const keys = ["Cmd", modifierKey, hotkeyObj.symbol];

        keys.forEach((key, index) => {
          const keySpan = document.createElement("span");
          keySpan.classList.add("key");
          keySpan.innerText = key;
          hotkeyItemKeyContainerEl.append(keySpan);

          // Add a `+` symbol after each key, except the last key.
          const isLast = index === keys.length - 1;
          if (isLast) return;
          const plusSpan = document.createElement("span");
          plusSpan.innerText = "+";
          hotkeyItemKeyContainerEl.append(plusSpan);
        });

        hotkeyItemEl.append(hotkeyItemKeyContainerEl);

        const hotkeyItemLabelEl = document.createElement("div");
        hotkeyItemLabelEl.classList.add("setting-desc", "hotkey-label");
        hotkeyItemLabelEl.innerText = hotkeyObj.label;
        hotkeyItemEl.append(hotkeyItemLabelEl);

        modifierListEl.append(hotkeyItemEl);
      }

      hotkeysMenuEl.append(modifierListEl);
    }

    return hotkeysMenuEl;
  };

  settingsMenu.append(createHotkeysMenu());
}

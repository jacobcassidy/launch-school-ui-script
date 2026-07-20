/**
 * @module helpers/settings
 */

import { hideSettingsMenu } from "./hide";
import { elements } from "./state";
import cmdKeyIcon from "../../../svg/cmd-key.svg";

// SETTINGS OBJECT
export const settings = {
  hotkeys: {
    cmdShift: {
      1: "Toggle Header",
      2: "Toggle Tabs Panel",
      E: "Focus Editor",
    },
    cmdCtrl: {
      "#": "Focus tab (in # order)",
      B: "Toggle sidebar menu",
      C: "Copy editor code",
      E: "Focus Editor",
      M: "Toggle exercise as completed/incomplete",
      N: "Go to next exercise",
      R: "Submit solution to LSBot Review",
      S: "Toggle Settings menu",
      T: "Toggle book's Table of Contents",
    },
  },
};

/**
 * CREATE SETTINGS MENU
 */
export function createSettingsMenu(containerEl) {
  const createSettingsMenuEl = () => {
    const settingsMenuEl = document.createElement("div");
    settingsMenuEl.classList.add("settings-menu");
    const settingsMenuHeaderEl = document.createElement("h2");
    settingsMenuHeaderEl.classList.add("setting-menu__title");
    settingsMenuHeaderEl.innerText = "Settings";
    settingsMenuEl.append(settingsMenuHeaderEl);
    settingsMenuEl.append(createHotkeysMenuSection());
    return settingsMenuEl;
  };

  const createSettingsMenuToggleButtonEl = () => {
    const settingsMenuToggleButtonEl = document.createElement("button");
    settingsMenuToggleButtonEl.classList.add("site-header__button", "btn--toggle-settings", "has-dropdown");
    settingsMenuToggleButtonEl.title = "Toggle Settings Menu";
    settingsMenuToggleButtonEl.innerHTML = cmdKeyIcon;
    return settingsMenuToggleButtonEl;
  };

  containerEl.append(createSettingsMenuToggleButtonEl());
  containerEl.append(createSettingsMenuEl());
}

/**
 * CREATE HOTKEYS MENU SECTION
 *
 * @returns {HTMLElement} hotkeysMenuSectionEl
 */
function createHotkeysMenuSection() {
  const hotkeysMenuSectionEl = document.createElement("section");
  hotkeysMenuSectionEl.classList.add("hotkeys-section");

  const hotkeysMenuTitleEl = document.createElement("h3");
  hotkeysMenuTitleEl.classList.add("section-title");
  hotkeysMenuTitleEl.innerText = "Hotkeys";
  hotkeysMenuSectionEl.append(hotkeysMenuTitleEl);

  const cmdShiftListEl = document.createElement("ul");
  const cmdCtrlListEl = document.createElement("ul");
  cmdShiftListEl.classList.add("hotkeys-list");
  cmdCtrlListEl.classList.add("hotkeys-list");

  const cmdShiftListTitleEl = document.createElement("li");
  cmdShiftListTitleEl.classList.add("list-title");
  cmdShiftListTitleEl.innerText = "Cmd Shift Hotkeys";
  cmdShiftListEl.append(cmdShiftListTitleEl);

  const cmdCtrlListTitleEl = document.createElement("li");
  cmdCtrlListTitleEl.classList.add("list-title");
  cmdCtrlListTitleEl.innerText = "Cmd Ctrl Hotkeys";
  cmdCtrlListEl.append(cmdCtrlListTitleEl);

  for (const [modifier, hotkeys] of Object.entries(settings.hotkeys)) {
    let hotkeyPrefix;
    if (modifier === "cmdShift") hotkeyPrefix = "CMD+SHIFT+";
    if (modifier === "cmdCtrl") hotkeyPrefix = "CMD+CTRL+";

    for (const [hotkey, label] of Object.entries(hotkeys)) {
      const hotkeyItemEl = document.createElement("li");
      hotkeyItemEl.classList.add("hotkeys-list__item");

      const hotkeyItemKeyEl = document.createElement("span");
      hotkeyItemKeyEl.classList.add("hotkey-key");
      hotkeyItemKeyEl.innerText = `${hotkeyPrefix}${hotkey}`;
      hotkeyItemEl.append(hotkeyItemKeyEl);

      const hotkeyItemLabelEl = document.createElement("span");
      hotkeyItemLabelEl.classList.add("hotkey-label");
      hotkeyItemLabelEl.innerText = label;
      hotkeyItemEl.append(hotkeyItemLabelEl);

      if (modifier === "cmdShift") cmdShiftListEl.append(hotkeyItemEl);
      if (modifier === "cmdCtrl") cmdCtrlListEl.append(hotkeyItemEl);
    }
  }

  hotkeysMenuSectionEl.append(cmdShiftListEl);
  hotkeysMenuSectionEl.append(cmdCtrlListEl);

  return hotkeysMenuSectionEl;
}

/**
 * HANDLE OUTSIDE SETTINGS MENU CLICK
 */
export function handleOutsideSettingsMenuClick(e) {
  const settingsMenu = elements.injected.settingsMenu;
  const settingsMenuToggleBtn = elements.injected.settingsToggleButton;

  if (settingsMenu.contains(e.target) || settingsMenuToggleBtn.contains(e.target)) return;
  hideSettingsMenu();
}

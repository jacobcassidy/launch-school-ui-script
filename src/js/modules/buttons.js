/**
 * BUTTONS
 * @module buttons
 */
import cmdKeyIcon from "../../svg/cmd-key.svg";
import panelsIcon from "../../svg/tabs-panel.svg";
import { elements } from "./helpers/state";

/**
 * INJECT SETTINGS MENU TOGGLE BUTTON
 * Injects a .btn-toggle-settings-menu button in the .site-header to toggle the Settings Menu when clicked.
 *
 * @param {HTMLElement} containerEl The container to which the button will be appended.
 */
export function injectSettingsMenuToggleButton(containerEl) {
  const createSettingsMenuToggleButton = () => {
    const settingsMenuToggleButtonEl = document.createElement("button");
    settingsMenuToggleButtonEl.classList.add("site-header__button", "btn--toggle-settings", "has-dropdown");
    settingsMenuToggleButtonEl.title = "Toggle Settings Menu";
    settingsMenuToggleButtonEl.innerHTML = cmdKeyIcon;
    return settingsMenuToggleButtonEl;
  };

  containerEl.append(createSettingsMenuToggleButton());
}

/**
 * INJECT SIDEBAR SHOW BUTTON
 * Injects a .btn--show-sidebar button in the .site-header__container to open the sidebar when clicked.
 *
 * @param {HTMLDivElement} containerEl The container to which the button will be appended.
 */
export function injectSidebarShowButton(containerEl) {
  const createSidebarShowButton = () => {
    const sidebarShowButtonEl = document.createElement("button");
    sidebarShowButtonEl.classList.add("site-header__button", "btn--show-sidebar");
    sidebarShowButtonEl.title = "Open Menu";

    // Add hamburger icon to button
    for (let i = 0; i < 3; i += 1) {
      const lineEl = document.createElement("span");
      lineEl.classList.add("hamburger-line");
      sidebarShowButtonEl.appendChild(lineEl);
    }

    return sidebarShowButtonEl;
  };

  containerEl.appendChild(createSidebarShowButton());
}

/**
 * INJECT TABS PANEL TOGGLE BUTTON
 * Injects a .btn--toggle-tabs-panel button in the .site-header to toggle the Tabs Panel when clicked.
 *
 * @param {HTMLDivElement} containerEl The container to which the button will be appended.
 */
export function injectTabsPanelToggleButton(containerEl) {
  const tabsPanel = elements.native.tabsPanel;
  if (!tabsPanel) return;

  const createTabsPanelToggleButton = () => {
    const tabsPanelToggleButtonEl = document.createElement("button");
    tabsPanelToggleButtonEl.classList.add("site-header__button", "btn--toggle-tabs-panel");
    tabsPanelToggleButtonEl.title = "Toggle Tabs Panel";
    tabsPanelToggleButtonEl.innerHTML = panelsIcon;
    return tabsPanelToggleButtonEl;
  };

  containerEl.appendChild(createTabsPanelToggleButton());
}

/**
 * MOVE TOC BUTTON TO HEADER
 * Moves the book's Table of Contents toggle button to the header
 *
 * @param {HTMLElement} containerEl The container to which the TOC button will be appended.
 */
export function moveTocBtnToHeader(containerEl) {
  const bookTocBtn = document.querySelector(".toc-toggle-button");
  if (bookTocBtn) {
    bookTocBtn.classList.add("site-header__button", "has-dropdown", ".btn--toggle-toc");
    bookTocBtn.title = "Toggle Table of Contents";

    containerEl.append(bookTocBtn);
  }
}

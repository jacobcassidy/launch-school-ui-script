/**
 * STATE
 * @module helpers/state
 */

// ELEMENTS OBJECT
export const elements = {
  injected: {
    header: null,
    settingsMenu: null,
    settingsToggleButton: null,
    sidebarShowButton: null,
    tabsPanelToggleButton: null,
  },
  native: {
    contentPanel: null,
    editorPanel: null,
    instructionsPanel: null,
    scratchpad: null,
    sidebar: null,
    tabNav: null,
    tabsPanel: null,
    tocButton: null,
  },
};

// STATES OBJECT
export const states = {
  hidden: {
    isHeaderHidden: sessionStorage.getItem("isHeaderHidden") === "true",
    isSidebarHidden:
      sessionStorage.getItem("isSidebarHidden") === "true" || document.querySelector("#navbar-collapsor").checked,
    isTabsPanelHidden: sessionStorage.getItem("isTabsPanelHidden") === "true",
  },
  hotkeys: {
    cmdShift: {},
    cmdCtrl: {},
    native: {},
  },
  load: {
    isReloadScheduled: false,
    lastUrl: null,
    previousBody: null,
  },
};

// SET INJECTED HEADER
export function setElementHeader(el) {
  elements.injected.header = el;
}

// SET INJECTED SETTINGS MENU
export function setElementSettingsMenu(el) {
  elements.injected.settingsMenu = el;
}

// SET INJECTED SETTINGS TOGGLE BTN
export function setElementSettingsToggleBtn(el) {
  elements.injected.settingsToggleButton = el;
}

// SET INJECTED SIDEBAR SHOW BUTTON
export function setElementSidebarShowButton(el) {
  elements.injected.sidebarShowButton = el;
}

// SET INJECTED TABS PANEL TOGGLE BUTTON
export function setElementTabsPanelToggleButton(el) {
  elements.injected.tabsPanelToggleButton = el;
}

// SET NATIVE CONTENT PANEL
export function setElementContentPanel(el) {
  elements.native.contentPanel = el;
}

// SET NATIVE EDITOR
export function setElementEditorPanel(el) {
  elements.native.editorPanel = el;
}

// SET NATIVE INSTRUCTIONS PANEL
export function setElementInstructionsPanel(el) {
  elements.native.instructionsPanel = el;
}

// SET NATIVE SCRATCHPAD
export function setElementScratchpad(el) {
  elements.native.scratchpad = el;
}

// SET NATIVE SIDEBAR
export function setElementSidebar(el) {
  elements.native.sidebar = el;
}

// SET NATIVE TABS PANEL
export function setElementTabsPanel(el) {
  elements.native.tabsPanel = el;
}

// SET NATIVE TABS NAV
export function setElementTabNav(el) {
  elements.native.tabNav = el;
}

// SET NATIVE TOC MENU
export function setElementTocButton(el) {
  elements.native.tocButton = el;
}

/**
 * SET AVAILABLE HOTKEY
 *
 * @param {string} modifier The settings object's modifier key name being accessed [cmdShift, cmdCtrl].
 * @param {string} key The event.code name for the key being pressed with the modifier keys.
 * @param {string|number} symbol The key symbol to displayed in the settings menu.
 * @param {string} label The hotkey label to displayed in the settings menu.
 * @param {() => void|null} callbackFunc The function that will run when the hotkey is triggered.
 */
export function setAvailableHotkey(modifier, key, symbol, label, callbackFunc = null) {
  let callback;
  if (!callbackFunc) {
    callback = null;
  } else {
    callback = () => callbackFunc();
  }

  states.hotkeys[modifier][key] = { callback: callback, label: label, symbol: symbol };
}

// SET IS HEADER HIDDEN
export function setIsHeaderHidden(value) {
  if (value === true) {
    elements.injected.header.classList.add("is-hidden");
  } else {
    elements.injected.header.classList.remove("is-hidden");
  }

  states.hidden.isHeaderHidden = value;
  sessionStorage.setItem("isHeaderHidden", value);
}
// SET IS RELOAD SCHEDULED
export function setIsReloadScheduled(value) {
  states.load.isReloadScheduled = value;
}

// SET IS SIDEBAR HIDDEN
export function setIsSidebarHidden(value) {
  const sidebarHideCheckbox = document.querySelector("#navbar-collapsor");
  const sidebarHideBtn = document.querySelector("#navbar-collapse");

  // SET If no sidebar found, set value to null.
  if (!sidebarHideCheckbox) {
    states.hidden.isSidebarHidden = null;
    return;
  }

  const isActiveSidebar = !sidebarHideCheckbox.checked;

  if (value === true) {
    if (isActiveSidebar) {
      sidebarHideBtn.dispatchEvent(
        new MouseEvent("mousedown", {
          bubbles: true,
          cancelable: true,
          button: 0,
        }),
      );

      sidebarHideBtn.click();
    }
  } else {
    const nativeSidebarShowBtn = document.querySelector("#navbar-expand");
    if (!isActiveSidebar) {
      nativeSidebarShowBtn.dispatchEvent(
        new MouseEvent("mousedown", {
          bubbles: true,
          cancelable: true,
          button: 0,
        }),
      );

      nativeSidebarShowBtn.click();
    }
  }

  states.hidden.isSidebarHidden = value;
  sessionStorage.setItem("isSidebarHidden", value);
}

// SET IS TABS PANEL HIDDEN
export function setIsTabsPanelHidden(value) {
  const tabsPanel = elements.native.tabsPanel;
  const contentPanel = elements.native.contentPanel;
  const tabsPanelToggleButton = elements.injected.tabsPanelToggleButton;

  if (value === true) {
    tabsPanel.classList.add("hidden", "panel-collapsed");
    contentPanel.classList.remove("half-width");
    tabsPanel.classList.remove("is-active", "half-width");
    tabsPanelToggleButton.classList.remove("active");
  } else {
    tabsPanel.classList.remove("hidden", "panel-collapsed");
    contentPanel.classList.add("half-width");
    tabsPanel.classList.add("is-active", "half-width");
    tabsPanelToggleButton.classList.add("active");
  }

  states.hidden.isTabsPanelHidden = value;
  sessionStorage.setItem("iisTabsPanelHidden", value);
}

// SET LAST URL
export function setLastUrl(value) {
  states.load.lastUrl = value;
}

// SET PREVIOUS BODY
export function setPreviousBody(value) {
  states.load.previousBody = value;
}

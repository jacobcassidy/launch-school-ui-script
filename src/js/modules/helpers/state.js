/**
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
    instructionsPanel: null,
    scrollContainer: null,
    sidebar: null,
    tabsPanel: null,
  },
};

// STATES OBJECT
export const states = {
  isHeaderHidden: sessionStorage.getItem("isHeaderHidden") === "true",
  isSidebarHidden:
    sessionStorage.getItem("isSidebarHidden") === "true" || document.querySelector("#navbar-collapsor").checked,
  isTabsPanelHidden: sessionStorage.getItem("isTabsPanelHidden") === "true",
  isReloadScheduled: false,
  ignoreMutationsUntil: 0,
  lastUrl: null,
  previousBody: null,
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

// SET NATIVE INSTRUCTIONS PANEL
export function setElementInstructionsPanel(el) {
  elements.native.instructionsPanel = el;
}

// SET NATIVE SCROLL CONTAINER
export function setElementScrollContainer(el) {
  elements.native.scrollContainer = el;
}

// SET NATIVE SIDEBAR
export function setElementSidebar(el) {
  elements.native.sidebar = el;
}

// SET NATIVE TABS PANEL
export function setElementTabsPanel(el) {
  elements.native.tabsPanel = el;
}

// SET IS HEADER HIDDEN
export function setIsHeaderHidden(value) {
  if (value === true) {
    elements.injected.header.classList.add("is-hidden");
  } else {
    elements.injected.header.classList.remove("is-hidden");
  }

  states.isHeaderHidden = value;
  sessionStorage.setItem("isHeaderHidden", value);
}
// SET IS RELOAD SCHEDULED
export function setIsReloadScheduled(value) {
  states.isReloadScheduled = value;
}

// SET IS SIDEBAR HIDDEN
export function setIsSidebarHidden(value) {
  const sidebarHideCheckbox = document.querySelector("#navbar-collapsor");
  const sidebarHideBtn = document.querySelector("#navbar-collapse");

  // SET If no sidebar found, set value to null.
  if (!sidebarHideCheckbox) {
    states.isSidebarHidden = null;
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

  states.isSidebarHidden = value;
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

  states.isTabsPanelHidden = value;
  sessionStorage.setItem("iisTabsPanelHidden", value);
}

// SET LAST URL
export function setLastUrl(value) {
  states.lastUrl = value;
}

// SET PREVIOUS BODY
export function setPreviousBody(value) {
  states.previousBody = value;
}

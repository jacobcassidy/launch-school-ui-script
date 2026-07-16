/**
 * STATE HELPERS
 */
export const elements = {
  injected: {
    header: null,
    settingsMenu: null,
    settingsToggleBtn: null,
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

export const states = {
  isHeaderPinned: sessionStorage.getItem("isHeaderPinned") === "true",
  isHeaderTop: false,
  isHeaderHidden: sessionStorage.getItem("isHeaderHidden") === "true",
  isSidebarHidden: sessionStorage.getItem("isSidebarHidden") === "true",
  isTabsPanelHidden: sessionStorage.getItem("isTabsPanelHidden") === "true",
  isReloadScheduled: false,
  lastUrl: null,
  previousBody: null,
};

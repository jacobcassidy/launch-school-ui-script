/**
 * STATE HELPERS
 */
export const elements = {
  contentPanel: null,
  header: null,
  instructionsPanel: null,
  scrollContainer: null,
  sidebar: null,
  sidebarShowButton: null,
  tabsPanel: null,
  tabsPanelToggleButton: null,
};

export const states = {
  isHeaderPinned: sessionStorage.getItem("isHeaderPinned") === "true",
  isHeaderTop: false,
  isHeaderUnpinned: sessionStorage.getItem("isHeaderUnpinned") === "true",
  isHiddenDefaultHeader: sessionStorage.getItem("isDefaultHeaderHidden") === "true",
  isHiddenDefaultSidebar: sessionStorage.getItem("isDefaultSidebarHidden") === "true",
  isHiddenDefaultTabsPanel: sessionStorage.getItem("isDefaultTabsPanelHidden") === "true",
  isReloadScheduled: false,
  isSidebarOpen: true,
  isTabsPanelOpen: true,
  lastUrl: null,
  previousBody: null,
};

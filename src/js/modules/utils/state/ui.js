/**
 * UI STATE
 * @module utils/state/ui
 */

// UI State Object
export const ui = {
  header: {
    isHidden: sessionStorage.getItem("isHeaderHidden") === "true",
  },
  sidebar: {
    isSettingSidebarHiddenHeadersOn: sessionStorage.getItem("isSettingSidebarHiddenHeadersOn") === "true",
    isSettingSidebarShrinkOn: sessionStorage.getItem("isSettingSidebarShrinkOn") === "true",
  },
  tabsPanel: {
    isHidden: sessionStorage.getItem("isTabsPanelHidden") === "true",
  },
  load: {
    isReloadScheduled: false,
    lastUrl: null,
  },
};

/**
 * UI SETTERS
 * @module utils/state/setters/ui
 */

// Import States
import { elements } from "../dom.js";
import { ui } from "../ui.js";

const tabsPanelClosings = new WeakMap();

/**
 * SET IS HEADER HIDDEN
 */
export function setIsHeaderHidden(value) {
  const header = elements.injected.header;
  if (value && header?.contains(document.activeElement)) document.activeElement.blur();
  header?.classList.toggle("is-hidden", value);
  if (header) {
    header.inert = value;
    header.setAttribute("aria-hidden", String(value));
  }

  ui.header.isHidden = value;
  sessionStorage.setItem("isHeaderHidden", value);
}

/**
 * SET IS RELOAD SCHEDULED
 */
export function setIsReloadScheduled(value) {
  ui.load.isReloadScheduled = value;
}

/**
 * SET IS SIDEBAR COLLAPSED
 */
export function setIsSidebarCollapsed(value) {
  const sidebarCollapseCheckbox = document.querySelector("#navbar-collapsor");

  // This page does not include the native sidebar control.
  if (!sidebarCollapseCheckbox) {
    return;
  }

  const isSidebarCollapsed = sidebarCollapseCheckbox.checked;
  if (isSidebarCollapsed !== value) {
    const sidebarButton = document.querySelector(value ? "#navbar-collapse" : "#navbar-expand");
    if (!sidebarButton) return;

    sidebarButton.dispatchEvent(
      new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
        button: 0,
      }),
    );
    sidebarButton.click();
  }
}

/**
 * SET SETTING SIDEBAR HIDDEN HEADERS
 */
export function setSettingSidebarHiddenHeaders(value) {
  if (value === true) {
    elements.native.sidebar?.classList.add("hide-section-headers");
  } else {
    elements.native.sidebar?.classList.remove("hide-section-headers");
  }

  ui.sidebar.isSettingSidebarHiddenHeadersOn = value;
  sessionStorage.setItem("isSettingSidebarHiddenHeadersOn", value);
}

/**
 * SET SETTING SIDEBAR SHRINK WHEN COLLAPSED
 */
export function setSettingSidebarShrink(value) {
  if (value === true) {
    elements.native.sidebar?.classList.add("shrink");
  } else {
    elements.native.sidebar?.classList.remove("shrink");
  }

  ui.sidebar.isSettingSidebarShrinkOn = value;
  sessionStorage.setItem("isSettingSidebarShrinkOn", value);
}

/**
 * SET IS TABS PANEL HIDDEN
 */
export function setIsTabsPanelHidden(value, { animate = true } = {}) {
  const tabsPanel = elements.native.tabsPanel;
  const contentPanel = elements.native.contentPanel;
  const tabsPanelToggleButton = elements.injected.tabsPanelToggleButton;

  ui.tabsPanel.isHidden = value;
  sessionStorage.setItem("isTabsPanelHidden", value);
  if (value) tabsPanelToggleButton?.classList.remove("active");
  else tabsPanelToggleButton?.classList.add("active");

  if (!tabsPanel) {
    contentPanel?.classList.remove("half-width");
    return;
  }

  const wasRendered = tabsPanel.classList.contains("is-active") && !tabsPanel.classList.contains("panel-collapsed");
  tabsPanelClosings.delete(tabsPanel);
  tabsPanel.inert = value;
  tabsPanel.setAttribute("aria-hidden", String(value));

  if (!value) {
    // Resize text once before reopening; reversing a close keeps its current position.
    contentPanel?.classList.add("half-width");
    tabsPanel.classList.remove("hidden", "panel-collapsed", "is-closing", "is-opening");
    tabsPanel.classList.add("is-active", "half-width");
    if (animate && !wasRendered) tabsPanel.classList.add("is-opening");
    prepareTabsPanelSlide(tabsPanel);
    tabsPanel.classList.remove("is-opening");
    return;
  }

  const closing = {};
  tabsPanelClosings.set(tabsPanel, closing);
  const finishClosing = () => {
    if (tabsPanelClosings.get(tabsPanel) !== closing) return;
    tabsPanelClosings.delete(tabsPanel);
    if (elements.native.tabsPanel !== tabsPanel) return;
    tabsPanel.classList.add("hidden", "panel-collapsed");
    tabsPanel.classList.remove("is-active", "half-width", "is-closing", "is-opening");
    // Expand only after the panel and divider have finished moving.
    contentPanel?.classList.remove("half-width");
  };

  if (!animate || !wasRendered) {
    finishClosing();
    return;
  }

  // Keep the content's line length and the tabs panel's layout intact during the slide.
  contentPanel?.classList.add("half-width");
  const resizeHandle = prepareTabsPanelSlide(tabsPanel);
  tabsPanel.classList.add("is-closing");
  const animations = [...(tabsPanel.getAnimations?.() || []), ...(resizeHandle?.getAnimations?.() || [])].filter(
    (animation) => animation.transitionProperty === "transform",
  );
  if (animations.length === 0) finishClosing();
  else Promise.allSettled(animations.map((animation) => animation.finished)).then(finishClosing);
}

/**
 * Measures the panel once so its divider can slide by the same distance.
 * Reading layout also establishes the opening transition's initial offscreen state.
 * @param {HTMLElement} tabsPanel
 * @returns {HTMLElement|null} Native divider, if present.
 */
function prepareTabsPanelSlide(tabsPanel) {
  const resizeHandle = tabsPanel.parentElement?.querySelector(":scope > .resize-handle") || null;
  const width = tabsPanel.getBoundingClientRect().width;
  resizeHandle?.style.setProperty("--tabs-panel-slide-offset", `${width}px`);
  resizeHandle?.getBoundingClientRect();
  return resizeHandle;
}

/**
 * SET LAST URL
 */
export function setLastUrl(value) {
  ui.load.lastUrl = value;
}

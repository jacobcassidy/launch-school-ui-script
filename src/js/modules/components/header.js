/**
 * HEADER
 * @module components/header
 */

// Import components
import { injectSettingsMenu } from "./settings-menu.js";
import { injectSettingsToggleButton } from "./buttons/header/settings-toggle.js";
import { injectSidebarToggleButton } from "./buttons/header/sidebar-toggle.js";
import { injectTabsPanelToggleButton } from "./buttons/header/tabs-panel-toggle.js";
import { moveTocBtnToHeader } from "./buttons/header/toc-toggle.js";

import { elements } from "../utils/state/dom.js";
import { setElementTocButton } from "../utils/state/setters/dom.js";

const headerElementSources = new WeakMap();

/**
 * INJECT SITE HEADER
 * Creates the header once and refreshes its page-specific contents.
 */
export function injectHeader() {
  watchHeaderBeforeCache();
  let header = document.querySelector(".site-header");
  if (!header) {
    header = document.createElement("header");
    header.className = "site-header";
    injectHeaderContainers(header);
    document.body.insertBefore(header, document.body.firstChild);
  }

  refreshHeader(header);
}

function watchHeaderBeforeCache() {
  if (document.documentElement.dataset.headerBeforeCacheBound) return;
  document.documentElement.dataset.headerBeforeCacheBound = "true";

  document.addEventListener("turbo:before-cache", () => {
    document.querySelectorAll(".site-header").forEach((header) => {
      const movedElements = [
        ...header.querySelectorAll(".gretel-breadcrumbs"),
        ...header.querySelectorAll(".toc-toggle-button"),
        ...header.querySelectorAll(".logged-out-nav"),
      ];

      movedElements.forEach((element) => {
        const source = headerElementSources.get(element);
        if (source?.marker.isConnected) source.marker.before(element);
        source?.marker.remove();
        headerElementSources.delete(element);
      });

      header.remove();
    });

    document
      .querySelectorAll("#ls-ui-script-styles, .toast-container, .tab-tooltip")
      .forEach((element) => element.remove());
  });
}

/**
 * INJECT HEADER CONTAINERS
 * Injects three .site-header__container elements to the .site-header
 *
 * @param {HTMLElement} headerEl The header element to which the containers will be appended.
 */
function injectHeaderContainers(headerEl) {
  for (let i = 0; i < 3; i += 1) {
    const createHeaderContainer = () => {
      const containerEl = document.createElement("div");
      const containerNum = i + 1;
      containerEl.classList.add("site-header__container", `container-${containerNum}`);

      if (containerNum === 3) {
        injectSettingsToggleButton(containerEl);
        injectSettingsMenu(containerEl);
      }

      return containerEl;
    };

    headerEl.appendChild(createHeaderContainer());
  }
}

/**
 * REFRESH HEADER
 * Reconciles page controls without replacing settings or their event handlers.
 */
function refreshHeader(header) {
  const left = header.querySelector(".container-1");
  const center = header.querySelector(".container-2");
  const right = header.querySelector(".container-3");
  const hasSidebar = !!document.querySelector(".nav-drawer");
  const loggedOutNav = refreshNativeElement(".columns:has(> #logo + .nav)", left, {
    keepAcrossPages: true,
    available: !hasSidebar,
  });
  if (loggedOutNav) {
    loggedOutNav.classList.remove("clearfix");
    loggedOutNav.classList.add("logged-out-nav");
  }

  const sidebarToggle = refreshToggle(left, ".btn--toggle-sidebar", hasSidebar, injectSidebarToggleButton);
  if (sidebarToggle && left.firstChild !== sidebarToggle) left.insertBefore(sidebarToggle, left.firstChild);

  const breadcrumbs = refreshNativeElement(".gretel-breadcrumbs", center);
  refreshTitle(center, !!breadcrumbs || !!loggedOutNav);

  const tabsToggle = refreshToggle(
    right,
    ".btn--toggle-tabs-panel",
    !!elements.native.tabsPanel,
    injectTabsPanelToggleButton,
  );
  const tocButton = refreshNativeElement(".toc-toggle-button", right, {
    onMove: (button) => moveTocBtnToHeader(right, button),
  });
  setElementTocButton(tocButton);

  const settingsToggle = right.querySelector(".btn--toggle-settings");
  if (tocButton && tocButton.nextSibling !== settingsToggle) right.insertBefore(tocButton, settingsToggle);
  const nextControl = tocButton || settingsToggle;
  if (tabsToggle && tabsToggle.nextSibling !== nextControl) right.insertBefore(tabsToggle, nextControl);
}

/**
 * REFRESH NATIVE ELEMENT
 * A source marker distinguishes a retained native control from stale header content
 * when the page changes or native markup is replaced at the same URL.
 */
function refreshNativeElement(selector, containerEl, { keepAcrossPages = false, available = true, onMove } = {}) {
  const header = containerEl.closest(".site-header");
  const currentElement = containerEl.querySelector(selector);
  const nextElement = available
    ? [...document.querySelectorAll(selector)].find((element) => !header.contains(element))
    : null;
  const pageUrl = `${window.location.pathname}${window.location.search || ""}`;

  if (currentElement) {
    const source = headerElementSources.get(currentElement);
    if (!nextElement && available && source?.marker.isConnected && (keepAcrossPages || source.pageUrl === pageUrl)) {
      return currentElement;
    }
    // History can change before the outgoing DOM is cached or replaced.
    // Preserve its native controls so cached book pages can restore them.
    if (available && !nextElement && source?.marker.isConnected) source.marker.before(currentElement);
    else currentElement.remove();
    source?.marker.remove();
    headerElementSources.delete(currentElement);
  }

  if (!nextElement) return null;

  const marker = document.createComment("Launch School UX Kit header source");
  nextElement.before(marker);
  headerElementSources.set(nextElement, { marker, pageUrl });
  if (onMove) onMove(nextElement);
  else containerEl.appendChild(nextElement);
  return nextElement;
}

function refreshToggle(containerEl, selector, available, injectButton) {
  const button = containerEl.querySelector(selector);
  if (!available) {
    button?.remove();
    return null;
  }
  if (!button) injectButton(containerEl);
  return containerEl.querySelector(selector);
}

/**
 * REFRESH TITLE
 * Uses the current page title when no breadcrumbs or logged-out navigation exist.
 */
function refreshTitle(containerEl, hasNativeHeading) {
  let headerTitle = containerEl.querySelector(".title-text");
  if (hasNativeHeading) {
    headerTitle?.remove();
    return;
  }

  const currentUrl = window.location.pathname;
  let titleEl;

  if (currentUrl.startsWith("/course_catalog/")) {
    // Add the courses-tabs title if on the courses page
    titleEl = document.querySelector(".courses-tabs li.active a");
  } else {
    titleEl = document.querySelector("title");
  }

  const titleText = titleEl?.textContent.trim();
  const defaultTitle = "Launch School - an online school for Software Engineers";

  if (!titleText || titleText === defaultTitle) {
    headerTitle?.remove();
    return;
  }
  if (!headerTitle) {
    headerTitle = document.createElement("div");
    headerTitle.classList.add("title-text");
    containerEl.appendChild(headerTitle);
  }
  if (headerTitle.textContent !== titleText) headerTitle.textContent = titleText;
}

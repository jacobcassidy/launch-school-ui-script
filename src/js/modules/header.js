/**
 * SITE HEADER FUNCTIONS
 */
import { colorLog } from "./helpers/utility.js";
import {
  elements,
  states,
  getHeaderElement,
  setHeaderElement,
  setIsHeaderTop,
  setIsHeaderPinned,
  setIsHeaderUnpinned,
} from "./helpers/state.js";
import { hideSidebar, hideHeader, hideTabsPanel } from "./helpers/hide.js";
import { showHeader, showSidebar, showTabsPanel } from "./helpers/show.js";

// import { elements, setIsHeaderPinned, setIsHeaderUnpinned } from "./state.js";

const { header, tabsPanel, contentPanel, tabsPanelToggleButton } = elements;
const { isHeaderPinned, isHeaderUnpinned, isHeaderTop } = states;

// TODO - Update all siteHeader mods to include the mods in setSiteHeaderElement()
/**
 * ADD SITE HEADER
 */
export function addHeader() {
  console.log("Running addHeader()");

  const currentDomHeader = document.querySelector(".site-header");

  if (getHeaderElement() !== currentDomHeader) setHeaderElement(currentDomHeader);
  if (currentDomHeader) return;

  // Native app nav items
  const breadcrumbsEl = document.querySelector(".gretel-breadcrumbs");
  const bookTocBtn = document.querySelector(".toc-toggle-button");

  // Hide the sidebar if it's showing
  hideSidebar();

  createHeader();

  const headerContainers = header.querySelectorAll(".site-header__container");
  const headerContainer1 = headerContainers[0];
  const headerContainer2 = headerContainers[1];
  const headerContainer3 = headerContainers[2];

  // Add elements to .site-header > .container-1
  if (headerContainer1) {
    createShowSidebarButton(headerContainer1);
    moveLoggedOutNavToHeader(headerContainer1);
  }

  // Add elements to .site-header > .container-2
  if (headerContainer2) {
    // If breadcrumbs exist, move them inside the .site-header, otherwise add the title there.
    if (breadcrumbsEl) {
      headerContainer2.append(breadcrumbsEl);
    } else {
      addTitleToHeaderWithNoBreadcrumbs(headerContainer2);
    }
  }

  // Add elements to .site-header > .container-3
  if (headerContainer3) {
    // Move book TOC button inside .site-header
    if (bookTocBtn) {
      bookTocBtn.classList.add("site-header__button");
      headerContainer3.append(bookTocBtn);
    }

    createToggleTabsPanelButton(headerContainer3);
  }

  // Set headerContainer CSS Custom Properties after all headerContainers modified
  addHeaderContainerOffsets();

  // TODO - Update this
  // if (isHeaderHidden) {
  //   header.classList.add("is-unpinned");
  //   isHeaderPinned = false;
  //   isHeaderUnpinned = true;
  //   hideHeader();
  // }
}

/**
 * UPDATE SITE HEADER VISIBILITY
 */
// TODO - Update this
export function updateHeaderVisibility() {
  console.log("Running updateHeaderVisibility()");

  if (scrollEl?.scrollTop <= 2) {
    setIsHeaderTop(true);
    setIsHeaderPinned(false);
    setIsHeaderUnpinned(false);
    showHeader();
  } else {
    if (isHeaderPinned || isHeaderUnpinned || !isHeaderTop) return;
    setIsHeaderTop(false);
    hideHeader();
  }
}

/**
 * Creates and adds a new header.site-header element to the DOM with 3 inner .headerContainers
 */
const createHeader = () => {
  console.log("Running createHeader()");

  const siteHeaderEl = document.createElement("header");
  siteHeaderEl.className = "site-header";

  // Add three div.headerContainers inside `.site-header`
  for (let i = 0; i < 3; i += 1) {
    const containerEl = document.createElement("div");
    containerEl.classList.add("site-header__container", `container-${i + 1}`);
    siteHeaderEl.appendChild(containerEl);
  }

  // Insert site header as first element in body
  document.body.insertBefore(siteHeaderEl, document.body.firstChild);
  const siteHeader = document.querySelector(".site-header");
  setHeaderElement(siteHeader);
};

/**
 * Creates and adds a button.btn--toggle-tabs-panel element in the .site-header to toggle the Tabs Panel when clicked
 * @param {HTMLElement} parentEL The parent element to which the button will be appended.
 */
const createToggleTabsPanelButton = (parentEl) => {
  if (!tabsPanel) return;

  const existingButton = document.querySelector(".btn--toggle-tabs-panel");
  if (existingButton) return;

  const tabsPanelToggleButtonEl = document.createElement("button");
  tabsPanelToggleButtonEl.classList.add("site-header__button", "btn--toggle-tabs-panel");
  tabsPanelToggleButtonEl.innerHTML = "&#10022;";
  parentEl?.appendChild(tabsPanelToggleButtonEl);

  tabsPanelToggleButton = document.querySelector(".btn--toggle-tabs-panel");

  // Toggle Tabs Panel on button click
  tabsPanelToggleButton?.addEventListener("click", function () {
    if (tabsPanel.classList.contains("hidden")) {
      showTabsPanel();
    } else {
      hideTabsPanel();
    }
  });
};

/**
 * Moves the logged out nav to the .site-header when user is logged out
 * @param {HTMLElement} parentEL The parent element to which the logged-out nav will be appended.
 */
const moveLoggedOutNavToHeader = (parentEl) => {
  const loggedOutNav = document.querySelector(".columns:has(> #logo + .nav)");

  if (!loggedOutNav) return;

  const hasLoggedOutNavInHeader = header.querySelector(".logged-out-nav");

  if (!hasLoggedOutNavInHeader) {
    loggedOutNav.classList.remove("clearfix");
    loggedOutNav.classList.add("logged-out-nav");
    parentEl.appendChild(loggedOutNav);
  }
};

// TODO - Update .container to .site-header__container
/**
 * Adds the offset style variables for the site-header.container elements
 */
function addHeaderContainerOffsets() {
  console.log("Running addHeaderContainerOffsets()");

  const headerContainer1Width = headerContainer1.offsetWidth;
  const headerContainer3Width = headerContainer3.offsetWidth;
  const siteHeaderPadding = 10;
  const gapBetweenContainers = 20;
  const sidebarWidth = 195;
  const navExpandBtnWidth = 30;
  const headerContainer2LeftOffset = headerContainer1Width + siteHeaderPadding + gapBetweenContainers;
  const headerContainer2RightOffset = headerContainer3Width + siteHeaderPadding + gapBetweenContainers;
  const headerContainer2SidebarLeftOffset = sidebarWidth + navExpandBtnWidth + gapBetweenContainers;
  const root = document.documentElement;

  root.style.setProperty("--header-container2-left-offset", `${headerContainer2LeftOffset}px`);
  root.style.setProperty("--header-container2-right-offset", `${headerContainer2RightOffset}px`);
  root.style.setProperty("--header-container2-sidebar-left-offset", `${headerContainer2SidebarLeftOffset}px`);
}

/**
 * Adds the non-default HTML title to the .headerContainer2 element if breadcrumbs don't exist
 * @param {HTMLElement} parentEL The parent element to which the title will be appended.
 */
const addTitleToHeaderWithNoBreadcrumbs = (parentEl) => {
  const loggedOutNav = document.querySelector(".columns:has(> #logo + .nav)");
  if (loggedOutNav) return;

  const titleEl = document.querySelector("title");
  const title = titleEl.innerText;
  const defaultTitle = "Launch School - an online school for Software Engineers";

  // Don't add the title if it's the default one.
  if (title === defaultTitle) return;

  const newTitleEl = document.createElement("div");
  newTitleEl.classList.add("title-text");
  newTitleEl.innerHTML = title;
  parentEl?.append(newTitleEl);
};

/**
 * Creates and adds a button.btn--show-sidebar element in the .site-header to open the sidebar when clicked.
 * @param {HTMLElement} parentEL The parent element to which the button will be appended.
 */
const createShowSidebarButton = (parentEl) => {
  let showSidebarBtn = document.querySelector(".btn--show-sidebar");
  if (showSidebarBtn) return;

  const createShowSidebarButtonEl = document.createElement("button");
  createShowSidebarButtonEl.classList.add("site-header__button", "btn--show-sidebar");

  for (let i = 0; i < 3; i += 1) {
    const lineEl = document.createElement("span");
    lineEl.classList.add("hamburger-line");
    createShowSidebarButtonEl.appendChild(lineEl);
  }

  parentEl?.appendChild(createShowSidebarButtonEl);
  showSidebarBtn = document.querySelector(".btn--show-sidebar");
  showSidebarBtn?.addEventListener("click", () => showSidebar());
};

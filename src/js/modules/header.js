import { colorLog } from "./helpers/log.js";
import { setTabsPanelElement, setHeaderElement } from "./helpers/state.js";
import settingsIcon from "../../svg/settings.svg";
import panelsIcon from "../../svg/panels.svg";
// import { watchShowSidebarBtn } from "./helpers/watch.js";

/**
 * INJECT SITE HEADER
 */
export function injectHeader() {
  colorLog.run("Running injectHeader()");
  const currentDomHeader = document.querySelector(".site-header");
  if (currentDomHeader) return;

  const newHeader = createHeader();
  document.body.insertBefore(newHeader, document.body.firstChild);

  injectContainerStyleOffsets();

  // Set Header Properties
  // const sidebarButton = document.querySelector(".btn--show-sidebar");
  // setSidebarButtonElement(sidebarButton);
  // setTabsPanelToggleButtonElement(document.querySelector(".btn--toggle-tabs-panel"));

  // Watch Header Elements
  // watchShowSidebarBtn();
}

/**
 * ADD CONTAINER ELEMENTS
 * Adds elements to each .site-header__container
 *
 * @param {HTMLDivElement} containerEl The container to which the elements will be appended..
 * @param {number} containerNum The number of the container to which the elements will be appended.
 */
function addContainerElements(containerEl, containerNum) {
  if (containerNum === 1) {
    createShowSidebarButton(containerEl);
    addLoggedOutNavToHeader(containerEl);
  }

  if (containerNum === 2) {
    // If breadcrumbs exist, move them inside the container, otherwise add the title there.
    const breadcrumbs = document.querySelector(".gretel-breadcrumbs");

    if (breadcrumbs) {
      containerEl.append(breadcrumbs);
    } else {
      addTitleToHeaderWithNoBreadcrumbs(containerEl);
    }
  }

  if (containerNum === 3) {
    // If a book TOC button exists, move it inside the container.
    const bookTocBtn = document.querySelector(".toc-toggle-button");

    if (bookTocBtn) {
      bookTocBtn.classList.add("site-header__button");
      containerEl.append(bookTocBtn);
    }

    createTabsPanelToggleButton(containerEl);
    createSettingsMenu(containerEl);
  }
}

/**
 * ADD LOGGED-OUT NAV TO HEADER
 * Moves the logged out nav to the .site-header when the user is logged out
 *
 * @param {HTMLDivElement} containerEl The container to which the logged-out nav will be appended.
 */
function addLoggedOutNavToHeader(containerEl) {
  const loggedOutNav = document.querySelector(".columns:has(> #logo + .nav)");
  if (loggedOutNav) {
    loggedOutNav.classList.remove("clearfix");
    loggedOutNav.classList.add("logged-out-nav");

    containerEl.appendChild(loggedOutNav);
  }
}

/**
 * ADD TITLE TO HEADER WITH NO BREADCRUMBS
 * If breadcrumbs don't exist, adds the non-default HTML title to the .site-header__container
 *
 * @param {HTMLDivElement} containerEl The container to which the title will be appended.
 */
function addTitleToHeaderWithNoBreadcrumbs(containerEl) {
  // Don't add title when the logged-out nav exists.
  const loggedOutNav = document.querySelector(".columns:has(> #logo + .nav)");
  if (loggedOutNav) return;

  const titleEl = document.querySelector("title");
  const titleText = titleEl.innerText;
  const defaultTitle = "Launch School - an online school for Software Engineers";

  // Don't add the title if it's the default one.
  if (titleText === defaultTitle) return;

  const newTitleEl = document.createElement("div");
  newTitleEl.classList.add("title-text");
  newTitleEl.innerHTML = titleText;

  containerEl.append(newTitleEl);
}

/**
 * CREATE HEADER
 * Creates a new .site-header element to inject in the DOM
 */
function createHeader() {
  colorLog.run("Running createHeader()");
  const siteHeaderEl = document.createElement("header");
  siteHeaderEl.className = "site-header";

  createHeaderContainers(siteHeaderEl);

  return siteHeaderEl;
}

/**
 * CREATE HEADER CONTAINERS
 * Creates and appends three .site-header__container elements to the .site-header
 *
 * @param {HTMLElement} headerEl The header element to which the containers will be appended.
 */
function createHeaderContainers(headerEl) {
  for (let i = 0; i < 3; i += 1) {
    const createHeaderContainerEl = () => {
      const containerEl = document.createElement("div");
      const containerNum = i + 1;
      containerEl.classList.add("site-header__container", `container-${containerNum}`);

      addContainerElements(containerEl, containerNum);

      return containerEl;
    };

    headerEl.appendChild(createHeaderContainerEl());
  }
}

/**
 * CREATE SETTINGS MENU
 */
function createSettingsMenu(containerEl) {
  const createSettingsMenuEl = () => {
    const settingsMenuEl = document.createElement("div");
    settingsMenuEl.classList.add("settings-menu");
    settingsMenuEl.innerText = "Hide header by default";
    return settingsMenuEl;
  };

  const createSettingsMenuToggleButtonEl = () => {
    const settingsMenuToggleButtonEl = document.createElement("button");
    settingsMenuToggleButtonEl.classList.add("site-header__button", "btn--settings-menu-toggle");
    settingsMenuToggleButtonEl.innerHTML = settingsIcon;
    return settingsMenuToggleButtonEl;
  };

  containerEl.append(createSettingsMenuToggleButtonEl());
  containerEl.append(createSettingsMenuEl());
}

/**
 * CREATE SHOW SIDEBAR BUTTON
 * Creates and appends a .btn--show-sidebar element in the .site-header__container to open the sidebar when clicked.
 *
 * @param {HTMLDivElement} containerEl The container to which the button will be appended.
 */
function createShowSidebarButton(containerEl) {
  const createShowSidebarButtonEl = () => {
    const showSidebarButtonEl = document.createElement("button");
    showSidebarButtonEl.classList.add("site-header__button", "btn--show-sidebar");

    // Add hamburger icon to button
    for (let i = 0; i < 3; i += 1) {
      const lineEl = document.createElement("span");
      lineEl.classList.add("hamburger-line");
      showSidebarButtonEl.appendChild(lineEl);
    }

    return showSidebarButtonEl;
  };

  containerEl.appendChild(createShowSidebarButtonEl());
}

/**
 * INJECT TABS PANEL TOGGLE BUTTON
 * Creates and injects a .btn--toggle-tabs-panel element in the .site-header to toggle the Tabs Panel when clicked
 *
 * @param {HTMLDivElement} containerEl The container to which the button will be appended.
 */
function createTabsPanelToggleButton(containerEl) {
  const tabsPanel = document.querySelector(".tabs-panel");
  if (!tabsPanel) return;

  const createTabsPanelToggleButtonEl = () => {
    const tabsPanelToggleButtonEl = document.createElement("button");
    tabsPanelToggleButtonEl.classList.add("site-header__button", "btn--toggle-tabs-panel");
    tabsPanelToggleButtonEl.innerHTML = panelsIcon;
    return tabsPanelToggleButtonEl;
  };

  containerEl.appendChild(createTabsPanelToggleButtonEl());
}

/**
 * INJECT CONTAINER STYLE OFFSETS
 * Adds the offset style variables for the .site-header__container elements
 */
function injectContainerStyleOffsets() {
  console.log("Running injectContainerStyleOffsets()");
  const container1 = document.querySelector(".site-header__container.container-1");
  const container3 = document.querySelector(".site-header__container.container-3");
  const container1Width = container1?.offsetWidth || 0;
  const container3Width = container3?.offsetWidth || 0;
  const siteHeaderPadding = 10;
  const gapBetweenContainers = 20;
  const sidebarWidth = 195;
  const navExpandBtnWidth = 30;
  const container2LeftOffset = container1Width + siteHeaderPadding + gapBetweenContainers;
  const container2RightOffset = container3Width + siteHeaderPadding + gapBetweenContainers;
  const container2SidebarLeftOffset = sidebarWidth + navExpandBtnWidth + gapBetweenContainers;
  const root = document.documentElement;

  root.style.setProperty("--header-container2-left-offset", `${container2LeftOffset}px`);
  root.style.setProperty("--header-container2-right-offset", `${container2RightOffset}px`);
  root.style.setProperty("--header-container2-sidebar-left-offset", `${container2SidebarLeftOffset}px`);
}

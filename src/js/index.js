// ==UserScript==
// @name         LaunchSchool UI Modifications
// @namespace    https://tampermonkey.net/
// @version      2026-07-11
// @description  Update the Launch School UI for better usability (minimizing distractions, improving layout, etc.)
// @author       You
// @match        https://launchschool.com/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=launchschool.com
// @grant        none
// ==/UserScript==

import { initScript } from "./modules/init.js";

// Initial script load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initScript, { once: true });
} else {
  initScript();
}

// // Elements
// let scrollEl = null;
// let tabsPanelToggleButton = null;

// // Data
// let lastUrl = null;
// let previousBody = null;

// // Panels
// let contentPanel = null;
// let instructionsPanel = null;
// let tabsPanel = null;

// // States
// let isHeaderHidden = sessionStorage.getItem("isHeaderHidden") === "true";
// let isHeaderPinned = false;
// let isHeaderTop = false;
// let isHeaderUnpinned = false;
// let isReloadScheduled = false;

// // Timers
// let observerTimeoutId;

/**
 * Script Initialization
 */
import { loadUI } from "./modules/helpers/load.js";
import { watchForPageChange } from "./modules/helpers/watch.js";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}

function init() {
  loadUI();
  watchForPageChange();
}

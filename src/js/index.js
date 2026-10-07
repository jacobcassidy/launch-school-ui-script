/**
 * SCRIPT INITIALIZATION
 */
import { setLastUrl } from "./modules/utils/state/index.js";
import { loadUI } from "./modules/utils/helpers/index.js";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}

function init() {
  setLastUrl(`${location.origin}${location.pathname}${location.search}`);
  loadUI();
}

/**
 * INDEX
 */
import { initScript } from "./modules/helpers/init.js";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initScript, { once: true });
} else {
  initScript();
}

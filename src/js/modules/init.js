/**
 * Script Initialization
 *
 * This function is only loaded on the first initialization of the script.
 */

import { colorLog } from "./helpers/utility.js";
import { loadUI } from "./load.js";
import { watchForPageChange } from "./helpers/watch.js";

export function initScript() {
  colorLog.run("Running initScript()");
  loadUI();
  watchForPageChange();
}

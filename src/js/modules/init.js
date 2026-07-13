/**
 * Script Initialization
 *
 * This function is only loaded on the first initialization of the script.
 */

import { colorLog } from "./helpers/utilities.js";
import { loadUI } from "./load.js";
import { detectNavChange } from "./helpers/detection.js";

export function initScript() {
  colorLog.run("Running initScript()");
  loadUI();
  detectNavChange();
}

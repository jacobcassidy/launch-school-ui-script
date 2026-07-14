/**
 * TOASTER
 */
import { colorLog } from "./helpers/log";

export function injectToaster() {
  colorLog.run("Running injectToaster()");

  const createToasterEl = () => {
    const toasterEl = document.createElement("div");
    toasterEl.classList.add("toast-container");
    return toasterEl;
  };

  document.body.appendChild(createToasterEl());
}

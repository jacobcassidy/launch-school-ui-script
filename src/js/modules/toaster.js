/**
 * TOASTER
 */
// import { colorLog } from "./helpers/log";

/**
 * INJECT TOASTER
 * Appends a div.toast-container to the body that is used to show toasts.
 */
export function injectToaster() {
  // colorLog.run("Running injectToaster()");

  const createToasterEl = () => {
    const toasterEl = document.createElement("div");
    toasterEl.classList.add("toast-container");
    return toasterEl;
  };

  document.body.appendChild(createToasterEl());
}

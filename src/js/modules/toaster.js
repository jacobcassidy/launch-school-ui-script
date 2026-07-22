/**
 * TOASTER
 * @module toaster
 */

/**
 * INJECT TOASTER
 * Appends a div.toast-container to the body that is used to show toasts.
 */
export function injectToaster() {
  const createToaster = () => {
    const toasterEl = document.createElement("div");
    toasterEl.classList.add("toast-container");
    return toasterEl;
  };

  document.body.appendChild(createToaster());
}

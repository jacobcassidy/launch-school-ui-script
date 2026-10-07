/**
 * TOASTER
 * @module components/toaster
 */

/**
 * INJECT TOASTER
 * Appends a div.toast-container to the body that is used to show toasts.
 */
export function injectToaster() {
  const existingToaster = document.querySelector(".toast-container");
  if (existingToaster) return existingToaster;

  const createToaster = () => {
    const toasterEl = document.createElement("div");
    toasterEl.classList.add("toast-container");
    return toasterEl;
  };

  const toasterEl = createToaster();
  document.body.appendChild(toasterEl);
  return toasterEl;
}

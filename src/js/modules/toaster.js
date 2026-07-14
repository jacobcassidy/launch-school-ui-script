/**
 * TOASTER
 */
export function createToaster() {
  console.log("Running createToaster()");

  const toasterEl = document.createElement("div");
  toasterEl.classList.add("toast-container");
  document.body.appendChild(toasterEl);
}

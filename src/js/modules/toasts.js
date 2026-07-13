/**
 * ADD TOASTER
 */
export function addToaster() {
  console.log("Running addToaster()");

  const toasterEl = document.createElement("div");
  toasterEl.classList.add("toast-container");
  document.body.appendChild(toasterEl);
}

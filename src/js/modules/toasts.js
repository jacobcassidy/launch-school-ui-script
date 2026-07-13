/**
 * ADD TOASTER
 */
function addToaster() {
  console.log("Running addToaster()");

  const toasterEl = document.createElement("div");
  toasterEl.classList.add("toast-container");
  document.body.appendChild(toasterEl);
}

/**
 * SHOW TOAST
 *
 * @param {string} message The text to display in the toast
 * @param {number} duration How long the toast should display
 */
function showToast(message, duration = 2500) {
  console.log("Running showToast()");

  const toastContainer = document.querySelector(".toast-container");
  const toast = document.createElement("div");

  toast.className = "toast";
  toast.textContent = message;
  toastContainer.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  // Remove after duration
  setTimeout(() => {
    toast.classList.remove("show");
    toast.addEventListener("transitionend", () => toast.remove(), { once: true });
  }, duration);
}

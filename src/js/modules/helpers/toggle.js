/**
 * TOGGLE SIDEBAR
 */
function toggleSidebar() {
  console.log("Running toggleSidebar()");

  const isSidebarClosed = document.querySelector("#navbar-collapsor").checked;

  if (isSidebarClosed) {
    showSidebar();
  } else {
    hideSidebar();
  }
}

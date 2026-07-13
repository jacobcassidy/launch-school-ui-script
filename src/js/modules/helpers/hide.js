/**
 * HIDE SIDEBAR
 */
function hideSidebar() {
  console.log("Running hideSidebar();");
  const hideSidebarBtn = document.querySelector("#navbar-collapsor");
  const isSidebarOpen = hideSidebarBtn && !hideSidebarBtn.checked;
  if (isSidebarOpen) hideSidebarBtn.click();
}

/**
 * HIDE SITE-HEADER
 */
function hideHeader() {
  console.log("Running hideHeader()");

  siteHeader.classList.add("is-hidden");
  isHeaderHidden = true;
  sessionStorage.setItem("isHeaderHidden", isHeaderHidden);
}

/**
 * HIDE TABS PANEL
 */
function hideTabsPanel() {
  console.log("Running hideTabsPanel()");

  tabsPanel.classList.add("hidden", "panel-collapsed");
  contentPanel.classList.remove("halfWidth");
  tabsPanel.classList.remove("halfWidth");
  tabsPanelToggleButton.classList.remove("active");
}

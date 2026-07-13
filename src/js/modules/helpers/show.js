/**
 * SHOW SIDEBAR
 */
function showSidebar() {
  console.log("Running showSidebar()");

  const showSidebarBtn = document.querySelector("#navbar-expand");
  const isSidebarClosed = document.querySelector("#navbar-collapsor").checked;
  if (isSidebarClosed) showSidebarBtn.click();
}

/**
 * SHOW SITE-HEADER
 */
function showHeader() {
  console.log("Running showHeader()");

  siteHeader.classList.remove("is-hidden");
  isHeaderHidden = false;
  sessionStorage.setItem("isHeaderHidden", isHeaderHidden);
}

/**
 * SHOW TABS PANEL
 */
function showTabsPanel() {
  console.log("Running showTabsPanel()");

  tabsPanel.classList.remove("hidden", "panel-collapsed");
  contentPanel.classList.add("halfWidth");
  tabsPanel.classList.add("halfWidth");
  tabsPanelToggleButton.classList.add("active");
}

/**
 * SHOW LSBOT PANEL WHEN SUBMITTING ANSWERS IN THE LSBOT QUESTION BOX
 */
function showLSBotPanelOnQbSubmission() {
  console.log("Running showLSBotPanelOnQbSubmission()");

  const qbTextareas = document.querySelectorAll(".lsbot-question-box-answer-input");
  const qbSubmitBtns = document.querySelectorAll(".lsbot-question-box-send-answer-button");
  if (!qbTextareas.length || !qbSubmitBtns.length || !tabsPanel) return;

  const lsbotPanel = document.querySelector("#tab-lsbot-help");

  // Show LSBot Tabs Panel on submission button click
  qbSubmitBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      handleFocus(lsbotPanel);
      showTabsPanel();
    });
  });

  // Show LSBot Tabs Panel on hotkey submission `CMD + Enter`
  qbTextareas.forEach((qbTextarea) => {
    const handleHotkeySubmission = () => {
      console.log("Running handleHotkeySubmission()");

      const isCmdEnter = event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey && event.key === "Enter";
      if (!isCmdEnter) return;
      handleFocus(lsbotPanel);
      showTabsPanel();
    };

    qbTextarea.addEventListener("focus", () => qbTextarea.addEventListener("keydown", handleHotkeySubmission));
    qbTextarea.addEventListener("blur", () => qbTextarea.removeEventListener("keydown", handleHotkeySubmission));
  });
}

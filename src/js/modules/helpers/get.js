/**
 * GET TAB BUTTON TEXTAREA ELEMENT
 *
 * @param {HTMLElement} tabBtn The .tab-button element to get the matching textarea for
 * @returns The textarea element for the connected .tab-button
 */
function getTabBtnTextarea(tabBtn) {
  console.log("Running getTabBtnTextarea()");

  const isTabButton = tabBtn.classList.contains("tab-button");
  if (!isTabButton) return;

  const tabButtonData = tabBtn?.dataset?.tab;
  if (!tabButtonData) return;

  const tabContainerId = `tab-${tabButtonData}`;
  const tabContainer = document.getElementById(tabContainerId);
  if (!tabContainer) return;

  const tabContainerTextarea =
    tabContainer.querySelector(".CodeMirror textarea") || tabContainer.querySelector("textarea") || null;
  if (!tabContainerTextarea) return;

  return tabContainerTextarea;
}

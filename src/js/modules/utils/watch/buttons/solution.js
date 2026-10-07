/**
 * WATCH VIEW SOLUTIONS BUTTON
 * @module utils/watch/buttons/solution
 */

/**
 * Preserves the solution icon pair when native code updates the button.
 * CSS selects the visible icon based on the collapse state.
 */
export function watchViewSolutionBtn(btn, svgIcons) {
  const parent = document.querySelector("#exercise_analysis .markup-collapse");
  if (!parent) {
    return;
  }

  if (btn.dataset.viewSolutionBtnEventBound) return;
  btn.dataset.viewSolutionBtnEventBound = "true";

  let currentIcons = [];

  const syncIcons = () => {
    const injectedIcons = [...btn.querySelectorAll(":scope > .is-new-icon")];
    if (
      currentIcons.length === svgIcons.length &&
      injectedIcons.length === currentIcons.length &&
      currentIcons.every((icon) => injectedIcons.includes(icon))
    )
      return;

    injectedIcons.forEach((icon) => icon.remove());
    currentIcons = svgIcons.map((createIcon) => {
      const icon = createIcon();
      icon.classList.add("is-new-icon");
      return icon;
    });
    currentIcons.forEach((icon) => btn.prepend(icon));
  };

  syncIcons();

  const observer = new MutationObserver(syncIcons);

  observer.observe(parent, {
    attributes: true,
    attributeFilter: ["class"],
  });
  observer.observe(btn, { childList: true });
}

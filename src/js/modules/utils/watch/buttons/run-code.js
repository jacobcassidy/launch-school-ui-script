/**
 * WATCH RUN CODE BUTTONS
 * @module utils/watch/buttons/run-code
 */

/**
 * Updates the run code button icon based on the current status the button holds.
 *
 * @param {HTMLButtonElement} btn The run code button element.
 * @param {function(): SVGElement} runIcon Creates the run code SVG icon.
 * @param {function(): SVGElement} stopIcon Creates the stop code SVG icon.
 */
export function watchRunCodeBtn(btn, runIcon, stopIcon) {
  if (!btn) return;

  if (watchedRunCodeButtons.has(btn)) return;
  watchedRunCodeButtons.add(btn);

  let currentIcon;
  let previousIsStopped;

  const syncIcon = () => {
    const isStopped = btn.classList.contains("stop-button");
    const injectedIcons = [...btn.querySelectorAll(":scope > .is-new-icon")];
    if (isStopped === previousIsStopped && injectedIcons.length === 1 && injectedIcons[0] === currentIcon) return;

    injectedIcons.forEach((icon) => icon.remove());
    currentIcon = isStopped ? stopIcon() : runIcon();
    currentIcon.classList.add("is-new-icon");
    btn.prepend(currentIcon);
    previousIsStopped = isStopped;
  };

  syncIcon();

  const observer = new MutationObserver(syncIcon);

  observer.observe(btn, {
    attributes: true,
    attributeFilter: ["class"],
    childList: true,
  });
}
const watchedRunCodeButtons = new WeakSet();

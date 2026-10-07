/**
 * WATCH FOR NEW COPY MARKUP BUTTONS
 * @module utils/watch/buttons/new-copy-markup
 */

// Import components
import { updateCopyMarkupButton } from "../../../components/buttons/panels/copy-markup.js";

const watchedTabContents = new WeakSet();

/**
 * Adds the copy markup button classes when new copy markup buttons are added to .tab-content in the DOM
 */
export function watchForNewCopyMarkupBtns() {
  const tabContent = document.querySelector(".tab-content");
  if (!tabContent) return;

  if (watchedTabContents.has(tabContent)) return;
  watchedTabContents.add(tabContent);

  const observer = new MutationObserver((mutationList) => {
    const btns = [];

    mutationList.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;

        if (node.matches(".markup-copy-block button")) {
          btns.push(node);
        }

        btns.push(...node.querySelectorAll(".markup-copy-block button"));
      });
    });

    updateCopyMarkupButton(btns);
  });

  observer.observe(tabContent, {
    childList: true,
    subtree: true,
  });
}

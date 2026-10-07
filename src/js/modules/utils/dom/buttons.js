/**
 * DOM button helpers.
 * @module utils/dom/buttons
 */

/**
 * Add icons and optional classes to a collection of buttons.
 *
 * @param {Array} btnEls Button elements to update.
 * @param {Array} newIcons Icon factories to insert.
 * @param {Array} btnClasses Classes to add to each button.
 * @param {Boolean} append Append icons instead of prepending them.
 */
export function setButtonProperties(btnEls, newIcons, btnClasses = [], append = false) {
  if (btnEls.length < 1 || newIcons.length < 1) return;

  btnEls.forEach((btn) => {
    if (!btn || btn.classList.contains("has-new-icon")) return;

    btn.classList.add(...btnClasses, "has-new-icon");

    newIcons.forEach((icon) => {
      const iconEl = icon();
      iconEl.classList.add("is-new-icon");
      if (append) {
        btn.append(iconEl);
      } else {
        btn.prepend(iconEl);
      }
    });
  });
}

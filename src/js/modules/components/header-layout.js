/**
 * HEADER LAYOUT
 * Keeps the title centered while reserving equal space for the outer controls.
 */

const headerLayouts = new WeakMap();

export function watchHeaderLayout(header) {
  const existingLayout = headerLayouts.get(header);
  if (existingLayout) {
    existingLayout.update();
    return;
  }

  const left = header.querySelector(".container-1");
  const right = header.querySelector(".container-3");
  if (!left || !right || typeof ResizeObserver === "undefined") return;

  const update = () => {
    if (!header.isConnected) {
      disconnectHeaderLayout(header);
      return;
    }
    const sideWidth = Math.ceil(Math.max(left.getBoundingClientRect().width, right.getBoundingClientRect().width));
    const styles = getComputedStyle(header);
    const contentWidth =
      header.clientWidth - (parseFloat(styles.paddingInlineStart) || 0) - (parseFloat(styles.paddingInlineEnd) || 0);
    const gap = parseFloat(styles.columnGap) || 0;
    const widthValue = `${sideWidth}px`;

    if (header.style.getPropertyValue("--header-side-width") !== widthValue) {
      header.style.setProperty("--header-side-width", widthValue);
    }
    // When even an empty center cannot fit, keep only the separated controls.
    header.classList.toggle("is-crowded", contentWidth <= sideWidth * 2 + gap * 2);
  };

  const observer = new ResizeObserver(update);
  headerLayouts.set(header, { observer, update });
  for (const element of [header, left, right]) observer.observe(element);
  update();
}

export function disconnectHeaderLayout(header) {
  headerLayouts.get(header)?.observer.disconnect();
  headerLayouts.delete(header);
}

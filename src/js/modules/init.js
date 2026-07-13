/**
 * INITIALIZE THE NAV DETECTION FOR CHANGES
 */
function initNavDetection() {
  console.log("Running initNavDetection()");

  /**
   * Check for URL Change
   * @param {string} from Where this function was called from.
   */
  const checkForUrlChange = (from) => {
    colorLog.detail(`Running checkForUrlChange() from ${from}`);

    const currentUrl = `${location.origin}${location.pathname}`;
    if (currentUrl === lastUrl) return;

    scheduleReload();
  };

  /**
   * Schedule UI reload for after DOM refresh.
   */
  const scheduleReload = () => {
    console.log("Running scheduleReload()");

    if (isReloadScheduled) return;
    isReloadScheduled = true;

    colorLog.info("Waiting for new DOM to be ready...");
    const startWait = performance.now();

    const waitForDom = () => {
      console.log("Running waitForDom()");

      const isNewBody = document.body !== previousBody;
      const isWaitMaxReached = performance.now() - startWait > 3000;

      if (isNewBody || isWaitMaxReached) {
        if (isWaitMaxReached) colorLog.alert("Max wait time reached.");

        colorLog.notice("New DOM is ready. Reloading UI layout.");
        loadUI();
        return;
      }
      requestAnimationFrame(waitForDom);
    };

    requestAnimationFrame(waitForDom);
  };

  /**
   * Observe document for URL changes
   */
  const observer = new MutationObserver(() => {
    colorLog.detail("Running observer()");

    clearTimeout(observerTimeoutId);
    observerTimeoutId = setTimeout(() => {
      checkForUrlChange("observer");
    }, 100);
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  // Triggered with browsers back/forward navigation
  window.addEventListener("popstate", () => {
    colorLog.notice("popstate: Browser back/forward nav");
    checkForUrlChange("popstate");
  });

  // Triggered with url hashchange such as /page to /page#section2
  window.addEventListener("hashchange", () => {
    colorLog.notice("hashchange in URL");
    checkForUrlChange("hashchange");
  });

  // document.addEventListener("turbo:load", () => {
  //   colorLog.alert("EVENT UPDATE! turbo:load");
  //   checkForUrlChange("turbo:load");
  // });

  // document.addEventListener("turbo:render", () => {
  //   colorLog.alert("EVENT UPDATE! turbo:render");
  //   checkForUrlChange("turbo:render");
  // });

  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (...args) {
    colorLog.notice("history.pushState");
    originalPushState.apply(this, args);
    checkForUrlChange("pushState");
  };

  history.replaceState = function (...args) {
    colorLog.notice("history.replaceState");
    originalReplaceState.apply(this, args);
    checkForUrlChange("replaceState");
  };
}

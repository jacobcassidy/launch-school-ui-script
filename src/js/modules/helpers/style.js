/**
 * STYLE
 * @module helpers/style
 */

// eslint-disable-next-line import-x/no-unresolved -- Used for esbuild.config.js cssTextPlugin
import stylesToInject from "virtual-esbuild:styles";

/**
 * INJECT CSS STYLES INTO LS APP
 */
export function injectStyles() {
  const existingStyles = document.getElementById("ls-ui-script-styles");
  if (existingStyles) return;

  const createStyleEl = () => {
    const style = document.createElement("style");
    style.setAttribute("id", "ls-ui-script-styles");
    style.textContent = stylesToInject;
    return style;
  };

  document.head.appendChild(createStyleEl());
}

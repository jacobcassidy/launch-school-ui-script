// eslint-disable-next-line import-x/no-unresolved -- Used for esbuild.config.js cssTextPlugin
import stylesToInject from "virtual-esbuild:styles";

/**
 * INJECT CSS STYLES INTO LS APP
 */
export default function injectStyles() {
  console.log("Running injectStyles()");

  const existingStyles = document.getElementById("ls-ui-script-styles");
  if (existingStyles) return;

  const style = document.createElement("style");
  style.setAttribute("id", "ls-ui-script-styles");
  style.textContent = stylesToInject;

  document.head.appendChild(style);
}

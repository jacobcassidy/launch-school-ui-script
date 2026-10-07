/**
 * CONVERSATION BUTTONS
 * @module components/buttons/panels/conversation
 */

// Import components
import { icons } from "../../icons.js";

// Import utils
import { setButtonProperties } from "../../../utils/dom/buttons.js";

/**
 * Updates the conversation history button styles and icon.
 */
export function updateConversationHistoryButton() {
  const btns = document.querySelectorAll(".conversation-history-button");
  if (btns.length < 1) return;

  const newIcons = [() => icons.panelIcons.conversationHistory()];
  const btnClasses = ["btn--plain"];

  setButtonProperties(btns, newIcons, btnClasses);
}

/**
 * Updates the new conversation button styles and icon.
 */
export function updateConversationNewButton() {
  const btns = document.querySelectorAll(".new-conversation-button");
  if (btns.length < 1) return;

  const newIcons = [() => icons.panelIcons.conversationNew()];
  const btnClasses = ["btn--plain"];

  setButtonProperties(btns, newIcons, btnClasses);
}

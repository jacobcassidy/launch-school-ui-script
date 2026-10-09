/**
 * WATCH PROMPT FOCUS
 * @module utils/watch/events/prompt-focus
 */

/**
 * Adds the "Enter" shortcut to focused chat prompts
 */
export function watchPromptFocus() {
  if (document.documentElement.dataset.promptFocusBound) return;
  document.documentElement.dataset.promptFocusBound = "true";
  const watchedChatInputs = new WeakSet();

  const inputSelector = ".lsbot-question-input, .lsbot-question-box-answer-input";

  const handleKeydown = (event) => {
    const chatInput = event.currentTarget;
    if (
      document.activeElement !== chatInput ||
      event.key !== "Enter" ||
      event.shiftKey ||
      event.metaKey ||
      event.ctrlKey ||
      event.altKey ||
      event.isComposing ||
      event.keyCode === 229 ||
      chatInput.disabled ||
      chatInput.readOnly
    )
      return;

    const submitSelector = chatInput.matches(".lsbot-question-box-answer-input")
      ? ".lsbot-question-box-send-answer-button"
      : ".lsbot-submit-btn";
    const container = chatInput.closest(".lsbot-question-box, .lsbot-input-area, form") || chatInput.parentElement;
    const submitButton = container?.querySelector(submitSelector);
    if (!submitButton) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    if (event.repeat || submitButton.matches(":disabled") || submitButton.getAttribute("aria-disabled") === "true")
      return;

    submitButton.click();
  };

  const bindInput = (chatInput) => {
    if (!chatInput?.matches(inputSelector) || watchedChatInputs.has(chatInput)) return;
    watchedChatInputs.add(chatInput);
    chatInput.addEventListener("keydown", handleKeydown, true);
  };

  document.addEventListener("focusin", (event) => bindInput(event.target));
  bindInput(document.activeElement);
}

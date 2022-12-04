function onKeydown(e, firstFEl, lastFEle) {
  const isTabPressed = e.key === "Tab" || e.keyCode === 9;

  if (!isTabPressed) return;

  if (e.shiftKey) {
    if (document.activeElement === firstFEl) {
      e.preventDefault();
      lastFEle.focus();
    }
  } else if (document.activeElement === lastFEle) {
    e.preventDefault();
    firstFEl.focus();
  }
}

export function startFocusClosure(selector) {
  const focusableElements =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const modal = document.querySelector(selector);

  const firstFocusableElement = modal.querySelectorAll(focusableElements)[0];
  const focusableContent = modal.querySelectorAll(focusableElements);
  const lastFocusableElement = focusableContent[focusableContent.length - 1];
  const handleKeydown = (e) =>
    onKeydown(e, firstFocusableElement, lastFocusableElement);

  document.addEventListener("keydown", handleKeydown);
  firstFocusableElement.focus();
  return handleKeydown;
}
export function stopFocusClosure(handleKeydown) {
  document.removeEventListener("keydown", handleKeydown);
}

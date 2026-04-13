let activeToast: HTMLElement | null = null;
let hideTimer: ReturnType<typeof setTimeout> | null = null;

export function showToast(message: string, duration = 1800): void {
  // Reuse existing toast if visible
  if (activeToast) {
    activeToast.textContent = message;
    if (hideTimer) clearTimeout(hideTimer);
  } else {
    const el = document.createElement('div');
    el.className =
      'toast-enter fixed bottom-6 left-1/2 -translate-x-1/2 ' +
      'bg-stone-900 text-white text-sm font-medium ' +
      'px-5 py-3 rounded-full shadow-lg z-50 pointer-events-none whitespace-nowrap';
    el.textContent = message;
    document.body.appendChild(el);
    activeToast = el;
  }

  hideTimer = setTimeout(() => {
    activeToast?.remove();
    activeToast = null;
    hideTimer = null;
  }, duration);
}

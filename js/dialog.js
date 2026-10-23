// iOS-style alerts drawn by the app, so every button is in the app's language. The system alert()
// and confirm() always say "OK" and "Cancel" in English, and a "Cancel" button on a question like
// "Cancel your monthly plan?" is ambiguous.
import { t } from './i18n.js';

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

// Shows `message` with `buttons` ({ label, value, style: 'cancel' | 'destructive' | 'preferred' })
// and resolves with the value of the button tapped.
export function showDialog({ title, message, buttons }) {
  return new Promise((resolve) => {
    const backdrop = el('div', 'dialog-backdrop');
    const box = el('div', 'dialog');
    box.setAttribute('role', 'alertdialog');
    box.setAttribute('aria-modal', 'true');
    const text = el('div', `dialog-text${title ? '' : ' no-title'}`);
    if (title) text.append(el('h2', 'dialog-title', title));
    if (message) text.append(el('p', 'dialog-message', message));
    // Two short buttons sit side by side, as on iOS; anything else stacks.
    const row = buttons.length === 2 && buttons.every((b) => b.label.length <= 14);
    const actions = el('div', `dialog-actions${row ? ' row' : ''}`);
    for (const button of buttons) {
      const node = el('button', `dialog-button ${button.style ?? ''}`, button.label);
      node.type = 'button';
      node.addEventListener('click', () => {
        backdrop.classList.remove('shown');
        setTimeout(() => backdrop.remove(), 200);
        resolve(button.value);
      });
      actions.append(node);
    }
    box.append(text, actions);
    backdrop.append(box);
    document.body.append(backdrop);
    document.activeElement?.blur();
    requestAnimationFrame(() => backdrop.classList.add('shown'));
  });
}

export function alertDialog(message) {
  return showDialog({ message, buttons: [{ label: t('ok'), value: true, style: 'preferred' }] });
}

// Resolves true if the user takes the action. `confirm` names the action ("Delete", "Cancel
// Monthly"); `cancel` defaults to Cancel.
export function confirmDialog(message, { confirm, cancel = t('cancel'), destructive = false } = {}) {
  return showDialog({
    message,
    buttons: [
      { label: cancel, value: false, style: 'cancel' },
      { label: confirm ?? t('ok'), value: true, style: destructive ? 'destructive' : 'preferred' },
    ],
  });
}

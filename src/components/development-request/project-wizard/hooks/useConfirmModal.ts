import { getFocusableElements } from '../utils/wizardHelpers';

interface ConfirmModalOptions {
  modal: HTMLElement;
  modalPanel: HTMLElement;
  cancelButton: HTMLButtonElement;
  isSending: () => boolean;
}

export const useConfirmModal = ({ modal, modalPanel, cancelButton, isSending }: ConfirmModalOptions) => {
  let modalScrollY = 0;
  let lastFocusedElement: HTMLElement | null = null;
  const originalParent = modal.parentNode;
  const originalNextSibling = modal.nextSibling;

  const restoreModalPosition = () => {
    if (!originalParent || modal.parentNode === originalParent) return;
    originalParent.insertBefore(modal, originalNextSibling?.parentNode === originalParent ? originalNextSibling : null);
  };

  const close = (force = false) => {
    if (isSending() && !force) return;

    modal.hidden = true;
    modal.classList.remove('is-open');
    document.documentElement.classList.remove('development-confirm-open', 'services-modal-open');
    document.body.classList.remove('development-confirm-body-lock', 'services-modal-body-lock');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    restoreModalPosition();
    window.scrollTo(0, modalScrollY);
    lastFocusedElement?.focus();
  };

  const open = () => {
    lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    modalScrollY = window.scrollY;

    document.documentElement.classList.add('development-confirm-open', 'services-modal-open');
    document.body.classList.add('development-confirm-body-lock', 'services-modal-body-lock');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${modalScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';

    if (modal.parentElement !== document.body) {
      document.body.appendChild(modal);
    }

    modal.hidden = false;
    modal.classList.add('is-open');
    window.requestAnimationFrame(() => cancelButton.focus());
  };

  const trapFocus = (event: KeyboardEvent) => {
    if (modal.hidden || event.key !== 'Tab') return;

    const focusable = getFocusableElements(modalPanel);
    if (!focusable.length) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return { close, open, trapFocus };
};

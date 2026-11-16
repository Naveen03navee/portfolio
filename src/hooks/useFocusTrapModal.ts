/**
 * @file clients/portfolio/src/hooks/useFocusTrapModal.ts
 * @description Reusable WCAG 2.1 AA modal focus management hook.
 * Moves focus into the dialog on open, traps Tab/Shift+Tab within focusable controls,
 * closes on Escape, and restores focus cleanly to the originating trigger element on close.
 */

import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true'
  );
}

export function useFocusTrapModal(
  isOpen: boolean,
  modalRef: RefObject<HTMLElement | null>,
  onClose: () => void,
  explicitReturnFocusEl?: HTMLElement | null
): void {
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const activeAtOpen =
      explicitReturnFocusEl ??
      (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    previousFocusRef.current = activeAtOpen;

    const container = modalRef.current;
    if (container) {
      // Ensure container itself can receive fallback focus if needed
      if (!container.hasAttribute('tabindex')) {
        container.setAttribute('tabindex', '-1');
      }
      const focusables = getFocusableElements(container);
      const firstTarget = focusables[0] ?? container;
      // Defer one animation frame so DOM mount completes cleanly before focus move
      requestAnimationFrame(() => {
        firstTarget.focus({ preventScroll: true });
      });
    }

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onCloseRef.current();
        return;
      }

      if (e.key !== 'Tab' || !modalRef.current) return;

      const focusables = getFocusableElements(modalRef.current);
      if (focusables.length === 0) {
        e.preventDefault();
        modalRef.current.focus({ preventScroll: true });
        return;
      }

      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];
      const current = document.activeElement;

      if (e.shiftKey) {
        if (current === firstEl || !modalRef.current.contains(current)) {
          e.preventDefault();
          lastEl.focus({ preventScroll: true });
        }
      } else if (current === lastEl || !modalRef.current.contains(current)) {
        e.preventDefault();
        firstEl.focus({ preventScroll: true });
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      const targetToRestore = explicitReturnFocusEl ?? previousFocusRef.current;
      if (targetToRestore && document.contains(targetToRestore)) {
        requestAnimationFrame(() => {
          targetToRestore.focus({ preventScroll: true });
        });
      }
    };
  }, [isOpen, modalRef, explicitReturnFocusEl]);
}


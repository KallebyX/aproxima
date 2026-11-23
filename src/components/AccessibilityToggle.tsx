'use client';

import { Accessibility, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import AdvancedAccessibility from './AdvancedAccessibility';

export default function AccessibilityToggle() {
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeAccessibility = useCallback(() => setShowAccessibility(false), []);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!showAccessibility || !dialogRef.current) return;

    const dialog = dialogRef.current;
    const trigger = buttonRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // A native modal keeps the background inert and focus inside the panel.
    dialog.showModal();
    closeButtonRef.current?.focus({ preventScroll: true });
    const onBackdropClick = (event: MouseEvent) => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right ||
          event.clientY < bounds.top || event.clientY > bounds.bottom) closeAccessibility();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      )).filter(element => element.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    dialog.addEventListener('click', onBackdropClick);
    dialog.addEventListener('keydown', onKeyDown);

    return () => {
      dialog.removeEventListener('click', onBackdropClick);
      dialog.removeEventListener('keydown', onKeyDown);
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      trigger?.focus({ preventScroll: true });
    };
  }, [showAccessibility, closeAccessibility]);

  if (!mounted) return null;

  return (
    <>
      <div className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-3 z-40 sm:left-4">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setShowAccessibility(true)}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-primary-200 bg-white px-4 py-3 text-sm font-semibold text-primary-800 shadow-md transition-colors hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
          aria-label="Abrir painel de acessibilidade"
          aria-expanded={showAccessibility}
          aria-controls="accessibility-panel"
          aria-haspopup="dialog"
        >
          <Accessibility className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span>Acessibilidade</span>
        </button>
      </div>

      {showAccessibility && (
        <dialog
          ref={dialogRef}
          id="accessibility-panel"
          aria-labelledby="accessibility-title"
          aria-describedby="accessibility-description"
          aria-modal="true"
          className="fixed inset-0 m-auto max-h-[calc(100dvh-1.5rem)] w-[calc(100%-1.5rem)] max-w-3xl overflow-hidden rounded-2xl border border-gray-200 bg-white p-0 text-gray-900 shadow-2xl backdrop:bg-gray-950/60 backdrop:backdrop-blur-sm open:flex open:flex-col sm:max-h-[calc(100dvh-3rem)] sm:w-[calc(100%-3rem)]"
          onCancel={event => {
            event.preventDefault();
            closeAccessibility();
          }}
        >
          <div className="flex shrink-0 items-start justify-between gap-3 border-b border-gray-200 px-4 py-4 sm:px-6">
            <div className="min-w-0">
              <h2 id="accessibility-title" className="flex items-center gap-2 text-lg font-semibold text-primary-900">
                <Accessibility className="h-5 w-5 shrink-0" aria-hidden="true" />
                Acessibilidade
              </h2>
              <p id="accessibility-description" className="mt-1 text-sm leading-relaxed text-gray-600">
                Ajuste a leitura e a navegação para você.
              </p>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeAccessibility}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              aria-label="Fechar painel de acessibilidade"
            >
              <X className="h-5 w-5" aria-hidden="true" />
              <span>Fechar</span>
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
            <AdvancedAccessibility className="w-full [&_[role=alert]]:relative [&_[role=alert]]:right-auto [&_[role=alert]]:top-auto [&_[role=alert]]:mt-3 [&_[role=switch]]:h-11 [&_[role=switch]]:min-h-11 [&_[role=switch]]:w-16 [&_[role=switch]]:min-w-16 [&_[role=switch]]:shrink-0 [&_[role=switch]>span]:h-7 [&_[role=switch]>span]:w-7 [&_[role=switch][aria-checked=true]>span]:translate-x-8" />
          </div>
          <div className="shrink-0 border-t border-gray-200 bg-gray-50 px-4 py-3 text-xs leading-relaxed text-gray-600 sm:px-6">
            As alterações são aplicadas à visualização do site. Use “Restaurar padrões” para desfazê-las.
          </div>
        </dialog>
      )}
    </>
  );
}

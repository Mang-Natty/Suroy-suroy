"use client";

import { useEffect, useRef } from "react";

/** Poster-style confirmation modal. Focus lands on Cancel (the safe choice),
    Escape and overlay-tap dismiss, and the danger action is visually loud. */
export default function Modal({
  open,
  title,
  body,
  confirmLabel,
  danger = false,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const cancelRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-body"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border-2 border-ink bg-card p-6 shadow-poster"
      >
        <h2 id="modal-title" className="font-display text-xl text-ink">
          {title}
        </h2>
        <p id="modal-body" className="mt-3 text-base leading-relaxed text-body">
          {body}
        </p>
        <div className="mt-6 flex gap-3">
          <button
            ref={cancelRef}
            type="button"
            onClick={onClose}
            className="inline-flex h-12 flex-1 items-center justify-center rounded-full border-2 border-ink bg-card px-5 text-base font-extrabold text-ink shadow-poster-sm transition-all duration-150 hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`inline-flex h-12 flex-1 items-center justify-center rounded-full border-2 px-5 text-base font-extrabold shadow-poster-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
              danger
                ? "border-danger bg-danger text-card hover:bg-[#9f0f33] focus-visible:ring-danger"
                : "border-ink bg-coral-deep text-card hover:bg-coral-press focus-visible:ring-ink"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

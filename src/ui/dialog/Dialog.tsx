import { useEffect, useRef, type ReactNode } from "react";
import { GlassSurface, GlassIcon } from "../glass";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export function Dialog({ open, onClose, title, children }: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement as HTMLElement;
      const timer = setTimeout(() => {
        dialogRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      triggerRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && open) {
        onClose();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <GlassSurface
        variant="overlay"
        enhancement="auto"
        as="div"
        className="dialog-panel"
      >
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="dialog-header">
            <h2 className="dialog-title">{title}</h2>
            <GlassIcon
              size={28}
              variant="interactive"
              onClick={onClose}
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5.64 4.22a1 1 0 0 0-1.42 1.42L10.6 12l-6.38 6.36a1 1 0 1 0 1.42 1.42L12 13.4l6.36 6.38a1 1 0 0 0 1.42-1.42L13.4 12l6.38-6.36a1 1 0 0 0-1.42-1.42L12 10.6 5.64 4.22z" />
              </svg>
            </GlassIcon>
          </div>
          <div className="dialog-body">{children}</div>
        </div>
      </GlassSurface>
    </div>
  );
}
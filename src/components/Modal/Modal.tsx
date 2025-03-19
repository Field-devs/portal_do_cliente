import React, { useEffect } from 'react';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { AskDialog } from '../Dialogs/Dialogs';
import XCloseForm from '../Fragments/XCloseForm';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function ModalForm({ isOpen, onClose, children }: ModalProps) {
  useEscapeKey(onClose);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-gray-800 flex flex-col overflow-y-auto scrollbar-none overflow-x-hidden max-h-[90vh] rounded-t-xl rounded-b-lg shadow-xl border border-gray-200 dark:border-gray-700 px-6 pt-6 pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-12 after:bg-gradient-to-t after:from-white/80 dark:after:from-gray-800/80 after:to-transparent after:pointer-events-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-6">
          {children}
          <div className="flex justify-end">
            <XCloseForm onClose={onClose} />
          </div>
        </div>
      </div>
    </div>
  );
}
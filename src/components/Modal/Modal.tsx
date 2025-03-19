import React, { useEffect, useState } from 'react';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { AskDialog } from '../Dialogs/Dialogs';
import XCloseForm from '../Fragments/XCloseForm';
import { ChevronDown } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function ModalForm({ isOpen, onClose, children }: ModalProps) {
  useEscapeKey(onClose);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [needsScroll, setNeedsScroll] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget;
    setShowScrollIndicator(scrollTop < 50);
  };

  const checkIfNeedsScroll = (element: HTMLDivElement) => {
    setNeedsScroll(element.scrollHeight > element.clientHeight);
  };

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
        className="relative w-full max-w-lg bg-white dark:bg-gray-800 flex flex-col overflow-y-auto scrollbar-none overflow-x-hidden max-h-[90vh] rounded-t-xl rounded-b-lg shadow-xl border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()} 
        onScroll={handleScroll}
        ref={(el) => el && checkIfNeedsScroll(el)}
      >
        <div className="relative px-6 pt-6 pb-3 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-12 after:h-1 after:bg-gray-300 dark:after:bg-gray-600 after:rounded-full after:opacity-50 after:transition-opacity after:duration-300 hover:after:opacity-0">
          <div className="space-y-6">
          {children}
          <div className="flex justify-end">
            <XCloseForm onClose={onClose} />
          </div>
          </div>
        </div>
        {showScrollIndicator && needsScroll && (
          <div 
            className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-40 transition-opacity duration-300 animate-bounce"
            style={{ animation: 'bounce 1.5s infinite' }}
          >
            <ChevronDown className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );
}
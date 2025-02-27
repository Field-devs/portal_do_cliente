import React, { useEffect } from 'react';
import { useEscapeKey } from '../../hooks/useEscapeKey';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';
}

export function ModalForm({ 
  isOpen, 
  onClose, 
  children, 
  title,
  maxWidth = '2xl'
}: ModalProps) {

  // Handle ESC key
  useEscapeKey(onClose);

  // Prevent body scroll when modal is open
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

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
  };

  return (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-start justify-center z-50 pt-4 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div 
        className={`bg-white/90 dark:bg-[#1E293B]/80 backdrop-blur-sm rounded-lg border-8 border-brand/30 dark:border-brand/30 w-full ${maxWidthClasses[maxWidth]} max-h-[calc(100vh-2rem)] overflow-y-auto shadow-lg p-8`}
        onClick={e => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-blue-400/10 p-3 rounded-lg">
              <div className="h-6 w-6 text-blue-400" />
            </div>
            <h2 id="modal-title" className="text-xl font-semibold text-gray-700 dark:text-white">
              {title}
            </h2>
          </div>
        )}
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
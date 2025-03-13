import React, { useEffect } from 'react';
import { useEscapeKey } from '../../hooks/useEscapeKey';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  // icon: LucideIcon;
  icon: any;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';
}

export function ModalForm({
  isOpen,
  onClose,
  children,
  title,
  icon,
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
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className={`bg-[#1E293B]/90 backdrop-blur-sm border border-gray-700/50 p-6 w-full mx-4 ${maxWidthClasses[maxWidth]} max-h-[90vh] overflow-y-auto`}
        onClick={e => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center space-x-3 mb-6">
            {icon && (
              <div className="bg-blue-400/10 p-3 rounded-xl">
                {/* {React.createElement(icon, { className: 'h-6 w-6 text-blue-400' })} */}
                {icon}
              </div>
            )}
            <h2 id="modal-title" className="text-xl font-semibold text-white">
              {title}
            </h2>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
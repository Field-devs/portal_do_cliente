import React, { useEffect } from 'react';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { AskDialog } from '../Dialogs/Dialogs';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  // icon: LucideIcon;
  icon: any;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';
}

const overlayClass = "fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50";
const modalClass = "bg-light-card dark:bg-[#1E293B]/90 backdrop-blur-sm border border-light-border dark:border-gray-700/50 p-6 w-full mx-4 rounded-lg shadow-lg overflow-y-auto relative";
const headerClass = "flex items-center justify-between mb-6";
const titleWrapperClass = "flex items-center space-x-3";
const iconWrapperClass = "bg-blue-400/10 p-3 rounded-xl";
const titleClass = "text-lg font-medium text-gray-900 dark:text-white";
const closeButtonClass = "p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg transition-colors";

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
      className={overlayClass}
      onMouseDown={async (e) => {
        if (e.target === e.currentTarget) {
          let response = await AskDialog('Deseja realmente fechar o Formulário?', 'Fechar');
          if (response.value === true)
            onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={undefined}
    >
      <div
        className={`${modalClass} ${maxWidthClasses[maxWidth]} max-h-[90vh]`}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
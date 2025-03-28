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
  const [isVisible, setIsVisible] = useState(true);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget;
    if (scrollTop > 50) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
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
        className="relative w-[95%] md:w-[85%] lg:w-[75%] xl:w-[65%] 2xl:w-[55%] bg-white dark:bg-gray-800 flex flex-col overflow-y-auto scrollbar-none overflow-x-hidden max-h-[90vh] rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50"
        onClick={(e) => e.stopPropagation()} 
        onScroll={handleScroll}
        ref={(el) => el && checkIfNeedsScroll(el)}
      >
        <div className="px-6 pt-6 pb-3 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-12 after:h-[2px] after:bg-gray-200 dark:after:bg-gray-700 after:rounded-full after:opacity-30 after:transition-opacity after:duration-300 hover:after:opacity-0">
          <div className="space-y-6">
          {children}
          </div>
        </div>
        <div className="absolute top-6 right-6">
          <XCloseForm onClose={onClose} />
        </div>
        {showScrollIndicator && needsScroll && (
          <div 
            className="absolute bottom-4 left-1/2 -translate-x-1/2 transition-all duration-700 ease-in-out animate-bounce"
            style={{
              opacity: isVisible ? '1' : '0',
              transform: `translate(-50%, ${isVisible ? '0' : '20px'})`,
              animation: 'bounce 1.5s infinite'
            }}
          >
            <div className="bg-brand/90 dark:bg-brand/80 p-2 rounded-full shadow-lg">
              <ChevronDown className="w-5 h-5 text-white" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
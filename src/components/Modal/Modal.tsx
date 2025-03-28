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
  const [isAnimating, setIsAnimating] = useState(false);
  const [showDots, setShowDots] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setShowDots(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setShowDots(false);
      }, 1000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

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
      className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        backgroundColor: `rgba(0, 0, 0, ${isClosing ? 0 : 0.5})`,
        backdropFilter: 'blur(4px)'
      }}
      onMouseDown={(e) => e.target === e.currentTarget && handleClose()}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative w-[95%] md:w-[85%] lg:w-[75%] xl:w-[65%] 2xl:w-[55%] bg-white dark:bg-gray-800 flex flex-col overflow-y-auto scrollbar-none overflow-x-hidden max-h-[90vh] rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 ${
          isClosing ? 'opacity-0 scale-95 -translate-y-4' : 'opacity-100 scale-100 translate-y-0'
        }`}
        style={{ position: 'relative' }}
        onClick={(e) => e.stopPropagation()} 
        onScroll={handleScroll}
        ref={(el) => el && checkIfNeedsScroll(el)}
      >
        {showDots && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/5 dark:bg-black/10 backdrop-blur-[2px] z-50 overflow-hidden transition-opacity duration-300">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-brand/60 dark:bg-brand/40 rounded-full animate-dotBounce1"></div>
                <div className="w-2 h-2 bg-brand/60 dark:bg-brand/40 rounded-full animate-dotBounce2"></div>
                <div className="w-2 h-2 bg-brand/60 dark:bg-brand/40 rounded-full animate-dotBounce3"></div>
              </div>
            </div>
          </div>
        )}
        <div className="px-6 pt-6 pb-3 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-12 after:h-[2px] after:bg-gray-200 dark:after:bg-gray-700 after:rounded-full after:opacity-30 after:transition-opacity after:duration-300 hover:after:opacity-0">
          <div className="space-y-6">
          {children}
          </div>
        </div>
        <div className="absolute top-6 right-6">
          <XCloseForm onClose={handleClose} />
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
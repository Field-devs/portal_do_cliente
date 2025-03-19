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
      onMouseDown={async (e) => {
        if (e.target === e.currentTarget) {
          // let response = await AskDialog('Deseja realmente fechar o Formulário?', 'Fechar');
          // if (response.value === true) onClose();
          // onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-lg bg-white flex flex-col"
        style={{
          overflowY: 'auto', // Permite rolagem vertical
          overflowX: 'hidden', // Impede rolagem horizontal
          maxHeight: '100vh', // Limita a altura ao tamanho da janela
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão de Fechar no canto superior direito */}
        {children}
        <XCloseForm onClose={onClose} />
      </div>
    </div>
  );
}
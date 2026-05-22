import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Card } from './card';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  // Desabilitar scroll do body ao abrir o modal
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Janela do Modal */}
      <div className="relative z-10 w-full max-w-lg animate-in fade-in zoom-in-95 duration-200">
        <Card className="border-slate-100 bg-white shadow-2xl" hoverEffect={false}>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <button 
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="max-h-[70vh] overflow-y-auto pr-1">
            {children}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Modal;

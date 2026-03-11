import React from 'react';
import ReactDom from 'react-dom';
import { FiX } from 'react-icons/fi';

export default function Modal({ children, onClose }) {
  return ReactDom.createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className="relative z-[1001] w-full max-w-4xl mx-auto flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
        <div className="w-full relative">
          <button 
            className="absolute -top-12 right-0 bg-white/10 hover:bg-red-500 text-white p-2 rounded-full transition-all shadow-md hover:shadow-red-500/50 hover:scale-110" 
            onClick={onClose}
          >
            <FiX className="w-6 h-6" />
          </button>
          {children}
        </div>
      </div>
    </div>,
    document.getElementById('cart-root')
  );
}
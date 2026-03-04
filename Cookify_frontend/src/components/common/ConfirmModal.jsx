import React from 'react';
import Button from './Button';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Yes, Sign Out', cancelText = 'Cancel', variant = 'danger' }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-reveal p-8 text-center">
                {/* Icon Circle */}
                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${variant === 'danger' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'}`}>
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 font-heading mb-2">{title}</h2>
                <p className="text-gray-500 mb-8 font-medium leading-relaxed">{message}</p>

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3.5 px-6 rounded-2xl font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all border border-gray-100"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => { onConfirm(); onClose(); }}
                        className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-white shadow-xl transition-all active:scale-[0.98] ${variant === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-[#2E7D32] hover:bg-[#1B5E20] shadow-green-600/20'}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;

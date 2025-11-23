import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

const Toast = ({ id, message, type, onClose }) => {
    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-500" />,
        error: <AlertCircle className="w-5 h-5 text-red-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />,
    };

    const bgColors = {
        success: 'bg-white dark:bg-gray-800 border-green-500/20',
        error: 'bg-white dark:bg-gray-800 border-red-500/20',
        info: 'bg-white dark:bg-gray-800 border-blue-500/20',
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`flex items-center w-full max-w-sm p-4 mb-3 text-gray-900 dark:text-white rounded-xl shadow-lg border ${bgColors[type]} backdrop-blur-md`}
        >
            <div className="flex-shrink-0">
                {icons[type]}
            </div>
            <div className="ml-3 text-sm font-medium flex-1">
                {message}
            </div>
            <button
                onClick={() => onClose(id)}
                className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8 text-gray-400 hover:text-gray-900 dark:hover:text-white focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto remove after 5 seconds
        setTimeout(() => {
            removeToast(id);
        }, 5000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-2 pointer-events-none">
                <div className="pointer-events-auto">
                    <AnimatePresence>
                        {toasts.map((toast) => (
                            <Toast key={toast.id} {...toast} onClose={removeToast} />
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </ToastContext.Provider>
    );
};

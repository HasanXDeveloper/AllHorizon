import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ message, type = 'error', onClose, duration = 4000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle className="w-5 h-5" />,
        error: <AlertCircle className="w-5 h-5" />,
        info: <Info className="w-5 h-5" />
    };

    const styles = {
        success: 'bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
        error: 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
        info: 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
    };

    const iconStyles = {
        success: 'text-green-500 dark:text-green-400',
        error: 'text-red-500 dark:text-red-400',
        info: 'text-blue-500 dark:text-blue-400'
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-slideInRight">
            <div className={`${styles[type]} border-2 rounded-xl shadow-2xl backdrop-blur-xl p-4 pr-5 max-w-sm min-w-[300px] relative overflow-hidden`}>
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>

                <div className="relative flex items-start gap-3">
                    <div className={iconStyles[type]}>
                        {icons[type]}
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-sm leading-relaxed pr-9">{message}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute top-0 right-0  p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4 " />
                    </button>
                </div>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 dark:bg-white/10">
                    <div
                        className={`h-full ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}
                        style={{
                            animation: `shrink ${duration}ms linear forwards`
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default Toast;

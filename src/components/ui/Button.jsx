export function Button({ children, variant = 'default', className = '', ...props }) {
    const baseClasses = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition-all duration-200 h-10 px-6 text-sm disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
        default: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-xl',
        outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950'
    };

    return (
        <button
            className={`${baseClasses} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

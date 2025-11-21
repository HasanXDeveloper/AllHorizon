export function Input({ className = '', ...props }) {
    return (
        <input
            className={`flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            {...props}
        />
    );
}

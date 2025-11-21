import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { cn } from '../lib/utils'

export function ScrollReveal({ children, className, delay = 0 }) {
    const { elementRef, isVisible } = useScrollAnimation(0.1)

    return (
        <div
            ref={elementRef}
            className={cn(
                "transition-all duration-700 ease-out transform",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
                className
            )}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    )
}

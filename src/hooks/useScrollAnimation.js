import { useEffect, useRef, useState } from 'react';

export function useScrollAnimation(threshold = 0.1) {
    const elementRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    // Once visible, stop observing to keep the element visible
                    if (elementRef.current) {
                        observer.unobserve(elementRef.current);
                    }
                }
            },
            {
                threshold: threshold,
                rootMargin: '0px 0px -50px 0px' // Trigger slightly before the element is fully in view
            }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, [threshold]);

    return { elementRef, isVisible };
}

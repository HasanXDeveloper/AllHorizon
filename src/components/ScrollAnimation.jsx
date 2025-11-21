import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function ScrollAnimation({
    children,
    animation = 'animate-fadeIn',
    className = '',
    delay = 100,
    threshold = 0.1
}) {
    const { elementRef, isVisible } = useScrollAnimation(threshold);

    return (
        <div
            ref={elementRef}
            className={`${className} ${isVisible ? animation : 'opacity-0'}`}
            style={{ animationDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

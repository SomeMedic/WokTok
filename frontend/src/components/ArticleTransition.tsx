import { useEffect, useState } from 'react';

interface ArticleTransitionProps {
    show: boolean;
    onComplete: () => void;
}

export function ArticleTransition({ show, onComplete }: ArticleTransitionProps) {
    const [animationClass, setAnimationClass] = useState('');

    useEffect(() => {
        if (show) {
            setAnimationClass('animate-slide-in');
            const timer = setTimeout(() => {
                setAnimationClass('animate-slide-out');
                setTimeout(onComplete, 500);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [show, onComplete]);

    if (!show && !animationClass) return null;

    return (
        <div className="fixed inset-0 z-50 pointer-events-none">
            <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-lg ${animationClass}`} />
        </div>
    );
} 
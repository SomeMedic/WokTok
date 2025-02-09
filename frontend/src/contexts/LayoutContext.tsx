import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface LayoutContextType {
    isReversed: boolean;
    toggleReversed: () => void;
}

const LayoutContext = createContext<LayoutContextType | null>(null);

export function LayoutProvider({ children }: { children: ReactNode }) {
    const [isReversed, setIsReversed] = useState(() => {
        // Загружаем сохранённое состояние при инициализации
        const saved = localStorage.getItem('layoutReversed');
        return saved ? JSON.parse(saved) : false;
    });

    // Сохраняем состояние при изменении
    useEffect(() => {
        localStorage.setItem('layoutReversed', JSON.stringify(isReversed));
    }, [isReversed]);

    const toggleReversed = () => {
        setIsReversed(prev => !prev);
    };

    return (
        <LayoutContext.Provider value={{ isReversed, toggleReversed }}>
            {children}
        </LayoutContext.Provider>
    );
}

export function useLayout() {
    const context = useContext(LayoutContext);
    if (!context) {
        throw new Error('useLayout must be used within a LayoutProvider');
    }
    return context;
} 
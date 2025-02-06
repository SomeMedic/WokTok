import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Theme {
    name: string;
    background: string;
    text: string;
    accent: string;
}

interface Settings {
    theme: string;
    fontSize: number;
    fontFamily: string;
    focusMode: boolean;
    showPreview: boolean;
}

const themes: Record<string, Theme> = {
    light: {
        name: 'Светлая',
        background: 'bg-white/90',
        text: 'text-gray-800',
        accent: 'blue'
    },
    dark: {
        name: 'Тёмная',
        background: 'bg-gray-800/90',
        text: 'text-gray-100',
        accent: 'blue'
    },
    sepia: {
        name: 'Сепия',
        background: 'bg-amber-50/90',
        text: 'text-amber-900',
        accent: 'amber'
    },
    forest: {
        name: 'Лесная',
        background: 'bg-emerald-900/90',
        text: 'text-emerald-50',
        accent: 'emerald'
    }
};

const fonts = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono'
};

const defaultSettings: Settings = {
    theme: 'light',
    fontSize: 16,
    fontFamily: 'sans',
    focusMode: false,
    showPreview: true
};

interface SettingsContextType {
    settings: Settings;
    themes: Record<string, Theme>;
    fonts: Record<string, string>;
    updateSettings: (newSettings: Partial<Settings>) => void;
    currentTheme: Theme;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<Settings>(() => {
        const saved = localStorage.getItem('userSettings');
        return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    });

    useEffect(() => {
        localStorage.setItem('userSettings', JSON.stringify(settings));
    }, [settings]);

    const updateSettings = (newSettings: Partial<Settings>) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const value = {
        settings,
        themes,
        fonts,
        updateSettings,
        currentTheme: themes[settings.theme]
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
} 
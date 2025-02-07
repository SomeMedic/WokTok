import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Theme {
    name: string;
    background: string;
    text: string;
    accent: string;
    gradient: string;
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
        accent: 'blue',
        gradient: 'from-blue-500 to-indigo-500'
    },
    dark: {
        name: 'Тёмная',
        background: 'bg-gray-800/90',
        text: 'text-gray-100',
        accent: 'blue',
        gradient: 'from-blue-400 to-indigo-400'
    },
    sepia: {
        name: 'Сепия',
        background: 'bg-amber-50/90',
        text: 'text-amber-900',
        accent: 'amber',
        gradient: 'from-amber-600 to-orange-500'
    },
    forest: {
        name: 'Лесная',
        background: 'bg-emerald-900/90',
        text: 'text-emerald-50',
        accent: 'emerald',
        gradient: 'from-emerald-400 to-green-500'
    },
    ocean: {
        name: 'Океан',
        background: 'bg-cyan-900/90',
        text: 'text-cyan-50',
        accent: 'cyan',
        gradient: 'from-cyan-400 to-blue-500'
    },
    sunset: {
        name: 'Закат',
        background: 'bg-rose-900/90',
        text: 'text-rose-50',
        accent: 'rose',
        gradient: 'from-rose-400 to-pink-500'
    },
    purple: {
        name: 'Сиреневая',
        background: 'bg-purple-900/90',
        text: 'text-purple-50',
        accent: 'purple',
        gradient: 'from-purple-400 to-violet-500'
    },
    coffee: {
        name: 'Кофейная',
        background: 'bg-stone-900/90',
        text: 'text-stone-100',
        accent: 'stone',
        gradient: 'from-stone-400 to-stone-600'
    },
    mint: {
        name: 'Мятная',
        background: 'bg-teal-900/90',
        text: 'text-teal-50',
        accent: 'teal',
        gradient: 'from-teal-300 to-emerald-400'
    },
    cherry: {
        name: 'Вишнёвая',
        background: 'bg-red-900/90',
        text: 'text-red-50',
        accent: 'red',
        gradient: 'from-red-400 to-rose-600'
    },
    lavender: {
        name: 'Лавандовая',
        background: 'bg-violet-900/90',
        text: 'text-violet-50',
        accent: 'violet',
        gradient: 'from-violet-400 to-purple-500'
    },
    autumn: {
        name: 'Осенняя',
        background: 'bg-orange-900/90',
        text: 'text-orange-50',
        accent: 'orange',
        gradient: 'from-orange-400 to-amber-600'
    },
    space: {
        name: 'Космос',
        background: 'bg-slate-900/90',
        text: 'text-slate-50',
        accent: 'slate',
        gradient: 'from-slate-400 via-indigo-500 to-purple-500'
    },
    sakura: {
        name: 'Сакура',
        background: 'bg-pink-900/90',
        text: 'text-pink-50',
        accent: 'pink',
        gradient: 'from-pink-300 to-rose-400'
    },
    nordic: {
        name: 'Северная',
        background: 'bg-sky-900/90',
        text: 'text-sky-50',
        accent: 'sky',
        gradient: 'from-sky-300 to-blue-500'
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
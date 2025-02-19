import { MonitorUp, Type } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { useState } from 'react';

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
    const { settings, updateSettings, themes, fonts, currentTheme } = useSettings();
    const [isThemeSelectOpen, setIsThemeSelectOpen] = useState(false);
    const isLightTheme = settings.theme === 'light';
    const isSepiaTheme = settings.theme === 'sepia';

    if (!isOpen) return null;

    const getThemeStyles = (type: 'text' | 'background' | 'hover' | 'ring') => {
        if (isLightTheme) {
            switch (type) {
                case 'text': return 'text-gray-800';
                case 'background': return 'bg-white/95';
                case 'hover': return 'hover:bg-gray-50';
                case 'ring': return 'ring-1 ring-gray-200 hover:ring-gray-300';
            }
        }
        if (isSepiaTheme) {
            switch (type) {
                case 'text': return 'text-amber-900';
                case 'background': return 'bg-amber-50/95';
                case 'hover': return 'hover:bg-amber-100/80';
                case 'ring': return 'ring-1 ring-amber-200 hover:ring-amber-300';
            }
        }
        return currentTheme[type === 'text' ? 'text' : 'background'];
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className={`${getThemeStyles('background')} shadow-xl rounded-xl max-w-md w-full p-6 backdrop-blur-sm`}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className={`text-2xl font-bold ${getThemeStyles('text')}`}>Настройки</h2>
                    <button
                        onClick={onClose}
                        className={`${getThemeStyles('text')} opacity-70 hover:opacity-100 transition-opacity`}
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Темы */}
                    <div>
                        <h3 className={`text-lg font-medium mb-3 ${getThemeStyles('text')} flex items-center gap-2`}>
                            <MonitorUp className="w-5 h-5" />
                            Тема оформления
                        </h3>
                        <div className="relative">
                            <button
                                onClick={() => setIsThemeSelectOpen(!isThemeSelectOpen)}
                                className={`w-full p-3 rounded-lg ${getThemeStyles('background')} ${getThemeStyles('ring')} ${getThemeStyles('text')} backdrop-blur-sm transition-all flex items-center justify-between`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${currentTheme.gradient}`} />
                                    <span>{currentTheme.name}</span>
                                </div>
                                <svg className={`w-5 h-5 transition-transform ${isThemeSelectOpen ? 'rotate-180' : ''}`} 
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {isThemeSelectOpen && (
                                <div className={`absolute w-full mt-2 py-2 ${getThemeStyles('background')} ${getThemeStyles('ring')} backdrop-blur-md rounded-lg shadow-xl overflow-hidden z-10 max-h-[60vh] overflow-y-auto`}>
                                    {Object.entries(themes).map(([key, theme]) => (
                                        <button
                                            key={key}
                                            onClick={() => {
                                                updateSettings({ theme: key });
                                                setIsThemeSelectOpen(false);
                                            }}
                                            className={`w-full p-3 flex items-center gap-3 ${
                                                settings.theme === key 
                                                    ? isLightTheme ? 'bg-gray-100' 
                                                    : isSepiaTheme ? 'bg-amber-100/50'
                                                    : 'bg-white/5'
                                                    : ''
                                            } ${getThemeStyles('hover')} ${getThemeStyles('text')} transition-colors`}
                                        >
                                            <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${theme.gradient}`} />
                                            <span>{theme.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Шрифты */}
                    <div>
                        <h3 className={`text-lg font-medium mb-3 ${getThemeStyles('text')} flex items-center gap-2`}>
                            <Type className="w-5 h-5" />
                            Шрифт
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                            {Object.entries(fonts).map(([key, className]) => (
                                <button
                                    key={key}
                                    onClick={() => updateSettings({ fontFamily: key })}
                                    className={`p-2 rounded-lg ${className} ${getThemeStyles('background')} ${getThemeStyles('ring')} ${getThemeStyles('text')} ${settings.fontFamily === key ? 'ring-2 ring-blue-500' : ''}`}
                                >
                                    Текст
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Размер шрифта */}
                    <div>
                        <h3 className={`text-lg font-medium mb-3 ${getThemeStyles('text')}`}>Размер текста</h3>
                        <input
                            type="range"
                            min="14"
                            max="24"
                            value={settings.fontSize}
                            onChange={(e) => updateSettings({ fontSize: Number(e.target.value) })}
                            className="w-full accent-blue-500"
                        />
                        <div className={`text-center mt-2 ${getThemeStyles('text')}`}>{settings.fontSize}px</div>
                    </div>

                    {/* Дополнительные настройки */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.focusMode}
                                onChange={(e) => updateSettings({ focusMode: e.target.checked })}
                                className="rounded accent-blue-500"
                            />
                            <span className={getThemeStyles('text')}>Режим фокусировки</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.showPreview}
                                onChange={(e) => updateSettings({ showPreview: e.target.checked })}
                                className="rounded accent-blue-500"
                            />
                            <span className={getThemeStyles('text')}>Показывать превью следующей статьи</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
} 
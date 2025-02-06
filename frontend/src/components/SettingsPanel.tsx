import { Settings, MonitorUp, Type, Eye } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { useState } from 'react';

export function SettingsPanel() {
    const { settings, updateSettings, themes, fonts } = useSettings();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed top-4 right-20 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
                title="Настройки"
            >
                <Settings className="w-6 h-6 text-white" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold dark:text-white">Настройки</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Темы */}
                            <div>
                                <h3 className="text-lg font-medium mb-3 dark:text-white flex items-center gap-2">
                                    <MonitorUp className="w-5 h-5" />
                                    Тема оформления
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {Object.entries(themes).map(([key, theme]) => (
                                        <button
                                            key={key}
                                            onClick={() => updateSettings({ theme: key })}
                                            className={`p-3 rounded-lg ${theme.background} ${theme.text} ${
                                                settings.theme === key ? 'ring-2 ring-blue-500' : ''
                                            }`}
                                        >
                                            {theme.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Шрифты */}
                            <div>
                                <h3 className="text-lg font-medium mb-3 dark:text-white flex items-center gap-2">
                                    <Type className="w-5 h-5" />
                                    Шрифт
                                </h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {Object.entries(fonts).map(([key, className]) => (
                                        <button
                                            key={key}
                                            onClick={() => updateSettings({ fontFamily: key })}
                                            className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${className} ${
                                                settings.fontFamily === key ? 'ring-2 ring-blue-500' : ''
                                            }`}
                                        >
                                            Текст
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Размер шрифта */}
                            <div>
                                <h3 className="text-lg font-medium mb-3 dark:text-white">Размер текста</h3>
                                <input
                                    type="range"
                                    min="14"
                                    max="24"
                                    value={settings.fontSize}
                                    onChange={(e) => updateSettings({ fontSize: Number(e.target.value) })}
                                    className="w-full"
                                />
                                <div className="text-center mt-2">{settings.fontSize}px</div>
                            </div>

                            {/* Дополнительные настройки */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.focusMode}
                                        onChange={(e) => updateSettings({ focusMode: e.target.checked })}
                                        className="rounded"
                                    />
                                    <span className="dark:text-white">Режим фокусировки</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.showPreview}
                                        onChange={(e) => updateSettings({ showPreview: e.target.checked })}
                                        className="rounded"
                                    />
                                    <span className="dark:text-white">Показывать превью следующей статьи</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
} 
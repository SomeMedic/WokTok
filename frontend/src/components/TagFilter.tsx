import { useState, useEffect } from 'react';
import { Filter, X, Hash, ChevronRight } from 'lucide-react';
import { useTagFilter } from '../contexts/TagFilterContext';
import { useSettings } from '../contexts/SettingsContext';
import { TAGS, Tag } from '../hooks/useArticleTags';

export function TagFilter() {
    const { selectedTags, toggleTag, clearTags, isTagSelected } = useTagFilter();
    const { currentTheme } = useSettings();
    const [isOpen, setIsOpen] = useState(false);
    const [isDesktopOpen, setIsDesktopOpen] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (isDesktopOpen) {
            setShouldRender(true);
        } else {
            const timer = setTimeout(() => {
                setShouldRender(false);
            }, 500); // Время анимации
            return () => clearTimeout(timer);
        }
    }, [isDesktopOpen]);

    // Контент фильтров для мобильной версии
    const MobileFilterContent = () => (
        <>
            <div className="flex justify-between items-center mb-3">
                <h3 className={`font-medium ${currentTheme.text}`}>Фильтр по тегам</h3>
                {selectedTags.length > 0 && (
                    <button
                        onClick={clearTags}
                        className={`text-sm ${currentTheme.text} opacity-70 hover:opacity-100 transition-opacity flex items-center gap-1`}
                    >
                        <X className="w-4 h-4" />
                        Сбросить
                    </button>
                )}
            </div>
            <div className="flex flex-wrap gap-2">
                {Object.values(TAGS).map((tag: Tag) => (
                    <button
                        key={tag.id}
                        onClick={() => toggleTag(tag.id)}
                        className={`px-2.5 py-1 rounded-full text-sm transition-all ${
                            isTagSelected(tag.id)
                                ? `${tag.color} text-white`
                                : `${currentTheme.background} hover:bg-white/10 ${currentTheme.text}`
                        }`}
                    >
                        {tag.name}
                    </button>
                ))}
            </div>
        </>
    );

    // Десктопная версия - выдвигающийся блок слева
    const DesktopFilter = () => (
        <div className="hidden md:block fixed left-0 top-1/2 -translate-y-1/2 z-50">
            {/* Кнопка открытия */}
            <button
                onClick={() => setIsDesktopOpen(!isDesktopOpen)}
                className={`absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-lg 
                    ${currentTheme.background} hover:bg-white/10 backdrop-blur-sm shadow-lg 
                    transition-all duration-300 group z-10
                    ${isDesktopOpen ? 'opacity-0' : 'opacity-100'}`}
                title="Открыть фильтры"
            >
                <Filter className={`w-5 h-5 ${selectedTags.length > 0 ? 'text-blue-500' : currentTheme.text}`} />
            </button>

            {/* Контейнер для центрирования */}
            {(shouldRender || isDesktopOpen) && (
                <div className="fixed left-0 top-1/2 -translate-y-1/2">
                    {/* Выдвигающийся блок */}
                    <div className={`${currentTheme.background} backdrop-blur-md rounded-r-xl shadow-xl 
                        border border-white/10 w-[420px] p-4
                        transform transition-all duration-500 ease-in-out origin-left
                        ${isDesktopOpen ? 'animate-slide-in' : 'animate-slide-out'}`}>

                        {/* Затемнение фона при открытом блоке */}
                        <div className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-500
                            ${isDesktopOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                            -z-10`} 
                            onClick={() => setIsDesktopOpen(false)}
                        />
                        
                        {/* Заголовок */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2.5">
                                <div className={`w-7 h-7 rounded-lg ${currentTheme.background} flex items-center justify-center
                                    shadow-inner border border-white/10`}>
                                    <Hash className={`w-4 h-4 ${currentTheme.text}`} />
                                </div>
                                <div>
                                    <h3 className={`font-medium ${currentTheme.text} text-base leading-none mb-1`}>
                                        Фильтр
                                    </h3>
                                    <p className={`text-xs ${currentTheme.text} opacity-60 leading-none`}>
                                        Выберите темы
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsDesktopOpen(false)}
                                className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors`}
                                title="Закрыть"
                            >
                                <ChevronRight className={`w-5 h-5 ${currentTheme.text}`} />
                            </button>
                        </div>

                        {/* Кнопка сброса */}
                        {selectedTags.length > 0 && (
                            <button
                                onClick={clearTags}
                                className={`w-full mb-2.5 px-3 py-1.5 rounded-lg border border-white/10
                                    ${currentTheme.text} opacity-70 hover:opacity-100 
                                    text-sm flex items-center justify-center gap-1.5 hover:bg-white/5`}
                            >
                                <X className="w-3.5 h-3.5" />
                                Сбросить фильтры
                            </button>
                        )}

                        {/* Теги */}
                        <div className="grid grid-cols-3 gap-2">
                            {Object.values(TAGS).map((tag: Tag) => (
                                <button
                                    key={tag.id}
                                    onClick={() => toggleTag(tag.id)}
                                    className={`px-3 py-2 rounded-lg text-sm
                                        ${isTagSelected(tag.id)
                                            ? `${tag.color} text-white shadow-md hover:brightness-110`
                                            : `${currentTheme.background} hover:bg-white/5 ${currentTheme.text} opacity-75 hover:opacity-100`
                                        }
                                        flex items-center justify-center gap-2`}
                                >
                                    <span className="text-base">{tag.emoji}</span>
                                    <span className="truncate">{tag.name}</span>
                                    {isTagSelected(tag.id) && (
                                        <X className="w-3.5 h-3.5 flex-shrink-0 ml-1" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    // Мобильная версия - выпадающий блок по кнопке
    const MobileFilter = () => (
        <div className="md:hidden fixed bottom-24 left-4 z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2.5 rounded-full ${currentTheme.background} hover:bg-white/10 backdrop-blur-sm shadow-lg transition-all`}
                title="Фильтр по тегам"
            >
                <Filter className={`w-6 h-6 ${selectedTags.length > 0 ? 'text-blue-500' : currentTheme.text}`} />
            </button>

            {isOpen && (
                <div className="absolute bottom-full mb-2 left-0">
                    <div className={`${currentTheme.background} backdrop-blur-sm rounded-lg shadow-lg p-4 min-w-[250px]`}>
                        <MobileFilterContent />
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <>
            <DesktopFilter />
            <MobileFilter />
        </>
    );
} 
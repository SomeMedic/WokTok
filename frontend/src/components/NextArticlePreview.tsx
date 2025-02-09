import { WikiArticle } from './WikiCard';
import { useSettings } from '../contexts/SettingsContext';
import { useEffect, useState, useMemo, memo } from 'react';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import { useArticleTags, getTagStyle } from '../hooks/useArticleTags';
import { useTagFilter } from '../contexts/TagFilterContext';

interface NextArticlePreviewProps {
    article: WikiArticle;
}

export const NextArticlePreview = memo(function NextArticlePreview({ article }: NextArticlePreviewProps) {
    const { settings } = useSettings();
    const [isVisible, setIsVisible] = useState(true);
    const [currentArticle, setCurrentArticle] = useState(article);
    const [isExpanded, setIsExpanded] = useState(() => {
        // Загружаем сохранённое состояние при инициализации
        const saved = localStorage.getItem('previewExpanded');
        return saved ? JSON.parse(saved) : false;
    });
    const { currentTheme } = useSettings();
    const tags = useArticleTags(article.title, article.extract);
    const { selectedTags } = useTagFilter();

    // Сохраняем состояние при изменении
    useEffect(() => {
        localStorage.setItem('previewExpanded', JSON.stringify(isExpanded));
    }, [isExpanded]);

    // Используем useMemo для вычисления shouldShow
    const shouldShow = useMemo(() => {
        if (!settings.showPreview) return false;
        if (selectedTags.length > 0 && !tags.some(tag => selectedTags.includes(tag.id))) {
            return false;
        }
        return true;
    }, [settings.showPreview, selectedTags, tags]);

    useEffect(() => {
        if (article.pageid !== currentArticle.pageid) {
            setIsVisible(false);
            const timer = setTimeout(() => {
                setCurrentArticle(article);
                setIsVisible(true);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [article, currentArticle]);

    if (!shouldShow) return null;

    // Для десктопа возвращаем выезжающий дизайн превью
    if (window.innerWidth >= 768) {
        return (
            <div className={`fixed bottom-0 left-1/2 -translate-x-1/2 z-40 w-[90%] md:max-w-[1200px] transform transition-all duration-300
                ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <div className="relative">
                    {/* Кнопка раскрытия */}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`absolute -top-3 left-1/2 -translate-x-1/2 z-10 p-1.5 rounded-full ${currentTheme.background} shadow-lg backdrop-blur-sm transition-transform duration-300 group
                            ${isExpanded ? 'rotate-180' : ''}`}
                    >
                        <ChevronDown className={`w-5 h-5 ${currentTheme.text} opacity-70 group-hover:opacity-100 transition-opacity`} />
                    </button>

                    {/* Контент превью */}
                    <div className={`${currentTheme.background} backdrop-blur-sm rounded-t-xl shadow-lg overflow-hidden transition-all duration-300 origin-bottom
                        ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'}`}>
                        <div className="flex items-center p-3 md:p-4 gap-4">
                            {/* Превью изображения */}
                            <div className="relative w-20 h-20 shrink-0">
                                {currentArticle.thumbnail ? (
                                    <img
                                        src={currentArticle.thumbnail.source}
                                        alt={currentArticle.title}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-lg" />
                                )}
                            </div>

                            {/* Контент */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1.5">
                                    <p className={`text-sm ${currentTheme.text} opacity-70`}>Следующая статья:</p>
                                    <div className="h-px flex-1 bg-white/10" />
                                </div>
                                <h3 className={`text-lg font-bold ${currentTheme.text} truncate mb-1.5`}>
                                    {currentArticle.title}
                                </h3>
                                <div className="flex flex-wrap gap-1.5">
                                    {tags.map(tag => (
                                        <span key={tag.id} className={`${getTagStyle(tag)} text-xs px-1.5 py-0`}>
                                            {tag.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Для мобильных устройств возвращаем выдвигающееся превью
    return (
        <div className="block md:hidden">
            <div className={`fixed bottom-24 right-0 z-30 transform transition-all duration-300
                ${isVisible ? 'opacity-100' : 'opacity-0'}
                ${isExpanded ? 'translate-x-0' : 'translate-x-[calc(100%-2rem)]'}`}
            >
                <div className="flex items-center">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-2 rounded-l-lg shadow-lg flex-shrink-0"
                    >
                        <ChevronLeft className={`w-6 h-6 ${currentTheme.text} transition-transform duration-300
                            ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>

                    <div className="w-72 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-l-lg shadow-lg overflow-hidden ml-2">
                        <div className="relative h-32">
                            {currentArticle.thumbnail ? (
                                <img
                                    src={currentArticle.thumbnail.source}
                                    alt={currentArticle.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-2 left-3 right-3">
                                <div className="flex flex-wrap gap-1 mb-1">
                                    {tags.map(tag => (
                                        <span key={tag.id} className={`${getTagStyle(tag)} text-xs px-1.5 py-0`}>
                                            {tag.name}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-sm text-white font-medium">Следующая статья:</p>
                                <h3 className="text-white font-bold truncate">{currentArticle.title}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}, (prevProps, nextProps) => {
    return prevProps.article.pageid === nextProps.article.pageid;
});
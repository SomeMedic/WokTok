import { WikiArticle } from './WikiCard';
import { useSettings } from '../contexts/SettingsContext';
import { useEffect, useState } from 'react';

interface NextArticlePreviewProps {
    article: WikiArticle;
}

export function NextArticlePreview({ article }: NextArticlePreviewProps) {
    const { settings } = useSettings();
    const [isVisible, setIsVisible] = useState(true);
    const [currentArticle, setCurrentArticle] = useState(article);

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

    if (!settings.showPreview) return null;

    return (
        <div className={`fixed md:bottom-4 bottom-[calc(env(safe-area-inset-bottom,0px)+4.5rem)] right-4 z-40 max-w-sm transform transition-all duration-300 
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
                <div className="relative h-24">
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
                        <p className="text-sm text-white font-medium">Следующая статья:</p>
                        <h3 className="text-white font-bold truncate">{currentArticle.title}</h3>
                    </div>
                </div>
            </div>
        </div>
    );
} 
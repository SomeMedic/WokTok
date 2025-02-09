import { Share2, Heart, Quote, ArrowLeftRight } from 'lucide-react';
import { useState } from 'react';
import { useLikedArticles } from '../contexts/LikedArticlesContext';
import { SpeechButton } from './SpeechButton';
import { useSettings } from '../contexts/SettingsContext';
import { useArticleTags, getTagStyle } from '../hooks/useArticleTags';

export interface WikiArticle {
    title: string;
    extract: string;
    pageid: number;
    url: string;
    thumbnail?: {
        source: string;
        width: number;
        height: number;
    };
}

interface WikiCardProps {
    article: WikiArticle;
}

export function WikiCard({ article }: WikiCardProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [selectedText, setSelectedText] = useState('');
    const [isReversed, setIsReversed] = useState(false);
    const { toggleLike, isLiked } = useLikedArticles();
    const { settings, currentTheme, fonts } = useSettings();
    const tags = useArticleTags(article.title, article.extract);

    // Add debugging log
    console.log('Article data:', {
        title: article.title,
        pageid: article.pageid
    });

    const handleTextSelection = () => {
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) {
            setSelectedText(selection.toString());
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: article.title,
                    text: article.extract || '',
                    url: article.url
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            await navigator.clipboard.writeText(article.url);
            alert('Ссылка скопирована в буфер обмена!');
        }
    };

    const saveQuote = () => {
        if (!selectedText) return;
        
        const quotes = JSON.parse(localStorage.getItem('savedQuotes') || '[]');
        quotes.push({
            text: selectedText,
            title: article.title,
            url: article.url,
            date: new Date().toISOString()
        });
        localStorage.setItem('savedQuotes', JSON.stringify(quotes));
        setSelectedText('');
        alert('Цитата сохранена!');
    };

    const cardClasses = `
        w-[90%] 
        ${currentTheme.background} 
        backdrop-blur-lg 
        shadow-xl 
        overflow-hidden 
        relative 
        hover:shadow-2xl 
        transition-all 
        duration-500 
        transform 
        motion-safe:animate-card-appear
        ${settings.focusMode ? 'focus-mode' : ''}
        flex flex-col
        md:max-w-[1200px]
        md:flex-row
        ${isReversed ? 'md:flex-row-reverse' : ''}
        md:h-[600px]
        max-h-[calc(100vh-4rem)]
        group
    `;

    const imageContainerClasses = `
        relative 
        h-96 
        shrink-0
        md:w-[45%]
        md:h-full
    `;

    const contentClasses = `
        p-8 
        flex 
        flex-col 
        flex-1 
        overflow-y-auto
        md:p-12
        md:border-l
        md:border-white/10
    `;

    const titleClasses = `
        text-4xl 
        font-bold 
        text-white 
        drop-shadow-lg
        md:text-5xl
        md:leading-tight
    `;

    const tagsContainerClasses = `
        flex 
        flex-wrap 
        gap-2 
        mb-3
        md:mb-6
    `;

    const extractClasses = `
        ${fonts[settings.fontFamily]}
        text-lg leading-relaxed
        ${currentTheme.text}
        flex-1 
        overflow-y-auto
        md:text-xl
        md:leading-relaxed
    `;

    const actionsContainerClasses = `
        flex 
        justify-between 
        items-center 
        mt-6 
        shrink-0 
        pb-safe
        md:mt-8
    `;

    const readMoreClasses = `
        text-blue-500 
        hover:text-blue-600 
        dark:text-blue-400 
        dark:hover:text-blue-300 
        transition-colors
        md:text-lg
    `;

    const actionButtonClasses = `
        p-2.5 
        rounded-full 
        bg-white/10 
        hover:bg-white/20 
        backdrop-blur-sm 
        transition-all
        md:p-3
    `;

    const actionIconClasses = `
        w-6 
        h-6 
        md:w-7 
        md:h-7
    `;

    return (
        <div className="h-screen w-full flex items-center justify-center snap-start snap-always relative">
            <div className={cardClasses}>
                {article.thumbnail && (
                    <>
                        <div className={`${imageContainerClasses} ${isReversed ? 'animate-flip-sides-reverse' : 'animate-flip-sides'}`}>
                            <img
                                src={article.thumbnail.source}
                                alt={article.title}
                                className={`w-full h-full object-cover transition-all duration-700 ${
                                    imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                                } hover:scale-105`}
                                onLoad={() => setImageLoaded(true)}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-8 md:hidden">
                                <div className={tagsContainerClasses}>
                                    {tags.map(tag => (
                                        <span key={tag.id} className={getTagStyle(tag)}>
                                            {tag.name}
                                        </span>
                                    ))}
                                </div>
                                <h2 className={titleClasses}>
                                    {article.title}
                                </h2>
                            </div>
                        </div>

                        <div className="hidden md:flex absolute top-1/2 left-[44%] -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => setIsReversed(!isReversed)}
                                className={`${currentTheme.background} p-2 rounded-full shadow-lg backdrop-blur-sm
                                    hover:bg-white/10 transition-all transform hover:scale-110
                                    border border-white/10 ${isReversed ? 'left-[55%]' : ''}`}
                                title={isReversed ? "Фото слева" : "Фото справа"}
                            >
                                <ArrowLeftRight className={`w-5 h-5 ${currentTheme.text} transition-transform duration-500 ${isReversed ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                    </>
                )}
                <div className={`${contentClasses} ${isReversed ? 'md:border-r md:border-l-0 animate-flip-sides' : 'animate-flip-sides-reverse'}`}>
                    {!article.thumbnail && (
                        <>
                            <div className={tagsContainerClasses}>
                                {tags.map(tag => (
                                    <span key={tag.id} className={getTagStyle(tag)}>
                                        {tag.name}
                                    </span>
                                ))}
                            </div>
                            <h2 className={`text-3xl font-bold mb-6 ${currentTheme.text} shrink-0`}>{article.title}</h2>
                        </>
                    )}
                    {article.thumbnail && (
                        <div className="hidden md:block mb-8">
                            <div className={tagsContainerClasses}>
                                {tags.map(tag => (
                                    <span key={tag.id} className={getTagStyle(tag)}>
                                        {tag.name}
                                    </span>
                                ))}
                            </div>
                            <h2 className={`text-4xl font-bold ${currentTheme.text}`}>{article.title}</h2>
                        </div>
                    )}
                    <p 
                        className={extractClasses}
                        style={{ fontSize: `${settings.fontSize}px` }}
                        onMouseUp={handleTextSelection}
                    >
                        {article.extract}
                    </p>
                    <div className={actionsContainerClasses}>
                        <a 
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={readMoreClasses}
                        >
                            Читать полностью →
                        </a>
                        <div className="flex space-x-3">
                            {selectedText && (
                                <button
                                    onClick={saveQuote}
                                    className={actionButtonClasses}
                                    title="Сохранить цитату"
                                >
                                    <Quote className={`${actionIconClasses} ${currentTheme.text}`} />
                                </button>
                            )}
                            <SpeechButton text={`${article.title}. ${article.extract}`} />
                            <button
                                onClick={handleShare}
                                className={actionButtonClasses}
                                title="Поделиться"
                            >
                                <Share2 className={`${actionIconClasses} ${currentTheme.text}`} />
                            </button>
                            <button
                                onClick={() => toggleLike(article)}
                                className={`${actionButtonClasses} ${
                                    isLiked(article.pageid) ? 'text-red-500' : currentTheme.text
                                }`}
                                title={isLiked(article.pageid) ? 'Удалить из избранного' : 'Добавить в избранное'}
                            >
                                <Heart className={`${actionIconClasses} ${isLiked(article.pageid) ? 'fill-current' : ''}`} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { Share2, Heart, Quote } from 'lucide-react';
import { useState } from 'react';
import { useLikedArticles } from '../contexts/LikedArticlesContext';
import { SpeechButton } from './SpeechButton';
import { useSettings } from '../contexts/SettingsContext';

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
    const { toggleLike, isLiked } = useLikedArticles();
    const { settings, currentTheme, fonts } = useSettings();

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
        max-w-4xl w-[90%] 
        ${currentTheme.background} 
        backdrop-blur-lg rounded-xl 
        shadow-xl overflow-hidden relative 
        hover:shadow-2xl transition-all duration-500 
        transform motion-safe:animate-card-appear
        ${settings.focusMode ? 'focus-mode' : ''}
        flex flex-col
        max-h-[calc(100vh-4rem)]
    `;

    const textClasses = `
        ${fonts[settings.fontFamily]}
        text-lg leading-relaxed
        ${currentTheme.text}
    `;

    return (
        <div className="h-screen w-full flex items-center justify-center snap-start snap-always relative">
            <div className={cardClasses}>
                {article.thumbnail && (
                    <div className="relative h-96 shrink-0">
                        <img
                            src={article.thumbnail.source}
                            alt={article.title}
                            className={`w-full h-full object-cover transition-all duration-700 ${
                                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                            } hover:scale-105`}
                            onLoad={() => setImageLoaded(true)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />
                        <h2 className="absolute bottom-0 left-0 right-0 p-8 text-4xl font-bold text-white drop-shadow-lg">
                            {article.title}
                        </h2>
                    </div>
                )}
                <div className="p-8 flex flex-col flex-1 overflow-y-auto" onMouseUp={handleTextSelection}>
                    {!article.thumbnail && (
                        <h2 className="text-3xl font-bold mb-6 dark:text-white shrink-0">{article.title}</h2>
                    )}
                    <p 
                        className={`${textClasses} flex-1 overflow-y-auto`}
                        style={{ fontSize: `${settings.fontSize}px` }}
                    >
                        {article.extract}
                    </p>
                    <div className="flex justify-between items-center mt-6 shrink-0 pb-safe">
                        <a 
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        >
                            Читать полностью →
                        </a>
                        <div className="flex space-x-3">
                            {selectedText && (
                                <button
                                    onClick={saveQuote}
                                    className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
                                    title="Сохранить цитату"
                                >
                                    <Quote className="w-6 h-6 text-white" />
                                </button>
                            )}
                            <SpeechButton text={`${article.title}. ${article.extract}`} />
                            <button
                                onClick={handleShare}
                                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
                                title="Поделиться"
                            >
                                <Share2 className="w-6 h-6 text-white" />
                            </button>
                            <button
                                onClick={() => toggleLike(article)}
                                className={`p-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all ${
                                    isLiked(article.pageid) ? 'text-red-500' : 'text-white'
                                }`}
                                title={isLiked(article.pageid) ? 'Удалить из избранного' : 'Добавить в избранное'}
                            >
                                <Heart className={`w-6 h-6 ${isLiked(article.pageid) ? 'fill-current' : ''}`} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

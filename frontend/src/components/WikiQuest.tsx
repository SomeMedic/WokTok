import { useState, useEffect } from 'react';
import { Timer, Flag, Trophy, ArrowRight, Loader2 } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { WikiArticle } from './WikiCard';
import { useWikiQuest } from '../contexts/WikiQuestContext';
import { useWikiLinks } from '../hooks/useWikiLinks';

interface WikiQuestProps {
    isOpen: boolean;
    onClose: () => void;
}

export function WikiQuest({ isOpen, onClose }: WikiQuestProps) {
    const { currentTheme } = useSettings();
    const {
        isGameActive,
        startGame,
        endGame,
        makeMove,
        stats,
        currentPath,
        startArticle,
        targetArticle,
        currentArticle,
        gameStartTime
    } = useWikiQuest();
    const { links, loading } = useWikiLinks(currentArticle);
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        if (isOpen && isGameActive && gameStartTime) {
            const timer = setInterval(() => {
                setElapsedTime(Math.floor((Date.now() - gameStartTime) / 1000));
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isOpen, isGameActive, gameStartTime]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className={`${currentTheme.background} backdrop-blur-md rounded-xl w-full max-w-4xl shadow-xl overflow-hidden max-h-[80vh] flex flex-col`}>
                {/* Заголовок */}
                <div className="p-6 border-b border-white/10 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <h2 className={`text-2xl font-bold ${currentTheme.text}`}>WikiQuest</h2>
                        <button
                            onClick={onClose}
                            className={`${currentTheme.text} opacity-70 hover:opacity-100 transition-opacity`}
                        >
                            ✕
                        </button>
                    </div>
                    <p className={`mt-2 ${currentTheme.text} opacity-70`}>
                        Найдите путь от одной статьи к другой, используя только гиперссылки!
                    </p>
                </div>

                {/* Статистика игры */}
                <div className="p-4 bg-white/5 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`flex items-center gap-2 ${currentTheme.text}`}>
                                <Timer className="w-5 h-5" />
                                <span>{formatTime(elapsedTime)}</span>
                            </div>
                            <div className={`flex items-center gap-2 ${currentTheme.text}`}>
                                <Flag className="w-5 h-5" />
                                <span>{currentPath.length} ходов</span>
                            </div>
                        </div>
                        <button
                            onClick={startGame}
                            className={`px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors`}
                        >
                            {isGameActive ? 'Новая игра' : 'Начать игру'}
                        </button>
                    </div>
                </div>

                {/* Игровое поле */}
                <div className="p-6 overflow-y-auto flex-1">
                    {!isGameActive ? (
                        <div className="text-center py-8">
                            <Trophy className={`w-16 h-16 ${currentTheme.text} opacity-50 mx-auto mb-4`} />
                            <h3 className={`text-xl font-bold ${currentTheme.text} mb-2`}>
                                Готовы начать приключение?
                            </h3>
                            <p className={`${currentTheme.text} opacity-70 mb-6`}>
                                Нажмите "Начать игру", чтобы начать свой WikiQuest!
                            </p>
                            {/* Статистика игрока */}
                            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                                <div className={`p-4 rounded-lg ${currentTheme.background} border border-white/10`}>
                                    <div className={`text-2xl font-bold ${currentTheme.text}`}>{stats.gamesPlayed}</div>
                                    <div className={`text-sm ${currentTheme.text} opacity-70`}>Сыграно игр</div>
                                </div>
                                <div className={`p-4 rounded-lg ${currentTheme.background} border border-white/10`}>
                                    <div className={`text-2xl font-bold ${currentTheme.text}`}>{stats.gamesWon}</div>
                                    <div className={`text-sm ${currentTheme.text} opacity-70`}>Побед</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Информация о задании */}
                            <div className={`${currentTheme.background} p-4 rounded-lg border border-white/10`}>
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <div className={`text-sm ${currentTheme.text} opacity-70 mb-1`}>Начальная статья:</div>
                                        <div className={`font-bold ${currentTheme.text}`}>{startArticle?.title}</div>
                                    </div>
                                    <ArrowRight className={`w-6 h-6 ${currentTheme.text} opacity-50 mx-4`} />
                                    <div>
                                        <div className={`text-sm ${currentTheme.text} opacity-70 mb-1`}>Целевая статья:</div>
                                        <div className={`font-bold ${currentTheme.text}`}>{targetArticle?.title}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                {/* Левая колонка - текущий путь и статья */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {currentPath.filter(Boolean).map((article, index) => (
                                            <div key={`${article.pageid}-${index}`} className="flex items-center">
                                                <span className={`${currentTheme.text}`}>{article.title}</span>
                                                {index < currentPath.length - 1 && (
                                                    <ArrowRight className={`w-4 h-4 ${currentTheme.text} opacity-50 mx-2`} />
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {currentArticle && (
                                        <div className={`${currentTheme.background} p-4 rounded-lg border border-white/10`}>
                                            {currentArticle.thumbnail && (
                                                <div className="relative w-full h-32 mb-4 rounded-lg overflow-hidden">
                                                    <img
                                                        src={currentArticle.thumbnail.source}
                                                        alt={currentArticle.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                                </div>
                                            )}
                                            <h3 className={`text-lg font-bold ${currentTheme.text} mb-2`}>
                                                {currentArticle.title}
                                            </h3>
                                            <p className={`${currentTheme.text} opacity-70 mb-4 max-h-[200px] overflow-y-auto pr-4`}>
                                                {currentArticle.extract}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Правая колонка - доступные ссылки */}
                                <div className={`${currentTheme.background} p-4 rounded-lg border border-white/10`}>
                                    <h3 className={`text-lg font-bold ${currentTheme.text} mb-4`}>
                                        Доступные ссылки
                                    </h3>
                                    {loading ? (
                                        <div className="flex items-center justify-center py-8">
                                            <Loader2 className={`w-8 h-8 ${currentTheme.text} animate-spin`} />
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
                                            {links.map((link, index) => (
                                                <button
                                                    key={`${link.title}-${link.pageid || index}`}
                                                    onClick={() => makeMove(link as WikiArticle)}
                                                    className={`p-2 text-left rounded-lg hover:bg-white/10 transition-colors
                                                        ${currentTheme.text} text-sm truncate`}
                                                >
                                                    {link.title}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 
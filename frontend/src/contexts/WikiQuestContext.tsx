import { createContext, useContext, useState, ReactNode } from 'react';
import { WikiArticle } from '../components/WikiCard';
import { useWikiArticles } from '../hooks/useWikiArticles';
import { useLocalization } from '../hooks/useLocalization';

interface GameStats {
    bestTime: number;
    bestMoves: number;
    gamesPlayed: number;
    gamesWon: number;
}

interface WikiQuestContextType {
    isGameActive: boolean;
    startGame: () => void;
    endGame: () => void;
    makeMove: (article: WikiArticle) => void;
    stats: GameStats;
    currentPath: WikiArticle[];
    startArticle: WikiArticle | null;
    targetArticle: WikiArticle | null;
    currentArticle: WikiArticle | null;
    gameStartTime: number | null;
}

const WikiQuestContext = createContext<WikiQuestContextType | null>(null);

const INITIAL_STATS: GameStats = {
    bestTime: Infinity,
    bestMoves: Infinity,
    gamesPlayed: 0,
    gamesWon: 0
};

export function WikiQuestProvider({ children }: { children: ReactNode }) {
    const [isGameActive, setIsGameActive] = useState(false);
    const [stats, setStats] = useState<GameStats>(() => {
        const saved = localStorage.getItem('wikiQuestStats');
        return saved ? JSON.parse(saved) : INITIAL_STATS;
    });
    const [currentPath, setCurrentPath] = useState<WikiArticle[]>([]);
    const [startArticle, setStartArticle] = useState<WikiArticle | null>(null);
    const [targetArticle, setTargetArticle] = useState<WikiArticle | null>(null);
    const [currentArticle, setCurrentArticle] = useState<WikiArticle | null>(null);
    const [gameStartTime, setGameStartTime] = useState<number | null>(null);
    const { articles, fetchArticles } = useWikiArticles();
    const { currentLanguage } = useLocalization();

    const fetchArticleDetails = async (title: string): Promise<WikiArticle | null> => {
        try {
            const params = new URLSearchParams({
                action: 'query',
                format: 'json',
                titles: title,
                prop: 'extracts|pageimages|info',
                inprop: 'url',
                exintro: '1',
                explaintext: '1',
                piprop: 'thumbnail',
                pithumbsize: '400',
                origin: '*'
            });

            const response = await fetch(`${currentLanguage.api}${params.toString()}`);
            const data = await response.json();

            if (!data.query?.pages) {
                console.error('Неверный формат ответа API');
                return null;
            }

            const page = Object.values(data.query.pages)[0] as any;
            return {
                title: page.title,
                extract: page.extract || '',
                pageid: page.pageid,
                thumbnail: page.thumbnail,
                url: page.canonicalurl
            };
        } catch (error) {
            console.error('Ошибка при загрузке деталей статьи:', error);
            return null;
        }
    };

    const startGame = async () => {
        try {
            // Сбрасываем текущее состояние игры
            setIsGameActive(false);
            setCurrentPath([]);
            setStartArticle(null);
            setTargetArticle(null);
            setCurrentArticle(null);
            setGameStartTime(null);

            // Загружаем статьи
            if (articles.length < 2) {
                console.log('Загрузка статей...');
                await fetchArticles();
            }

            console.log('Доступные статьи:', articles.length);

            if (articles.length < 2) {
                console.error('Не удалось загрузить достаточное количество статей');
                return;
            }

            // Выбираем две случайные статьи
            const availableArticles = articles.filter(article => 
                article && article.title && article.pageid && article.extract
            );

            console.log('Отфильтрованные статьи:', availableArticles.length);

            if (availableArticles.length < 2) {
                console.error('Недостаточно валидных статей для начала игры');
                return;
            }

            const startIndex = Math.floor(Math.random() * availableArticles.length);
            const start = availableArticles[startIndex];
            const remainingArticles = availableArticles.filter(a => a.pageid !== start.pageid);
            
            const targetIndex = Math.floor(Math.random() * remainingArticles.length);
            const target = remainingArticles[targetIndex];

            console.log('Выбраны статьи:', {
                start: start.title,
                target: target.title
            });

            // Устанавливаем начальное состояние игры
            setStartArticle(start);
            setTargetArticle(target);
            setCurrentArticle(start);
            setCurrentPath([start]);
            setGameStartTime(Date.now());
            setIsGameActive(true);
            
            setStats(prev => ({
                ...prev,
                gamesPlayed: prev.gamesPlayed + 1
            }));
        } catch (error) {
            console.error('Ошибка при запуске игры:', error);
            setIsGameActive(false);
        }
    };

    const endGame = () => {
        setIsGameActive(false);
        setGameStartTime(null);
        // Сохраняем статистику
        localStorage.setItem('wikiQuestStats', JSON.stringify(stats));
    };

    const makeMove = async (article: WikiArticle) => {
        if (!article) return;
        
        // Загружаем полную информацию о статье
        const fullArticle = await fetchArticleDetails(article.title);
        if (!fullArticle) return;
        
        setCurrentPath(prev => [...prev, fullArticle]);
        setCurrentArticle(fullArticle);

        // Проверяем, достигли ли цели
        if (fullArticle.pageid === targetArticle?.pageid && gameStartTime) {
            const gameTime = Date.now() - gameStartTime;
            setStats(prev => ({
                ...prev,
                gamesWon: prev.gamesWon + 1,
                bestTime: Math.min(prev.bestTime, gameTime),
                bestMoves: Math.min(prev.bestMoves, currentPath.length + 1)
            }));
            endGame();
        }
    };

    return (
        <WikiQuestContext.Provider value={{
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
        }}>
            {children}
        </WikiQuestContext.Provider>
    );
}

export function useWikiQuest() {
    const context = useContext(WikiQuestContext);
    if (!context) {
        throw new Error('useWikiQuest must be used within a WikiQuestProvider');
    }
    return context;
} 
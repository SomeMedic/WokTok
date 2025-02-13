import { useEffect, useRef, useCallback, useState, useMemo, memo } from 'react'
import { WikiArticle } from './components/WikiCard'
import { Loader2, Search, X, Download, Menu, Heart, Settings as SettingsIcon, ChevronRight, Trophy } from 'lucide-react'
import { Analytics } from "@vercel/analytics/react"
import { LanguageSelector } from './components/LanguageSelector'
import { useLikedArticles } from './contexts/LikedArticlesContext'
import { useWikiArticles } from './hooks/useWikiArticles'
import { AnimatedBackground } from './components/AnimatedBackground'
import { SettingsProvider, useSettings } from './contexts/SettingsContext'
import { SettingsPanel } from './components/SettingsPanel'
import { NextArticlePreview } from './components/NextArticlePreview'
import { TagFilterProvider, useTagFilter } from './contexts/TagFilterContext'
import { TagFilter } from './components/TagFilter'
import { useArticleTags } from './hooks/useArticleTags'
import { ArticleWithTags } from './components/ArticleWithTags'
import { useVisibleArticlesCount } from './hooks/useVisibleArticlesCount'
import { LayoutProvider } from './contexts/LayoutContext'
import { WikiQuest } from './components/WikiQuest'
import { WikiQuestProvider } from './contexts/WikiQuestContext'

// Создадим компонент для проверки видимости статьи
const ArticleVisibilityChecker = memo(function ArticleVisibilityChecker({ 
    article, 
    onVisible
}: { 
    article: WikiArticle;
    onVisible: (article: WikiArticle) => void;
}) {
    const tags = useArticleTags(article.title, article.extract);
    const { selectedTags } = useTagFilter();

    useEffect(() => {
        // Проверяем только следующую статью после текущей
        if (selectedTags.length === 0 || tags.some(tag => selectedTags.includes(tag.id))) {
            onVisible(article);
        }
    }, [article, tags, selectedTags, onVisible]);

    return null;
});

// Добавим компонент десктопного меню
interface DesktopMenuProps {
  onShowLikes: () => void;
  onShowSettings: () => void;
  onShowWikiQuest: () => void;
}

const DesktopMenu = ({ onShowLikes, onShowSettings, onShowWikiQuest }: DesktopMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentTheme } = useSettings();

  return (
    <div className="hidden md:block fixed right-0 top-1/2 -translate-y-1/2 z-50">
      {/* Кнопка открытия */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg 
          ${currentTheme.background} hover:bg-white/10 backdrop-blur-sm shadow-lg 
          transition-all duration-300 group z-10
          ${isOpen ? 'opacity-0' : 'opacity-100'}`}
        title="Открыть меню"
      >
        <Menu className={`w-5 h-5 ${currentTheme.text}`} />
      </button>

      {/* Выдвигающийся блок */}
      <div className={`${currentTheme.background} backdrop-blur-md rounded-l-xl shadow-xl 
        border border-white/10 w-[280px] p-3.5
        fixed right-0 top-1/2 -translate-y-1/2
        transform transition-all duration-500 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Затемнение фона */}
        <div className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-500
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          -z-10`} 
          onClick={() => setIsOpen(false)}
        />

        {/* Заголовок */}
        <div className={`flex items-center justify-between mb-6 
          transform transition-all duration-300 delay-100
          ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-7 h-7 rounded-lg ${currentTheme.background} flex items-center justify-center
              shadow-inner border border-white/10`}>
              <Menu className={`w-4 h-4 ${currentTheme.text}`} />
            </div>
            <div>
              <h3 className={`font-medium ${currentTheme.text} text-base leading-none mb-1`}>
                Меню
              </h3>
              <p className={`text-xs ${currentTheme.text} opacity-60 leading-none`}>
                Дополнительные опции
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors`}
            title="Закрыть"
          >
            <ChevronRight className={`w-5 h-5 ${currentTheme.text} rotate-180`} />
          </button>
        </div>

        {/* Пункты меню */}
        <div className="space-y-1.5">
          <button
            onClick={() => {
              setIsOpen(false);
              onShowLikes();
            }}
            className={`w-full px-4 py-2.5 rounded-lg text-left
              transform transition-all duration-300 delay-150
              ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}
              ${currentTheme.background} hover:bg-white/10 ${currentTheme.text}
              flex items-center gap-3`}
          >
            <Heart className="w-5 h-5" />
            <span>Избранное</span>
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              onShowSettings();
            }}
            className={`w-full px-4 py-2.5 rounded-lg text-left
              transform transition-all duration-300 delay-200
              ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}
              ${currentTheme.background} hover:bg-white/10 ${currentTheme.text}
              flex items-center gap-3`}
          >
            <SettingsIcon className="w-5 h-5" />
            <span>Настройки</span>
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              onShowWikiQuest();
            }}
            className={`w-full px-4 py-2.5 rounded-lg text-left
              transform transition-all duration-300 delay-150
              ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}
              ${currentTheme.background} hover:bg-white/10 ${currentTheme.text}
              flex items-center gap-3`}
          >
            <Trophy className="w-5 h-5" />
            <span>WikiQuest</span>
          </button>

          <div className={`px-4 py-2.5 transform transition-all duration-300 delay-250
            ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
            <p className={`text-sm mb-2 ${currentTheme.text} opacity-70`}>Язык:</p>
            <div className="relative">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function AppContent() {
  const [showMenu, setShowMenu] = useState(false)
  const [showLikes, setShowLikes] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showWikiQuest, setShowWikiQuest] = useState(false)
  const { articles, loading, fetchArticles } = useWikiArticles()
  const { likedArticles, toggleLike } = useLikedArticles()
  const observerTarget = useRef(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0)
  const { currentTheme } = useSettings()
  const { selectedTags } = useTagFilter()
  const [nextVisibleArticle, setNextVisibleArticle] = useState<WikiArticle | null>(null)

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const index = parseInt(entry.target.getAttribute('data-index') || '0')
        setCurrentArticleIndex(index)
      }
    })
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.5,
      rootMargin: '0px'
    })

    const articleElements = document.querySelectorAll('.article-card')
    articleElements.forEach(element => observer.observe(element))

    return () => observer.disconnect()
  }, [handleIntersection, articles])

  // Заменим старый код подсчета на новый хук
  const visibleArticlesCount = useVisibleArticlesCount(articles);

  // Обновим handleObserver
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && !loading) {
        // Если отфильтрованных статей мало, загружаем ещё
        if (visibleArticlesCount < 5) {
          fetchArticles();
        }
      }
    },
    [loading, fetchArticles, visibleArticlesCount]
  );

  // Добавим эффект для автоматической подгрузки при малом количестве видимых статей
  useEffect(() => {
    if (visibleArticlesCount < 5 && !loading) {
      fetchArticles();
    }
  }, [visibleArticlesCount, loading, fetchArticles]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: '100px',
    })

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [handleObserver])

  useEffect(() => {
    fetchArticles()
  }, [])

  const filteredLikedArticles = likedArticles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.extract.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleExport = () => {
    const simplifiedArticles = likedArticles.map(article => ({
      title: article.title,
      url: article.url,
      extract: article.extract,
      thumbnail: article.thumbnail?.source || null
    }));

    const dataStr = JSON.stringify(simplifiedArticles, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `woktok-favorites-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Обработчик для установки следующей видимой статьи
  const handleVisibleArticle = useCallback((article: WikiArticle) => {
    if (article.pageid !== articles[currentArticleIndex]?.pageid) {
      setNextVisibleArticle(article);
    }
  }, [articles, currentArticleIndex]);

  // Сбрасываем nextVisibleArticle при изменении фильтров
  useEffect(() => {
    setNextVisibleArticle(null);
  }, [selectedTags]);

  // Оптимизируем отображение проверки видимости
  const nextArticle = useMemo(() => {
    return articles[currentArticleIndex + 1] || null;
  }, [articles, currentArticleIndex]);

  return (
    <div className="min-h-screen bg-transparent">
      <AnimatedBackground />
      <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory">
        <button
          onClick={() => window.location.href = '/'}
          className="fixed top-4 left-4 z-50 group flex items-center gap-2"
        >
          <div className="relative w-6 h-6">
            <div className={`absolute inset-0 bg-gradient-to-r ${currentTheme.gradient} rounded-full animate-pulse`} />
            <div className="absolute inset-0.5 bg-black/5 backdrop-blur-sm rounded-full" />
            <span className="absolute inset-0 flex items-center justify-center font-bold text-white text-sm">W</span>
          </div>
          <span className={`font-bold bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent group-hover:scale-105 transition-transform`}>
            WikiTok
          </span>
        </button>

        <div className="md:hidden fixed top-4 right-4 z-50">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className={`p-2.5 rounded-full transition-all ${currentTheme.background} hover:bg-white/10 backdrop-blur-sm shadow-lg ${currentTheme.text}`}
          >
            {showMenu ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {showMenu && (
            <div className="fixed top-16 right-4 z-50">
              <div className={`${currentTheme.background} backdrop-blur-md rounded-2xl shadow-lg overflow-hidden`}>
                <div className="p-2 space-y-1 min-w-[200px]">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setShowLikes(true);
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors ${currentTheme.text}`}
                  >
                    <Heart className="w-5 h-5" />
                    <span>Избранное</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setShowSettings(true);
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors ${currentTheme.text}`}
                  >
                    <SettingsIcon className="w-5 h-5" />
                    <span>Настройки</span>
                  </button>

                  <div className="px-4 py-2">
                    <p className={`text-sm mb-2 ${currentTheme.text} opacity-70`}>Язык:</p>
                    <div className="relative">
                      <LanguageSelector />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DesktopMenu 
          onShowLikes={() => setShowLikes(true)}
          onShowSettings={() => setShowSettings(true)}
          onShowWikiQuest={() => setShowWikiQuest(true)}
        />

        <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />

        <WikiQuest isOpen={showWikiQuest} onClose={() => setShowWikiQuest(false)} />

        {showLikes && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className={`${currentTheme.background} p-6 rounded-lg w-full max-w-2xl h-[80vh] flex flex-col relative backdrop-blur-sm`}>
              <button
                onClick={() => setShowLikes(false)}
                className={`absolute top-2 right-2 ${currentTheme.text} opacity-70 hover:opacity-100 transition-opacity`}
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-xl font-bold ${currentTheme.text}`}>Избранное</h2>
                {likedArticles.length > 0 && (
                  <button
                    onClick={handleExport}
                    className={`flex items-center gap-2 px-3 py-1.5 text-sm ${currentTheme.background} hover:bg-white/10 rounded-lg transition-colors ${currentTheme.text}`}
                    title="Экспорт избранного"
                  >
                    <Download className="w-4 h-4" />
                    Экспорт
                  </button>
                )}
              </div>

              <div className="relative mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск по избранному..."
                  className={`w-full bg-white/10 ${currentTheme.text} px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <Search className={`w-5 h-5 ${currentTheme.text} opacity-50 absolute left-3 top-1/2 transform -translate-y-1/2`} />
              </div>

              <div className="flex-1 overflow-y-auto min-h-0">
                {filteredLikedArticles.length === 0 ? (
                  <p className={`${currentTheme.text} opacity-70`}>
                    {searchQuery ? "Ничего не найдено" : "Нет избранных статей"}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {filteredLikedArticles.map((article) => (
                      <div key={article.pageid} className="group">
                        <div className="flex items-start justify-between gap-4">
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`font-bold ${currentTheme.text} hover:opacity-80 transition-opacity`}
                          >
                            {article.title}
                          </a>
                          <button
                            onClick={() => toggleLike(article)}
                            className={`${currentTheme.text} opacity-50 hover:opacity-90 p-1 rounded-full md:opacity-0 md:group-hover:opacity-50 transition-opacity`}
                            aria-label="Удалить из избранного"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className={`text-sm ${currentTheme.text} opacity-70 line-clamp-2`}>
                          {article.extract}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {articles.map((article, index) => (
          <ArticleWithTags 
            key={`${article.pageid}-${index}`}
            article={article}
            index={index}
          />
        ))}

        {/* Проверяем только следующую статью */}
        {nextArticle && (
          <ArticleVisibilityChecker
            key={nextArticle.pageid}
            article={nextArticle}
            onVisible={handleVisibleArticle}
          />
        )}

        {nextVisibleArticle && (
          <NextArticlePreview article={nextVisibleArticle} />
        )}

        <div ref={observerTarget} className="h-10 -mt-1" />
        {loading && (
          <div className="h-screen w-full flex items-center justify-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading...</span>
          </div>
        )}
        <Analytics />
        <TagFilter />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <SettingsProvider>
      <LayoutProvider>
        <WikiQuestProvider>
          <TagFilterProvider>
            <AppContent />
          </TagFilterProvider>
        </WikiQuestProvider>
      </LayoutProvider>
    </SettingsProvider>
  )
}

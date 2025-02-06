import { useEffect, useRef, useCallback, useState } from 'react'
import { WikiCard } from './components/WikiCard'
import { Loader2, Search, X, Download } from 'lucide-react'
import { Analytics } from "@vercel/analytics/react"
import { LanguageSelector } from './components/LanguageSelector'
import { useLikedArticles } from './contexts/LikedArticlesContext'
import { useWikiArticles } from './hooks/useWikiArticles'
import { AnimatedBackground } from './components/AnimatedBackground'
import { SettingsProvider } from './contexts/SettingsContext'
import { SettingsPanel } from './components/SettingsPanel'
import { NextArticlePreview } from './components/NextArticlePreview'
import { WikiArticle } from './components/WikiCard'

function AppContent() {
  const [showAbout, setShowAbout] = useState(false)
  const [showLikes, setShowLikes] = useState(false)
  const { articles, loading, fetchArticles } = useWikiArticles()
  const { likedArticles, toggleLike } = useLikedArticles()
  const observerTarget = useRef(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0)

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

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries
      if (target.isIntersecting && !loading) {
        fetchArticles()
      }
    },
    [loading, fetchArticles]
  )

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

  return (
    <div className="min-h-screen bg-transparent">
      <AnimatedBackground />
      <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory">
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={() => window.location.reload()}
            className="text-2xl font-bold text-white drop-shadow-lg hover:opacity-80 transition-opacity"
          >
            WokTok
          </button>
        </div>

        <SettingsPanel />

        <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
          <button
            onClick={() => setShowAbout(!showAbout)}
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            About
          </button>
          <button
            onClick={() => setShowLikes(!showLikes)}
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            Likes
          </button>
          <LanguageSelector />
        </div>

        {showAbout && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 p-6 rounded-lg max-w-md relative">
              <button
                onClick={() => setShowAbout(false)}
                className="absolute top-2 right-2 text-white/70 hover:text-white"
              >
                ✕
              </button>
              <h2 className="text-xl font-bold mb-4">About WikiTok</h2>
              <p className="mb-4">
                A TikTok-style interface for exploring random Wikipedia articles.
              </p>
              <p className="text-white/70 mt-2">
                Check out the code on{' '}
                <a
                  href="https://github.com/SomeMedic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:underline"
                >
                  GitHub
                </a>
              </p>
            </div>
          </div>
        )}

        {showLikes && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 p-6 rounded-lg w-full max-w-2xl h-[80vh] flex flex-col relative">
              <button
                onClick={() => setShowLikes(false)}
                className="absolute top-2 right-2 text-white/70 hover:text-white"
              >
                ✕
              </button>

              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Liked Articles</h2>
                {likedArticles.length > 0 && (
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                    title="Export liked articles"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                )}
              </div>

              <div className="relative mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search liked articles..."
                  className="w-full bg-gray-800 text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="w-5 h-5 text-white/50 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>

              <div className="flex-1 overflow-y-auto min-h-0">
                {filteredLikedArticles.length === 0 ? (
                  <p className="text-white/70">
                    {searchQuery ? "No matches found." : "No liked articles yet."}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {filteredLikedArticles.map((article) => (
                      <div key={`${article.pageid}-${Date.now()}`} className="flex gap-4 items-start group">
                        {article.thumbnail && (
                          <img
                            src={article.thumbnail.source}
                            alt={article.title}
                            className="w-20 h-20 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <a
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-bold hover:text-gray-200"
                            >
                              {article.title}
                            </a>
                            <button
                              onClick={() => toggleLike(article)}
                              className="text-white/50 hover:text-white/90 p-1 rounded-full md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                              aria-label="Remove from likes"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-sm text-white/70 line-clamp-2">
                            {article.extract}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {articles.map((article, index) => (
          <div key={`${article.pageid}-${index}`} className="article-card" data-index={index}>
            <WikiCard article={article} />
          </div>
        ))}

        {articles.length > currentArticleIndex + 1 && (
          <NextArticlePreview article={articles[currentArticleIndex + 1]} />
        )}

        <div ref={observerTarget} className="h-10 -mt-1" />
        {loading && (
          <div className="h-screen w-full flex items-center justify-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading...</span>
          </div>
        )}
        <Analytics />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  )
}

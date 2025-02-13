import { useState, useCallback } from "react";
import { useLocalization } from "./useLocalization";
import type { WikiArticle } from "../components/WikiCard";

const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve();
    img.onerror = reject;
  });
};

const MAX_RETRIES = 3;
const ARTICLES_PER_REQUEST = 20;

export function useWikiArticles() {
  const [articles, setArticles] = useState<WikiArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [buffer, setBuffer] = useState<WikiArticle[]>([]);
  const { currentLanguage } = useLocalization();

  const fetchArticles = async (forBuffer = false, retryCount = 0) => {
    if (loading) return;
    setLoading(true);

    try {
      console.log('Загрузка статей...');
      const response = await fetch(
        currentLanguage.api +
          new URLSearchParams({
            action: "query",
            format: "json",
            generator: "random",
            grnnamespace: "0",
            prop: "extracts|pageimages|info",
            inprop: "url",
            grnlimit: String(ARTICLES_PER_REQUEST),
            exintro: "1",
            exlimit: "max",
            exsentences: "5",
            explaintext: "1",
            piprop: "thumbnail",
            pithumbsize: "400",
            origin: "*",
          })
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.query || !data.query.pages) {
        throw new Error('Неверный формат ответа API');
      }

      console.log('Получены данные:', Object.keys(data.query.pages).length, 'статей');

      const newArticles = Object.values(data.query.pages)
        .map((page: any): WikiArticle => ({
          title: page.title,
          extract: page.extract,
          pageid: page.pageid,
          thumbnail: page.thumbnail,
          url: page.canonicalurl,
        }))
        .filter((article): article is WikiArticle => 
          Boolean(article) &&
          Boolean(article.title) &&
          Boolean(article.extract) &&
          Boolean(article.pageid) &&
          Boolean(article.url)
        );

      console.log('Отфильтровано статей:', newArticles.length);

      // Предзагрузка изображений
      await Promise.allSettled(
        newArticles
          .filter((article) => article.thumbnail?.source)
          .map((article) => preloadImage(article.thumbnail!.source))
      );

      if (newArticles.length === 0 && retryCount < MAX_RETRIES) {
        console.log(`Попытка ${retryCount + 1} не дала результатов, повторяем...`);
        setLoading(false);
        return fetchArticles(forBuffer, retryCount + 1);
      }

      if (forBuffer) {
        setBuffer(newArticles);
      } else {
        setArticles((prev) => [...prev, ...newArticles]);
        // Загружаем в буфер только если получили статьи
        if (newArticles.length > 0) {
          fetchArticles(true);
        }
      }
    } catch (error) {
      console.error("Ошибка при загрузке статей:", error);
      if (retryCount < MAX_RETRIES) {
        console.log(`Повторная попытка ${retryCount + 1}...`);
        setLoading(false);
        return fetchArticles(forBuffer, retryCount + 1);
      }
    }
    setLoading(false);
  };

  const getMoreArticles = useCallback(() => {
    if (buffer.length > 0) {
      setArticles((prev) => [...prev, ...buffer]);
      setBuffer([]);
      fetchArticles(true);
    } else {
      fetchArticles(false);
    }
  }, [buffer]);

  return { articles, loading, fetchArticles: getMoreArticles };
}

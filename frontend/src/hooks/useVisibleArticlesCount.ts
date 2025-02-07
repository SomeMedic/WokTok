import { useMemo } from 'react';
import { WikiArticle } from '../components/WikiCard';
import { useTagFilter } from '../contexts/TagFilterContext';
import { useArticlesTags } from './useArticlesTags';

// Кэш для хранения результатов подсчета
const countCache = new Map<string, number>();

export function useVisibleArticlesCount(articles: WikiArticle[]) {
    const { selectedTags } = useTagFilter();
    const articleTags = useArticlesTags(articles);

    return useMemo(() => {
        if (selectedTags.length === 0) return articles.length;

        // Создаем ключ для кэша
        const cacheKey = `${articles.length}:${selectedTags.join(',')}`;
        
        // Проверяем кэш
        if (countCache.has(cacheKey)) {
            return countCache.get(cacheKey)!;
        }

        // Вычисляем количество видимых статей
        const count = articles.reduce((count, _, index) => {
            const tags = articleTags[index];
            if (tags.some(tag => selectedTags.includes(tag.id))) {
                return count + 1;
            }
            return count;
        }, 0);

        // Сохраняем результат в кэш
        countCache.set(cacheKey, count);

        // Очищаем кэш, если он стал слишком большим
        if (countCache.size > 1000) {
            const keys = Array.from(countCache.keys());
            for (let i = 0; i < keys.length - 1000; i++) {
                countCache.delete(keys[i]);
            }
        }

        return count;
    }, [articles.length, selectedTags, articleTags]);
} 
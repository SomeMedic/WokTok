import { useMemo } from 'react';
import { WikiArticle } from '../components/WikiCard';
import { calculateArticleTags } from './useArticleTags';

// Функция для создания стабильного ключа для статьи
function getArticleKey(article: WikiArticle) {
    return `${article.pageid}:${article.title}`;
}

export function useArticlesTags(articles: WikiArticle[]) {
    // Создаем стабильный ключ для массива статей
    const articlesKey = useMemo(() => 
        articles.map(getArticleKey).join('|'),
        [articles]
    );

    // Мемоизируем базовые данные статей
    const articlesData = useMemo(() => 
        articles.map(article => ({
            title: article.title,
            extract: article.extract
        })),
        [articlesKey] // Используем ключ вместо самого массива
    );

    // Мемоизируем вычисление тегов
    return useMemo(() => 
        articlesData.map(article => 
            calculateArticleTags(article.title, article.extract)
        ),
        [articlesData] // Зависим только от мемоизированных данных
    );
} 
import { WikiArticle, WikiCard } from './WikiCard';
import { useArticleTags } from '../hooks/useArticleTags';
import { useTagFilter } from '../contexts/TagFilterContext';
import { memo, useMemo } from 'react';

interface ArticleWithTagsProps {
    article: WikiArticle;
    index: number;
}

export const ArticleWithTags = memo(function ArticleWithTags({ article, index }: ArticleWithTagsProps) {
    const tags = useArticleTags(article.title, article.extract);
    const { selectedTags } = useTagFilter();

    // Используем useMemo для вычисления shouldRender
    const shouldRender = useMemo(() => {
        return selectedTags.length === 0 || tags.some(tag => selectedTags.includes(tag.id));
    }, [selectedTags, tags]);

    if (!shouldRender) {
        return null;
    }

    return (
        <div className="article-card" data-index={index}>
            <WikiCard article={article} />
        </div>
    );
}, (prevProps, nextProps) => {
    // Добавляем проверку для предотвращения ненужных ререндеров
    return prevProps.article.pageid === nextProps.article.pageid && 
           prevProps.index === nextProps.index;
}); 
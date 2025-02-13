import { useState, useEffect } from 'react';
import { useLocalization } from './useLocalization';
import { WikiArticle } from '../components/WikiCard';

interface WikiLink {
    pageid: number;
    title: string;
}

export function useWikiLinks(article: WikiArticle | null) {
    const [links, setLinks] = useState<WikiLink[]>([]);
    const [loading, setLoading] = useState(false);
    const { currentLanguage } = useLocalization();

    useEffect(() => {
        if (!article) return;

        const fetchLinks = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    action: 'query',
                    prop: 'links',
                    titles: article.title,
                    pllimit: '50', // Ограничиваем количество ссылок
                    format: 'json',
                    origin: '*'
                });

                const response = await fetch(`${currentLanguage.api}${params.toString()}`);
                const data = await response.json();

                const page = Object.values(data.query.pages)[0] as any;
                if (page.links) {
                    setLinks(page.links.map((link: any) => ({
                        pageid: link.pageid || 0,
                        title: link.title
                    })));
                }
            } catch (error) {
                console.error('Error fetching links:', error);
                setLinks([]);
            } finally {
                setLoading(false);
            }
        };

        fetchLinks();
    }, [article, currentLanguage]);

    return { links, loading };
} 
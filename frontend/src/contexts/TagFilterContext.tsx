import { createContext, useContext, useState, ReactNode } from 'react';
import { Tag } from '../hooks/useArticleTags';

interface TagFilterContextType {
    selectedTags: string[];
    toggleTag: (tagId: string) => void;
    clearTags: () => void;
    isTagSelected: (tagId: string) => boolean;
}

const TagFilterContext = createContext<TagFilterContextType | null>(null);

export function TagFilterProvider({ children }: { children: ReactNode }) {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const toggleTag = (tagId: string) => {
        setSelectedTags(prev => {
            if (prev.includes(tagId)) {
                return prev.filter(id => id !== tagId);
            }
            return [...prev, tagId];
        });
    };

    const clearTags = () => {
        setSelectedTags([]);
    };

    const isTagSelected = (tagId: string) => {
        return selectedTags.includes(tagId);
    };

    return (
        <TagFilterContext.Provider value={{ selectedTags, toggleTag, clearTags, isTagSelected }}>
            {children}
        </TagFilterContext.Provider>
    );
}

export function useTagFilter() {
    const context = useContext(TagFilterContext);
    if (!context) {
        throw new Error('useTagFilter must be used within a TagFilterProvider');
    }
    return context;
} 
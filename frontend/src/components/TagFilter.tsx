import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { useTagFilter } from '../contexts/TagFilterContext';
import { useSettings } from '../contexts/SettingsContext';
import { TAGS, Tag } from '../hooks/useArticleTags';

export function TagFilter() {
    const { selectedTags, toggleTag, clearTags, isTagSelected } = useTagFilter();
    const { currentTheme } = useSettings();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-24 left-4 z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2.5 rounded-full ${currentTheme.background} hover:bg-white/10 backdrop-blur-sm shadow-lg transition-all`}
                title="Фильтр по тегам"
            >
                <Filter className={`w-6 h-6 ${selectedTags.length > 0 ? 'text-blue-500' : currentTheme.text}`} />
            </button>

            {isOpen && (
                <div className="absolute bottom-full mb-2 left-0">
                    <div className={`${currentTheme.background} backdrop-blur-sm rounded-lg shadow-lg p-4 min-w-[250px]`}>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className={`font-medium ${currentTheme.text}`}>Фильтр по тегам</h3>
                            {selectedTags.length > 0 && (
                                <button
                                    onClick={clearTags}
                                    className={`text-sm ${currentTheme.text} opacity-70 hover:opacity-100 transition-opacity flex items-center gap-1`}
                                >
                                    <X className="w-4 h-4" />
                                    Сбросить
                                </button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {Object.values(TAGS).map((tag: Tag) => (
                                <button
                                    key={tag.id}
                                    onClick={() => toggleTag(tag.id)}
                                    className={`px-2.5 py-1 rounded-full text-sm transition-all ${
                                        isTagSelected(tag.id)
                                            ? `${tag.color} text-white`
                                            : `${currentTheme.background} hover:bg-white/10 ${currentTheme.text}`
                                    }`}
                                >
                                    {tag.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 
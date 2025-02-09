import { useMemo } from 'react';

export interface Tag {
    id: string;
    name: string;
    color: string;
    emoji: string;
}

interface Keyword {
    word: string;
    weight: number;
}

export const TAGS: Record<string, Tag> = {
    science: {
        id: 'science',
        name: 'Наука',
        color: 'bg-blue-500',
        emoji: '🔬'
    },
    history: {
        id: 'history',
        name: 'История',
        color: 'bg-amber-500',
        emoji: '📜'
    },
    technology: {
        id: 'technology',
        name: 'Технологии',
        color: 'bg-purple-500',
        emoji: '💻'
    },
    culture: {
        id: 'culture',
        name: 'Культура',
        color: 'bg-pink-500',
        emoji: '🎭'
    },
    nature: {
        id: 'nature',
        name: 'Природа',
        color: 'bg-emerald-500',
        emoji: '🌿'
    },
    society: {
        id: 'society',
        name: 'Общество',
        color: 'bg-orange-500',
        emoji: '👥'
    },
    art: {
        id: 'art',
        name: 'Искусство',
        color: 'bg-rose-500',
        emoji: '🎨'
    },
    sport: {
        id: 'sport',
        name: 'Спорт',
        color: 'bg-sky-500',
        emoji: '⚽'
    },
    politics: {
        id: 'politics',
        name: 'Политика',
        color: 'bg-red-500',
        emoji: '🏛️'
    },
    religion: {
        id: 'religion',
        name: 'Религия',
        color: 'bg-indigo-500',
        emoji: '🕊️'
    },
    philosophy: {
        id: 'philosophy',
        name: 'Философия',
        color: 'bg-violet-500',
        emoji: '🤔'
    },
    geography: {
        id: 'geography',
        name: 'География',
        color: 'bg-teal-500',
        emoji: '🌍'
    },
    medicine: {
        id: 'medicine',
        name: 'Медицина',
        color: 'bg-green-500',
        emoji: '⚕️'
    },
    space: {
        id: 'space',
        name: 'Космос',
        color: 'bg-slate-500',
        emoji: '🚀'
    },
    military: {
        id: 'military',
        name: 'Военное дело',
        color: 'bg-stone-500',
        emoji: '🎖️'
    }
};

const KEYWORDS: Record<string, Keyword[]> = {
    science: [
        { word: 'физика', weight: 10 },
        { word: 'химия', weight: 10 },
        { word: 'биология', weight: 10 },
        { word: 'научн', weight: 8 },
        { word: 'исследован', weight: 7 },
        { word: 'открыти', weight: 6 },
        { word: 'эксперимент', weight: 8 },
        { word: 'теори', weight: 7 },
        { word: 'учёный', weight: 8 },
        { word: 'лаборатор', weight: 9 },
        { word: 'математик', weight: 10 },
        { word: 'формул', weight: 7 },
        { word: 'гипотез', weight: 8 },
        { word: 'закон', weight: 6 },
        { word: 'атом', weight: 9 },
        { word: 'молекул', weight: 9 },
        { word: 'квант', weight: 10 },
        { word: 'элемент', weight: 7 },
        { word: 'реакци', weight: 8 },
        { word: 'излучени', weight: 8 },
        { word: 'энерги', weight: 7 },
        { word: 'генетик', weight: 9 },
        { word: 'клетк', weight: 8 },
        { word: 'днк', weight: 10 },
        { word: 'фермент', weight: 9 }
    ],
    history: [
        { word: 'истори', weight: 10 },
        { word: 'век', weight: 5 },
        { word: 'древн', weight: 8 },
        { word: 'импери', weight: 7 },
        { word: 'войн', weight: 6 },
        { word: 'революци', weight: 8 },
        { word: 'династи', weight: 9 },
        { word: 'эпох', weight: 7 },
        { word: 'археолог', weight: 10 },
        { word: 'летопис', weight: 9 },
        { word: 'историческ', weight: 8 },
        { word: 'хроник', weight: 7 },
        { word: 'цивилизаци', weight: 9 },
        { word: 'королевств', weight: 8 },
        { word: 'царств', weight: 8 },
        { word: 'князь', weight: 7 },
        { word: 'средневеков', weight: 9 },
        { word: 'античн', weight: 9 },
        { word: 'раскопк', weight: 8 },
        { word: 'артефакт', weight: 8 },
        { word: 'памятник', weight: 7 },
        { word: 'реликви', weight: 8 },
        { word: 'восстани', weight: 7 },
        { word: 'завоеван', weight: 7 },
        { word: 'государств', weight: 6 }
    ],
    technology: [
        { word: 'технолог', weight: 10 },
        { word: 'компьютер', weight: 9 },
        { word: 'интернет', weight: 8 },
        { word: 'программ', weight: 7 },
        { word: 'устройств', weight: 6 },
        { word: 'изобретен', weight: 8 },
        { word: 'инноваци', weight: 9 },
        { word: 'робот', weight: 10 },
        { word: 'гаджет', weight: 8 },
        { word: 'электрон', weight: 7 },
        { word: 'процессор', weight: 9 },
        { word: 'алгоритм', weight: 9 },
        { word: 'софт', weight: 8 },
        { word: 'приложени', weight: 7 },
        { word: 'сервер', weight: 8 },
        { word: 'микросхем', weight: 9 },
        { word: 'автоматиз', weight: 8 },
        { word: 'искусственн', weight: 9 },
        { word: 'нейросет', weight: 10 },
        { word: 'виртуальн', weight: 8 },
        { word: 'цифров', weight: 7 },
        { word: 'смартфон', weight: 8 },
        { word: 'беспроводн', weight: 7 },
        { word: 'сенсор', weight: 8 },
        { word: 'чип', weight: 9 }
    ],
    culture: [
        { word: 'культур', weight: 10 },
        { word: 'традици', weight: 8 },
        { word: 'обыча', weight: 7 },
        { word: 'праздник', weight: 6 },
        { word: 'фестивал', weight: 8 },
        { word: 'церемони', weight: 7 },
        { word: 'наследи', weight: 9 },
        { word: 'обряд', weight: 8 },
        { word: 'этнос', weight: 9 },
        { word: 'фольклор', weight: 10 },
        { word: 'карнавал', weight: 8 },
        { word: 'маскарад', weight: 7 },
        { word: 'костюм', weight: 6 },
        { word: 'танц', weight: 7 },
        { word: 'песн', weight: 7 },
        { word: 'сказани', weight: 8 },
        { word: 'легенд', weight: 8 },
        { word: 'мифолог', weight: 9 },
        { word: 'ремесл', weight: 8 },
        { word: 'творчеств', weight: 7 },
        { word: 'обычай', weight: 8 },
        { word: 'ритуал', weight: 8 },
        { word: 'традиционн', weight: 7 },
        { word: 'народн', weight: 7 },
        { word: 'искусств', weight: 8 }
    ],
    nature: [
        { word: 'природ', weight: 10 },
        { word: 'животн', weight: 9 },
        { word: 'растен', weight: 9 },
        { word: 'эколог', weight: 8 },
        { word: 'климат', weight: 7 },
        { word: 'океан', weight: 8 },
        { word: 'лес', weight: 6 },
        { word: 'гор', weight: 6 },
        { word: 'рек', weight: 6 },
        { word: 'биосфер', weight: 10 },
        { word: 'заповедник', weight: 9 },
        { word: 'млекопитающ', weight: 9 },
        { word: 'птиц', weight: 8 },
        { word: 'рыб', weight: 8 },
        { word: 'насеком', weight: 8 },
        { word: 'цветок', weight: 7 },
        { word: 'дерев', weight: 7 },
        { word: 'трав', weight: 7 },
        { word: 'вулкан', weight: 8 },
        { word: 'землетряс', weight: 8 },
        { word: 'атмосфер', weight: 8 },
        { word: 'ландшафт', weight: 8 },
        { word: 'экосистем', weight: 9 },
        { word: 'популяци', weight: 8 },
        { word: 'сред обитани', weight: 8 }
    ],
    medicine: [
        { word: 'медицин', weight: 10 },
        { word: 'болезн', weight: 8 },
        { word: 'лечени', weight: 9 },
        { word: 'здоровь', weight: 7 },
        { word: 'врач', weight: 8 },
        { word: 'диагноз', weight: 9 },
        { word: 'терапи', weight: 8 },
        { word: 'хирурги', weight: 10 },
        { word: 'пациент', weight: 7 },
        { word: 'клиник', weight: 8 },
        { word: 'симптом', weight: 9 },
        { word: 'синдром', weight: 9 },
        { word: 'вакцин', weight: 9 },
        { word: 'иммунитет', weight: 8 },
        { word: 'антибиотик', weight: 9 },
        { word: 'препарат', weight: 8 },
        { word: 'анализ', weight: 7 },
        { word: 'диагностик', weight: 8 },
        { word: 'операци', weight: 8 },
        { word: 'реабилитац', weight: 8 },
        { word: 'профилактик', weight: 8 },
        { word: 'анатоми', weight: 9 },
        { word: 'физиолог', weight: 9 },
        { word: 'патолог', weight: 9 },
        { word: 'фармац', weight: 9 }
    ],
    space: [
        { word: 'космос', weight: 10 },
        { word: 'планет', weight: 9 },
        { word: 'звезд', weight: 8 },
        { word: 'галакти', weight: 10 },
        { word: 'астроном', weight: 9 },
        { word: 'космическ', weight: 8 },
        { word: 'спутник', weight: 7 },
        { word: 'орбит', weight: 8 },
        { word: 'вселенн', weight: 9 },
        { word: 'солнечн систем', weight: 10 },
        { word: 'комет', weight: 8 },
        { word: 'астероид', weight: 8 },
        { word: 'метеорит', weight: 8 },
        { word: 'созвезди', weight: 8 },
        { word: 'телескоп', weight: 8 },
        { word: 'обсерватори', weight: 9 },
        { word: 'невесомост', weight: 8 },
        { word: 'ракет', weight: 8 },
        { word: 'космонавт', weight: 9 },
        { word: 'астронавт', weight: 9 },
        { word: 'марс', weight: 8 },
        { word: 'луна', weight: 8 },
        { word: 'юпитер', weight: 8 },
        { word: 'сатурн', weight: 8 },
        { word: 'черная дыра', weight: 10 }
    ],
    military: [
        { word: 'военн', weight: 10 },
        { word: 'арми', weight: 9 },
        { word: 'оружи', weight: 8 },
        { word: 'битв', weight: 7 },
        { word: 'сражени', weight: 8 },
        { word: 'тактик', weight: 9 },
        { word: 'стратеги', weight: 8 },
        { word: 'генерал', weight: 7 },
        { word: 'командир', weight: 7 },
        { word: 'солдат', weight: 8 },
        { word: 'офицер', weight: 8 },
        { word: 'гарнизон', weight: 8 },
        { word: 'крепост', weight: 7 },
        { word: 'осад', weight: 7 },
        { word: 'штурм', weight: 7 },
        { word: 'атак', weight: 7 },
        { word: 'оборон', weight: 7 },
        { word: 'разведк', weight: 8 },
        { word: 'десант', weight: 8 },
        { word: 'артиллери', weight: 9 },
        { word: 'пехот', weight: 8 },
        { word: 'кавалери', weight: 8 },
        { word: 'флот', weight: 8 },
        { word: 'авиаци', weight: 8 },
        { word: 'танк', weight: 8 }
    ],
    art: [
        { word: 'искусств', weight: 10 },
        { word: 'живопис', weight: 9 },
        { word: 'художник', weight: 9 },
        { word: 'картин', weight: 8 },
        { word: 'скульптур', weight: 9 },
        { word: 'портрет', weight: 8 },
        { word: 'пейзаж', weight: 8 },
        { word: 'натюрморт', weight: 8 },
        { word: 'галере', weight: 8 },
        { word: 'выставк', weight: 7 },
        { word: 'музей', weight: 7 },
        { word: 'холст', weight: 8 },
        { word: 'краск', weight: 7 },
        { word: 'рисунок', weight: 7 },
        { word: 'эскиз', weight: 7 },
        { word: 'фреск', weight: 8 },
        { word: 'мозаик', weight: 8 },
        { word: 'витраж', weight: 8 },
        { word: 'график', weight: 7 },
        { word: 'офорт', weight: 8 },
        { word: 'гравюр', weight: 8 },
        { word: 'барельеф', weight: 8 },
        { word: 'инсталляци', weight: 8 },
        { word: 'перформанс', weight: 8 },
        { word: 'экспозици', weight: 7 }
    ],
    sport: [
        { word: 'спорт', weight: 10 },
        { word: 'олимпиад', weight: 9 },
        { word: 'чемпионат', weight: 8 },
        { word: 'соревнован', weight: 7 },
        { word: 'турнир', weight: 7 },
        { word: 'матч', weight: 7 },
        { word: 'игр', weight: 6 },
        { word: 'футбол', weight: 8 },
        { word: 'хокке', weight: 8 },
        { word: 'баскетбол', weight: 8 },
        { word: 'волейбол', weight: 8 },
        { word: 'теннис', weight: 8 },
        { word: 'атлет', weight: 8 },
        { word: 'гимнаст', weight: 8 },
        { word: 'пловец', weight: 8 },
        { word: 'боксер', weight: 8 },
        { word: 'борец', weight: 8 },
        { word: 'тренер', weight: 7 },
        { word: 'стадион', weight: 7 },
        { word: 'рекорд', weight: 8 },
        { word: 'медал', weight: 7 },
        { word: 'кубок', weight: 7 },
        { word: 'финал', weight: 6 },
        { word: 'чемпион', weight: 8 },
        { word: 'команд', weight: 6 }
    ],
    religion: [
        { word: 'религи', weight: 10 },
        { word: 'вер', weight: 8 },
        { word: 'бог', weight: 9 },
        { word: 'храм', weight: 8 },
        { word: 'церковь', weight: 8 },
        { word: 'мечеть', weight: 8 },
        { word: 'синагог', weight: 8 },
        { word: 'пагод', weight: 8 },
        { word: 'монастыр', weight: 8 },
        { word: 'священн', weight: 8 },
        { word: 'молитв', weight: 8 },
        { word: 'ритуал', weight: 7 },
        { word: 'обряд', weight: 7 },
        { word: 'духовн', weight: 7 },
        { word: 'святын', weight: 8 },
        { word: 'паломни', weight: 8 },
        { word: 'пророк', weight: 8 },
        { word: 'священник', weight: 8 },
        { word: 'монах', weight: 8 },
        { word: 'библи', weight: 9 },
        { word: 'коран', weight: 9 },
        { word: 'тор', weight: 9 },
        { word: 'буддизм', weight: 9 },
        { word: 'христианств', weight: 9 },
        { word: 'ислам', weight: 9 }
    ],
    philosophy: [
        { word: 'философи', weight: 10 },
        { word: 'мышлени', weight: 8 },
        { word: 'сознани', weight: 8 },
        { word: 'быти', weight: 7 },
        { word: 'этик', weight: 8 },
        { word: 'морал', weight: 8 },
        { word: 'концепци', weight: 7 },
        { word: 'метафизик', weight: 9 },
        { word: 'онтолог', weight: 9 },
        { word: 'гносеолог', weight: 9 },
        { word: 'диалектик', weight: 9 },
        { word: 'логик', weight: 8 },
        { word: 'рационализм', weight: 9 },
        { word: 'эмпиризм', weight: 9 },
        { word: 'идеализм', weight: 9 },
        { word: 'материализм', weight: 9 },
        { word: 'экзистенциализм', weight: 10 },
        { word: 'феноменолог', weight: 9 },
        { word: 'герменевтик', weight: 9 },
        { word: 'софист', weight: 8 },
        { word: 'стоик', weight: 8 },
        { word: 'эпикур', weight: 8 },
        { word: 'платон', weight: 9 },
        { word: 'аристотел', weight: 9 },
        { word: 'кант', weight: 9 }
    ]
};

const TAG_THRESHOLD = 15; // Минимальный вес для присвоения тега
const MAX_TAGS = 3; // Максимальное количество тегов для статьи

// Кэш для хранения результатов
const tagsCache = new Map<string, Tag[]>();

// Предварительно скомпилированные регулярные выражения
const compiledRegexps = new Map<string, RegExp>();

function getCompiledRegexp(word: string): RegExp {
    if (!compiledRegexps.has(word)) {
        compiledRegexps.set(word, new RegExp(word, 'g'));
    }
    return compiledRegexps.get(word)!;
}

// Функция для вычисления тегов без хуков
export function calculateArticleTags(title: string, content: string): Tag[] {
    // Создаем ключ для кэша
    const cacheKey = `${title}:${content}`;
    
    // Проверяем кэш
    if (tagsCache.has(cacheKey)) {
        return tagsCache.get(cacheKey)!;
    }

    const text = `${title} ${content}`.toLowerCase();
    const titleLower = title.toLowerCase();
    const tagScores = new Map<string, number>();

    // Подсчёт весов для каждой категории
    Object.entries(KEYWORDS).forEach(([tagId, keywords]) => {
        let score = 0;
        keywords.forEach(({ word, weight }) => {
            const regexp = getCompiledRegexp(word);
            const matches = (text.match(regexp) || []).length;
            if (matches > 0) {
                const titleBonus = titleLower.includes(word) ? 1.5 : 1;
                score += matches * weight * titleBonus;
            }
        });
        if (score >= TAG_THRESHOLD) {
            tagScores.set(tagId, score);
        }
    });

    // Если теги не найдены, добавляем общий тег
    let result;
    if (tagScores.size === 0) {
        result = [TAGS.culture];
    } else {
        // Сортируем теги по весу и берём top MAX_TAGS
        result = Array.from(tagScores.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, MAX_TAGS)
            .map(([tagId]) => TAGS[tagId]);
    }

    // Сохраняем результат в кэш
    tagsCache.set(cacheKey, result);
    
    return result;
}

export function useArticleTags(title: string, content: string) {
    return useMemo(() => calculateArticleTags(title, content), [title, content]);
}

// Ограничиваем размер кэша
setInterval(() => {
    if (tagsCache.size > 1000) {
        const keys = Array.from(tagsCache.keys());
        for (let i = 0; i < keys.length - 1000; i++) {
            tagsCache.delete(keys[i]);
        }
    }
}, 60000); // Проверяем каждую минуту

export function getTagStyle(tag: Tag) {
    return `${tag.color} text-white text-sm px-2.5 py-0.5 rounded-full`;
} 
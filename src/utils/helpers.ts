export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export const formatNumber = (num: number): string => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
};

export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

export const getLanguageColor = (language: string): string => {
    const colors: { [key: string]: string } = {
        JavaScript: '#f1e05a',
        TypeScript: '#3178c6',
        Python: '#3572A5',
        Java: '#b07219',
        Go: '#00ADD8',
        Rust: '#dea584',
        Ruby: '#701516',
        PHP: '#4F5D95',
        C: '#555555',
        'C++': '#f34b7d',
        'C#': '#178600',
        HTML: '#e34c26',
        CSS: '#563d7c',
        Vue: '#41b883',
        Swift: '#ffac45',
        Kotlin: '#A97BFF',
        Dart: '#00B4AB',
    };

    return colors[language] || '#8b5cf6';
};

export const sortByKey = <T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
    return [...array].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];

        if (typeof aVal === 'number' && typeof bVal === 'number') {
            return direction === 'desc' ? bVal - aVal : aVal - bVal;
        }

        if (typeof aVal === 'string' && typeof bVal === 'string') {
            return direction === 'desc' ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
        }

        return 0;
    });
};

export const filterBySearchTerm = <T>(
    array: T[],
    searchTerm: string,
    searchKeys: (keyof T)[]
): T[] => {
    if (!searchTerm.trim()) return array;

    const lowerSearch = searchTerm.toLowerCase();

    return array.filter((item) =>
        searchKeys.some((key) => {
            const value = item[key];
            if (typeof value === 'string') {
                return value.toLowerCase().includes(lowerSearch);
            }
            return false;
        })
    );
};

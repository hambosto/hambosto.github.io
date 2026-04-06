import React, { useState } from 'react';
import type { GitHubData } from '../../types/github';

interface FileManagerAppProps {
    githubData: GitHubData | null;
}

export const FileManagerApp: React.FC<FileManagerAppProps> = ({ githubData }) => {
    const repos = githubData?.repos ?? [];
    const sorted = [...repos].sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0));
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [search, setSearch] = useState('');

    const langColors: Record<string, string> = {
        TypeScript: '#3178c6',
        JavaScript: '#f1e05a',
        Python: '#3572A5',
        Go: '#00ADD8',
        Rust: '#dea584',
        Java: '#b07219',
        'C++': '#f34b7d',
        C: '#555555',
        HTML: '#e34c26',
        CSS: '#563d7c',
        Shell: '#89e051',
        Lua: '#000080',
        Dart: '#00B4AB',
        Kotlin: '#A97BFF',
    };

    const filtered = sorted.filter(
        (r) =>
            r.name.toLowerCase().includes(search.toLowerCase()) ||
            (r.language || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col" style={{ backgroundColor: '#0a0a0a' }}>
            <div
                className="flex items-center justify-between px-3 py-2 text-xs font-mono"
                style={{
                    borderBottom: '1px solid var(--color-border)',
                    backgroundColor: '#111111',
                }}
            >
                <div className="flex items-center gap-2">
                    <i className="fas fa-folder-open" style={{ color: 'var(--color-primary)' }} />
                    <span style={{ color: 'var(--color-text-dim)' }}>/home/guest/projects</span>
                </div>
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search repos..."
                        className="px-2 py-1 text-xs rounded-sm border outline-none"
                        style={{
                            backgroundColor: '#0a0a0a',
                            borderColor: 'var(--color-border)',
                            color: 'var(--color-text)',
                            width: 160,
                            caretColor: 'var(--color-primary)',
                        }}
                    />
                    <div className="flex gap-1">
                        {(['grid', 'list'] as const).map((v) => (
                            <button
                                key={v}
                                onClick={() => setView(v)}
                                className="px-2 py-0.5 text-xs rounded-sm border transition-all"
                                style={{
                                    borderColor:
                                        view === v ? 'var(--color-primary)' : 'var(--color-border)',
                                    color:
                                        view === v
                                            ? 'var(--color-primary)'
                                            : 'var(--color-text-dim)',
                                    backgroundColor:
                                        view === v ? 'var(--color-primary-glow)' : 'transparent',
                                }}
                            >
                                <i className={`fas fa-${v === 'grid' ? 'th-large' : 'list'}`} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {view === 'grid' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {filtered.map((repo) => {
                            const langColor =
                                langColors[repo.language || ''] || 'var(--color-primary)';
                            return (
                                <a
                                    key={repo.id}
                                    href={repo.html_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex flex-col gap-2 p-4 rounded-sm border transition-all group"
                                    style={{ borderColor: 'var(--color-border)' }}
                                    onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLElement).style.borderColor =
                                            'var(--color-primary)';
                                        (e.currentTarget as HTMLElement).style.boxShadow =
                                            '0 0 8px var(--color-primary-glow)';
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLElement).style.borderColor =
                                            'var(--color-border)';
                                        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                                    }}
                                >
                                    <div className="flex items-start justify-between">
                                        <i
                                            className="fas fa-folder text-2xl"
                                            style={{ color: 'var(--color-primary)' }}
                                        />
                                        {repo.stargazers_count > 0 && (
                                            <span
                                                className="text-xs"
                                                style={{ color: 'var(--color-warning)' }}
                                            >
                                                ★ {repo.stargazers_count}
                                            </span>
                                        )}
                                    </div>
                                    <span
                                        className="text-sm font-bold"
                                        style={{ color: 'var(--color-text)' }}
                                    >
                                        {repo.name}
                                    </span>
                                    {repo.description && (
                                        <span
                                            className="text-xs line-clamp-2"
                                            style={{ color: 'var(--color-text-dim)' }}
                                        >
                                            {repo.description}
                                        </span>
                                    )}
                                    {repo.language && (
                                        <div
                                            className="flex items-center gap-1.5 text-xs"
                                            style={{ color: 'var(--color-text-dim)' }}
                                        >
                                            <span
                                                className="w-2.5 h-2.5 rounded-full"
                                                style={{ backgroundColor: langColor }}
                                            />
                                            {repo.language}
                                        </div>
                                    )}
                                    <span
                                        className="text-xs"
                                        style={{ color: 'var(--color-text-muted)' }}
                                    >
                                        Updated {new Date(repo.updated_at).toLocaleDateString()}
                                    </span>
                                </a>
                            );
                        })}
                    </div>
                ) : (
                    <div className="space-y-1">
                        {filtered.map((repo) => {
                            const langColor =
                                langColors[repo.language || ''] || 'var(--color-primary)';
                            return (
                                <a
                                    key={repo.id}
                                    href={repo.html_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-4 p-3 rounded-sm border transition-all group"
                                    style={{ borderColor: 'var(--color-border)' }}
                                    onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLElement).style.borderColor =
                                            'var(--color-primary)';
                                        (e.currentTarget as HTMLElement).style.backgroundColor =
                                            'var(--color-primary-glow)';
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLElement).style.borderColor =
                                            'var(--color-border)';
                                        (e.currentTarget as HTMLElement).style.backgroundColor =
                                            'transparent';
                                    }}
                                >
                                    <i
                                        className="fas fa-folder"
                                        style={{ color: 'var(--color-primary)' }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div
                                            className="text-sm font-bold"
                                            style={{ color: 'var(--color-text)' }}
                                        >
                                            {repo.name}
                                        </div>
                                        {repo.description && (
                                            <div
                                                className="text-xs truncate"
                                                style={{ color: 'var(--color-text-dim)' }}
                                            >
                                                {repo.description}
                                            </div>
                                        )}
                                    </div>
                                    {repo.language && (
                                        <div
                                            className="flex items-center gap-1.5 text-xs"
                                            style={{ color: 'var(--color-text-dim)' }}
                                        >
                                            <span
                                                className="w-2.5 h-2.5 rounded-full"
                                                style={{ backgroundColor: langColor }}
                                            />
                                            {repo.language}
                                        </div>
                                    )}
                                    {repo.stargazers_count > 0 && (
                                        <span
                                            className="text-xs"
                                            style={{ color: 'var(--color-warning)' }}
                                        >
                                            ★ {repo.stargazers_count}
                                        </span>
                                    )}
                                    <i
                                        className="fas fa-external-link-alt text-xs"
                                        style={{ color: 'var(--color-text-muted)' }}
                                    />
                                </a>
                            );
                        })}
                    </div>
                )}
                {filtered.length === 0 && (
                    <div
                        className="flex flex-col items-center justify-center h-full"
                        style={{ color: 'var(--color-text-muted)' }}
                    >
                        <i className="fas fa-folder-open text-4xl mb-3" />
                        <p className="text-sm">
                            {search ? 'No matching repositories' : 'No repositories found'}
                        </p>
                    </div>
                )}
            </div>
            <div
                className="px-3 py-2 text-xs flex justify-between"
                style={{
                    borderTop: '1px solid var(--color-border)',
                    color: 'var(--color-text-muted)',
                }}
            >
                <span>
                    {filtered.length} of {sorted.length} repositories
                </span>
                {githubData?.totalStars ? <span>Total stars: {githubData.totalStars}</span> : null}
            </div>
        </div>
    );
};

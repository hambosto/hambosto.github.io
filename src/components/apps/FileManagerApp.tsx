import React, { useState } from 'react';
import type { GitHubData } from '../../types/github';
import { CONFIG } from '../../utils/config';

interface FileManagerAppProps {
    githubData: GitHubData | null;
}

export const FileManagerApp: React.FC<FileManagerAppProps> = ({ githubData }) => {
    const repos = githubData?.repos ?? [];
    const sorted = [...repos].sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0));
    const [search, setSearch] = useState('');

    const langColors: Record<string, string> = {
        TypeScript: '#3178c6',
        JavaScript: '#f1e05a',
        Python: '#3572A5',
        Go: '#00ADD8',
        Rust: '#dea584',
        Java: '#b07219',
        Shell: '#89e051',
    };

    const filtered = sorted.filter(
        (r) =>
            r.name.toLowerCase().includes(search.toLowerCase()) ||
            (r.language || '').toLowerCase().includes(search.toLowerCase())
    );

    // Get featured projects from config
    const featuredProjects = (CONFIG.projects ?? []).filter((p) => p.featured);

    return (
        <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
            {/* Header */}
            <div
                className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: '1px solid var(--color-border)' }}
            >
                <div className="flex items-center gap-2">
                    <i
                        className="fas fa-folder-open text-sm"
                        style={{ color: 'var(--color-primary)' }}
                    />
                    <span
                        className="text-[13px] font-semibold"
                        style={{ color: 'var(--color-text)' }}
                    >
                        Projects
                    </span>
                </div>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="px-3 py-1.5 text-[12px] rounded-lg outline-none"
                    style={{
                        backgroundColor: 'var(--color-bg-light)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text)',
                        width: 160,
                        fontFamily: 'var(--font-sans)',
                    }}
                    onFocus={(e) => {
                        (e.target as HTMLElement).style.borderColor = 'var(--color-primary)';
                    }}
                    onBlur={(e) => {
                        (e.target as HTMLElement).style.borderColor = 'var(--color-border)';
                    }}
                />
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {/* Featured Projects from Config */}
                {featuredProjects.length > 0 && !search && (
                    <div className="mb-5">
                        <h3
                            className="text-[11px] font-semibold uppercase tracking-wider mb-3"
                            style={{ color: 'var(--color-text-muted)' }}
                        >
                            Featured
                        </h3>
                        <div className="space-y-2">
                            {featuredProjects.map((project) => (
                                <a
                                    key={project.id}
                                    href={project.github || project.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block p-4 rounded-xl transition-colors"
                                    style={{ border: '1px solid var(--color-border)' }}
                                    onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLElement).style.borderColor =
                                            'var(--color-border-active)';
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
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <i
                                                className="fas fa-folder text-sm"
                                                style={{ color: 'var(--color-primary)' }}
                                            />
                                            <span
                                                className="text-[13px] font-semibold"
                                                style={{ color: 'var(--color-text)' }}
                                            >
                                                {project.name}
                                            </span>
                                        </div>
                                        <div className="flex gap-1.5">
                                            {project.url && (
                                                <span
                                                    className="text-[10px] px-2 py-0.5 rounded-md font-medium"
                                                    style={{
                                                        backgroundColor:
                                                            'var(--color-primary-glow)',
                                                        color: 'var(--color-primary)',
                                                    }}
                                                >
                                                    Live
                                                </span>
                                            )}
                                            {project.github && (
                                                <i
                                                    className="fab fa-github text-xs"
                                                    style={{ color: 'var(--color-text-muted)' }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <p
                                        className="text-[12px] leading-relaxed mb-2"
                                        style={{ color: 'var(--color-text-dim)' }}
                                    >
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                        {project.technologies.slice(0, 5).map((tech) => (
                                            <span
                                                key={tech}
                                                className="text-[10px] px-2 py-0.5 rounded-md"
                                                style={{
                                                    backgroundColor: 'var(--color-bg-light)',
                                                    color: 'var(--color-text-muted)',
                                                }}
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* GitHub Repos */}
                <div>
                    <h3
                        className="text-[11px] font-semibold uppercase tracking-wider mb-3"
                        style={{ color: 'var(--color-text-muted)' }}
                    >
                        {search ? 'Search Results' : 'All Repositories'}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {filtered.map((repo) => {
                            const langColor =
                                langColors[repo.language || ''] || 'var(--color-primary)';
                            return (
                                <a
                                    key={repo.id}
                                    href={repo.html_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block p-3 rounded-xl transition-colors"
                                    style={{ border: '1px solid var(--color-border)' }}
                                    onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLElement).style.borderColor =
                                            'var(--color-border-active)';
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLElement).style.borderColor =
                                            'var(--color-border)';
                                    }}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span
                                            className="text-[12px] font-semibold truncate"
                                            style={{ color: 'var(--color-text)' }}
                                        >
                                            {repo.name}
                                        </span>
                                        {repo.stargazers_count > 0 && (
                                            <span
                                                className="text-[10px] flex-shrink-0 ml-2"
                                                style={{ color: 'var(--color-warning)' }}
                                            >
                                                ★ {repo.stargazers_count}
                                            </span>
                                        )}
                                    </div>
                                    {repo.description && (
                                        <p
                                            className="text-[11px] line-clamp-2 mb-1.5 leading-relaxed"
                                            style={{ color: 'var(--color-text-muted)' }}
                                        >
                                            {repo.description}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between">
                                        {repo.language && (
                                            <div
                                                className="flex items-center gap-1.5 text-[10px]"
                                                style={{ color: 'var(--color-text-muted)' }}
                                            >
                                                <span
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: langColor }}
                                                />
                                                {repo.language}
                                            </div>
                                        )}
                                        <span
                                            className="text-[10px]"
                                            style={{ color: 'var(--color-text-muted)' }}
                                        >
                                            {new Date(repo.updated_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                    {filtered.length === 0 && (
                        <div
                            className="flex flex-col items-center justify-center py-12"
                            style={{ color: 'var(--color-text-muted)' }}
                        >
                            <i className="fas fa-folder-open text-3xl mb-2 opacity-30" />
                            <p className="text-[13px]">
                                {search ? 'No matching repositories' : 'No repositories found'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div
                className="px-4 py-2.5 text-[11px] flex justify-between"
                style={{
                    borderTop: '1px solid var(--color-border)',
                    color: 'var(--color-text-muted)',
                }}
            >
                <span>{filtered.length} repositories</span>
                {githubData?.totalStars ? <span>★ {githubData.totalStars} total stars</span> : null}
            </div>
        </div>
    );
};

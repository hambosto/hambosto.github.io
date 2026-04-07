import React from 'react';
import { CONFIG } from '../../utils/config';
import type { GitHubUser } from '../../types/github';

interface TextEditorAppProps {
    user: GitHubUser | null;
}

export const TextEditorApp: React.FC<TextEditorAppProps> = ({ user }) => {
    return (
        <div className="h-full flex flex-col" style={{ backgroundColor: '#0a0a0a' }}>
            <div
                className="flex items-center gap-2 px-3 py-2 text-xs font-mono"
                style={{
                    borderBottom: '1px solid var(--color-border)',
                    backgroundColor: '#111111',
                }}
            >
                <i className="fas fa-file-lines" style={{ color: 'var(--color-primary)' }} />
                <span style={{ color: 'var(--color-text)' }}>about.md</span>
                <span className="ml-auto" style={{ color: 'var(--color-text-muted)' }}>
                    UTF-8 · Markdown
                </span>
            </div>
            <div className="flex-1 overflow-y-auto p-6 font-mono text-sm leading-relaxed">
                {/* Profile Header */}
                <div
                    className="mb-6 pb-4 flex items-start gap-4"
                    style={{ borderBottom: '1px solid var(--color-border)' }}
                >
                    {user?.avatar_url && (
                        <div className="relative flex-shrink-0">
                            <img
                                src={user.avatar_url}
                                alt={user.name || user.login}
                                className="w-20 h-20 rounded-sm"
                                style={{
                                    border: '2px solid var(--color-primary-dark)',
                                    boxShadow: '0 0 12px var(--color-primary-glow)',
                                }}
                            />
                            <div
                                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2"
                                style={{
                                    backgroundColor: 'var(--color-success)',
                                    borderColor: '#0a0a0a',
                                }}
                            />
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <h1
                            className="text-2xl font-bold mb-1"
                            style={{ color: 'var(--color-text)' }}
                        >
                            {user?.name || CONFIG.personal.name}
                        </h1>
                        <p className="text-sm mb-2" style={{ color: 'var(--color-primary)' }}>
                            {CONFIG.personal.title}
                        </p>
                        {user?.bio && (
                            <p className="text-sm mb-2" style={{ color: 'var(--color-text-dim)' }}>
                                {user.bio}
                            </p>
                        )}
                        <div
                            className="flex flex-wrap gap-3 text-xs"
                            style={{ color: 'var(--color-text-muted)' }}
                        >
                            {user?.location && (
                                <span>
                                    <i className="fas fa-map-marker-alt mr-1" />
                                    {user.location}
                                </span>
                            )}
                            {user?.blog && (
                                <a
                                    href={
                                        user.blog.startsWith('http')
                                            ? user.blog
                                            : `https://${user.blog}`
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ color: 'var(--color-primary)' }}
                                >
                                    <i className="fas fa-link mr-1" />
                                    {user.blog}
                                </a>
                            )}
                            {user?.company && (
                                <span>
                                    <i className="fas fa-building mr-1" />
                                    {user.company}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-base font-bold mb-3" style={{ color: 'var(--color-text)' }}>
                        <i
                            className="fas fa-chart-pie mr-2"
                            style={{ color: 'var(--color-primary)' }}
                        />
                        Quick Stats
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            {
                                label: 'Repositories',
                                value: user?.public_repos ?? 0,
                                icon: 'fa-folder',
                            },
                            { label: 'Followers', value: user?.followers ?? 0, icon: 'fa-users' },
                            {
                                label: 'Following',
                                value: user?.following ?? 0,
                                icon: 'fa-user-friends',
                            },
                            {
                                label: 'Location',
                                value: user?.location || '—',
                                icon: 'fa-map-marker-alt',
                            },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="flex items-center gap-3 p-3 rounded-sm border"
                                style={{ borderColor: 'var(--color-border)' }}
                            >
                                <i
                                    className={`fas ${stat.icon}`}
                                    style={{ color: 'var(--color-primary)', fontSize: 18 }}
                                />
                                <div>
                                    <div
                                        className="text-lg font-bold"
                                        style={{ color: 'var(--color-text)' }}
                                    >
                                        {stat.value}
                                    </div>
                                    <div
                                        className="text-xs"
                                        style={{ color: 'var(--color-text-muted)' }}
                                    >
                                        {stat.label}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-base font-bold mb-3" style={{ color: 'var(--color-text)' }}>
                        <i
                            className="fas fa-briefcase mr-2"
                            style={{ color: 'var(--color-primary)' }}
                        />
                        Experience
                    </h2>
                    <div className="space-y-4">
                        {CONFIG.workExperience.map((exp, i) => (
                            <div
                                key={i}
                                className="pl-4 relative"
                                style={{ borderLeft: '2px solid var(--color-primary)' }}
                            >
                                <div
                                    className="absolute -left-1.5 top-1 w-3 h-3 rounded-full"
                                    style={{
                                        backgroundColor: 'var(--color-primary)',
                                        boxShadow: '0 0 6px var(--color-primary-glow-strong)',
                                    }}
                                />
                                <div className="flex items-center gap-2 mb-1">
                                    <span
                                        className="text-sm font-bold"
                                        style={{ color: 'var(--color-text)' }}
                                    >
                                        {exp.position}
                                    </span>
                                    <span
                                        className="text-xs px-2 py-0.5 rounded-sm"
                                        style={{
                                            backgroundColor: exp.endDate
                                                ? 'var(--color-bg-light)'
                                                : 'var(--color-primary-glow)',
                                            color: exp.endDate
                                                ? 'var(--color-text-muted)'
                                                : 'var(--color-primary)',
                                            border: `1px solid ${exp.endDate ? 'var(--color-border)' : 'var(--color-primary)'}`,
                                        }}
                                    >
                                        {exp.endDate ? 'Completed' : 'Current'}
                                    </span>
                                </div>
                                <div
                                    className="text-xs mb-2"
                                    style={{ color: 'var(--color-text-dim)' }}
                                >
                                    {exp.company} · {exp.startDate} – {exp.endDate || 'Present'}
                                </div>
                                <div
                                    className="text-xs mb-2"
                                    style={{ color: 'var(--color-text-dim)' }}
                                >
                                    {exp.description}
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {exp.technologies.map((tech) => (
                                        <span
                                            key={tech}
                                            className="text-xs px-2 py-0.5 rounded-sm"
                                            style={{
                                                backgroundColor: 'var(--color-primary-glow)',
                                                border: '1px solid var(--color-border)',
                                                color: 'var(--color-text-dim)',
                                            }}
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                                {exp.achievements && exp.achievements.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                        {exp.achievements.map((a, j) => (
                                            <div
                                                key={j}
                                                className="text-xs flex items-start gap-2"
                                                style={{ color: 'var(--color-text-dim)' }}
                                            >
                                                <span style={{ color: 'var(--color-primary)' }}>
                                                    ✓
                                                </span>
                                                <span>{a}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-base font-bold mb-3" style={{ color: 'var(--color-text)' }}>
                        <i
                            className="fas fa-address-card mr-2"
                            style={{ color: 'var(--color-primary)' }}
                        />
                        Contact
                    </h2>
                    <div className="space-y-2 text-xs" style={{ color: 'var(--color-text-dim)' }}>
                        <div className="flex items-center gap-2">
                            <i
                                className="fas fa-envelope"
                                style={{ color: 'var(--color-primary)', width: 16 }}
                            />
                            {CONFIG.personal.email}
                        </div>
                        <div className="flex items-center gap-2">
                            <i
                                className="fab fa-github"
                                style={{ color: 'var(--color-primary)', width: 16 }}
                            />
                            github.com/hambosto
                        </div>
                        <div className="flex items-center gap-2">
                            <i
                                className="fab fa-linkedin"
                                style={{ color: 'var(--color-primary)', width: 16 }}
                            />
                            linkedin.com/in/hambosto
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

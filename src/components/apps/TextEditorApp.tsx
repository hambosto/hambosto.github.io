import React from 'react';
import { CONFIG } from '../../utils/config';
import type { GitHubUser } from '../../types/github';

interface TextEditorAppProps {
    user: GitHubUser | null;
}

const categoryLabels: Record<string, string> = {
    languages: 'Languages',
    goWeb: 'Go Web',
    goLibraries: 'Go Libraries',
    rustWeb: 'Rust Web',
    rustLibraries: 'Rust Libraries',
    grpc: 'gRPC',
    messaging: 'Messaging',
    databases: 'Databases',
    storage: 'Storage',
    infrastructure: 'Infrastructure',
    architecture: 'Architecture',
    observability: 'Observability',
    security: 'Security',
};

const categoryIcons: Record<string, string> = {
    languages: 'fa-code',
    goWeb: 'fa-server',
    goLibraries: 'fa-cube',
    rustWeb: 'fa-gear',
    rustLibraries: 'fa-wrench',
    grpc: 'fa-network-wired',
    messaging: 'fa-comments',
    databases: 'fa-database',
    storage: 'fa-hard-drive',
    infrastructure: 'fa-cloud',
    architecture: 'fa-sitemap',
    observability: 'fa-eye',
    security: 'fa-shield-halved',
};

// Curated top skills for the hero section
const topSkills = [
    'Go',
    'Rust',
    'TypeScript',
    'Python',
    'PostgreSQL',
    'Redis',
    'Docker',
    'Kubernetes',
    'Kafka',
    'RabbitMQ',
    'gRPC',
    'REST',
    'AWS',
    'Terraform',
    'GitHub Actions',
    'Sentry',
    'OpenTelemetry',
    'Prometheus',
];

export const TextEditorApp: React.FC<TextEditorAppProps> = ({ user }) => {
    const categories = Object.entries(CONFIG.customSkills);

    return (
        <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
            <div
                className="flex items-center gap-2 px-4 py-3"
                style={{ borderBottom: '1px solid var(--color-border)' }}
            >
                <i className="fas fa-user text-sm" style={{ color: 'var(--color-primary)' }} />
                <span className="text-[13px] font-semibold" style={{ color: 'var(--color-text)' }}>
                    About Me
                </span>
                <span className="ml-auto text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                    about.md
                </span>
            </div>

            <div className="flex-1 overflow-y-auto">
                {/* Hero */}
                <div className="p-6 pb-4">
                    <div className="flex items-start gap-4 mb-4">
                        {user?.avatar_url && (
                            <img
                                src={user.avatar_url}
                                alt={user.name || user.login}
                                className="w-16 h-16 rounded-full flex-shrink-0"
                            />
                        )}
                        <div className="flex-1 min-w-0">
                            <h1
                                className="text-xl font-bold"
                                style={{ color: 'var(--color-text)' }}
                            >
                                {user?.name || CONFIG.personal.name}
                            </h1>
                            <p
                                className="text-[13px] font-medium mt-0.5"
                                style={{ color: 'var(--color-primary)' }}
                            >
                                {CONFIG.personal.title}
                            </p>
                            {CONFIG.personal.subtitle && (
                                <p
                                    className="text-[12px] mt-1"
                                    style={{ color: 'var(--color-text-muted)' }}
                                >
                                    {CONFIG.personal.subtitle}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Meta */}
                    <div
                        className="flex flex-wrap gap-4 text-[12px]"
                        style={{ color: 'var(--color-text-muted)' }}
                    >
                        {user?.location && (
                            <span className="flex items-center gap-1.5">
                                <i className="fas fa-map-marker-alt" style={{ fontSize: 10 }} />
                                {user.location}
                            </span>
                        )}
                        {user?.company && (
                            <span className="flex items-center gap-1.5">
                                <i className="fas fa-building" style={{ fontSize: 10 }} />
                                {user.company}
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
                                className="flex items-center gap-1.5 hover:underline"
                                style={{ color: 'var(--color-primary)' }}
                            >
                                <i className="fas fa-link" style={{ fontSize: 10 }} />
                                {user.blog}
                            </a>
                        )}
                    </div>
                </div>

                {/* Bio */}
                <div className="px-6 pb-5">
                    <p
                        className="text-[13px] leading-relaxed"
                        style={{ color: 'var(--color-text-dim)' }}
                    >
                        {CONFIG.personal.bio}
                    </p>
                </div>

                {/* Core Technologies */}
                <div className="px-6 pb-5">
                    <h2
                        className="text-[11px] font-semibold uppercase tracking-wider mb-3"
                        style={{ color: 'var(--color-text-muted)' }}
                    >
                        Core Technologies
                    </h2>
                    <div className="flex flex-wrap gap-1.5">
                        {topSkills.map((skill) => (
                            <span
                                key={skill}
                                className="px-2.5 py-1 text-[11px] font-medium rounded-lg"
                                style={{
                                    backgroundColor: 'var(--color-primary-glow)',
                                    color: 'var(--color-primary)',
                                    border: '1px solid var(--color-border)',
                                }}
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Experience */}
                <div className="px-6 pb-5">
                    <h2
                        className="text-[11px] font-semibold uppercase tracking-wider mb-3"
                        style={{ color: 'var(--color-text-muted)' }}
                    >
                        Experience
                    </h2>
                    <div className="space-y-4">
                        {CONFIG.workExperience.map((exp, i) => (
                            <div
                                key={i}
                                className="pl-4 relative"
                                style={{ borderLeft: '2px solid var(--color-border)' }}
                            >
                                <div
                                    className="absolute -left-[5px] top-1 w-2 h-2 rounded-full"
                                    style={{ backgroundColor: 'var(--color-primary)' }}
                                />
                                <div className="flex items-center gap-2 mb-1">
                                    <span
                                        className="text-[13px] font-semibold"
                                        style={{ color: 'var(--color-text)' }}
                                    >
                                        {exp.position}
                                    </span>
                                    <span
                                        className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                                        style={{
                                            backgroundColor: exp.endDate
                                                ? 'var(--color-bg-light)'
                                                : 'var(--color-primary-glow)',
                                            color: exp.endDate
                                                ? 'var(--color-text-muted)'
                                                : 'var(--color-primary)',
                                        }}
                                    >
                                        {exp.endDate ? 'Completed' : 'Current'}
                                    </span>
                                </div>
                                <div
                                    className="text-[12px] mb-1.5"
                                    style={{ color: 'var(--color-text-muted)' }}
                                >
                                    {exp.company} · {exp.startDate} – {exp.endDate || 'Present'}
                                    {exp.location && ` · ${exp.location}`}
                                </div>
                                <p
                                    className="text-[12px] leading-relaxed mb-2"
                                    style={{ color: 'var(--color-text-dim)' }}
                                >
                                    {exp.description}
                                </p>
                                <div className="flex flex-wrap gap-1">
                                    {exp.technologies.map((tech) => (
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
                            </div>
                        ))}
                    </div>
                </div>

                {/* Education */}
                {CONFIG.education && CONFIG.education.length > 0 && (
                    <div className="px-6 pb-5">
                        <h2
                            className="text-[11px] font-semibold uppercase tracking-wider mb-3"
                            style={{ color: 'var(--color-text-muted)' }}
                        >
                            Education
                        </h2>
                        <div className="space-y-4">
                            {CONFIG.education.map((edu, i) => (
                                <div
                                    key={i}
                                    className="pl-4 relative"
                                    style={{ borderLeft: '2px solid var(--color-border)' }}
                                >
                                    <div
                                        className="absolute -left-[5px] top-1 w-2 h-2 rounded-full"
                                        style={{ backgroundColor: 'var(--color-primary)' }}
                                    />
                                    <div className="flex items-center gap-2 mb-1">
                                        <span
                                            className="text-[13px] font-semibold"
                                            style={{ color: 'var(--color-text)' }}
                                        >
                                            {edu.degree} in {edu.field}
                                        </span>
                                        <span
                                            className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                                            style={{
                                                backgroundColor: edu.endDate
                                                    ? 'var(--color-bg-light)'
                                                    : 'var(--color-primary-glow)',
                                                color: edu.endDate
                                                    ? 'var(--color-text-muted)'
                                                    : 'var(--color-primary)',
                                            }}
                                        >
                                            {edu.endDate ? 'Graduated' : 'Enrolled'}
                                        </span>
                                    </div>
                                    <div
                                        className="text-[12px] mb-1.5"
                                        style={{ color: 'var(--color-text-muted)' }}
                                    >
                                        {edu.institution} · {edu.startDate} –{' '}
                                        {edu.endDate || 'Present'}
                                        {edu.location && ` · ${edu.location}`}
                                    </div>
                                    {edu.description && (
                                        <p
                                            className="text-[12px] leading-relaxed mb-2"
                                            style={{ color: 'var(--color-text-dim)' }}
                                        >
                                            {edu.description}
                                        </p>
                                    )}
                                    {edu.achievements && edu.achievements.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {edu.achievements.map((a, j) => (
                                                <span
                                                    key={j}
                                                    className="text-[11px] px-2 py-0.5 rounded-md"
                                                    style={{
                                                        backgroundColor: 'var(--color-bg-light)',
                                                        color: 'var(--color-text-dim)',
                                                    }}
                                                >
                                                    {a}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Skills by Category */}
                <div className="px-6 pb-5">
                    <h2
                        className="text-[11px] font-semibold uppercase tracking-wider mb-3"
                        style={{ color: 'var(--color-text-muted)' }}
                    >
                        Full Skill Set
                    </h2>
                    <div className="space-y-3">
                        {categories.map(([category, skills]) => {
                            const icon = categoryIcons[category] || 'fa-layer-group';
                            const label = categoryLabels[category] || category;
                            return (
                                <div key={category}>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <i
                                            className={`fas ${icon} text-[10px]`}
                                            style={{ color: 'var(--color-primary)' }}
                                        />
                                        <span
                                            className="text-[11px] font-medium"
                                            style={{ color: 'var(--color-text-dim)' }}
                                        >
                                            {label}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {skills.map((skill, i) => (
                                            <span
                                                key={i}
                                                className="text-[10px] px-2 py-0.5 rounded-md"
                                                style={{
                                                    backgroundColor: 'var(--color-bg-light)',
                                                    color: 'var(--color-text-muted)',
                                                }}
                                            >
                                                {skill.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Social */}
                <div className="px-6 pb-6">
                    <h2
                        className="text-[11px] font-semibold uppercase tracking-wider mb-3"
                        style={{ color: 'var(--color-text-muted)' }}
                    >
                        Connect
                    </h2>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { name: 'GitHub', url: CONFIG.social.github, icon: 'fab fa-github' },
                            {
                                name: 'LinkedIn',
                                url: CONFIG.social.linkedin,
                                icon: 'fab fa-linkedin',
                            },
                            {
                                name: 'Twitter',
                                url: CONFIG.social.twitter,
                                icon: 'fab fa-x-twitter',
                            },
                            {
                                name: 'Resume',
                                url: CONFIG.personal.resume,
                                icon: 'fas fa-file-pdf',
                            },
                        ].map((link) => (
                            <a
                                key={link.name}
                                href={link.url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2.5 p-2.5 rounded-xl transition-colors"
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
                                <i
                                    className={`${link.icon} text-sm`}
                                    style={{ color: 'var(--color-primary)' }}
                                />
                                <span
                                    className="text-[12px] font-medium"
                                    style={{ color: 'var(--color-text)' }}
                                >
                                    {link.name}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

import React from 'react';
import { CONFIG } from '../../utils/config';

const links = [
    {
        name: 'GitHub',
        url: CONFIG.social.github || '',
        icon: 'fab fa-github',
        desc: 'Source code & projects',
        status: 'ESTABLISHED',
    },
    {
        name: 'LinkedIn',
        url: CONFIG.social.linkedin || '',
        icon: 'fab fa-linkedin',
        desc: 'Professional network',
        status: 'ESTABLISHED',
    },
    {
        name: 'Twitter',
        url: CONFIG.social.twitter || '',
        icon: 'fab fa-x-twitter',
        desc: 'Thoughts & updates',
        status: 'ESTABLISHED',
    },
    {
        name: 'Email',
        url: `mailto:${CONFIG.social.email}`,
        icon: 'fas fa-envelope',
        desc: CONFIG.social.email,
        status: 'LISTENING',
    },
    {
        name: 'Resume',
        url: CONFIG.personal.resume || '#',
        icon: 'fas fa-file-pdf',
        desc: 'Download CV',
        status: 'AVAILABLE',
    },
];

export const NetworkManagerApp: React.FC = () => {
    return (
        <div
            className="h-full flex flex-col overflow-hidden"
            style={{ backgroundColor: 'var(--color-bg)' }}
        >
            <div
                className="p-4"
                style={{
                    borderBottom: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-bg-light)',
                }}
            >
                <div className="flex items-center gap-2 mb-3">
                    <i className="fas fa-globe" style={{ color: 'var(--color-primary)' }} />
                    <span className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                        NETWORK MANAGER
                    </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    <div
                        className="text-center p-2 rounded-sm"
                        style={{ border: '1px solid var(--color-border)' }}
                    >
                        <div
                            className="text-lg font-bold"
                            style={{ color: 'var(--color-success)' }}
                        >
                            3
                        </div>
                        <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                            Active
                        </div>
                    </div>
                    <div
                        className="text-center p-2 rounded-sm"
                        style={{ border: '1px solid var(--color-border)' }}
                    >
                        <div
                            className="text-lg font-bold"
                            style={{ color: 'var(--color-warning)' }}
                        >
                            1
                        </div>
                        <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                            Listening
                        </div>
                    </div>
                    <div
                        className="text-center p-2 rounded-sm"
                        style={{ border: '1px solid var(--color-border)' }}
                    >
                        <div className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
                            5
                        </div>
                        <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                            Total
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                    {links.map((link, i) => (
                        <a
                            key={i}
                            href={link.url}
                            target={link.url.startsWith('mailto') ? undefined : '_blank'}
                            rel="noreferrer"
                            className="flex items-center gap-4 p-4 rounded-sm border transition-all group"
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
                            <div
                                className="w-10 h-10 rounded-sm flex items-center justify-center"
                                style={{ backgroundColor: 'var(--color-primary-glow)' }}
                            >
                                <i
                                    className={`${link.icon} text-xl`}
                                    style={{ color: 'var(--color-primary)' }}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div
                                    className="text-sm font-bold"
                                    style={{ color: 'var(--color-text)' }}
                                >
                                    {link.name}
                                </div>
                                <div
                                    className="text-xs truncate"
                                    style={{ color: 'var(--color-text-dim)' }}
                                >
                                    {link.desc}
                                </div>
                            </div>
                            <span
                                className="text-xs px-2 py-0.5 rounded-sm"
                                style={{
                                    color:
                                        link.status === 'ESTABLISHED'
                                            ? 'var(--color-success)'
                                            : link.status === 'LISTENING'
                                              ? 'var(--color-warning)'
                                              : 'var(--color-text-muted)',
                                    border: `1px solid ${link.status === 'ESTABLISHED' ? 'var(--color-success)' : link.status === 'LISTENING' ? 'var(--color-warning)' : 'var(--color-border)'}`,
                                }}
                            >
                                {link.status}
                            </span>
                            <i
                                className="fas fa-external-link-alt text-xs"
                                style={{ color: 'var(--color-text-muted)' }}
                            />
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

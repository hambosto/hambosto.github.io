import React from 'react';
import { CONFIG } from '../../utils/config';

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

export const SystemMonitorApp: React.FC = () => {
    const categories = Object.entries(CONFIG.customSkills);
    const totalSkills = categories.reduce((sum, [, skills]) => sum + skills.length, 0);
    const avgLevel = Math.round(
        categories.reduce((sum, [, skills]) => sum + skills.reduce((s, sk) => s + sk.level, 0), 0) /
            totalSkills
    );

    return (
        <div className="h-full flex flex-col overflow-hidden" style={{ backgroundColor: '#0a0a0a' }}>
            {/* Header Stats */}
            <div
                className="p-4 flex-shrink-0"
                style={{
                    borderBottom: '1px solid var(--color-border)',
                    backgroundColor: '#111111',
                }}
            >
                <div className="flex items-center gap-2 mb-3">
                    <i className="fas fa-chart-bar" style={{ color: 'var(--color-primary)' }} />
                    <span className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                        TECH STACK OVERVIEW
                    </span>
                    <span className="ml-auto text-xs px-2 py-0.5 rounded-sm" style={{ backgroundColor: 'var(--color-primary-glow)', color: 'var(--color-primary)', border: '1px solid var(--color-border)' }}>
                        {totalSkills} skills
                    </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-2 rounded-sm" style={{ border: '1px solid var(--color-border)' }}>
                        <div className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>{totalSkills}</div>
                        <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Skills</div>
                    </div>
                    <div className="text-center p-2 rounded-sm" style={{ border: '1px solid var(--color-border)' }}>
                        <div className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>{categories.length}</div>
                        <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Categories</div>
                    </div>
                    <div className="text-center p-2 rounded-sm" style={{ border: '1px solid var(--color-border)' }}>
                        <div className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>{avgLevel}%</div>
                        <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Average</div>
                    </div>
                </div>
            </div>

            {/* All Skills — No drawers, everything visible */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categories.map(([category, skills]) => {
                        const icon = categoryIcons[category] || 'fa-layer-group';
                        const catAvg = Math.round(skills.reduce((s, sk) => s + sk.level, 0) / skills.length);
                        return (
                            <div
                                key={category}
                                className="rounded-sm border p-4"
                                style={{ borderColor: 'var(--color-border)' }}
                            >
                                {/* Category Header */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <i className={`fas ${icon} text-xs`} style={{ color: 'var(--color-primary)' }} />
                                        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text)' }}>
                                            {category.replace(/([A-Z])/g, ' $1').trim()}
                                        </span>
                                    </div>
                                    <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>
                                        {catAvg}%
                                    </span>
                                </div>

                                {/* Skill Bars */}
                                <div className="space-y-2.5">
                                    {skills.map((skill, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span style={{ color: 'var(--color-text-dim)' }}>{skill.name}</span>
                                                <span className="font-mono" style={{ color: 'var(--color-primary)' }}>{skill.level}%</span>
                                            </div>
                                            <div className="progress-bar">
                                                <div className="progress-fill" style={{ width: `${skill.level}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

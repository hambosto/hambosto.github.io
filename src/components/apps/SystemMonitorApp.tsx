import React, { useState } from 'react';
import { CONFIG } from '../../utils/config';

export const SystemMonitorApp: React.FC = () => {
    const [expanded, setExpanded] = useState<string | null>(null);

    const categories = Object.entries(CONFIG.customSkills);
    const totalSkills = categories.reduce((sum, [, skills]) => sum + skills.length, 0);
    const avgLevel = Math.round(
        categories.reduce((sum, [, skills]) => sum + skills.reduce((s, sk) => s + sk.level, 0), 0) /
            totalSkills
    );

    return (
        <div
            className="h-full flex flex-col overflow-hidden"
            style={{ backgroundColor: '#0a0a0a' }}
        >
            {/* Header Stats */}
            <div
                className="p-4"
                style={{
                    borderBottom: '1px solid var(--color-border)',
                    backgroundColor: '#111111',
                }}
            >
                <div className="flex items-center gap-2 mb-3">
                    <i className="fas fa-chart-bar" style={{ color: 'var(--color-primary)' }} />
                    <span className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                        SYSTEM MONITOR
                    </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    <div
                        className="text-center p-2 rounded-sm"
                        style={{ border: '1px solid var(--color-border)' }}
                    >
                        <div
                            className="text-lg font-bold"
                            style={{ color: 'var(--color-primary)' }}
                        >
                            {totalSkills}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                            Skills
                        </div>
                    </div>
                    <div
                        className="text-center p-2 rounded-sm"
                        style={{ border: '1px solid var(--color-border)' }}
                    >
                        <div
                            className="text-lg font-bold"
                            style={{ color: 'var(--color-primary)' }}
                        >
                            {categories.length}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                            Categories
                        </div>
                    </div>
                    <div
                        className="text-center p-2 rounded-sm"
                        style={{ border: '1px solid var(--color-border)' }}
                    >
                        <div
                            className="text-lg font-bold"
                            style={{ color: 'var(--color-primary)' }}
                        >
                            {avgLevel}%
                        </div>
                        <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                            Average
                        </div>
                    </div>
                </div>
            </div>

            {/* Skill List */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                    {categories.map(([category, skills]) => {
                        const isExpanded = expanded === category;
                        const catAvg = Math.round(
                            skills.reduce((s, sk) => s + sk.level, 0) / skills.length
                        );
                        return (
                            <div
                                key={category}
                                className="rounded-sm border overflow-hidden"
                                style={{
                                    borderColor: isExpanded
                                        ? 'var(--color-primary)'
                                        : 'var(--color-border)',
                                }}
                            >
                                <div
                                    className="flex items-center justify-between p-3 cursor-pointer"
                                    style={{
                                        backgroundColor: isExpanded
                                            ? 'var(--color-primary-glow)'
                                            : 'var(--color-bg-light)',
                                    }}
                                    onClick={() => setExpanded(isExpanded ? null : category)}
                                >
                                    <div className="flex items-center gap-3">
                                        <i
                                            className={`fas fa-chevron-${isExpanded ? 'down' : 'right'} text-xs`}
                                            style={{ color: 'var(--color-primary)' }}
                                        />
                                        <span
                                            className="text-sm font-bold uppercase"
                                            style={{ color: 'var(--color-text)' }}
                                        >
                                            {category}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-24 progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{ width: `${catAvg}%` }}
                                            />
                                        </div>
                                        <span
                                            className="text-xs font-mono"
                                            style={{ color: 'var(--color-text-dim)' }}
                                        >
                                            {catAvg}%
                                        </span>
                                    </div>
                                </div>
                                {isExpanded && (
                                    <div
                                        className="p-3 space-y-3"
                                        style={{ borderTop: '1px solid var(--color-border)' }}
                                    >
                                        {skills.map((skill, i) => (
                                            <div key={i}>
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span
                                                        style={{ color: 'var(--color-text-dim)' }}
                                                    >
                                                        {skill.name}
                                                    </span>
                                                    <span
                                                        className="font-mono"
                                                        style={{ color: 'var(--color-primary)' }}
                                                    >
                                                        {skill.level}%
                                                    </span>
                                                </div>
                                                <div className="progress-bar">
                                                    <div
                                                        className="progress-fill"
                                                        style={{ width: `${skill.level}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

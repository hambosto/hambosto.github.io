import React, { useState } from 'react';
import { useTheme, THEMES } from '../../context/ThemeContext';

export const SettingsApp: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const [activeTab, setActiveTab] = useState<'theme' | 'about'>('theme');

    return (
        <div
            className="h-full flex flex-col overflow-hidden"
            style={{ backgroundColor: 'var(--color-bg)' }}
        >
            {/* Header */}
            <div
                className="flex items-center gap-2 px-4 py-3"
                style={{ borderBottom: '1px solid var(--color-border)' }}
            >
                <i className="fas fa-gear text-sm" style={{ color: 'var(--color-primary)' }} />
                <span className="text-[13px] font-semibold" style={{ color: 'var(--color-text)' }}>
                    Settings
                </span>
                <div className="ml-auto flex gap-1">
                    {(['theme', 'about'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className="px-3 py-1 text-[11px] font-medium rounded-lg transition-colors capitalize"
                            style={{
                                color:
                                    activeTab === tab
                                        ? 'var(--color-text)'
                                        : 'var(--color-text-muted)',
                                backgroundColor:
                                    activeTab === tab ? 'var(--color-primary-glow)' : 'transparent',
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {activeTab === 'theme' && (
                    <div className="space-y-2">
                        {Object.values(THEMES).map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTheme(t.id)}
                                className="w-full flex items-center gap-4 p-3 rounded-xl transition-colors"
                                style={{
                                    border: `1px solid ${theme.id === t.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                                    backgroundColor:
                                        theme.id === t.id
                                            ? 'var(--color-primary-glow)'
                                            : 'transparent',
                                }}
                                onMouseEnter={(e) => {
                                    if (theme.id !== t.id)
                                        (e.currentTarget as HTMLElement).style.borderColor =
                                            'var(--color-border-active)';
                                }}
                                onMouseLeave={(e) => {
                                    if (theme.id !== t.id)
                                        (e.currentTarget as HTMLElement).style.borderColor =
                                            'var(--color-border)';
                                }}
                            >
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: t.colors.primary }}
                                >
                                    {theme.id === t.id && (
                                        <i
                                            className="fas fa-check text-xs"
                                            style={{ color: t.colors.bgDark }}
                                        />
                                    )}
                                </div>
                                <div className="flex-1 text-left">
                                    <div
                                        className="text-[13px] font-medium"
                                        style={{ color: 'var(--color-text)' }}
                                    >
                                        {t.name}
                                    </div>
                                    <div
                                        className="text-[11px] font-mono"
                                        style={{ color: t.colors.primary }}
                                    >
                                        {t.colors.primary}
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    {[
                                        t.colors.primary,
                                        t.colors.accent,
                                        t.colors.warning,
                                        t.colors.error,
                                    ].map((c, i) => (
                                        <div
                                            key={i}
                                            className="w-3.5 h-3.5 rounded-full"
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {activeTab === 'about' && (
                    <div className="space-y-4">
                        <div className="text-center py-4">
                            <div
                                className="text-4xl mb-3 font-mono font-bold"
                                style={{ color: 'var(--color-primary)' }}
                            >
                                ⌘
                            </div>
                            <div
                                className="text-lg font-semibold"
                                style={{ color: 'var(--color-text)' }}
                            >
                                Portfolio OS
                            </div>
                            <div
                                className="text-[13px] mt-1"
                                style={{ color: 'var(--color-text-muted)' }}
                            >
                                Version 3.1
                            </div>
                        </div>
                        <div
                            className="rounded-xl p-4"
                            style={{ border: '1px solid var(--color-border)' }}
                        >
                            <div
                                className="space-y-2.5 text-[12px]"
                                style={{ color: 'var(--color-text-dim)' }}
                            >
                                {[
                                    { label: 'Framework', value: 'React 19' },
                                    { label: 'Language', value: 'TypeScript' },
                                    { label: 'Build Tool', value: 'Vite 7' },
                                    { label: 'Styling', value: 'Tailwind CSS' },
                                    { label: 'UI Font', value: 'Inter' },
                                    { label: 'Code Font', value: 'Fira Code' },
                                ].map((item) => (
                                    <div key={item.label} className="flex justify-between">
                                        <span>{item.label}</span>
                                        <span
                                            className="font-medium"
                                            style={{ color: 'var(--color-text)' }}
                                        >
                                            {item.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

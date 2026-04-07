import React, { useState } from 'react';
import { useTheme, THEMES } from '../../context/ThemeContext';

export const SettingsApp: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const [activeTab, setActiveTab] = useState<'theme' | 'preview' | 'about'>('theme');

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
                    <i className="fas fa-gear" style={{ color: 'var(--color-primary)' }} />
                    <span className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                        SETTINGS
                    </span>
                </div>
                <div className="flex gap-1">
                    {(['theme', 'preview', 'about'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className="px-3 py-1 text-xs rounded-sm border transition-all capitalize"
                            style={{
                                borderColor:
                                    activeTab === tab
                                        ? 'var(--color-primary)'
                                        : 'var(--color-border)',
                                color:
                                    activeTab === tab
                                        ? 'var(--color-primary)'
                                        : 'var(--color-text-dim)',
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
                    <div className="space-y-3">
                        {Object.values(THEMES).map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTheme(t.id)}
                                className="w-full flex items-center gap-4 p-4 rounded-sm border transition-all"
                                style={{
                                    borderColor:
                                        theme.id === t.id
                                            ? 'var(--color-primary)'
                                            : 'var(--color-border)',
                                    backgroundColor:
                                        theme.id === t.id
                                            ? 'var(--color-primary-glow)'
                                            : 'var(--color-bg-light)',
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
                                <div className="relative">
                                    <div
                                        className="w-12 h-12 rounded-sm"
                                        style={{ backgroundColor: t.colors.primary }}
                                    />
                                    {theme.id === t.id && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <i
                                                className="fas fa-check text-sm"
                                                style={{
                                                    color: t.id === 'white' ? '#000' : '#fff',
                                                    textShadow: '0 0 4px rgba(0,0,0,0.5)',
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 text-left">
                                    <div
                                        className="text-sm font-bold"
                                        style={{ color: 'var(--color-text)' }}
                                    >
                                        {t.name}
                                    </div>
                                    <div
                                        className="text-xs font-mono"
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
                                            className="w-4 h-4 rounded-sm"
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {activeTab === 'preview' && (
                    <div className="space-y-4">
                        <div
                            className="p-4 rounded-sm border"
                            style={{ borderColor: 'var(--color-border)' }}
                        >
                            <h3
                                className="text-xs uppercase tracking-wider mb-3"
                                style={{ color: 'var(--color-text-muted)' }}
                            >
                                Typography
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div style={{ color: 'var(--color-text)' }}>
                                    Primary text — The quick brown fox jumps over the lazy dog
                                </div>
                                <div style={{ color: 'var(--color-text-dim)' }}>
                                    Dim text — The quick brown fox jumps over the lazy dog
                                </div>
                                <div style={{ color: 'var(--color-text-muted)' }}>
                                    Muted text — The quick brown fox jumps over the lazy dog
                                </div>
                                <div style={{ color: 'var(--color-error)' }}>
                                    Error text — Something went wrong
                                </div>
                                <div style={{ color: 'var(--color-warning)' }}>
                                    Warning text — Proceed with caution
                                </div>
                            </div>
                        </div>
                        <div
                            className="p-4 rounded-sm border"
                            style={{ borderColor: 'var(--color-border)' }}
                        >
                            <h3
                                className="text-xs uppercase tracking-wider mb-3"
                                style={{ color: 'var(--color-text-muted)' }}
                            >
                                Progress Bars
                            </h3>
                            <div className="space-y-3">
                                {[25, 50, 75, 100].map((v) => (
                                    <div key={v}>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span style={{ color: 'var(--color-text-dim)' }}>
                                                {v}%
                                            </span>
                                        </div>
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{ width: `${v}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div
                            className="p-4 rounded-sm border"
                            style={{ borderColor: 'var(--color-border)' }}
                        >
                            <h3
                                className="text-xs uppercase tracking-wider mb-3"
                                style={{ color: 'var(--color-text-muted)' }}
                            >
                                Tags & Buttons
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {['React', 'TypeScript', 'Vite', 'Tailwind'].map((t) => (
                                    <span
                                        key={t}
                                        className="text-xs px-2 py-1 rounded-sm"
                                        style={{
                                            backgroundColor: 'var(--color-primary-glow)',
                                            border: '1px solid var(--color-border)',
                                            color: 'var(--color-text-dim)',
                                        }}
                                    >
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'about' && (
                    <div className="space-y-4">
                        <div
                            className="p-4 rounded-sm border"
                            style={{ borderColor: 'var(--color-border)' }}
                        >
                            <div className="text-center mb-4">
                                <div
                                    className="text-3xl mb-2"
                                    style={{ color: 'var(--color-primary)' }}
                                >
                                    ⌘
                                </div>
                                <div
                                    className="text-lg font-bold"
                                    style={{ color: 'var(--color-text)' }}
                                >
                                    Portfolio OS
                                </div>
                                <div className="text-sm" style={{ color: 'var(--color-text-dim)' }}>
                                    Version 3.0.2
                                </div>
                            </div>
                            <div
                                className="space-y-2 text-xs"
                                style={{ color: 'var(--color-text-dim)' }}
                            >
                                <div className="flex justify-between">
                                    <span>Framework</span>
                                    <span style={{ color: 'var(--color-text)' }}>React 19</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Language</span>
                                    <span style={{ color: 'var(--color-text)' }}>TypeScript</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Build Tool</span>
                                    <span style={{ color: 'var(--color-text)' }}>Vite 7</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Styling</span>
                                    <span style={{ color: 'var(--color-text)' }}>Tailwind CSS</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Font</span>
                                    <span style={{ color: 'var(--color-text)' }}>Fira Code</span>
                                </div>
                            </div>
                        </div>
                        <div
                            className="p-4 rounded-sm border"
                            style={{ borderColor: 'var(--color-border)' }}
                        >
                            <h3
                                className="text-xs uppercase tracking-wider mb-3"
                                style={{ color: 'var(--color-text-muted)' }}
                            >
                                Features
                            </h3>
                            <div
                                className="space-y-2 text-xs"
                                style={{ color: 'var(--color-text-dim)' }}
                            >
                                {[
                                    'Draggable window manager',
                                    'Multiple color themes',
                                    'Terminal emulator with 25+ commands',
                                    'GitHub API integration',
                                    'File manager with grid/list views',
                                    'Collapsible system monitor',
                                    'Contact form with Formspree',
                                    'Matrix screensaver',
                                    'Boot sequence animation',
                                ].map((f) => (
                                    <div key={f} className="flex items-center gap-2">
                                        <i
                                            className="fas fa-check"
                                            style={{ color: 'var(--color-primary)', fontSize: 10 }}
                                        />
                                        {f}
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

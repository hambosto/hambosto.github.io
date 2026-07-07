/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

export interface Theme {
    id: string;
    name: string;
    colors: {
        primary: string;
        primaryDim: string;
        primaryDark: string;
        primaryGlow: string;
        primaryGlowStrong: string;
        bg: string;
        bgDark: string;
        bgLight: string;
        surface: string;
        surfaceHover: string;
        border: string;
        borderActive: string;
        text: string;
        textDim: string;
        textMuted: string;
        accent: string;
        warning: string;
        error: string;
        success: string;
    };
}

export const THEMES: Record<string, Theme> = {
    cyan: {
        id: 'cyan',
        name: 'Frost',
        colors: {
            primary: '#22d3ee',
            primaryDim: '#06b6d4',
            primaryDark: '#0891b2',
            primaryGlow: 'rgba(34, 211, 238, 0.08)',
            primaryGlowStrong: 'rgba(34, 211, 238, 0.15)',
            bg: '#121218',
            bgDark: '#0c0c11',
            bgLight: '#1a1a23',
            surface: '#16161f',
            surfaceHover: '#1e1e2a',
            border: '#27272a',
            borderActive: '#3f3f46',
            text: '#fafafa',
            textDim: '#a1a1aa',
            textMuted: '#71717a',
            accent: '#a78bfa',
            warning: '#fbbf24',
            error: '#f87171',
            success: '#34d399',
        },
    },
    purple: {
        id: 'purple',
        name: 'Ultraviolet',
        colors: {
            primary: '#a78bfa',
            primaryDim: '#8b5cf6',
            primaryDark: '#7c3aed',
            primaryGlow: 'rgba(167, 139, 250, 0.08)',
            primaryGlowStrong: 'rgba(167, 139, 250, 0.15)',
            bg: '#121218',
            bgDark: '#0c0c11',
            bgLight: '#1a1a23',
            surface: '#16161f',
            surfaceHover: '#1e1e2a',
            border: '#27272a',
            borderActive: '#3f3f46',
            text: '#fafafa',
            textDim: '#a1a1aa',
            textMuted: '#71717a',
            accent: '#22d3ee',
            warning: '#fbbf24',
            error: '#f87171',
            success: '#34d399',
        },
    },
    green: {
        id: 'green',
        name: 'Mint',
        colors: {
            primary: '#34d399',
            primaryDim: '#10b981',
            primaryDark: '#059669',
            primaryGlow: 'rgba(52, 211, 153, 0.08)',
            primaryGlowStrong: 'rgba(52, 211, 153, 0.15)',
            bg: '#121218',
            bgDark: '#0c0c11',
            bgLight: '#1a1a23',
            surface: '#16161f',
            surfaceHover: '#1e1e2a',
            border: '#27272a',
            borderActive: '#3f3f46',
            text: '#fafafa',
            textDim: '#a1a1aa',
            textMuted: '#71717a',
            accent: '#a78bfa',
            warning: '#fbbf24',
            error: '#f87171',
            success: '#34d399',
        },
    },
    amber: {
        id: 'amber',
        name: 'Ember',
        colors: {
            primary: '#fbbf24',
            primaryDim: '#f59e0b',
            primaryDark: '#d97706',
            primaryGlow: 'rgba(251, 191, 36, 0.08)',
            primaryGlowStrong: 'rgba(251, 191, 36, 0.15)',
            bg: '#121218',
            bgDark: '#0c0c11',
            bgLight: '#1a1a23',
            surface: '#16161f',
            surfaceHover: '#1e1e2a',
            border: '#27272a',
            borderActive: '#3f3f46',
            text: '#fafafa',
            textDim: '#a1a1aa',
            textMuted: '#71717a',
            accent: '#f87171',
            warning: '#fbbf24',
            error: '#f87171',
            success: '#34d399',
        },
    },
    rose: {
        id: 'rose',
        name: 'Rose',
        colors: {
            primary: '#fb7185',
            primaryDim: '#f43f5e',
            primaryDark: '#e11d48',
            primaryGlow: 'rgba(251, 113, 133, 0.08)',
            primaryGlowStrong: 'rgba(251, 113, 133, 0.15)',
            bg: '#121218',
            bgDark: '#0c0c11',
            bgLight: '#1a1a23',
            surface: '#16161f',
            surfaceHover: '#1e1e2a',
            border: '#27272a',
            borderActive: '#3f3f46',
            text: '#fafafa',
            textDim: '#a1a1aa',
            textMuted: '#71717a',
            accent: '#a78bfa',
            warning: '#fbbf24',
            error: '#f87171',
            success: '#34d399',
        },
    },
};

interface ThemeContextValue {
    theme: Theme;
    setTheme: (id: string) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [themeId, setThemeId] = useState('cyan');
    const theme = THEMES[themeId] || THEMES.cyan;

    const setTheme = useCallback((id: string) => {
        const t = THEMES[id];
        if (!t) return;
        setThemeId(id);
        const r = document.documentElement.style;
        const c = t.colors;
        r.setProperty('--color-primary', c.primary);
        r.setProperty('--color-primary-dim', c.primaryDim);
        r.setProperty('--color-primary-dark', c.primaryDark);
        r.setProperty('--color-primary-glow', c.primaryGlow);
        r.setProperty('--color-primary-glow-strong', c.primaryGlowStrong);
        r.setProperty('--color-bg', c.bg);
        r.setProperty('--color-bg-dark', c.bgDark);
        r.setProperty('--color-bg-light', c.bgLight);
        r.setProperty('--color-surface', c.surface);
        r.setProperty('--color-surface-hover', c.surfaceHover);
        r.setProperty('--color-border', c.border);
        r.setProperty('--color-border-active', c.borderActive);
        r.setProperty('--color-text', c.text);
        r.setProperty('--color-text-dim', c.textDim);
        r.setProperty('--color-text-muted', c.textMuted);
        r.setProperty('--color-accent', c.accent);
        r.setProperty('--color-warning', c.warning);
        r.setProperty('--color-error', c.error);
        r.setProperty('--color-success', c.success);
    }, []);

    // Apply default theme on mount
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTheme('cyan');
    }, [setTheme]);

    return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
    return ctx;
}

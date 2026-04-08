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
    green: {
        id: 'green',
        name: 'Matrix Green',
        colors: {
            primary: '#00ff41',
            primaryDim: '#00cc33',
            primaryDark: '#00801f',
            primaryGlow: 'rgba(0, 255, 65, 0.15)',
            primaryGlowStrong: 'rgba(0, 255, 65, 0.3)',
            bg: '#0a0a0a',
            bgDark: '#050505',
            bgLight: '#111111',
            surface: '#0d0d0d',
            surfaceHover: '#141414',
            border: '#1a2e1a',
            borderActive: '#2a4a2a',
            text: '#00ff41',
            textDim: '#00ee38',
            textMuted: '#00bb2c',
            accent: '#00ffff',
            warning: '#ffb000',
            error: '#ff4466',
            success: '#00ff41',
        },
    },
    amber: {
        id: 'amber',
        name: 'Amber Phosphor',
        colors: {
            primary: '#ffb000',
            primaryDim: '#cc8d00',
            primaryDark: '#805800',
            primaryGlow: 'rgba(255, 176, 0, 0.15)',
            primaryGlowStrong: 'rgba(255, 176, 0, 0.3)',
            bg: '#0a0800',
            bgDark: '#050400',
            bgLight: '#110d00',
            surface: '#0d0a00',
            surfaceHover: '#141000',
            border: '#2e2410',
            borderActive: '#4a3a1a',
            text: '#ffb000',
            textDim: '#eeaa00',
            textMuted: '#cc8800',
            accent: '#ff6600',
            warning: '#ff6600',
            error: '#ff4444',
            success: '#ffb000',
        },
    },
    cyan: {
        id: 'cyan',
        name: 'Cyan CRT',
        colors: {
            primary: '#00ffff',
            primaryDim: '#00cccc',
            primaryDark: '#008080',
            primaryGlow: 'rgba(0, 255, 255, 0.15)',
            primaryGlowStrong: 'rgba(0, 255, 255, 0.3)',
            bg: '#000a0a',
            bgDark: '#000505',
            bgLight: '#001111',
            surface: '#000d0d',
            surfaceHover: '#001414',
            border: '#102e2e',
            borderActive: '#1a4a4a',
            text: '#00ffff',
            textDim: '#00dddd',
            textMuted: '#00bbbb',
            accent: '#00ff41',
            warning: '#ffb000',
            error: '#ff4444',
            success: '#00ffff',
        },
    },
    white: {
        id: 'white',
        name: 'White Phosphor',
        colors: {
            primary: '#e0e0e0',
            primaryDim: '#b0b0b0',
            primaryDark: '#808080',
            primaryGlow: 'rgba(224, 224, 224, 0.1)',
            primaryGlowStrong: 'rgba(224, 224, 224, 0.2)',
            bg: '#0a0a0a',
            bgDark: '#050505',
            bgLight: '#111111',
            surface: '#0d0d0d',
            surfaceHover: '#141414',
            border: '#2a2a2a',
            borderActive: '#404040',
            text: '#e0e0e0',
            textDim: '#c8c8c8',
            textMuted: '#a0a0a0',
            accent: '#00ffff',
            warning: '#ffb000',
            error: '#ff4444',
            success: '#e0e0e0',
        },
    },
    purple: {
        id: 'purple',
        name: 'Neon Purple',
        colors: {
            primary: '#bf5af2',
            primaryDim: '#9a40c4',
            primaryDark: '#6b2d8a',
            primaryGlow: 'rgba(191, 90, 242, 0.15)',
            primaryGlowStrong: 'rgba(191, 90, 242, 0.3)',
            bg: '#0a050d',
            bgDark: '#050307',
            bgLight: '#110816',
            surface: '#0d0710',
            surfaceHover: '#140a1a',
            border: '#2a1a3a',
            borderActive: '#4a2a5a',
            text: '#bf5af2',
            textDim: '#b050e0',
            textMuted: '#9540c0',
            accent: '#ff2d55',
            warning: '#ffb000',
            error: '#ff4444',
            success: '#bf5af2',
        },
    },
};

interface ThemeContextValue {
    theme: Theme;
    setTheme: (id: string) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [themeId, setThemeId] = useState('green');
    const theme = THEMES[themeId] || THEMES.green;

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
        setTheme('green');
    }, [setTheme]);

    return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
    return ctx;
}

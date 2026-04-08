import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';

const apps = [
    {
        id: 'terminal',
        name: 'Terminal',
        icon: 'fa-solid fa-terminal',
        desc: 'Command line interface',
    },
    { id: 'files', name: 'File Manager', icon: 'fa-solid fa-folder-open', desc: 'Browse projects' },
    { id: 'editor', name: 'About Me', icon: 'fa-solid fa-file-lines', desc: 'About me & skills' },
    { id: 'calculator', name: 'Calculator', icon: 'fa-solid fa-calculator', desc: 'Do some math' },
    { id: 'mail', name: 'Mail Client', icon: 'fa-solid fa-envelope', desc: 'Send a message' },
    { id: 'settings', name: 'Settings', icon: 'fa-solid fa-gear', desc: 'Appearance & themes' },
    { id: 'tetris', name: 'Tetris', icon: 'fa-solid fa-gamepad', desc: 'Classic block puzzle' },
    { id: 'snake', name: 'Snake', icon: 'fa-solid fa-worm', desc: 'Retro snake game' },
    { id: 'flappy', name: 'Flappy Bird', icon: 'fa-solid fa-dove', desc: 'Tap to fly' },
];

const actions = [
    {
        id: 'maximize-all',
        name: 'Maximize All Windows',
        icon: 'fa-solid fa-expand',
        desc: 'Expand all open windows',
    },
    {
        id: 'minimize-all',
        name: 'Minimize All Windows',
        icon: 'fa-solid fa-compress',
        desc: 'Collapse all windows',
    },
    {
        id: 'close-all',
        name: 'Close All Windows',
        icon: 'fa-solid fa-xmark',
        desc: 'Close everything',
    },
    {
        id: 'matrix',
        name: 'Toggle Matrix Screensaver',
        icon: 'fa-solid fa-code',
        desc: 'Enter the Matrix',
    },
];

export const SpotlightSearch: React.FC = () => {
    const { openWindow, windows, minimizeWindow, maximizeWindow, closeWindow } = useWindowManager();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setOpen((prev) => !prev);
                setQuery('');
                setSelectedIndex(0);
            }
            if (e.key === 'Escape' && open) {
                setOpen(false);
                setQuery('');
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [open]);

    const handleOpenSearch = useCallback(() => {
        setOpen(true);
        setQuery('');
        setSelectedIndex(0);
        setTimeout(() => inputRef.current?.focus(), 50);
    }, []);

    useEffect(() => {
        window.addEventListener('open-search', handleOpenSearch);
        return () => window.removeEventListener('open-search', handleOpenSearch);
    }, [handleOpenSearch]);

    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [open]);

    const filteredApps = useMemo(
        () =>
            apps.filter(
                (a) =>
                    a.name.toLowerCase().includes(query.toLowerCase()) ||
                    a.desc.toLowerCase().includes(query.toLowerCase())
            ),
        [query]
    );

    const filteredActions = useMemo(
        () => actions.filter((a) => a.name.toLowerCase().includes(query.toLowerCase())),
        [query]
    );

    const allResults = useMemo(
        () => [
            ...filteredApps.map((a) => ({ ...a, type: 'app' as const })),
            ...filteredActions.map((a) => ({ ...a, type: 'action' as const })),
        ],
        [filteredApps, filteredActions]
    );

    const normalizedIndex = Math.min(selectedIndex, Math.max(allResults.length - 1, 0));

    useEffect(() => {
        if (listRef.current && allResults.length > 0) {
            const selectedEl = listRef.current.querySelector(`[data-index="${normalizedIndex}"]`);
            if (selectedEl) {
                selectedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        }
    }, [normalizedIndex, allResults.length]);

    const handleSelect = useCallback(
        (item: (typeof allResults)[0]) => {
            if (item.type === 'app') {
                openWindow({
                    id: item.id,
                    title: item.name,
                    icon: item.icon,
                    x: 100 + Math.random() * 100,
                    y: 50 + Math.random() * 50,
                    width: item.id === 'terminal' ? 700 : item.id === 'files' ? 800 : 600,
                    height: item.id === 'terminal' ? 450 : 500,
                });
            } else if (item.type === 'action') {
                switch (item.id) {
                    case 'maximize-all':
                        windows.forEach((w) => maximizeWindow(w.id));
                        break;
                    case 'minimize-all':
                        windows.forEach((w) => minimizeWindow(w.id));
                        break;
                    case 'close-all':
                        windows.forEach((w) => closeWindow(w.id));
                        break;
                    case 'matrix':
                        window.dispatchEvent(new CustomEvent('toggle-matrix'));
                        break;
                }
            }
            setOpen(false);
            setQuery('');
        },
        [openWindow, windows, maximizeWindow, minimizeWindow, closeWindow]
    );

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) => Math.min(prev + 1, allResults.length - 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) => Math.max(prev - 1, 0));
            } else if (e.key === 'Enter' && allResults[selectedIndex]) {
                handleSelect(allResults[selectedIndex]);
            }
        },
        [allResults, selectedIndex, handleSelect]
    );

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[99998] flex items-start justify-center pt-[20vh]"
            onClick={() => setOpen(false)}
        >
            <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} />
            <div
                className="relative w-full max-w-lg rounded-lg border overflow-hidden animate-fade-in"
                style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border-active)',
                    boxShadow: '0 16px 64px rgba(0,0,0,0.8), 0 0 2px var(--color-primary)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className="flex items-center gap-3 px-4 py-3 border-b"
                    style={{ borderColor: 'var(--color-border)' }}
                >
                    <i
                        className="fa-solid fa-search text-sm"
                        style={{ color: 'var(--color-primary)' }}
                    />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setSelectedIndex(0);
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="Search apps, actions..."
                        className="flex-1 bg-transparent outline-none text-sm"
                        style={{ color: 'var(--color-text)', fontFamily: "'Fira Code', monospace" }}
                    />
                    <kbd
                        className="px-1.5 py-0.5 text-[10px] rounded"
                        style={{
                            backgroundColor: 'var(--color-primary-glow)',
                            color: 'var(--color-text-muted)',
                            border: '1px solid var(--color-border)',
                        }}
                    >
                        ESC
                    </kbd>
                </div>
                <div className="max-h-80 overflow-y-auto py-2" ref={listRef}>
                    {allResults.length === 0 && (
                        <div
                            className="px-4 py-8 text-center text-xs"
                            style={{ color: 'var(--color-text-muted)' }}
                        >
                            No results found
                        </div>
                    )}
                    {filteredApps.length > 0 && (
                        <div
                            className="px-3 py-1 text-[10px] font-bold tracking-wider"
                            style={{ color: 'var(--color-text-muted)' }}
                        >
                            APPLICATIONS
                        </div>
                    )}
                    {filteredApps.map((app, i) => {
                        const isSelected = i === normalizedIndex;
                        return (
                            <div
                                key={app.id}
                                data-index={i}
                                className="flex items-center gap-3 px-4 py-2.5 cursor-pointer"
                                style={{
                                    backgroundColor: isSelected
                                        ? 'var(--color-primary-glow-strong)'
                                        : 'transparent',
                                }}
                                onClick={() => handleSelect({ ...app, type: 'app' })}
                                onMouseEnter={() => setSelectedIndex(i)}
                            >
                                <i
                                    className={`${app.icon} text-sm w-5 text-center`}
                                    style={{ color: 'var(--color-primary)' }}
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm" style={{ color: 'var(--color-text)' }}>
                                        {app.name}
                                    </div>
                                    <div
                                        className="text-[11px]"
                                        style={{ color: 'var(--color-text-muted)' }}
                                    >
                                        {app.desc}
                                    </div>
                                </div>
                                <span
                                    className="text-[10px] px-1.5 py-0.5 rounded"
                                    style={{
                                        color: 'var(--color-text-muted)',
                                        backgroundColor: 'var(--color-primary-glow)',
                                    }}
                                >
                                    APP
                                </span>
                            </div>
                        );
                    })}
                    {filteredActions.length > 0 && (
                        <div
                            className="px-3 py-1 text-[10px] font-bold tracking-wider mt-1"
                            style={{ color: 'var(--color-text-muted)' }}
                        >
                            ACTIONS
                        </div>
                    )}
                    {filteredActions.map((action, i) => {
                        const idx = filteredApps.length + i;
                        const isSelected = idx === normalizedIndex;
                        return (
                            <div
                                key={action.id}
                                data-index={idx}
                                className="flex items-center gap-3 px-4 py-2.5 cursor-pointer"
                                style={{
                                    backgroundColor: isSelected
                                        ? 'var(--color-primary-glow-strong)'
                                        : 'transparent',
                                }}
                                onClick={() => handleSelect({ ...action, type: 'action' })}
                                onMouseEnter={() => setSelectedIndex(idx)}
                            >
                                <i
                                    className={`${action.icon} text-sm w-5 text-center`}
                                    style={{ color: 'var(--color-warning)' }}
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm" style={{ color: 'var(--color-text)' }}>
                                        {action.name}
                                    </div>
                                    <div
                                        className="text-[11px]"
                                        style={{ color: 'var(--color-text-muted)' }}
                                    >
                                        {action.desc}
                                    </div>
                                </div>
                                <span
                                    className="text-[10px] px-1.5 py-0.5 rounded"
                                    style={{
                                        color: 'var(--color-warning)',
                                        backgroundColor: 'rgba(255,176,0,0.1)',
                                    }}
                                >
                                    CMD
                                </span>
                            </div>
                        );
                    })}
                </div>
                <div
                    className="px-4 py-2 text-[10px] flex items-center gap-3"
                    style={{
                        borderTop: '1px solid var(--color-border)',
                        color: 'var(--color-text-muted)',
                    }}
                >
                    <span>
                        <kbd
                            style={{
                                backgroundColor: 'var(--color-primary-glow)',
                                padding: '0 4px',
                                borderRadius: 2,
                            }}
                        >
                            ↑↓
                        </kbd>{' '}
                        Navigate
                    </span>
                    <span>
                        <kbd
                            style={{
                                backgroundColor: 'var(--color-primary-glow)',
                                padding: '0 4px',
                                borderRadius: 2,
                            }}
                        >
                            ↵
                        </kbd>{' '}
                        Open
                    </span>
                    <span>
                        <kbd
                            style={{
                                backgroundColor: 'var(--color-primary-glow)',
                                padding: '0 4px',
                                borderRadius: 2,
                            }}
                        >
                            ESC
                        </kbd>{' '}
                        Close
                    </span>
                </div>
            </div>
        </div>
    );
};

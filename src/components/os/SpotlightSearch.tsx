import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';

const apps = [
    { id: 'editor', name: 'About Me', icon: 'fa-solid fa-user', desc: 'About me & skills' },
    { id: 'files', name: 'Projects', icon: 'fa-solid fa-folder-open', desc: 'Browse projects' },
    {
        id: 'terminal',
        name: 'Terminal',
        icon: 'fa-solid fa-terminal',
        desc: 'Command line interface',
    },
    { id: 'mail', name: 'Contact', icon: 'fa-solid fa-envelope', desc: 'Send a message' },
    { id: 'settings', name: 'Settings', icon: 'fa-solid fa-gear', desc: 'Appearance & themes' },
];

export const SpotlightSearch: React.FC = () => {
    const { openWindow } = useWindowManager();
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

    useEffect(() => {
        if (listRef.current && filteredApps.length > 0) {
            const selectedEl = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
            if (selectedEl) {
                selectedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        }
    }, [selectedIndex, filteredApps.length]);

    const handleSelect = useCallback(
        (item: (typeof filteredApps)[0]) => {
            openWindow({
                id: item.id,
                title: item.name,
                icon: item.icon,
                x: 100 + Math.random() * 100,
                y: 50 + Math.random() * 50,
                width: item.id === 'terminal' ? 700 : item.id === 'files' ? 800 : 600,
                height: item.id === 'terminal' ? 450 : 500,
            });
            setOpen(false);
            setQuery('');
        },
        [openWindow]
    );

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) => Math.min(prev + 1, filteredApps.length - 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) => Math.max(prev - 1, 0));
            } else if (e.key === 'Enter' && filteredApps[selectedIndex]) {
                handleSelect(filteredApps[selectedIndex]);
            }
        },
        [filteredApps, selectedIndex, handleSelect]
    );

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[99998] flex items-start justify-center pt-[20vh]"
            onClick={() => setOpen(false)}
        >
            <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} />
            <div
                className="relative w-full max-w-md rounded-2xl overflow-hidden animate-fade-in"
                style={{
                    backgroundColor: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    boxShadow: '0 16px 64px rgba(0,0,0,0.5)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className="flex items-center gap-3 px-4 py-3"
                    style={{ borderBottom: '1px solid var(--color-border)' }}
                >
                    <i
                        className="fa-solid fa-search text-sm"
                        style={{ color: 'var(--color-text-muted)' }}
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
                        placeholder="Search apps..."
                        className="flex-1 bg-transparent outline-none text-[13px]"
                        style={{ color: 'var(--color-text)', fontFamily: 'var(--font-sans)' }}
                    />
                    <kbd
                        className="px-1.5 py-0.5 text-[10px] rounded-md"
                        style={{
                            backgroundColor: 'var(--color-bg-light)',
                            color: 'var(--color-text-muted)',
                            border: '1px solid var(--color-border)',
                        }}
                    >
                        ESC
                    </kbd>
                </div>
                <div className="max-h-72 overflow-y-auto py-1.5" ref={listRef}>
                    {filteredApps.length === 0 && (
                        <div
                            className="px-4 py-8 text-center text-[13px]"
                            style={{ color: 'var(--color-text-muted)' }}
                        >
                            No results found
                        </div>
                    )}
                    {filteredApps.map((app, i) => {
                        const isSelected = i === selectedIndex;
                        return (
                            <div
                                key={app.id}
                                data-index={i}
                                className="flex items-center gap-3 px-4 py-2.5 cursor-pointer mx-1.5 rounded-lg transition-colors"
                                style={{
                                    backgroundColor: isSelected
                                        ? 'var(--color-primary-glow)'
                                        : 'transparent',
                                }}
                                onClick={() => handleSelect(app)}
                                onMouseEnter={() => setSelectedIndex(i)}
                            >
                                <i
                                    className={`${app.icon} text-sm w-5 text-center`}
                                    style={{ color: 'var(--color-primary)' }}
                                />
                                <div className="flex-1 min-w-0">
                                    <div
                                        className="text-[13px] font-medium"
                                        style={{ color: 'var(--color-text)' }}
                                    >
                                        {app.name}
                                    </div>
                                    <div
                                        className="text-[11px]"
                                        style={{ color: 'var(--color-text-muted)' }}
                                    >
                                        {app.desc}
                                    </div>
                                </div>
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
                            className="px-1 py-0.5 rounded"
                            style={{ backgroundColor: 'var(--color-bg-light)' }}
                        >
                            ↑↓
                        </kbd>{' '}
                        Navigate
                    </span>
                    <span>
                        <kbd
                            className="px-1 py-0.5 rounded"
                            style={{ backgroundColor: 'var(--color-bg-light)' }}
                        >
                            ↵
                        </kbd>{' '}
                        Open
                    </span>
                </div>
            </div>
        </div>
    );
};

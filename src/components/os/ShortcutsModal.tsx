import { useState, useEffect } from 'react';

const shortcuts = [
    {
        category: 'System',
        items: [
            { keys: ['Ctrl', 'K'], desc: 'Open Spotlight Search' },
            { keys: ['Ctrl', 'Shift', 'H'], desc: 'Show Keyboard Shortcuts' },
            { keys: ['Esc'], desc: 'Close modals / dismiss menus' },
        ],
    },
    {
        category: 'Window Management',
        items: [
            { keys: ['Click title'], desc: 'Focus window' },
            { keys: ['Drag title'], desc: 'Move window' },
            { keys: ['Drag corner'], desc: 'Resize window' },
        ],
    },
    {
        category: 'Desktop',
        items: [
            { keys: ['Right Click'], desc: 'Open context menu' },
            { keys: ['Double click icon'], desc: 'Open application' },
        ],
    },
    {
        category: 'Easter Eggs',
        items: [
            { keys: ['↑↑↓↓←→←→BA'], desc: 'Konami Code' },
            { keys: ['type', 'matrix'], desc: 'Toggle Matrix mode' },
        ],
    },
];

export const ShortcutsModal: React.FC = () => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'H') {
                e.preventDefault();
                setOpen((prev) => !prev);
            }
            if (e.key === 'Escape' && open) setOpen(false);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [open]);

    useEffect(() => {
        window.addEventListener('open-shortcuts', () => setOpen(true));
        return () => window.removeEventListener('open-shortcuts', () => {});
    }, []);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[99998] flex items-center justify-center p-4"
            onClick={() => setOpen(false)}
        >
            <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} />
            <div
                className="relative w-full max-w-lg rounded-lg border overflow-hidden animate-fade-in"
                style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border-active)',
                    boxShadow: '0 16px 64px rgba(0,0,0,0.8), 0 0 2px var(--color-primary)',
                    maxHeight: '80vh',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className="flex items-center justify-between px-4 py-3 border-b"
                    style={{ borderColor: 'var(--color-border)' }}
                >
                    <div className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                        <i
                            className="fa-solid fa-keyboard mr-2"
                            style={{ color: 'var(--color-primary)' }}
                        />
                        KEYBOARD SHORTCUTS
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        className="text-xs"
                        style={{ color: 'var(--color-text-muted)' }}
                    >
                        <i className="fa-solid fa-xmark" />
                    </button>
                </div>
                <div className="overflow-y-auto max-h-[calc(80vh-50px)] p-4 space-y-4">
                    {shortcuts.map((cat) => (
                        <div key={cat.category}>
                            <div
                                className="text-[10px] font-bold tracking-wider mb-2"
                                style={{ color: 'var(--color-primary)' }}
                            >
                                {cat.category}
                            </div>
                            <div className="space-y-1.5">
                                {cat.items.map((item) => (
                                    <div
                                        key={item.desc}
                                        className="flex items-center justify-between"
                                    >
                                        <div
                                            className="text-xs"
                                            style={{ color: 'var(--color-text-dim)' }}
                                        >
                                            {item.desc}
                                        </div>
                                        <div className="flex gap-1">
                                            {item.keys.map((k) => (
                                                <kbd
                                                    key={k}
                                                    className="px-1.5 py-0.5 text-[10px] rounded-sm"
                                                    style={{
                                                        backgroundColor:
                                                            'var(--color-primary-glow)',
                                                        color: 'var(--color-primary)',
                                                        border: '1px solid var(--color-border)',
                                                        fontFamily: "'Fira Code', monospace",
                                                    }}
                                                >
                                                    {k}
                                                </kbd>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

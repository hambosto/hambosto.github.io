import { useState, useEffect } from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
import { StartMenu } from './StartMenu';
import type { GitHubData } from '../../types/github';

interface TaskbarProps {
    githubData: GitHubData | null;
}

export const Taskbar: React.FC<TaskbarProps> = ({ githubData }) => {
    const { windows, focusedId, focusWindow, minimizeWindow } = useWindowManager();
    const [time, setTime] = useState(new Date());
    const [showStart, setShowStart] = useState(false);

    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    return (
        <>
            {showStart && (
                <>
                    <div className="start-menu-backdrop" onClick={() => setShowStart(false)} />
                    <StartMenu githubData={githubData} onClose={() => setShowStart(false)} />
                </>
            )}

            <div className="taskbar" onClick={(e) => e.stopPropagation()}>
                {/* Left: Start button */}
                <button
                    className="taskbar-btn px-3 font-semibold"
                    style={{
                        color: showStart ? 'var(--color-bg-dark)' : 'var(--color-primary)',
                        backgroundColor: showStart ? 'var(--color-primary)' : 'transparent',
                    }}
                    onClick={() => setShowStart(!showStart)}
                    onMouseEnter={(e) => {
                        if (!showStart) {
                            (e.currentTarget as HTMLElement).style.backgroundColor =
                                'var(--color-primary-glow)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!showStart) {
                            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                        }
                    }}
                >
                    <i className="fas fa-terminal mr-1.5" style={{ fontSize: 11 }} />
                    <span className="hidden sm:inline" style={{ fontSize: 11 }}>
                        PORTFOLIO
                    </span>
                </button>

                <div
                    className="w-px h-4 mx-1.5"
                    style={{ backgroundColor: 'var(--color-border)' }}
                />

                {/* Center: Running apps */}
                <div className="flex items-center gap-1 flex-1 min-w-0 overflow-x-auto">
                    {windows.map((win) => {
                        const isActive = focusedId === win.id && !win.minimized;
                        return (
                            <button
                                key={win.id}
                                className="taskbar-btn relative"
                                style={{
                                    backgroundColor: isActive
                                        ? 'var(--color-primary-glow-strong)'
                                        : 'transparent',
                                    color: isActive
                                        ? 'var(--color-text)'
                                        : 'var(--color-text-muted)',
                                }}
                                onClick={() =>
                                    win.minimized || focusedId !== win.id
                                        ? focusWindow(win.id)
                                        : minimizeWindow(win.id)
                                }
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        (e.currentTarget as HTMLElement).style.backgroundColor =
                                            'var(--color-primary-glow)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        (e.currentTarget as HTMLElement).style.backgroundColor =
                                            'transparent';
                                    }
                                }}
                            >
                                <i className={`${win.icon} mr-1.5`} style={{ fontSize: 11 }} />
                                <span className="truncate">{win.title}</span>
                                {isActive && (
                                    <span
                                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                                        style={{ backgroundColor: 'var(--color-primary)' }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Right: System tray */}
                <div className="taskbar-tray">
                    <span className="hidden md:inline" style={{ color: 'var(--color-text-muted)' }}>
                        {time.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                    <span
                        className="font-mono font-medium"
                        style={{ color: 'var(--color-text-dim)', fontSize: 12 }}
                    >
                        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>
        </>
    );
};

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

    const activeWindows = windows.filter((w) => !w.minimized);

    return (
        <>
            {showStart && (
                <>
                    <div className="start-menu-backdrop" onClick={() => setShowStart(false)} />
                    <StartMenu githubData={githubData} onClose={() => setShowStart(false)} />
                </>
            )}

            <div
                className="taskbar"
                onClick={(e) => e.stopPropagation()}
                style={{
                    backgroundColor: '#0a0a0a',
                    borderTopColor: 'var(--color-border)',
                }}
            >
                {/* Left: Start button */}
                <button
                    className="taskbar-btn px-3 font-bold"
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
                    <i className="fas fa-terminal mr-1" />
                    <span className="hidden sm:inline">PORTFOLIO</span>
                </button>

                <div className="w-px h-5 mx-1" style={{ backgroundColor: 'var(--color-border)' }} />

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
                                    borderColor: isActive ? 'var(--color-primary)' : 'transparent',
                                    color: isActive ? 'var(--color-text)' : 'var(--color-text-dim)',
                                    borderBottomWidth: '2px',
                                    borderBottomStyle: isActive ? 'solid' : 'none',
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
                                <i className={`${win.icon} mr-1`} />
                                <span className="truncate">{win.title}</span>
                                {win.minimized && (
                                    <span
                                        className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full"
                                        style={{ backgroundColor: 'var(--color-text-muted)' }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Right: System tray */}
                <div className="taskbar-tray" style={{ color: 'var(--color-text-dim)' }}>
                    {/* Window count badge */}
                    {activeWindows.length > 0 && (
                        <span
                            className="hidden sm:inline px-2 py-0.5 rounded-sm text-xs"
                            style={{
                                backgroundColor: 'var(--color-primary-glow)',
                                color: 'var(--color-primary)',
                                border: '1px solid var(--color-border)',
                            }}
                        >
                            {activeWindows.length} app{activeWindows.length !== 1 ? 's' : ''}
                        </span>
                    )}

                    {/* Date */}
                    <span className="hidden md:inline" style={{ color: 'var(--color-text-muted)' }}>
                        {time.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>

                    {/* Time */}
                    <span className="font-mono" style={{ color: 'var(--color-primary)' }}>
                        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>
        </>
    );
};

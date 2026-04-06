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
            <div
                className="taskbar"
                onClick={(e) => e.stopPropagation()}
                style={{
                    backgroundColor: '#0a0a0a',
                    borderTopColor: 'var(--color-border)',
                }}
            >
                <button
                    className="taskbar-btn px-3 font-bold"
                    style={{ color: 'var(--color-primary)' }}
                    onClick={() => setShowStart(!showStart)}
                >
                    <i className="fas fa-terminal mr-1" /> PORTFOLIO
                </button>

                <div className="w-px h-5 mx-1" style={{ backgroundColor: 'var(--color-border)' }} />

                {windows.map((win) => (
                    <button
                        key={win.id}
                        className="taskbar-btn"
                        style={{
                            backgroundColor:
                                focusedId === win.id && !win.minimized
                                    ? 'var(--color-primary-glow-strong)'
                                    : 'transparent',
                            borderColor:
                                focusedId === win.id && !win.minimized
                                    ? 'var(--color-border-active)'
                                    : 'transparent',
                            color:
                                focusedId === win.id && !win.minimized
                                    ? 'var(--color-text)'
                                    : 'var(--color-text-dim)',
                        }}
                        onClick={() =>
                            win.minimized || focusedId !== win.id
                                ? focusWindow(win.id)
                                : minimizeWindow(win.id)
                        }
                    >
                        <i className={`${win.icon} mr-1`} /> {win.title}
                    </button>
                ))}

                <div className="taskbar-tray" style={{ color: 'var(--color-text-dim)' }}>
                    <span className="hidden sm:inline">
                        {windows.filter((w) => !w.minimized).length} window
                        {windows.filter((w) => !w.minimized).length !== 1 ? 's' : ''}
                    </span>
                    <span style={{ color: 'var(--color-primary)' }}>
                        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>
        </>
    );
};

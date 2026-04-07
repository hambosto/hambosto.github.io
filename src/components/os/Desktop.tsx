import { useEffect, useState, useCallback } from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
import type { GitHubData } from '../../types/github';
import { TerminalApp } from '../apps/TerminalApp';
import { FileManagerApp } from '../apps/FileManagerApp';
import { TextEditorApp } from '../apps/TextEditorApp';
import { SystemMonitorApp } from '../apps/SystemMonitorApp';
import { NetworkManagerApp } from '../apps/NetworkManagerApp';
import { MailClientApp } from '../apps/MailClientApp';
import { SettingsApp } from '../apps/SettingsApp';
import { DraggableWindow } from './DraggableWindow';
import { MatrixScreensaver } from './MatrixScreensaver';
import { Wallpaper } from './Wallpaper';

interface DesktopProps {
    githubData: GitHubData | null;
}

const desktopIcons = [
    { id: 'terminal', name: 'Terminal', icon: 'fa-solid fa-terminal' },
    { id: 'files', name: 'Projects', icon: 'fa-solid fa-folder-open' },
    { id: 'editor', name: 'About Me', icon: 'fa-solid fa-file-lines' },
    { id: 'monitor', name: 'Skills', icon: 'fa-solid fa-chart-bar' },
    { id: 'network', name: 'Social', icon: 'fa-solid fa-globe' },
    { id: 'mail', name: 'Contact', icon: 'fa-solid fa-envelope' },
    { id: 'settings', name: 'Settings', icon: 'fa-solid fa-gear' },
];

export const Desktop: React.FC<DesktopProps> = ({ githubData }) => {
    const { openWindow, focusWindow, windows } = useWindowManager();
    const [initialized, setInitialized] = useState(false);
    const [lastActivity, setLastActivity] = useState(Date.now());
    const [showScreensaver, setShowScreensaver] = useState(false);
    const SCREENSAVER_TIMEOUT = 5 * 60 * 1000;

    const handleOpen = useCallback(
        (appId: string) => {
            const icon = desktopIcons.find((i) => i.id === appId);
            if (!icon) return;
            const existing = windows.find((w) => w.id === appId);
            if (existing) {
                if (existing.minimized) {
                    openWindow({
                        id: appId,
                        title: icon.name,
                        icon: icon.icon,
                        x: existing.x,
                        y: existing.y,
                        width: existing.width,
                        height: existing.height,
                    });
                } else {
                    focusWindow(appId);
                }
                return;
            }
            const offset = windows.length * 30;
            openWindow({
                id: appId,
                title: icon.name,
                icon: icon.icon,
                x: 180 + offset,
                y: 50 + offset,
                width: appId === 'terminal' ? 750 : appId === 'files' ? 850 : 650,
                height: appId === 'terminal' ? 480 : 520,
            });
        },
        [openWindow, focusWindow, windows]
    );

    useEffect(() => {
        if (!initialized) {
            setInitialized(true);
            setTimeout(() => handleOpen('terminal'), 600);
            setTimeout(() => handleOpen('editor'), 1000);
        }
    }, [initialized, handleOpen]);

    useEffect(() => {
        const resetTimer = () => {
            setLastActivity(Date.now());
            if (showScreensaver) setShowScreensaver(false);
        };
        const checkIdle = () => {
            if (!showScreensaver && Date.now() - lastActivity > SCREENSAVER_TIMEOUT) {
                setShowScreensaver(true);
            }
        };
        const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
        events.forEach((e) => window.addEventListener(e, resetTimer));
        const interval = setInterval(checkIdle, 1000);
        return () => {
            events.forEach((e) => window.removeEventListener(e, resetTimer));
            clearInterval(interval);
        };
    }, [lastActivity, showScreensaver]);

    return (
        <>
            {/* 1. Desktop background — z-index 1 */}
            <div
                className="fixed"
                style={{
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: '40px',
                    backgroundColor: '#050505',
                    zIndex: 1,
                }}
            >
                <Wallpaper />
                <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{ opacity: 0.08 }}
                >
                    <pre
                        className="ascii-art hidden sm:block"
                        style={{
                            color: 'var(--color-primary)',
                            fontSize: 'clamp(6px, 1.2vw, 14px)',
                            lineHeight: '1.1',
                            letterSpacing: '2px',
                            textShadow:
                                '0 0 20px var(--color-primary-glow-strong), 0 0 40px var(--color-primary-glow)',
                        }}
                    >
                        {`
██╗  ██╗ █████╗ ███╗   ███╗██████╗  ██████╗ ███████╗████████╗ ██████╗ 
██║  ██║██╔══██╗████╗ ████║██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝██╔═══██╗
███████║███████║██╔████╔██║██████╔╝██║   ██║███████╗   ██║   ██║   ██║
██╔══██║██╔══██║██║╚██╔╝██║██╔══██╗██║   ██║╚════██║   ██║   ██║   ██║
██║  ██║██║  ██║██║ ╚═╝ ██║██████╔╝╚██████╔╝███████║   ██║   ╚██████╔╝
╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚═════╝  ╚═════╝ ╚══════╝   ╚═╝    ╚═════╝ 
`}
                    </pre>
                </div>
            </div>

            {/* 2. Desktop icons — z-index 10 */}
            <div className="fixed top-4 left-4 flex flex-col gap-1" style={{ zIndex: 10 }}>
                {desktopIcons.map((icon) => (
                    <div key={icon.id} className="desktop-icon" onClick={() => handleOpen(icon.id)}>
                        <i
                            className={`${icon.icon} text-2xl`}
                            style={{
                                color: 'var(--color-primary)',
                                filter: 'drop-shadow(0 0 4px var(--color-primary-glow-strong))',
                            }}
                        />
                        <span className="desktop-icon-label">{icon.name}</span>
                    </div>
                ))}
            </div>

            {/* 3. Windows — z-index 100+, rendered at root level */}
            <WindowRenderer githubData={githubData} />

            {showScreensaver && <MatrixScreensaver onWake={() => setShowScreensaver(false)} />}
        </>
    );
};

const WindowRenderer: React.FC<{ githubData: GitHubData | null }> = ({ githubData }) => {
    const { windows } = useWindowManager();
    const user = githubData?.user ?? null;

    return (
        <>
            {windows.map((win) => (
                <DraggableWindow key={win.id} windowId={win.id} title={win.title} icon={win.icon}>
                    {win.id === 'terminal' && <TerminalApp githubData={githubData} />}
                    {win.id === 'files' && <FileManagerApp githubData={githubData} />}
                    {win.id === 'editor' && <TextEditorApp user={user} />}
                    {win.id === 'monitor' && <SystemMonitorApp />}
                    {win.id === 'network' && <NetworkManagerApp />}
                    {win.id === 'mail' && <MailClientApp />}
                    {win.id === 'settings' && <SettingsApp />}
                </DraggableWindow>
            ))}
        </>
    );
};

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
import type { GitHubData } from '../../types/github';
import { TerminalApp } from '../apps/TerminalApp';
import { FileManagerApp } from '../apps/FileManagerApp';
import { TextEditorApp } from '../apps/TextEditorApp';
import { MailClientApp } from '../apps/MailClientApp';
import { SettingsApp } from '../apps/SettingsApp';
import { DraggableWindow } from './DraggableWindow';
import { MatrixScreensaver } from './MatrixScreensaver';
import { Wallpaper } from './Wallpaper';
import { ContextMenu } from './ContextMenu';
import { SpotlightSearch } from './SpotlightSearch';
import { NotificationToast, pushNotification } from './NotificationToast';
import { ShortcutsModal } from './ShortcutsModal';

interface DesktopProps {
    githubData: GitHubData | null;
}

const desktopIcons = [
    { id: 'editor', name: 'About Me', icon: 'fa-solid fa-user' },
    { id: 'files', name: 'Projects', icon: 'fa-solid fa-folder-open' },
    { id: 'terminal', name: 'Terminal', icon: 'fa-solid fa-terminal' },
    { id: 'mail', name: 'Contact', icon: 'fa-solid fa-envelope' },
    { id: 'settings', name: 'Settings', icon: 'fa-solid fa-gear' },
];

const KONAMI_CODE = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a',
];

export const Desktop: React.FC<DesktopProps> = ({ githubData }) => {
    const { openWindow, focusWindow, windows } = useWindowManager();
    const [initialized, setInitialized] = useState(false);
    const [showScreensaver, setShowScreensaver] = useState(false);
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
    const [showClock] = useState(true);
    const [konamiIndex, setKonamiIndex] = useState(0);
    const [matrixMode, setMatrixMode] = useState(false);
    const SCREENSAVER_TIMEOUT = useMemo(() => 5 * 60 * 1000, []);

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
            let width = 650;
            let height = 520;
            if (appId === 'terminal') {
                width = 750;
                height = 480;
            } else if (appId === 'files') {
                width = 850;
                height = 520;
            }
            openWindow({
                id: appId,
                title: icon.name,
                icon: icon.icon,
                x: 180 + offset,
                y: 50 + offset,
                width,
                height,
            });
        },
        [openWindow, focusWindow, windows]
    );

    const welcomeSent = useRef(false);
    const lastActivityRef = useRef(0);

    useEffect(() => {
        lastActivityRef.current = Date.now();
    }, []);

    useEffect(() => {
        if (!initialized) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setInitialized(true);
            setTimeout(() => handleOpen('editor'), 600);
            if (!welcomeSent.current) {
                welcomeSent.current = true;
                setTimeout(() => {
                    pushNotification({
                        title: 'Welcome!',
                        message: 'Portfolio OS v3.0.2 loaded. Right-click desktop for options.',
                        icon: 'fa-solid fa-terminal',
                        type: 'info',
                        duration: 5000,
                    });
                }, 2000);
            }
        }
    }, [initialized, handleOpen]);

    useEffect(() => {
        const resetTimer = () => {
            lastActivityRef.current = Date.now();
            if (showScreensaver) setShowScreensaver(false);
        };
        const checkIdle = () => {
            if (!showScreensaver && Date.now() - lastActivityRef.current > SCREENSAVER_TIMEOUT) {
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
    }, [showScreensaver, SCREENSAVER_TIMEOUT]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === KONAMI_CODE[konamiIndex]) {
                const next = konamiIndex + 1;
                if (next === KONAMI_CODE.length) {
                    pushNotification({
                        title: '🎮 Konami Code!',
                        message: 'You found the secret! +30 lives... just kidding. But nice!',
                        icon: 'fa-solid fa-gamepad',
                        type: 'success',
                        duration: 6000,
                    });
                    setKonamiIndex(0);
                } else {
                    setKonamiIndex(next);
                }
            } else {
                setKonamiIndex(0);
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [konamiIndex]);

    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            if ((e.target as HTMLElement).closest('.os-window, .taskbar, .start-menu')) return;
            e.preventDefault();
            setContextMenu({ x: e.clientX, y: e.clientY });
        };
        const handleClick = () => setContextMenu(null);
        window.addEventListener('contextmenu', handleContextMenu);
        window.addEventListener('click', handleClick);
        window.addEventListener('open-shortcuts', () => setContextMenu(null));
        return () => {
            window.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('click', handleClick);
            window.removeEventListener('open-shortcuts', () => {});
        };
    }, []);

    useEffect(() => {
        const handleToggleMatrix = () => setMatrixMode((prev) => !prev);
        window.addEventListener('toggle-matrix', handleToggleMatrix);
        return () => window.removeEventListener('toggle-matrix', handleToggleMatrix);
    }, []);

    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    return (
        <>
            {/* 1. Desktop background — z-index 1 */}
            <div
                className="fixed"
                style={{
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: '44px',
                    backgroundColor: 'var(--color-bg-dark)',
                    zIndex: 1,
                }}
            >
                <Wallpaper />
            </div>

            {/* 2. Desktop icons — z-index 10, hidden on mobile */}
            <div
                className="fixed top-4 left-4 flex flex-col gap-1 hidden sm:flex"
                style={{ zIndex: 10 }}
            >
                {desktopIcons.map((icon) => (
                    <div key={icon.id} className="desktop-icon" onClick={() => handleOpen(icon.id)}>
                        <i
                            className={`${icon.icon} text-2xl`}
                            style={{ color: 'var(--color-primary)' }}
                        />
                        <span className="desktop-icon-label">{icon.name}</span>
                    </div>
                ))}
            </div>

            {/* Mobile app launcher grid */}
            <div
                className="fixed inset-0 flex items-center justify-center sm:hidden p-4"
                style={{ zIndex: 5, bottom: '50px' }}
            >
                <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
                    {desktopIcons.map((icon) => (
                        <div
                            key={icon.id}
                            className="flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer active:scale-95 transition-transform"
                            style={{
                                backgroundColor: 'var(--color-primary-glow)',
                                border: '1px solid var(--color-border)',
                            }}
                            onClick={() => handleOpen(icon.id)}
                        >
                            <i
                                className={`${icon.icon} text-2xl`}
                                style={{ color: 'var(--color-primary)' }}
                            />
                            <span
                                className="text-[10px] font-medium text-center"
                                style={{ color: 'var(--color-text-dim)' }}
                            >
                                {icon.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Desktop clock widget */}
            {showClock && (
                <div
                    className="hidden md:block fixed right-4 top-4 px-5 py-3 glass-panel select-none"
                    style={{ zIndex: 10 }}
                >
                    <div
                        className="text-2xl font-semibold font-mono tracking-tight"
                        style={{ color: 'var(--color-text)' }}
                    >
                        {time.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </div>
                    <div
                        className="text-[11px] mt-1 font-medium"
                        style={{ color: 'var(--color-text-muted)' }}
                    >
                        {time.toLocaleDateString([], {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                        })}
                    </div>
                </div>
            )}

            {/* 4. Windows — z-index 100+, rendered at root level */}
            <WindowRenderer githubData={githubData} />

            {/* Context menu */}
            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onClose={() => setContextMenu(null)}
                    onOpenApp={handleOpen}
                />
            )}

            {/* Spotlight Search */}
            <SpotlightSearch />

            {/* Shortcuts Modal */}
            <ShortcutsModal />

            {/* Notification Toasts */}
            <NotificationToast />

            {/* Matrix screensaver */}
            {(showScreensaver || matrixMode) && (
                <MatrixScreensaver
                    onWake={() => {
                        setShowScreensaver(false);
                        setMatrixMode(false);
                    }}
                />
            )}
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
                    {win.id === 'mail' && <MailClientApp />}
                    {win.id === 'settings' && <SettingsApp />}
                </DraggableWindow>
            ))}
        </>
    );
};

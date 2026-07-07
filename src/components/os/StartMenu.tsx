import { useWindowManager } from '../../context/WindowManagerContext';
import type { GitHubData } from '../../types/github';
import { CONFIG } from '../../utils/config';
import { useRef, useCallback } from 'react';

interface StartMenuProps {
    onClose: () => void;
    githubData: GitHubData | null;
}

const apps: { id: string; name: string; icon: string; desc: string }[] = [
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

export const StartMenu: React.FC<StartMenuProps> = ({ onClose, githubData }) => {
    const { openWindow } = useWindowManager();
    const user = githubData?.user;
    const offsetRef = useRef({ x: 0, y: 0 });

    const handleOpen = useCallback(
        (appId: string) => {
            const app = apps.find((a) => a.id === appId);
            if (!app) return;
            offsetRef.current.x += 30;
            offsetRef.current.y += 20;
            openWindow({
                id: appId,
                title: app.name,
                icon: app.icon,
                x: 80 + (offsetRef.current.x % 200),
                y: 40 + (offsetRef.current.y % 150),
                width: appId === 'terminal' ? 700 : appId === 'files' ? 800 : 600,
                height: appId === 'terminal' ? 450 : 500,
            });
            onClose();
        },
        [openWindow, onClose]
    );

    return (
        <div className="start-menu" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="start-menu-header">
                {user?.avatar_url ? (
                    <img src={user.avatar_url} alt="" className="w-9 h-9 rounded-full" />
                ) : (
                    <div
                        className="w-9 h-9 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'var(--color-bg-light)' }}
                    >
                        <i
                            className="fas fa-user text-sm"
                            style={{ color: 'var(--color-text-muted)' }}
                        />
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                        {user?.name || CONFIG.personal.name}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        {CONFIG.personal.title}
                    </div>
                </div>
            </div>

            {/* App list */}
            <div className="py-1">
                {apps.map((app) => (
                    <div
                        key={app.id}
                        className="start-menu-item"
                        onClick={() => handleOpen(app.id)}
                    >
                        <i
                            className={`${app.icon} w-5 text-center`}
                            style={{ color: 'var(--color-primary)', fontSize: 13 }}
                        />
                        <div className="flex-1">
                            <div className="text-[13px] font-medium">{app.name}</div>
                            <div
                                className="text-[11px]"
                                style={{ color: 'var(--color-text-muted)' }}
                            >
                                {app.desc}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div
                className="px-4 py-2.5 flex items-center justify-between text-[11px]"
                style={{
                    borderTop: '1px solid var(--color-border)',
                    color: 'var(--color-text-muted)',
                }}
            >
                <span>Portfolio OS v3.1</span>
                <div
                    className="px-2.5 py-1 cursor-pointer rounded-md transition-colors"
                    style={{ backgroundColor: 'var(--color-primary-glow)' }}
                    onClick={() => {
                        window.open('https://github.com/hambosto', '_blank');
                        onClose();
                    }}
                    onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLElement).style.backgroundColor =
                            'var(--color-primary-glow-strong)')
                    }
                    onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.backgroundColor =
                            'var(--color-primary-glow)')
                    }
                >
                    <i className="fab fa-github mr-1" style={{ color: 'var(--color-primary)' }} />
                    GitHub
                </div>
            </div>
        </div>
    );
};

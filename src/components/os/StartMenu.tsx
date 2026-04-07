import { useWindowManager } from '../../context/WindowManagerContext';
import type { GitHubData } from '../../types/github';
import { CONFIG } from '../../utils/config';

interface StartMenuProps {
    onClose: () => void;
    githubData: GitHubData | null;
}

const apps: { id: string; name: string; icon: string; desc: string }[] = [
    { id: 'terminal', name: 'Terminal', icon: 'fa-solid fa-terminal', desc: 'Command line interface' },
    { id: 'files', name: 'File Manager', icon: 'fa-solid fa-folder-open', desc: 'Browse projects' },
    { id: 'editor', name: 'Text Editor', icon: 'fa-solid fa-file-lines', desc: 'About me' },
    { id: 'monitor', name: 'System Monitor', icon: 'fa-solid fa-chart-bar', desc: 'Skills & technologies' },
    { id: 'network', name: 'Network Manager', icon: 'fa-solid fa-globe', desc: 'Social connections' },
    { id: 'mail', name: 'Mail Client', icon: 'fa-solid fa-envelope', desc: 'Send a message' },
    { id: 'settings', name: 'Settings', icon: 'fa-solid fa-gear', desc: 'Appearance & themes' },
    { id: 'tetris', name: 'Tetris', icon: 'fa-solid fa-gamepad', desc: 'Classic block puzzle' },
    { id: 'snake', name: 'Snake', icon: 'fa-solid fa-worm', desc: 'Retro snake game' },
    { id: 'flappy', name: 'Flappy Bird', icon: 'fa-solid fa-dove', desc: 'Tap to fly through pipes' },
];

export const StartMenu: React.FC<StartMenuProps> = ({ onClose, githubData }) => {
    const { openWindow } = useWindowManager();
    const user = githubData?.user;

    const handleOpen = (appId: string) => {
        const app = apps.find((a) => a.id === appId);
        if (!app) return;
        openWindow({
            id: appId,
            title: app.name,
            icon: app.icon,
            x: 80 + Math.random() * 200,
            y: 40 + Math.random() * 100,
            width: appId === 'terminal' ? 700 : appId === 'files' ? 800 : 600,
            height: appId === 'terminal' ? 450 : 500,
        });
        onClose();
    };

    return (
        <div
            className="start-menu"
            onClick={(e) => e.stopPropagation()}
            style={{
                backgroundColor: '#0a0a0a',
                borderColor: 'var(--color-border)',
                boxShadow: '0 -4px 24px rgba(0,0,0,0.8), 0 0 1px var(--color-primary-dark)',
            }}
        >
            {/* Header */}
            <div
                className="start-menu-header"
                style={{
                    borderBottomColor: 'var(--color-border)',
                    backgroundColor: '#111111',
                }}
            >
                {user?.avatar_url ? (
                    <img
                        src={user.avatar_url}
                        alt=""
                        className="w-10 h-10 rounded-sm"
                        style={{ border: '2px solid var(--color-primary-dark)' }}
                    />
                ) : (
                    <div
                        className="w-10 h-10 rounded-sm flex items-center justify-center text-lg"
                        style={{
                            backgroundColor: '#0a0a0a',
                            border: '2px solid var(--color-border-active)',
                        }}
                    >
                        <i className="fas fa-user" style={{ color: 'var(--color-text-dim)' }} />
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <div
                        className="text-sm font-bold"
                        style={{ color: 'var(--color-text)', wordBreak: 'break-word' }}
                    >
                        {user?.name || CONFIG.personal.name}
                    </div>
                    <div
                        className="text-xs"
                        style={{ color: 'var(--color-text-dim)', wordBreak: 'break-word' }}
                    >
                        {user?.bio || CONFIG.personal.title}
                    </div>
                </div>
                {/* Stats */}
                <div className="text-right text-xs" style={{ color: 'var(--color-text-dim)' }}>
                    <div>
                        <span style={{ color: 'var(--color-primary)' }}>
                            {user?.public_repos ?? 0}
                        </span>{' '}
                        repos
                    </div>
                    <div>
                        <span style={{ color: 'var(--color-primary)' }}>
                            {user?.followers ?? 0}
                        </span>{' '}
                        followers
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
                        style={{ color: 'var(--color-text-dim)' }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-primary-glow)';
                            e.currentTarget.style.color = 'var(--color-text)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = 'var(--color-text-dim)';
                        }}
                    >
                        <i
                            className={`${app.icon} text-base w-5 text-center`}
                            style={{ color: 'var(--color-primary)' }}
                        />
                        <div className="flex-1">
                            <div className="text-sm">{app.name}</div>
                            <div className="text-xs" style={{ color: 'var(--color-text-dim)' }}>
                                {app.desc}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div
                className="px-4 py-3 flex items-center justify-between text-xs"
                style={{
                    borderTop: '1px solid var(--color-border)',
                    color: 'var(--color-text-dim)',
                    backgroundColor: '#111111',
                }}
            >
                <span>Portfolio OS v3.0.2</span>
                <div
                    className="px-3 py-1 cursor-pointer rounded-sm"
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

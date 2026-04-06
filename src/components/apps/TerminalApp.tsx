import {
    useState,
    useRef,
    useEffect,
    useCallback,
    type FormEvent,
    type KeyboardEvent,
} from 'react';
import { CONFIG } from '../../utils/config';
import { formatUptime } from '../../lib/utils';
import type { GitHubData } from '../../types/github';

interface TerminalLine {
    type: 'input' | 'output' | 'error' | 'system' | 'success';
    content: string;
}

interface TerminalAppProps {
    githubData: GitHubData | null;
}

const COMMANDS = [
    'help',
    'whoami',
    'neofetch',
    'ls',
    'cat',
    'pwd',
    'uptime',
    'skills',
    'projects',
    'social',
    'contact',
    'clear',
    'exit',
    'tree',
    'echo',
    'date',
    'uname',
    'free',
    'df',
    'top',
    'fortune',
    'cowsay',
    'matrix',
    'theme',
    'open',
];

export const TerminalApp: React.FC<TerminalAppProps> = ({ githubData }) => {
    const [lines, setLines] = useState<TerminalLine[]>([]);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>([]);
    const [historyIdx, setHistoryIdx] = useState(-1);
    const [uptime] = useState(() => Math.floor(Math.random() * 86400));
    const cwd = '/home/guest';
    const endRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView();
    }, [lines]);

    const addLine = useCallback((type: TerminalLine['type'], content: string) => {
        setLines((prev) => [...prev, { type, content }]);
    }, []);

    const addLines = useCallback((lines: { type: TerminalLine['type']; content: string }[]) => {
        setLines((prev) => [...prev, ...lines]);
    }, []);

    const processCommand = useCallback(
        (cmd: string) => {
            const trimmed = cmd.trim();
            if (!trimmed) return;
            const parts = trimmed.split(/\s+/);
            const command = parts[0]?.toLowerCase();
            const args = parts.slice(1);

            addLine('input', `${cwd}$ ${trimmed}`);

            switch (command) {
                case 'help':
                    addLines([
                        {
                            type: 'success',
                            content: '╭──────────────────────────────────────────────╮',
                        },
                        {
                            type: 'success',
                            content: '│          Portfolio OS — Help Menu            │',
                        },
                        {
                            type: 'success',
                            content: '├──────────────────────────────────────────────┤',
                        },
                        {
                            type: 'output',
                            content: '│  whoami      - Display user info              │',
                        },
                        {
                            type: 'output',
                            content: '│  neofetch    - System info with ASCII art     │',
                        },
                        {
                            type: 'output',
                            content: '│  ls [dir]    - List files/directories         │',
                        },
                        {
                            type: 'output',
                            content: '│  cat <file>  - Read file contents             │',
                        },
                        {
                            type: 'output',
                            content: '│  tree        - Directory tree view            │',
                        },
                        {
                            type: 'output',
                            content: '│  skills      - Show skills with progress bars │',
                        },
                        {
                            type: 'output',
                            content: '│  projects    - List GitHub repositories       │',
                        },
                        {
                            type: 'output',
                            content: '│  social      - Show social links              │',
                        },
                        {
                            type: 'output',
                            content: '│  contact     - Show contact information       │',
                        },
                        {
                            type: 'output',
                            content: '│  open <app>  - Launch an application          │',
                        },
                        {
                            type: 'output',
                            content: '│  theme <n>   - Change theme (0-4)             │',
                        },
                        {
                            type: 'output',
                            content: '│  echo <text> - Print text                     │',
                        },
                        {
                            type: 'output',
                            content: '│  date        - Show current date/time         │',
                        },
                        {
                            type: 'output',
                            content: '│  uname       - System information             │',
                        },
                        {
                            type: 'output',
                            content: '│  fortune     - Random fortune                 │',
                        },
                        {
                            type: 'output',
                            content: '│  cowsay      - Cow says your message          │',
                        },
                        {
                            type: 'output',
                            content: '│  matrix      - Toggle matrix rain             │',
                        },
                        {
                            type: 'output',
                            content: '│  clear       - Clear terminal                 │',
                        },
                        {
                            type: 'output',
                            content: '│  exit        - Close terminal                 │',
                        },
                        {
                            type: 'success',
                            content: '╰──────────────────────────────────────────────╯',
                        },
                    ]);
                    break;

                case 'whoami':
                    addLines([
                        { type: 'output', content: '' },
                        { type: 'success', content: `  ${CONFIG.personal.name}` },
                        { type: 'output', content: `  ${CONFIG.personal.title}` },
                        { type: 'output', content: `  ${CONFIG.personal.bio}` },
                        { type: 'output', content: '' },
                        { type: 'output', content: `  Email:    ${CONFIG.personal.email}` },
                        { type: 'output', content: `  GitHub:   ${CONFIG.social.github}` },
                        { type: 'output', content: `  LinkedIn: ${CONFIG.social.linkedin}` },
                    ]);
                    break;

                case 'neofetch': {
                    const user = githubData?.user;
                    const topLangs = Object.entries(githubData?.languageStats ?? {})
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 5)
                        .map(([lang]) => lang)
                        .join(', ');
                    addLines([
                        { type: 'output', content: '' },
                        {
                            type: 'success',
                            content: '  ╔══════════════════════════════════════════╗',
                        },
                        {
                            type: 'success',
                            content: '  ║          Portfolio OS v3.0.2             ║',
                        },
                        {
                            type: 'success',
                            content: '  ╠══════════════════════════════════════════╣',
                        },
                        {
                            type: 'output',
                            content: `  ║  OS:       Portfolio OS v3.0.2 x86_64      ║`,
                        },
                        {
                            type: 'output',
                            content: `  ║  Host:     ${user?.name || CONFIG.personal.name}${' '.repeat(Math.max(0, 34 - (user?.name || CONFIG.personal.name).length))}║`,
                        },
                        {
                            type: 'output',
                            content: `  ║  Role:     ${CONFIG.personal.title}${' '.repeat(Math.max(0, 34 - CONFIG.personal.title.length))}║`,
                        },
                        {
                            type: 'output',
                            content: `  ║  Shell:    /bin/zsh                          ║`,
                        },
                        {
                            type: 'output',
                            content: `  ║  Repos:    ${user?.public_repos ?? 0}${' '.repeat(Math.max(0, 34 - String(user?.public_repos ?? 0).length))}║`,
                        },
                        {
                            type: 'output',
                            content: `  ║  Stars:    ${githubData?.totalStars ?? 0}${' '.repeat(Math.max(0, 34 - String(githubData?.totalStars ?? 0).length))}║`,
                        },
                        {
                            type: 'output',
                            content: `  ║  Langs:    ${topLangs || 'N/A'}${' '.repeat(Math.max(0, 34 - (topLangs || 'N/A').length))}║`,
                        },
                        {
                            type: 'output',
                            content: `  ║  Uptime:   ${formatUptime(uptime)}                           ║`,
                        },
                        {
                            type: 'success',
                            content: '  ╚══════════════════════════════════════════╝',
                        },
                    ]);
                    break;
                }

                case 'ls': {
                    const dir = args[0];
                    if (!dir || dir === '~' || dir === '/home/guest') {
                        addLine(
                            'output',
                            '  about.md  skills/  projects/  experience.log  social/  contact.cfg  settings.conf'
                        );
                    } else if (dir === 'projects' || dir === './projects') {
                        const repos = githubData?.repos ?? [];
                        repos.forEach((r) => {
                            const star = r.stargazers_count > 0 ? ` ★${r.stargazers_count}` : '';
                            const lang = r.language ? ` (${r.language})` : '';
                            addLine('output', `  [DIR] ${r.name}${lang}${star}`);
                        });
                        addLine('output', `\n  ${repos.length} directories`);
                    } else if (dir === 'skills' || dir === './skills') {
                        Object.entries(CONFIG.customSkills).forEach(([cat, skills]) => {
                            addLine('output', `  [DIR] ${cat}/ (${skills.length} items)`);
                        });
                    } else if (dir === 'social' || dir === './social') {
                        addLine('output', '  github.link  linkedin.link  twitter.link  email.cfg');
                    } else {
                        addLine('error', `ls: cannot access '${dir}': No such file or directory`);
                    }
                    break;
                }

                case 'tree': {
                    addLines([
                        { type: 'output', content: '.' },
                        { type: 'output', content: '├── about.md' },
                        { type: 'output', content: '├── experience.log' },
                        { type: 'output', content: '├── skills/' },
                    ]);
                    Object.entries(CONFIG.customSkills).forEach(([cat, skills]) => {
                        addLine('output', `│   └── ${cat}/ (${skills.length})`);
                    });
                    addLine('output', '├── projects/');
                    (githubData?.repos ?? []).slice(0, 8).forEach((r) => {
                        addLine('output', `│   ├── ${r.name}/`);
                    });
                    addLine('output', '├── social/');
                    addLine('output', '│   ├── github.link');
                    addLine('output', '│   ├── linkedin.link');
                    addLine('output', '│   └── twitter.link');
                    addLine('output', '├── contact.cfg');
                    addLine('output', '└── settings.conf');
                    break;
                }

                case 'cat': {
                    const file = args[0];
                    if (file === 'about.md') {
                        addLines([
                            { type: 'output', content: `# ${CONFIG.personal.name}` },
                            { type: 'output', content: `## ${CONFIG.personal.title}` },
                            { type: 'output', content: '' },
                            { type: 'output', content: CONFIG.personal.bio },
                        ]);
                    } else if (file === 'experience.log') {
                        CONFIG.workExperience.forEach((exp) => {
                            addLine(
                                'output',
                                `[${exp.startDate} – ${exp.endDate || 'PRESENT'}] ${exp.position} @ ${exp.company}`
                            );
                            exp.achievements?.forEach((a) => addLine('output', `  ✓ ${a}`));
                            addLine('output', '');
                        });
                    } else if (file === 'contact.cfg') {
                        addLines([
                            { type: 'output', content: `[contact]` },
                            { type: 'output', content: `email=${CONFIG.personal.email}` },
                            { type: 'output', content: `github=${CONFIG.social.github}` },
                            { type: 'output', content: `linkedin=${CONFIG.social.linkedin}` },
                        ]);
                    } else if (file === 'settings.conf') {
                        addLines([
                            { type: 'output', content: `[settings]` },
                            { type: 'output', content: `theme=green` },
                            { type: 'output', content: `font=Fira Code` },
                            { type: 'output', content: `fontSize=13` },
                            { type: 'output', content: `crt=true` },
                        ]);
                    } else {
                        addLine('error', `cat: ${file}: No such file or directory`);
                    }
                    break;
                }

                case 'pwd':
                    addLine('output', cwd);
                    break;

                case 'uptime':
                    addLine(
                        'output',
                        ` ${new Date().toLocaleTimeString()} up ${formatUptime(uptime)}, 1 user, load average: 0.42, 0.38, 0.35`
                    );
                    break;

                case 'skills': {
                    Object.entries(CONFIG.customSkills).forEach(([cat, skills]) => {
                        addLine('output', '');
                        addLine('output', `  [${cat.toUpperCase()}]`);
                        skills.forEach((s) => {
                            const filled = Math.floor(s.level / 5);
                            const empty = 20 - filled;
                            const bar = '█'.repeat(filled) + '░'.repeat(empty);
                            addLine('output', `  ${s.name.padEnd(28)} [${bar}] ${s.level}%`);
                        });
                    });
                    break;
                }

                case 'projects': {
                    const repos = githubData?.repos ?? [];
                    const sorted = [...repos].sort(
                        (a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0)
                    );
                    sorted.slice(0, 20).forEach((r) => {
                        const stars = r.stargazers_count > 0 ? ` ★${r.stargazers_count}` : '';
                        const lang = r.language ? ` ${r.language}` : '';
                        addLine('output', `  ${r.name}${lang}${stars}`);
                    });
                    if (sorted.length > 20)
                        addLine('output', `  ... and ${sorted.length - 20} more`);
                    addLine('output', `\n  Total: ${sorted.length} repositories`);
                    break;
                }

                case 'social':
                    addLines([
                        { type: 'output', content: '' },
                        { type: 'output', content: '  Social Connections:' },
                        {
                            type: 'output',
                            content: `  ┌──────────┬─────────────────────────────────────┐`,
                        },
                        {
                            type: 'output',
                            content: `  │ GitHub   │ ${CONFIG.social.github?.padEnd(38)}│`,
                        },
                        {
                            type: 'output',
                            content: `  │ LinkedIn │ ${CONFIG.social.linkedin?.padEnd(38)}│`,
                        },
                        {
                            type: 'output',
                            content: `  │ Twitter  │ ${CONFIG.social.twitter?.padEnd(38)}│`,
                        },
                        {
                            type: 'output',
                            content: `  │ Email    │ ${CONFIG.social.email.padEnd(38)}│`,
                        },
                        {
                            type: 'output',
                            content: `  └──────────┴─────────────────────────────────────┘`,
                        },
                    ]);
                    break;

                case 'contact':
                    addLines([
                        { type: 'output', content: '' },
                        { type: 'success', content: '  ┌─────────────────────────────────────┐' },
                        { type: 'success', content: '  │         Contact Information         │' },
                        { type: 'success', content: '  ├─────────────────────────────────────┤' },
                        {
                            type: 'output',
                            content: `  │  Email:    ${CONFIG.personal.email}${' '.repeat(Math.max(0, 28 - CONFIG.personal.email.length))}│`,
                        },
                        {
                            type: 'output',
                            content: `  │  GitHub:   github.com/hambosto${' '.repeat(Math.max(0, 28 - 21))}│`,
                        },
                        {
                            type: 'output',
                            content: `  │  LinkedIn: linkedin.com/in/hambosto${' '.repeat(Math.max(0, 28 - 26))}│`,
                        },
                        { type: 'success', content: '  └─────────────────────────────────────┘' },
                        {
                            type: 'output',
                            content: '  Open the Mail Client app to send a message.',
                        },
                    ]);
                    break;

                case 'open': {
                    const app = args[0]?.toLowerCase();
                    const appMap: Record<string, string> = {
                        terminal: 'terminal',
                        files: 'files',
                        filemanager: 'files',
                        editor: 'editor',
                        about: 'editor',
                        monitor: 'monitor',
                        skills: 'monitor',
                        network: 'network',
                        social: 'network',
                        mail: 'mail',
                        contact: 'mail',
                        settings: 'settings',
                    };
                    if (app && appMap[app]) {
                        addLine('success', `  Launching ${appMap[app]}...`);
                    } else {
                        addLine(
                            'error',
                            `  Available apps: terminal, files, editor, monitor, network, mail, settings`
                        );
                    }
                    break;
                }

                case 'theme': {
                    const themes = ['green', 'amber', 'cyan', 'white', 'purple'];
                    if (args[0] && themes.includes(args[0])) {
                        addLine(
                            'success',
                            `  Theme changed to ${args[0]}. Open Settings to apply.`
                        );
                    } else {
                        addLine(
                            'output',
                            `  Available themes: ${themes.map((t, i) => `${i}=${t}`).join(', ')}`
                        );
                    }
                    break;
                }

                case 'echo':
                    addLine('output', args.join(' '));
                    break;

                case 'date':
                    addLine('output', `  ${new Date().toString()}`);
                    break;

                case 'uname':
                    addLine(
                        'output',
                        '  PortfolioOS 3.0.2 portfolio-guest x86_64 React/TypeScript'
                    );
                    break;

                case 'free':
                    addLines([
                        { type: 'output', content: '              total        used        free' },
                        {
                            type: 'output',
                            content: `  Mem:       65536       ${Math.floor(Math.random() * 30000 + 20000)}       ${Math.floor(Math.random() * 20000 + 10000)}`,
                        },
                        {
                            type: 'output',
                            content: `  Swap:      16384       ${Math.floor(Math.random() * 2000)}       ${Math.floor(Math.random() * 14000 + 14000)}`,
                        },
                    ]);
                    break;

                case 'df':
                    addLines([
                        { type: 'output', content: '  Filesystem     Size   Used  Avail  Use%' },
                        {
                            type: 'output',
                            content: `  /dev/sda1      500G   ${Math.floor(Math.random() * 200 + 100)}G   ${Math.floor(Math.random() * 200 + 100)}G   ${Math.floor(Math.random() * 40 + 20)}%`,
                        },
                        {
                            type: 'output',
                            content: `  /dev/sda2      100G   ${Math.floor(Math.random() * 50 + 10)}G   ${Math.floor(Math.random() * 50 + 30)}G   ${Math.floor(Math.random() * 30 + 10)}%`,
                        },
                    ]);
                    break;

                case 'top':
                    addLines([
                        {
                            type: 'output',
                            content: `  PID  USER     PRI  NI   VIRT   RES   CPU%  MEM%   TIME+  COMMAND`,
                        },
                        {
                            type: 'output',
                            content: `  1    root      20   0  2.1g  412m   2.3   0.6   12:34  portfolio-os`,
                        },
                        {
                            type: 'output',
                            content: `  42   guest     20   0  1.4g  256m   1.8   0.4    8:21  react-app`,
                        },
                        {
                            type: 'output',
                            content: `  99   guest     20   0  512m   64m   0.5   0.1    2:15  vite-dev`,
                        },
                    ]);
                    break;

                case 'fortune': {
                    const fortunes = [
                        'The best way to predict the future is to invent it.',
                        'Talk is cheap. Show me the code. — Linus Torvalds',
                        'First, solve the problem. Then, write the code.',
                        "Code is like humor. When you have to explain it, it's bad.",
                        'Simplicity is the soul of efficiency.',
                        'The most disastrous thing you can ever learn is your first programming language.',
                        'Measuring programming progress by lines of code is like measuring aircraft building progress by weight.',
                    ];
                    addLine(
                        'output',
                        `  "${fortunes[Math.floor(Math.random() * fortunes.length)]}"`
                    );
                    break;
                }

                case 'cowsay': {
                    const msg = args.length > 0 ? args.join(' ') : 'Moo!';
                    const border = '─'.repeat(msg.length + 2);
                    addLines([
                        { type: 'output', content: `  ┌${border}┐` },
                        { type: 'output', content: `  │ ${msg} │` },
                        { type: 'output', content: `  └${border}┘` },
                        { type: 'output', content: `         \\   ^__^` },
                        { type: 'output', content: `          \\  (oo)\\_______` },
                        { type: 'output', content: `             (__)\\       )\\/\\` },
                        { type: 'output', content: `                 ||----w |` },
                        { type: 'output', content: `                 ||     ||` },
                    ]);
                    break;
                }

                case 'matrix':
                    addLine(
                        'success',
                        '  Wake up, Neo... The Matrix has you... Follow the white rabbit.'
                    );
                    break;

                case 'clear':
                    setLines([]);
                    break;

                case 'exit':
                    addLine('system', '  Goodbye!');
                    break;

                default:
                    addLine(
                        'error',
                        `  command not found: ${command}. Type 'help' for available commands.`
                    );
            }
        },
        [addLine, addLines, cwd, githubData, uptime]
    );

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            setHistory((prev) => [input, ...prev]);
            setHistoryIdx(-1);
            processCommand(input);
            setInput('');
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIdx < history.length - 1) {
                const ni = historyIdx + 1;
                setHistoryIdx(ni);
                setInput(history[ni]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIdx > 0) {
                const ni = historyIdx - 1;
                setHistoryIdx(ni);
                setInput(history[ni]);
            } else {
                setHistoryIdx(-1);
                setInput('');
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const partial = input.toLowerCase();
            const matches = COMMANDS.filter((c) => c.startsWith(partial));
            if (matches.length === 1) setInput(matches[0]);
            else if (matches.length > 1) addLine('output', `  ${matches.join('  ')}`);
        }
    };

    const lineStyle = (type: string): React.CSSProperties => {
        switch (type) {
            case 'input':
                return { color: 'var(--color-text)' };
            case 'error':
                return { color: 'var(--color-error)' };
            case 'success':
                return { color: 'var(--color-primary)' };
            case 'system':
                return { color: 'var(--color-text-dim)' };
            default:
                return { color: 'var(--color-text-dim)' };
        }
    };

    return (
        <div
            className="h-full flex flex-col p-3 font-mono text-xs sm:text-sm"
            style={{ backgroundColor: '#0a0a0a' }}
            onClick={() => inputRef.current?.focus()}
        >
            {/* Terminal header */}
            <div
                className="flex items-center justify-between px-2 py-1 mb-2 text-xs"
                style={{
                    borderBottom: '1px solid var(--color-border)',
                    color: 'var(--color-text-dim)',
                }}
            >
                <span>
                    <i className="fas fa-terminal mr-1" style={{ color: 'var(--color-primary)' }} />
                    guest@portfolio
                </span>
                <span>{cwd}</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-0.5">
                {lines.map((line, i) => (
                    <div
                        key={i}
                        style={lineStyle(line.type)}
                        className="whitespace-pre-wrap leading-relaxed"
                    >
                        {line.content}
                    </div>
                ))}
                <div ref={endRef} />
            </div>

            <form
                onSubmit={handleSubmit}
                className="flex items-center mt-2 pt-2"
                style={{ borderTop: '1px solid var(--color-border)' }}
            >
                <span
                    style={{ color: 'var(--color-primary)' }}
                    className="mr-2 whitespace-nowrap font-bold"
                >
                    ❯
                </span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1"
                    style={{
                        caretColor: 'var(--color-primary)',
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: 'var(--color-text)',
                        fontFamily: "'Fira Code', monospace",
                        fontSize: '13px',
                    }}
                    autoFocus
                    spellCheck={false}
                    autoComplete="off"
                    placeholder="Type a command..."
                />
            </form>
        </div>
    );
};

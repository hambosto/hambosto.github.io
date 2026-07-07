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
import Table from 'cli-table3';

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

const makeTable = (opts: {
    head?: string[];
    colWidths?: number[];
    rows: string[][];
    style?: Record<string, string>;
}): string => {
    const t = new Table({
        head: opts.head,
        colWidths: opts.colWidths,
        style: opts.style || { head: [], border: [] },
        chars: {
            top: '─',
            'top-mid': '┬',
            'top-left': '╭',
            'top-right': '╮',
            bottom: '─',
            'bottom-mid': '┴',
            'bottom-left': '╰',
            'bottom-right': '╯',
            left: '│',
            'left-mid': '├',
            mid: '─',
            'mid-mid': '┼',
            right: '│',
            'right-mid': '┤',
            middle: '│',
        },
    });
    opts.rows.forEach((r) => t.push(r));
    return t.toString();
};

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

    const addLines = useCallback((ls: { type: TerminalLine['type']; content: string }[]) => {
        setLines((prev) => [...prev, ...ls]);
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
                case 'help': {
                    const table = makeTable({
                        colWidths: [16, 40],
                        rows: [
                            ['whoami', 'Display user information'],
                            ['neofetch', 'System info with ASCII art'],
                            ['ls [dir]', 'List files/directories'],
                            ['cat <file>', 'Read file contents'],
                            ['tree', 'Directory tree view'],
                            ['skills', 'Show skills with progress bars'],
                            ['projects', 'List GitHub repositories'],
                            ['social', 'Show social links'],
                            ['contact', 'Show contact information'],
                            ['open <app>', 'Launch an application'],
                            ['theme <name>', 'Change theme'],
                            ['echo <text>', 'Print text'],
                            ['date', 'Show current date/time'],
                            ['uname', 'System information'],
                            ['fortune', 'Random fortune'],
                            ['cowsay', 'Cow says your message'],
                            ['matrix', 'Toggle matrix rain'],
                            ['clear', 'Clear terminal'],
                            ['exit', 'Close terminal'],
                        ],
                    });
                    addLines([
                        { type: 'success', content: '' },
                        { type: 'success', content: '  Portfolio OS — Help Menu' },
                        { type: 'output', content: table },
                        { type: 'success', content: '' },
                    ]);
                    break;
                }

                case 'whoami': {
                    const table = makeTable({
                        colWidths: [14, 44],
                        rows: [
                            ['Name', CONFIG.personal.name],
                            ['Title', CONFIG.personal.title],
                            ['Email', CONFIG.personal.email],
                            ['GitHub', CONFIG.social.github || ''],
                            ['LinkedIn', CONFIG.social.linkedin || ''],
                            ['Bio', CONFIG.personal.bio],
                        ],
                    });
                    addLines([
                        { type: 'output', content: '' },
                        { type: 'output', content: table },
                        { type: 'output', content: '' },
                    ]);
                    break;
                }

                case 'neofetch': {
                    const user = githubData?.user;
                    const topLangs = Object.entries(githubData?.languageStats ?? {})
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 5)
                        .map(([lang]) => lang)
                        .join(', ');
                    const table = makeTable({
                        colWidths: [14, 44],
                        rows: [
                            ['OS', 'Portfolio OS v3.1 x86_64'],
                            ['Host', user?.name || CONFIG.personal.name],
                            ['Role', CONFIG.personal.title],
                            ['Shell', '/bin/zsh'],
                            ['Repos', String(user?.public_repos ?? 0)],
                            ['Stars', String(githubData?.totalStars ?? 0)],
                            ['Langs', topLangs || 'N/A'],
                            ['Uptime', formatUptime(uptime)],
                        ],
                    });
                    addLines([
                        { type: 'output', content: '' },
                        { type: 'output', content: table },
                        { type: 'output', content: '' },
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
                        const table = makeTable({
                            head: ['Name', 'Language', 'Stars'],
                            colWidths: [30, 16, 10],
                            rows: repos.map((r) => [
                                r.name,
                                r.language || '—',
                                r.stargazers_count > 0 ? `★ ${r.stargazers_count}` : '—',
                            ]),
                        });
                        addLines([
                            { type: 'output', content: '' },
                            { type: 'output', content: table },
                            { type: 'output', content: `\n  ${repos.length} directories` },
                        ]);
                    } else if (dir === 'skills' || dir === './skills') {
                        const rows = Object.entries(CONFIG.customSkills).map(([cat, skills]) => [
                            cat,
                            `${skills.length} skills`,
                        ]);
                        const table = makeTable({
                            head: ['Category', 'Count'],
                            colWidths: [30, 26],
                            rows,
                        });
                        addLines([
                            { type: 'output', content: '' },
                            { type: 'output', content: table },
                        ]);
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
                            { type: 'output', content: `theme=cyan` },
                            { type: 'output', content: `font=Inter + Fira Code` },
                            { type: 'output', content: `fontSize=13` },
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
                    const rows: string[][] = [];
                    Object.entries(CONFIG.customSkills).forEach(([cat, skills]) => {
                        rows.push([cat.toUpperCase(), '', '']);
                        skills.forEach((s) => {
                            const filled = Math.floor(s.level / 5);
                            const empty = 20 - filled;
                            const bar = '█'.repeat(filled) + '░'.repeat(empty);
                            rows.push([s.name, bar, `${s.level}%`]);
                        });
                        rows.push(['', '', '']);
                    });
                    const table = makeTable({
                        colWidths: [28, 42, 8],
                        rows,
                    });
                    addLines([
                        { type: 'output', content: '' },
                        { type: 'output', content: table },
                        { type: 'output', content: '' },
                    ]);
                    break;
                }

                case 'projects': {
                    const repos = githubData?.repos ?? [];
                    const sorted = [...repos].sort(
                        (a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0)
                    );
                    const table = makeTable({
                        head: ['Repository', 'Language', 'Stars'],
                        colWidths: [30, 16, 10],
                        rows: sorted
                            .slice(0, 20)
                            .map((r) => [
                                r.name,
                                r.language || '—',
                                r.stargazers_count > 0 ? `★ ${r.stargazers_count}` : '—',
                            ]),
                    });
                    addLines([
                        { type: 'output', content: '' },
                        { type: 'output', content: table },
                        {
                            type: 'output',
                            content:
                                sorted.length > 20 ? `\n  ... and ${sorted.length - 20} more` : '',
                        },
                        { type: 'output', content: `  Total: ${sorted.length} repositories` },
                        { type: 'output', content: '' },
                    ]);
                    break;
                }

                case 'social': {
                    const table = makeTable({
                        head: ['Platform', 'URL'],
                        colWidths: [14, 42],
                        rows: [
                            ['GitHub', CONFIG.social.github || ''],
                            ['LinkedIn', CONFIG.social.linkedin || ''],
                            ['Twitter', CONFIG.social.twitter || ''],
                            ['Email', CONFIG.social.email],
                        ],
                    });
                    addLines([
                        { type: 'output', content: '' },
                        { type: 'output', content: table },
                        { type: 'output', content: '' },
                    ]);
                    break;
                }

                case 'contact': {
                    const table = makeTable({
                        colWidths: [14, 44],
                        rows: [
                            ['Email', CONFIG.personal.email],
                            ['GitHub', 'github.com/hambosto'],
                            ['LinkedIn', 'linkedin.com/in/hambosto'],
                        ],
                    });
                    addLines([
                        { type: 'output', content: '' },
                        { type: 'output', content: table },
                        {
                            type: 'output',
                            content: '  Open the Mail Client app to send a message.',
                        },
                        { type: 'output', content: '' },
                    ]);
                    break;
                }

                case 'open': {
                    const app = args[0]?.toLowerCase();
                    const appMap: Record<string, string> = {
                        terminal: 'terminal',
                        files: 'files',
                        filemanager: 'files',
                        projects: 'files',
                        editor: 'editor',
                        about: 'editor',
                        mail: 'mail',
                        contact: 'mail',
                        settings: 'settings',
                    };
                    if (app && appMap[app]) {
                        addLine('success', `  Launching ${appMap[app]}...`);
                    } else {
                        addLine(
                            'error',
                            `  Available apps: terminal, files, editor, mail, settings`
                        );
                    }
                    break;
                }

                case 'theme': {
                    const themes = ['cyan', 'purple', 'green', 'amber', 'rose'];
                    if (args[0] && themes.includes(args[0])) {
                        addLine(
                            'success',
                            `  Theme changed to ${args[0]}. Open Settings to apply.`
                        );
                    } else {
                        const table = makeTable({
                            head: ['#', 'Theme'],
                            colWidths: [6, 50],
                            rows: themes.map((t, i) => [String(i), t]),
                        });
                        addLines([
                            { type: 'output', content: '' },
                            { type: 'output', content: table },
                            { type: 'output', content: '' },
                        ]);
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
                    addLine('output', '  PortfolioOS 3.1 portfolio-guest x86_64 React/TypeScript');
                    break;

                case 'free': {
                    const memUsed = Math.floor(Math.random() * 30000 + 20000);
                    const memFree = 65536 - memUsed;
                    const swapUsed = Math.floor(Math.random() * 2000);
                    const swapFree = 16384 - swapUsed;
                    const table = makeTable({
                        head: ['', 'total', 'used', 'free'],
                        colWidths: [10, 14, 14, 14],
                        rows: [
                            ['Mem', String(65536), String(memUsed), String(memFree)],
                            ['Swap', String(16384), String(swapUsed), String(swapFree)],
                        ],
                    });
                    addLines([
                        { type: 'output', content: '' },
                        { type: 'output', content: table },
                        { type: 'output', content: '' },
                    ]);
                    break;
                }

                case 'df': {
                    const s1Used = Math.floor(Math.random() * 200 + 100);
                    const s1Avail = 500 - s1Used;
                    const s2Used = Math.floor(Math.random() * 50 + 10);
                    const s2Avail = 100 - s2Used;
                    const table = makeTable({
                        head: ['Filesystem', 'Size', 'Used', 'Avail', 'Use%'],
                        colWidths: [18, 10, 10, 10, 8],
                        rows: [
                            [
                                '/dev/sda1',
                                '500G',
                                `${s1Used}G`,
                                `${s1Avail}G`,
                                `${Math.round(s1Used / 5)}%`,
                            ],
                            [
                                '/dev/sda2',
                                '100G',
                                `${s2Used}G`,
                                `${s2Avail}G`,
                                `${Math.round(s2Used)}%`,
                            ],
                        ],
                    });
                    addLines([
                        { type: 'output', content: '' },
                        { type: 'output', content: table },
                        { type: 'output', content: '' },
                    ]);
                    break;
                }

                case 'top': {
                    const table = makeTable({
                        head: ['PID', 'USER', 'CPU%', 'MEM%', 'TIME+', 'COMMAND'],
                        colWidths: [8, 10, 8, 8, 12, 20],
                        rows: [
                            ['1', 'root', '2.3', '0.6', '12:34', 'portfolio-os'],
                            ['42', 'guest', '1.8', '0.4', '8:21', 'react-app'],
                            ['99', 'guest', '0.5', '0.1', '2:15', 'vite-dev'],
                        ],
                    });
                    addLines([
                        { type: 'output', content: '' },
                        { type: 'output', content: table },
                        { type: 'output', content: '' },
                    ]);
                    break;
                }

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
            style={{ backgroundColor: 'var(--color-bg)' }}
            onClick={() => inputRef.current?.focus()}
        >
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

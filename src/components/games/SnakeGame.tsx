import { useState, useEffect, useCallback, useRef } from 'react';

const GRID = 20;
const CELL = 20;
const DIRS = [{ x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }];

type Difficulty = 'easy' | 'normal' | 'hard' | 'insane';

const DIFFICULTY_CONFIG: Record<Difficulty, { speed: number; label: string; color: string }> = {
    easy:   { speed: 180, label: 'EASY',   color: '#00ff41' },
    normal: { speed: 120, label: 'NORMAL', color: '#ffb000' },
    hard:   { speed: 70,  label: 'HARD',   color: '#ff6600' },
    insane: { speed: 40,  label: 'INSANE', color: '#ff0040' },
};

type Pos = { x: number; y: number };

const randomFood = (snake: Pos[]): Pos => {
    let pos: Pos;
    do { pos = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) }; }
    while (snake.some(s => s.x === pos.x && s.y === pos.y));
    return pos;
};

export const SnakeGame: React.FC = () => {
    const [snake, setSnake] = useState<Pos[]>([{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }]);
    const [food, setFood] = useState<Pos>({ x: 15, y: 10 });
    const [dir, setDir] = useState(1);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [started, setStarted] = useState(false);
    const [paused, setPaused] = useState(false);
    const [difficulty, setDifficulty] = useState<Difficulty>('normal');
    const dirRef = useRef(dir);
    const snakeRef = useRef(snake);
    const foodRef = useRef(food);
    const gameOverRef = useRef(gameOver);
    const pausedRef = useRef(paused);
    const startedRef = useRef(started);
    const touchStart = useRef<{ x: number; y: number } | null>(null);

    dirRef.current = dir;
    snakeRef.current = snake;
    foodRef.current = food;
    gameOverRef.current = gameOver;
    pausedRef.current = paused;
    startedRef.current = started;

    const diff = DIFFICULTY_CONFIG[difficulty];

    const reset = useCallback(() => {
        const s = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
        setSnake(s);
        setFood(randomFood(s));
        setDir(1);
        setScore(0);
        setGameOver(false);
        setPaused(false);
        setStarted(true);
    }, []);

    const tick = useCallback(() => {
        if (gameOverRef.current || pausedRef.current || !startedRef.current) return;
        const s = snakeRef.current;
        const d = dirRef.current;
        const head = { x: s[0].x + DIRS[d].x, y: s[0].y + DIRS[d].y };
        if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID || s.some(seg => seg.x === head.x && seg.y === head.y)) {
            setGameOver(true);
            setHighScore(h => Math.max(h, score));
            return;
        }
        const ns = [head, ...s];
        if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
            setScore(sc => sc + 10);
            setFood(randomFood(ns));
        } else {
            ns.pop();
        }
        setSnake(ns);
    }, [score]);

    useEffect(() => {
        if (!started || gameOver || paused) return;
        const t = setInterval(tick, DIFFICULTY_CONFIG[difficulty].speed);
        return () => clearInterval(t);
    }, [started, gameOver, paused, tick, difficulty]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (!startedRef.current) return;
            const d = dirRef.current;
            switch (e.key) {
                case 'ArrowUp': case 'w': case 'W': e.preventDefault(); if (d !== 2) setDir(0); break;
                case 'ArrowRight': case 'd': case 'D': e.preventDefault(); if (d !== 3) setDir(1); break;
                case 'ArrowDown': case 's': case 'S': e.preventDefault(); if (d !== 0) setDir(2); break;
                case 'ArrowLeft': case 'a': case 'A': e.preventDefault(); if (d !== 1) setDir(3); break;
                case 'p': case 'P': setPaused(p => !p); break;
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [started]);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, []);

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        if (!touchStart.current) return;
        const dx = e.changedTouches[0].clientX - touchStart.current.x;
        const dy = e.changedTouches[0].clientY - touchStart.current.y;
        const d = dirRef.current;
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 20 && d !== 3) setDir(1);
            else if (dx < -20 && d !== 1) setDir(3);
        } else {
            if (dy > 20 && d !== 0) setDir(2);
            else if (dy < -20 && d !== 2) setDir(0);
        }
        touchStart.current = null;
    }, []);

    const changeDir = useCallback((newDir: number) => {
        const d = dirRef.current;
        if (newDir === 0 && d !== 2) setDir(0);
        else if (newDir === 1 && d !== 3) setDir(1);
        else if (newDir === 2 && d !== 0) setDir(2);
        else if (newDir === 3 && d !== 1) setDir(3);
    }, []);

    const snakeSet = new Set(snake.map(s => `${s.x},${s.y}`));

    const btnClass = "flex items-center justify-center w-12 h-10 sm:w-14 sm:h-12 rounded-sm border text-lg font-bold active:scale-95 select-none";
    const btnStyle = { borderColor: 'var(--color-primary)', color: 'var(--color-primary)', backgroundColor: 'var(--color-primary-glow)' };

    return (
        <div className="h-full flex flex-col items-center justify-center p-2 sm:p-4" style={{ backgroundColor: 'var(--color-bg)' }}>
            <div className="text-sm font-bold mb-2 sm:mb-3" style={{ color: 'var(--color-text)' }}>
                <i className="fas fa-gamepad mr-2" style={{ color: 'var(--color-primary)' }} />
                SNAKE
            </div>

            {/* Difficulty selector */}
            <div className="flex gap-1.5 mb-3">
                {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map(d => (
                    <button
                        key={d}
                        className="px-3 py-1 text-[10px] font-bold rounded-sm border transition-all"
                        style={{
                            borderColor: difficulty === d ? DIFFICULTY_CONFIG[d].color : 'var(--color-border)',
                            color: difficulty === d ? DIFFICULTY_CONFIG[d].color : 'var(--color-text-muted)',
                            backgroundColor: difficulty === d ? `${DIFFICULTY_CONFIG[d].color}22` : 'transparent',
                        }}
                        onClick={() => { setDifficulty(d); setStarted(false); setGameOver(false); }}
                    >
                        {DIFFICULTY_CONFIG[d].label}
                    </button>
                ))}
            </div>

            <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 items-center">
                <div className="flex flex-col items-center gap-2">
                    <div
                        className="relative border-2"
                        style={{ borderColor: 'var(--color-border)' }}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        {Array.from({ length: GRID }).map((_, y) => (
                            <div key={y} className="flex">
                                {Array.from({ length: GRID }).map((_, x) => {
                                    const isHead = snake[0]?.x === x && snake[0]?.y === y;
                                    const isBody = snakeSet.has(`${x},${y}`) && !isHead;
                                    const isFood = food.x === x && food.y === y;
                                    return (
                                        <div key={x} style={{
                                            width: CELL, height: CELL,
                                            backgroundColor: isHead ? 'var(--color-primary)' : isBody ? 'var(--color-primary-dark)' : isFood ? 'var(--color-error)' : '#0d0d0d',
                                            borderRadius: isFood ? '50%' : isHead ? '2px' : '1px',
                                            boxShadow: isHead ? '0 0 6px var(--color-primary)' : isFood ? '0 0 6px var(--color-error)' : 'none',
                                        }} />
                                    );
                                })}
                            </div>
                        ))}
                        {(gameOver || paused || !started) && (
                            <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
                                <div className="text-center">
                                    <div className="text-lg font-bold mb-1" style={{ color: diff.color }}>
                                        {gameOver ? 'GAME OVER' : paused ? 'PAUSED' : 'SNAKE'}
                                    </div>
                                    <div className="text-[10px] mb-2" style={{ color: diff.color }}>{diff.label} MODE</div>
                                    {!started && <div className="text-xs mb-3" style={{ color: 'var(--color-text-dim)' }}>Press Start to play</div>}
                                    {gameOver && <div className="text-xs mb-3" style={{ color: 'var(--color-text-dim)' }}>Score: {score}</div>}
                                    <button onClick={reset} className="px-4 py-2 text-xs font-bold rounded-sm border"
                                        style={{ borderColor: diff.color, color: diff.color, backgroundColor: `${diff.color}22` }}>
                                        {gameOver || !started ? 'START' : 'RESUME'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="lg:hidden flex gap-3">
                        {[['Score', score], ['High', highScore], ['Len', snake.length]].map(([label, val]) => (
                            <div key={label as string} className="p-2 rounded-sm border text-center min-w-[60px]" style={{ borderColor: 'var(--color-border)' }}>
                                <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{label}</div>
                                <div className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>{val}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="hidden lg:block space-y-3">
                    {[['Score', score], ['High Score', highScore], ['Length', snake.length]].map(([label, val]) => (
                        <div key={label as string} className="p-2 rounded-sm border" style={{ borderColor: 'var(--color-border)' }}>
                            <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{label}</div>
                            <div className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>{val}</div>
                        </div>
                    ))}
                    <div className="text-xs space-y-1" style={{ color: 'var(--color-text-muted)' }}>
                        <div>↑↓←→ / WASD Move</div>
                        <div>P Pause</div>
                        <div>Swipe on mobile</div>
                    </div>
                </div>
                <div className="lg:hidden flex flex-col items-center gap-2">
                    <button className={btnClass} style={btnStyle} onClick={() => changeDir(0)}>
                        <i className="fas fa-arrow-up" />
                    </button>
                    <div className="flex gap-2">
                        <button className={btnClass} style={btnStyle} onClick={() => changeDir(3)}>
                            <i className="fas fa-arrow-left" />
                        </button>
                        <button className={btnClass} style={btnStyle} onClick={() => changeDir(2)}>
                            <i className="fas fa-arrow-down" />
                        </button>
                        <button className={btnClass} style={btnStyle} onClick={() => changeDir(1)}>
                            <i className="fas fa-arrow-right" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

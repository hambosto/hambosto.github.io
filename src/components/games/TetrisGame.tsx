import { useState, useEffect, useCallback, useRef } from 'react';

const COLS = 10;
const ROWS = 20;
const CELL = 22;
const SHAPES = [
    [[1, 1, 1, 1]],
    [[1, 1], [1, 1]],
    [[0, 1, 0], [1, 1, 1]],
    [[1, 0, 0], [1, 1, 1]],
    [[0, 0, 1], [1, 1, 1]],
    [[1, 1, 0], [0, 1, 1]],
    [[0, 1, 1], [1, 1, 0]],
];
const COLORS = ['#00f0f0', '#f0f000', '#a000f0', '#0000f0', '#f0a000', '#00f000', '#f00000'];

type Board = (string | null)[][];

interface Piece {
    shape: number[][];
    color: string;
    x: number;
    y: number;
}

const emptyBoard = (): Board => Array.from({ length: ROWS }, () => Array(COLS).fill(null));

const randomPiece = (): Piece => {
    const i = Math.floor(Math.random() * SHAPES.length);
    return { shape: SHAPES[i].map(r => [...r]), color: COLORS[i], x: Math.floor(COLS / 2) - 1, y: 0 };
};

const rotateShape = (shape: number[][]): number[][] => shape[0].map((_, i) => shape.map(row => row[i]).reverse());

const isValid = (board: Board, shape: number[][], x: number, y: number): boolean =>
    shape.every((row, dy) =>
        row.every((cell, dx) => {
            if (!cell) return true;
            const nx = x + dx, ny = y + dy;
            return nx >= 0 && nx < COLS && ny < ROWS && (ny < 0 || !board[ny][nx]);
        })
    );

export const TetrisGame: React.FC = () => {
    const [board, setBoard] = useState<Board>(emptyBoard);
    const [piece, setPiece] = useState<Piece>(randomPiece);
    const [next, setNext] = useState<Piece>(randomPiece);
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [totalLines, setTotalLines] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [paused, setPaused] = useState(false);
    const [started, setStarted] = useState(false);

    const stateRef = useRef({ board, piece, next, score, level, totalLines, gameOver, paused, started });
    stateRef.current = { board, piece, next, score, level, totalLines, gameOver, paused, started };

    const lockPiece = useCallback(() => {
        const s = stateRef.current;
        const b = s.board.map(r => [...r]);
        const { shape, color, x, y } = s.piece;
        shape.forEach((row, dy) => row.forEach((cell, dx) => {
            if (cell && y + dy >= 0 && y + dy < ROWS && x + dx >= 0 && x + dx < COLS) {
                b[y + dy][x + dx] = color;
            }
        }));
        const fullRows: number[] = [];
        b.forEach((row, i) => { if (row.every(c => c !== null)) fullRows.push(i); });
        fullRows.forEach(i => b.splice(i, 1));
        while (b.length < ROWS) b.unshift(Array(COLS).fill(null));
        const cleared = fullRows.length;
        const newLines = s.totalLines + cleared;
        const newLevel = Math.floor(newLines / 10) + 1;
        const newScore = s.score + cleared * 100 * s.level;
        setBoard(b);
        setTotalLines(newLines);
        setLevel(newLevel);
        setScore(newScore);
        const np = s.next;
        if (!isValid(b, np.shape, np.x, np.y)) {
            setGameOver(true);
            return;
        }
        setPiece(np);
        setNext(randomPiece());
    }, []);

    const moveDown = useCallback(() => {
        const s = stateRef.current;
        if (s.gameOver || s.paused || !s.started) return;
        const p = s.piece;
        if (isValid(s.board, p.shape, p.x, p.y + 1)) {
            setPiece({ ...p, y: p.y + 1 });
        } else {
            lockPiece();
        }
    }, [lockPiece]);

    const moveLeft = useCallback(() => {
        const s = stateRef.current;
        if (s.gameOver || s.paused || !s.started) return;
        const p = s.piece;
        if (isValid(s.board, p.shape, p.x - 1, p.y)) setPiece({ ...p, x: p.x - 1 });
    }, []);

    const moveRight = useCallback(() => {
        const s = stateRef.current;
        if (s.gameOver || s.paused || !s.started) return;
        const p = s.piece;
        if (isValid(s.board, p.shape, p.x + 1, p.y)) setPiece({ ...p, x: p.x + 1 });
    }, []);

    const rotatePiece = useCallback(() => {
        const s = stateRef.current;
        if (s.gameOver || s.paused || !s.started) return;
        const p = s.piece;
        const rotated = rotateShape(p.shape);
        if (isValid(s.board, rotated, p.x, p.y)) setPiece({ ...p, shape: rotated });
    }, []);

    const hardDrop = useCallback(() => {
        const s = stateRef.current;
        if (s.gameOver || s.paused || !s.started) return;
        const p = s.piece;
        let dy = 0;
        while (isValid(s.board, p.shape, p.x, p.y + dy + 1)) dy++;
        setScore(sc => sc + dy * 2);
        setPiece({ ...p, y: p.y + dy });
        setTimeout(() => lockPiece(), 0);
    }, [lockPiece]);

    const start = useCallback(() => {
        setBoard(emptyBoard());
        setPiece(randomPiece());
        setNext(randomPiece());
        setScore(0);
        setLevel(1);
        setTotalLines(0);
        setGameOver(false);
        setPaused(false);
        setStarted(true);
    }, []);

    useEffect(() => {
        if (!started || gameOver || paused) return;
        const speed = Math.max(100, 800 - (level - 1) * 70);
        const t = setInterval(moveDown, speed);
        return () => clearInterval(t);
    }, [started, gameOver, paused, level, moveDown]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const s = stateRef.current;
            if (!s.started) return;
            switch (e.key) {
                case 'ArrowLeft': e.preventDefault(); moveLeft(); break;
                case 'ArrowRight': e.preventDefault(); moveRight(); break;
                case 'ArrowDown': e.preventDefault(); moveDown(); break;
                case 'ArrowUp': e.preventDefault(); rotatePiece(); break;
                case ' ': e.preventDefault(); hardDrop(); break;
                case 'p': case 'P': setPaused(p => !p); break;
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [moveLeft, moveRight, moveDown, rotatePiece, hardDrop]);

    const display = board.map(r => [...r]);
    piece.shape.forEach((row, dy) => row.forEach((cell, dx) => {
        if (cell && piece.y + dy >= 0 && piece.y + dy < ROWS && piece.x + dx >= 0 && piece.x + dx < COLS) {
            display[piece.y + dy][piece.x + dx] = piece.color;
        }
    }));

    const btnClass = "flex items-center justify-center w-12 h-10 sm:w-14 sm:h-12 rounded-sm border text-lg font-bold active:scale-95 select-none";
    const btnStyle = { borderColor: 'var(--color-primary)', color: 'var(--color-primary)', backgroundColor: 'var(--color-primary-glow)' };

    return (
        <div className="h-full flex flex-col items-center justify-center p-2 sm:p-4" style={{ backgroundColor: '#0a0a0a' }}>
            <div className="text-sm font-bold mb-2 sm:mb-3" style={{ color: 'var(--color-text)' }}>
                <i className="fas fa-gamepad mr-2" style={{ color: 'var(--color-primary)' }} />
                TETRIS
            </div>
            <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 items-center">
                <div className="flex flex-col items-center gap-2">
                    <div className="relative border-2" style={{ borderColor: 'var(--color-border)' }}>
                        {display.map((row, y) => (
                            <div key={y} className="flex">
                                {row.map((cell, x) => (
                                    <div key={x} style={{
                                        width: CELL, height: CELL,
                                        backgroundColor: cell || '#111',
                                        border: cell ? '1px solid rgba(255,255,255,0.2)' : '1px solid #1a1a1a',
                                        boxShadow: cell ? `inset 0 0 4px ${cell}` : 'none',
                                    }} />
                                ))}
                            </div>
                        ))}
                        {(gameOver || paused || !started) && (
                            <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
                                <div className="text-center">
                                    <div className="text-lg font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                                        {gameOver ? 'GAME OVER' : paused ? 'PAUSED' : 'TETRIS'}
                                    </div>
                                    {!started && <div className="text-xs mb-3" style={{ color: 'var(--color-text-dim)' }}>Press Start to play</div>}
                                    {gameOver && <div className="text-xs mb-3" style={{ color: 'var(--color-text-dim)' }}>Score: {score}</div>}
                                    <button onClick={start} className="px-4 py-2 text-xs font-bold rounded-sm border"
                                        style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)', backgroundColor: 'var(--color-primary-glow)' }}>
                                        {gameOver || !started ? 'START' : 'RESUME'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="lg:hidden flex gap-3">
                        {[['Score', score], ['Level', level], ['Lines', totalLines]].map(([label, val]) => (
                            <div key={label as string} className="p-2 rounded-sm border text-center min-w-[60px]" style={{ borderColor: 'var(--color-border)' }}>
                                <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{label}</div>
                                <div className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>{val}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="hidden lg:block space-y-3">
                    <div className="p-3 rounded-sm border" style={{ borderColor: 'var(--color-border)' }}>
                        <div className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>NEXT</div>
                        <div className="flex flex-col items-center">
                            {next.shape.map((row, y) => (
                                <div key={y} className="flex">
                                    {row.map((cell, x) => (
                                        <div key={x} style={{
                                            width: 14, height: 14,
                                            backgroundColor: cell ? next.color : 'transparent',
                                            border: cell ? '1px solid rgba(255,255,255,0.2)' : 'none',
                                        }} />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                    {[['Score', score], ['Level', level], ['Lines', totalLines]].map(([label, val]) => (
                        <div key={label as string} className="p-2 rounded-sm border" style={{ borderColor: 'var(--color-border)' }}>
                            <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{label}</div>
                            <div className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>{val}</div>
                        </div>
                    ))}
                    <div className="text-xs space-y-1" style={{ color: 'var(--color-text-muted)' }}>
                        <div>← → Move</div>
                        <div>↑ Rotate</div>
                        <div>↓ Soft Drop</div>
                        <div>Space Hard Drop</div>
                        <div>P Pause</div>
                    </div>
                </div>
                <div className="lg:hidden flex flex-col items-center gap-2">
                    <button className={btnClass} style={btnStyle} onClick={rotatePiece}>
                        <i className="fas fa-rotate-right" />
                    </button>
                    <div className="flex gap-2">
                        <button className={btnClass} style={btnStyle} onClick={moveLeft}>
                            <i className="fas fa-arrow-left" />
                        </button>
                        <button className={btnClass} style={btnStyle} onClick={moveDown}>
                            <i className="fas fa-arrow-down" />
                        </button>
                        <button className={btnClass} style={btnStyle} onClick={moveRight}>
                            <i className="fas fa-arrow-right" />
                        </button>
                    </div>
                    <button className={`${btnClass} w-24`} style={btnStyle} onClick={hardDrop}>
                        DROP
                    </button>
                </div>
            </div>
        </div>
    );
};

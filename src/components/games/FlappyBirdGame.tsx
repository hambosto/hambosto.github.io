import { useState, useEffect, useCallback, useRef } from 'react';

const WIDTH = 320;
const HEIGHT = 480;
const BIRD_SIZE = 20;
const PIPE_WIDTH = 40;
const PIPE_GAP = 120;
const GRAVITY = 0.4;
const JUMP = -6;
const PIPE_SPEED = 2.5;

interface Pipe {
    x: number;
    topHeight: number;
    scored: boolean;
}

export const FlappyBirdGame: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);

    const stateRef = useRef({
        birdY: HEIGHT / 2,
        birdVel: 0,
        pipes: [] as Pipe[],
        score: 0,
        gameOver: false,
        started: false,
        frame: 0,
    });

    const reset = useCallback(() => {
        stateRef.current = {
            birdY: HEIGHT / 2,
            birdVel: 0,
            pipes: [],
            score: 0,
            gameOver: false,
            started: true,
            frame: 0,
        };
        setScore(0);
    }, []);

    const jump = useCallback(() => {
        const s = stateRef.current;
        if (s.gameOver) return;
        if (!s.started) {
            reset();
            return;
        }
        s.birdVel = JUMP;
    }, [reset]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === ' ' || e.key === 'ArrowUp') {
                e.preventDefault();
                jump();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [jump]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animId: number;

        const draw = () => {
            const s = stateRef.current;
            ctx.clearRect(0, 0, WIDTH, HEIGHT);

            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            ctx.strokeStyle = 'rgba(0, 255, 65, 0.05)';
            ctx.lineWidth = 1;
            for (let x = 0; x < WIDTH; x += 20) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, HEIGHT); ctx.stroke();
            }
            for (let y = 0; y < HEIGHT; y += 20) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(WIDTH, y); ctx.stroke();
            }

            if (!s.started && !s.gameOver) {
                ctx.fillStyle = 'var(--color-text, #00ff41)';
                ctx.font = 'bold 24px monospace';
                ctx.textAlign = 'center';
                ctx.fillText('FLAPPY BIRD', WIDTH / 2, HEIGHT / 2 - 20);
                ctx.font = '14px monospace';
                ctx.fillStyle = 'var(--color-text-dim, #00cc33)';
                ctx.fillText('Press Space or Tap to Start', WIDTH / 2, HEIGHT / 2 + 20);
                animId = requestAnimationFrame(draw);
                return;
            }

            if (s.started && !s.gameOver) {
                s.birdVel += GRAVITY;
                s.birdY += s.birdVel;

                s.frame++;
                if (s.frame % 90 === 0) {
                    const topH = Math.random() * (HEIGHT - PIPE_GAP - 100) + 40;
                    s.pipes.push({ x: WIDTH, topHeight: topH, scored: false });
                }

                for (const pipe of s.pipes) {
                    pipe.x -= PIPE_SPEED;
                }
                s.pipes = s.pipes.filter(p => p.x > -PIPE_WIDTH);

                const birdLeft = WIDTH / 3;
                const birdRight = birdLeft + BIRD_SIZE;
                const birdTop = s.birdY;
                const birdBottom = s.birdY + BIRD_SIZE;

                if (birdBottom > HEIGHT || birdTop < 0) {
                    s.gameOver = true;
                    setBestScore(b => Math.max(b, s.score));
                }

                for (const pipe of s.pipes) {
                    if (birdRight > pipe.x && birdLeft < pipe.x + PIPE_WIDTH) {
                        if (birdTop < pipe.topHeight || birdBottom > pipe.topHeight + PIPE_GAP) {
                            s.gameOver = true;
                            setBestScore(b => Math.max(b, s.score));
                        }
                    }
                    if (!pipe.scored && pipe.x + PIPE_WIDTH < birdLeft) {
                        pipe.scored = true;
                        s.score++;
                        setScore(s.score);
                    }
                }
            }

            const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#00ff41';
            const primaryDark = getComputedStyle(document.documentElement).getPropertyValue('--color-primary-dark').trim() || '#00801f';

            for (const pipe of s.pipes) {
                ctx.fillStyle = primaryDark;
                ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
                ctx.fillStyle = primaryColor;
                ctx.fillRect(pipe.x + 2, 0, PIPE_WIDTH - 4, pipe.topHeight - 2);

                const bottomY = pipe.topHeight + PIPE_GAP;
                ctx.fillStyle = primaryDark;
                ctx.fillRect(pipe.x, bottomY, PIPE_WIDTH, HEIGHT - bottomY);
                ctx.fillStyle = primaryColor;
                ctx.fillRect(pipe.x + 2, bottomY + 2, PIPE_WIDTH - 4, HEIGHT - bottomY - 2);
            }

            const birdX = WIDTH / 3;
            ctx.fillStyle = '#ffb000';
            ctx.beginPath();
            ctx.arc(birdX + BIRD_SIZE / 2, s.birdY + BIRD_SIZE / 2, BIRD_SIZE / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(birdX + BIRD_SIZE / 2 + 3, s.birdY + BIRD_SIZE / 2 - 2, 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#fff';
            ctx.font = 'bold 32px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(String(s.score), WIDTH / 2, 50);

            if (s.gameOver) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
                ctx.fillRect(0, 0, WIDTH, HEIGHT);
                ctx.fillStyle = 'var(--color-error, #ff4466)';
                ctx.font = 'bold 24px monospace';
                ctx.textAlign = 'center';
                ctx.fillText('GAME OVER', WIDTH / 2, HEIGHT / 2 - 30);
                ctx.fillStyle = 'var(--color-text-dim, #00cc33)';
                ctx.font = '16px monospace';
                ctx.fillText(`Score: ${s.score}`, WIDTH / 2, HEIGHT / 2 + 10);
                ctx.fillText('Press Space or Tap', WIDTH / 2, HEIGHT / 2 + 40);
            }

            animId = requestAnimationFrame(draw);
        };

        animId = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(animId);
    }, []);

    return (
        <div className="h-full flex flex-col items-center justify-center p-2 sm:p-4" style={{ backgroundColor: '#0a0a0a' }}>
            <div className="text-sm font-bold mb-2 sm:mb-3" style={{ color: 'var(--color-text)' }}>
                <i className="fas fa-dove mr-2" style={{ color: 'var(--color-primary)' }} />
                FLAPPY BIRD
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
                <canvas
                    ref={canvasRef}
                    width={WIDTH}
                    height={HEIGHT}
                    className="border-2 cursor-pointer max-w-full"
                    style={{ borderColor: 'var(--color-border)', maxHeight: 'calc(100vh - 200px)' }}
                    onClick={jump}
                    onTouchStart={(e) => { e.preventDefault(); jump(); }}
                />
                <div className="flex flex-row sm:flex-col gap-2 sm:gap-3 sm:space-y-3">
                    <button onClick={reset} className="px-4 py-2 text-xs font-bold rounded-sm border"
                        style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)', backgroundColor: 'var(--color-primary-glow)' }}>
                        NEW GAME
                    </button>
                    {[['Score', score], ['Best', bestScore]].map(([label, val]) => (
                        <div key={label as string} className="p-2 rounded-sm border text-center min-w-[70px]" style={{ borderColor: 'var(--color-border)' }}>
                            <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{label}</div>
                            <div className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>{val}</div>
                        </div>
                    ))}
                    <div className="hidden sm:block text-xs space-y-1" style={{ color: 'var(--color-text-muted)' }}>
                        <div>Space / Tap / ↑</div>
                        <div>to flap</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

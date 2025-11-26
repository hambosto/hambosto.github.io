import { useEffect, useRef, useState, useCallback } from 'react';

interface SnakeGameProps {
    onExit: () => void;
}

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

export const SnakeGame = ({ onExit }: SnakeGameProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [highScore, setHighScore] = useState(() => {
        const saved = localStorage.getItem('snake_highscore');
        return saved ? parseInt(saved, 10) : 0;
    });

    // Game state refs to avoid closure staleness in game loop
    const snakeRef = useRef<Point[]>([{ x: 10, y: 10 }]);
    const foodRef = useRef<Point>({ x: 15, y: 15 });
    const directionRef = useRef<Direction>('RIGHT');
    const nextDirectionRef = useRef<Direction>('RIGHT');
    const gameLoopRef = useRef<number | null>(null);
    const speedRef = useRef(INITIAL_SPEED);

    const generateFood = useCallback((width: number, height: number, snake: Point[]) => {
        const cols = Math.floor(width / CELL_SIZE);
        const rows = Math.floor(height / CELL_SIZE);

        let newFood: Point;
        let isOnSnake;

        do {
            newFood = {
                x: Math.floor(Math.random() * cols),
                y: Math.floor(Math.random() * rows)
            };
            isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
        } while (isOnSnake);

        return newFood;
    }, []);

    const resetGame = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        snakeRef.current = [{ x: 10, y: 10 }];
        directionRef.current = 'RIGHT';
        nextDirectionRef.current = 'RIGHT';
        speedRef.current = INITIAL_SPEED;
        setScore(0);
        setGameOver(false);
        foodRef.current = generateFood(canvas.width, canvas.height, snakeRef.current);
    }, [generateFood]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' || e.key.toLowerCase() === 'q') {
                onExit();
                return;
            }

            if (gameOver && e.key === 'Enter') {
                resetGame();
                return;
            }

            const currentDir = directionRef.current;

            switch (e.key) {
                case 'ArrowUp':
                    if (currentDir !== 'DOWN') nextDirectionRef.current = 'UP';
                    break;
                case 'ArrowDown':
                    if (currentDir !== 'UP') nextDirectionRef.current = 'DOWN';
                    break;
                case 'ArrowLeft':
                    if (currentDir !== 'RIGHT') nextDirectionRef.current = 'LEFT';
                    break;
                case 'ArrowRight':
                    if (currentDir !== 'LEFT') nextDirectionRef.current = 'RIGHT';
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onExit, gameOver, resetGame]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // Regenerate food if it's out of bounds after resize
            if (foodRef.current.x * CELL_SIZE >= canvas.width || foodRef.current.y * CELL_SIZE >= canvas.height) {
                foodRef.current = generateFood(canvas.width, canvas.height, snakeRef.current);
            }
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const gameLoop = () => {
            if (gameOver) {
                // Draw Game Over screen
                ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.fillStyle = '#00ff00';
                ctx.font = '40px "Fira Code", monospace';
                ctx.textAlign = 'center';
                ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 40);

                ctx.font = '20px "Fira Code", monospace';
                ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 10);
                ctx.fillText('Press ENTER to restart', canvas.width / 2, canvas.height / 2 + 50);
                ctx.fillText('Press ESC to exit', canvas.width / 2, canvas.height / 2 + 80);
                return;
            }

            // Update state
            directionRef.current = nextDirectionRef.current;
            const head = { ...snakeRef.current[0] };

            switch (directionRef.current) {
                case 'UP': head.y -= 1; break;
                case 'DOWN': head.y += 1; break;
                case 'LEFT': head.x -= 1; break;
                case 'RIGHT': head.x += 1; break;
            }

            // Check collisions
            const cols = Math.floor(canvas.width / CELL_SIZE);
            const rows = Math.floor(canvas.height / CELL_SIZE);

            if (
                head.x < 0 || head.x >= cols ||
                head.y < 0 || head.y >= rows ||
                snakeRef.current.some(segment => segment.x === head.x && segment.y === head.y)
            ) {
                setGameOver(true);
                if (score > highScore) {
                    setHighScore(score);
                    localStorage.setItem('snake_highscore', score.toString());
                }
                return;
            }

            const newSnake = [head, ...snakeRef.current];

            // Check food
            if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
                setScore(s => s + 10);
                foodRef.current = generateFood(canvas.width, canvas.height, newSnake);
                // Increase speed slightly
                speedRef.current = Math.max(50, speedRef.current - 2);
            } else {
                newSnake.pop();
            }

            snakeRef.current = newSnake;

            // Draw
            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw grid (optional, subtle)
            ctx.strokeStyle = '#003300';
            ctx.lineWidth = 0.5;
            for (let x = 0; x < canvas.width; x += CELL_SIZE) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
            for (let y = 0; y < canvas.height; y += CELL_SIZE) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }

            // Draw snake
            ctx.fillStyle = '#00ff00';
            newSnake.forEach((segment, index) => {
                // Head is slightly brighter or different
                if (index === 0) ctx.fillStyle = '#ccffcc';
                else ctx.fillStyle = '#00ff00';

                ctx.fillRect(
                    segment.x * CELL_SIZE + 1,
                    segment.y * CELL_SIZE + 1,
                    CELL_SIZE - 2,
                    CELL_SIZE - 2
                );
            });

            // Draw food
            ctx.fillStyle = '#ff0000';
            ctx.beginPath();
            ctx.arc(
                foodRef.current.x * CELL_SIZE + CELL_SIZE / 2,
                foodRef.current.y * CELL_SIZE + CELL_SIZE / 2,
                CELL_SIZE / 2 - 2,
                0,
                Math.PI * 2
            );
            ctx.fill();

            // Draw UI
            ctx.fillStyle = '#00ff00';
            ctx.font = '20px "Fira Code", monospace';
            ctx.textAlign = 'left';
            ctx.fillText(`Score: ${score}`, 20, 30);
            ctx.textAlign = 'right';
            ctx.fillText(`High Score: ${highScore}`, canvas.width - 20, 30);

            gameLoopRef.current = setTimeout(gameLoop, speedRef.current);
        };

        gameLoop();

        return () => {
            if (gameLoopRef.current) clearTimeout(gameLoopRef.current);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [gameOver, score, highScore, generateFood]);

    return (
        <div className="fixed inset-0 z-[100] bg-black">
            <canvas
                ref={canvasRef}
                className="block w-full h-full"
            />
        </div>
    );
};

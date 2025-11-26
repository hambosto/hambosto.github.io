import { useEffect, useRef } from 'react';

export const MatrixRain = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Matrix characters
        const chars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const charArray = chars.split('');

        const fontSize = 14;
        let columns = 0;
        let drops: number[] = [];

        const resizeCanvas = () => {
            const { clientWidth, clientHeight } = container;
            canvas.width = clientWidth;
            canvas.height = clientHeight;

            columns = Math.ceil(canvas.width / fontSize);
            // Initialize drops if array length changed or empty
            if (drops.length !== columns) {
                drops = [];
                for (let i = 0; i < columns; i++) {
                    drops[i] = Math.random() * -100; // Start above screen randomly
                }
            }
        };

        // Initial resize
        resizeCanvas();

        // Handle resize
        const observer = new ResizeObserver(resizeCanvas);
        observer.observe(container);

        const draw = () => {
            // Semi-transparent black to create trail effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#0F0'; // Green text
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = charArray[Math.floor(Math.random() * charArray.length)];
                const x = i * fontSize;
                const y = drops[i] * fontSize;

                ctx.fillText(text, x, y);

                // Reset drop to top randomly after it crosses bottom
                if (y > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                drops[i]++;
            }
        };

        const interval = setInterval(draw, 33);

        return () => {
            clearInterval(interval);
            observer.disconnect();
        };
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full bg-black overflow-hidden">
            <canvas
                ref={canvasRef}
                className="block"
            />
        </div>
    );
};

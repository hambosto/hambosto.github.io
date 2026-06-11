import { useEffect, useRef, useState, useCallback } from "react";

interface MatrixScreensaverProps {
  onWake: () => void;
}

export const MatrixScreensaver: React.FC<MatrixScreensaverProps> = ({ onWake }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "アァカサタナハマヤャラワ0123456789ABCDEF";
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns)
      .fill(1)
      .map(() => Math.random() * -100);

    const getPrimaryColor = () => {
      const cs = getComputedStyle(document.documentElement);
      return cs.getPropertyValue("--color-primary").trim() || "#00ff41";
    };

    const draw = () => {
      ctx.fillStyle = "rgba(5, 5, 5, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const primary = getPrimaryColor();
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        if (Math.random() > 0.98) ctx.fillStyle = "#ffffff";
        else ctx.fillStyle = primary;

        ctx.globalAlpha = 0.2 + Math.random() * 0.6;
        ctx.fillText(text, x, y);
        ctx.globalAlpha = 1;

        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 40);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleWake = useCallback(() => onWake(), [onWake]);

  return (
    <div
      className="fixed inset-0 z-[99998] cursor-none"
      onClick={handleWake}
      onMouseMove={handleWake}
      onKeyDown={handleWake}
      tabIndex={0}
      style={{ backgroundColor: "#050505" }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div
          className="text-4xl sm:text-6xl font-mono mb-4"
          style={{
            color: "var(--color-primary)",
            opacity: 0.3,
            textShadow: "0 0 20px var(--color-primary)",
          }}
        >
          {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
        <div className="text-sm font-mono" style={{ color: "var(--color-text-dim)", opacity: 0.2 }}>
          Move mouse or press any key to wake
        </div>
      </div>
    </div>
  );
};

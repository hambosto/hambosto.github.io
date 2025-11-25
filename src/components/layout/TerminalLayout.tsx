import React, { useState, useEffect } from 'react';

interface TerminalLayoutProps {
    children: React.ReactNode;
}

export const TerminalLayout: React.FC<TerminalLayoutProps> = ({ children }) => {
    const [booting, setBooting] = useState(true);
    const [bootLines, setBootLines] = useState<string[]>([]);

    useEffect(() => {
        const lines = [
            "BIOS Date 01/01/2024 12:00:00 Ver: 1.0.0",
            "CPU: Intel(R) Core(TM) i9-14900K CPU @ 6.00GHz",
            "Memory Test: 65536K OK",
            "Detecting Primary Master ... Hacking_Station_V1",
            "Detecting Primary Slave ... None",
            "Booting from Hard Disk...",
            "Loading Kernel...",
            "Starting System Services...",
            "Initializing UI...",
            "Welcome to Portfolio OS v2.0"
        ];

        let delay = 0;
        lines.forEach((line, index) => {
            delay += Math.random() * 300 + 100;
            setTimeout(() => {
                setBootLines(prev => [...prev, line]);
                if (index === lines.length - 1) {
                    setTimeout(() => setBooting(false), 800);
                }
            }, delay);
        });
    }, []);

    if (booting) {
        return (
            <div className="min-h-screen bg-terminal-black text-terminal-green font-mono p-8 crt">
                {bootLines.map((line, i) => (
                    <div key={i} className="mb-1">{line}</div>
                ))}
                <div className="animate-pulse">_</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-terminal-black text-terminal-green font-mono crt overflow-hidden relative">
            <div className="absolute inset-0 pointer-events-none z-50 crt-overlay"></div>
            <div className="relative z-10 h-full overflow-y-auto">
                {children}
            </div>
        </div>
    );
};

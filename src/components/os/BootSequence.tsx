import { useState, useEffect } from 'react';

interface BootSequenceProps {
    onComplete: () => void;
}

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
    const [lines, setLines] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const bootLines = [
            '[BIOS] POST Check.......................... OK',
            '[BIOS] CPU: Intel(R) Core(TM) i9-14900K @ 6.00GHz',
            '[BIOS] Memory Test: 65536K OK',
            '[BIOS] Detecting Primary Master ... Portfolio_OS_v3.0',
            '',
            '[BOOT] Loading kernel modules..............',
            '[BOOT]   ├─ sched.ko',
            '[BOOT]   ├─ memory.ko',
            '[BOOT]   ├─ network.ko',
            '[BOOT]   └─ display.ko',
            '',
            '[INIT] Mounting root filesystem........... OK',
            '[INIT] Starting system services...........',
            '[INIT]   ├─ sshd',
            '[INIT]   ├─ nginx',
            '[INIT]   ├─ postgresql',
            '[INIT]   └─ redis',
            '',
            '[NET] Configuring network interfaces...... OK',
            '[NET]   └─ eth0: 192.168.1.42',
            '',
            '[UI] Starting graphical subsystem........ OK',
            '[UI] Loading desktop environment......... OK',
            '[UI] Initializing window manager......... OK',
            '',
            '[SEC] Establishing secure connection..... OK',
            '[SEC] Loading PGP keys................... OK',
            '',
            '[OK] All systems operational',
            '',
            '╔══════════════════════════════════════════╗',
            '║     Welcome to Portfolio OS v3.0.2       ║',
            '╚══════════════════════════════════════════╝',
        ];

        let delay = 0;
        bootLines.forEach((line, i) => {
            delay += line === '' ? 50 : Math.random() * 120 + 40;
            setTimeout(() => {
                setLines((prev) => [...prev, line]);
                setProgress(((i + 1) / bootLines.length) * 100);
                if (i === bootLines.length - 1) {
                    setTimeout(onComplete, 800);
                }
            }, delay);
        });
    }, [onComplete]);

    const getLineColor = (line: string): string => {
        if (line.startsWith('[OK]') || line.includes('OK')) return 'var(--color-success)';
        if (line.includes('Portfolio OS')) return 'var(--color-primary)';
        if (
            line.startsWith('[BOOT]') ||
            line.startsWith('[INIT]') ||
            line.startsWith('[NET]') ||
            line.startsWith('[UI]') ||
            line.startsWith('[SEC]')
        )
            return 'var(--color-text-dim)';
        return 'var(--color-text-dim)';
    };

    return (
        <div
            className="fixed inset-0 z-[100000] p-6 sm:p-12 font-mono flex flex-col justify-end"
            style={{ backgroundColor: '#050505' }}
        >
            <div className="max-w-2xl mx-auto w-full">
                {lines.map((line, i) => (
                    <div
                        key={i}
                        className="boot-line text-xs sm:text-sm mb-0.5"
                        style={{ color: getLineColor(line) }}
                    >
                        {line}
                    </div>
                ))}
                <div className="mt-4">
                    <div className="text-xs mb-1" style={{ color: 'var(--color-text-dim)' }}>
                        Booting... {Math.round(progress)}%
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                </div>
                <div className="blink text-sm mt-2" style={{ color: 'var(--color-primary)' }}>
                    █
                </div>
            </div>
        </div>
    );
};

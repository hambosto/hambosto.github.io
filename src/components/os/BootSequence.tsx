import { useState, useEffect } from 'react';

interface BootSequenceProps {
    onComplete: () => void;
}

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
    const [lines, setLines] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const bootLines = [
            'Portfolio OS v3.1',
            '',
            'Initializing system...',
            'Loading workspace...',
            'Mounting filesystem... OK',
            'Starting services... OK',
            '',
            'System ready.',
        ];

        let delay = 0;
        bootLines.forEach((line, i) => {
            delay += line === '' ? 30 : Math.random() * 80 + 30;
            setTimeout(() => {
                setLines((prev) => [...prev, line]);
                setProgress(((i + 1) / bootLines.length) * 100);
                if (i === bootLines.length - 1) {
                    setTimeout(onComplete, 400);
                }
            }, delay);
        });
    }, [onComplete]);

    return (
        <div
            className="fixed inset-0 z-[100000] p-6 sm:p-12 font-mono flex flex-col justify-end"
            style={{ backgroundColor: 'var(--color-bg-dark)' }}
        >
            <div className="max-w-lg mx-auto w-full">
                {lines.map((line, i) => (
                    <div
                        key={i}
                        className="boot-line text-xs sm:text-sm mb-0.5"
                        style={{
                            color:
                                line.includes('OK') || line.includes('ready')
                                    ? 'var(--color-success)'
                                    : 'var(--color-text-muted)',
                        }}
                    >
                        {line}
                    </div>
                ))}
                <div className="mt-4">
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                </div>
                <div className="blink text-sm mt-3" style={{ color: 'var(--color-primary)' }}>
                    _
                </div>
            </div>
        </div>
    );
};

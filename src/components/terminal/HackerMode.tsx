import React, { useState, useEffect, useRef } from 'react';
import { KERNEL_SOURCE } from '../../lib/utils';

interface HackerModeProps {
    onExit: () => void;
}

export const HackerMode: React.FC<HackerModeProps> = ({ onExit }) => {
    const [code, setCode] = useState('');
    const [accessGranted, setAccessGranted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const sourceIndex = useRef(0);
    const charCount = useRef(0);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onExit();
                return;
            }

            if (accessGranted) return;

            // Add a chunk of code (3-8 chars) per keypress
            const charsToAdd = Math.floor(Math.random() * 6) + 3;
            const nextChunk = KERNEL_SOURCE.slice(
                sourceIndex.current,
                sourceIndex.current + charsToAdd
            );

            setCode(prev => prev + nextChunk);
            sourceIndex.current = (sourceIndex.current + charsToAdd) % KERNEL_SOURCE.length;
            charCount.current += charsToAdd;

            // Trigger "Access Granted" after ~800 chars
            if (charCount.current > 800 && !accessGranted) {
                setAccessGranted(true);
            }

            // Auto-scroll
            if (containerRef.current) {
                containerRef.current.scrollTop = containerRef.current.scrollHeight;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [accessGranted, onExit]);

    return (
        <div className="fixed inset-0 bg-black z-[100] font-mono p-4 overflow-hidden">
            <div
                ref={containerRef}
                className="h-full overflow-y-auto text-terminal-green text-sm sm:text-base whitespace-pre-wrap break-all"
            >
                {code}
                <span className="animate-pulse">_</span>
            </div>

            {accessGranted && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-500">
                    <div className="border-2 border-terminal-green bg-black p-8 text-center animate-bounce">
                        <h1 className="text-4xl sm:text-6xl font-bold text-terminal-green mb-4 glitch-text">
                            ACCESS GRANTED
                        </h1>
                        <p className="text-terminal-dim text-xl">System Override Complete</p>
                        <p className="text-terminal-dim mt-4 text-sm">Press ESC to return</p>
                    </div>
                </div>
            )}

            <div className="absolute top-4 right-4 text-terminal-dim text-xs">
                HACKER_MODE_V1.0 // PRESS ESC TO EXIT
            </div>
        </div>
    );
};

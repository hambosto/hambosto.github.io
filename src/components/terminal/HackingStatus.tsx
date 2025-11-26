import React, { useState, useEffect, useRef } from 'react';

const HACKING_MESSAGES = [
    "Hacking the planet...",
    "Compiling kernel modules...",
    "Decrypting secure handshake...",
    "Hashing data packets...",
    "Bypassing firewall...",
    "Injecting payload...",
    "Tracing route...",
    "Establishing secure connection...",
    "Downloading mainframe data...",
    "Overriding security protocols...",
    "Scanning ports...",
    "Brute-forcing credentials...",
    "Accessing root directory...",
    "Encrypting local drive...",
    "Uploading virus signature...",
    "Initializing neural network...",
    "Optimizing algorithms...",
    "Synchronizing databases...",
    "Deploying botnet...",
    "Masking IP address..."
];

export const HackingStatus: React.FC = () => {
    const [logs, setLogs] = useState<string[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initial logs
        setLogs([
            "Initializing hacking sequence...",
            "Loading modules...",
            "Target acquired."
        ]);

        const interval = setInterval(() => {
            const randomMsg = HACKING_MESSAGES[Math.floor(Math.random() * HACKING_MESSAGES.length)];
            const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
            const newLog = `[${timestamp}] ${randomMsg}`;

            setLogs(prev => {
                const newLogs = [...prev, newLog];
                if (newLogs.length > 8) {
                    return newLogs.slice(newLogs.length - 8);
                }
                return newLogs;
            });
        }, 800);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="mt-8 border border-terminal-dim p-4 relative">
            <div className="absolute top-0 left-0 bg-terminal-dim text-terminal-black px-2 text-xs">SYSTEM_LOG</div>
            <div
                ref={containerRef}
                className="mt-4 font-mono text-xs sm:text-sm text-terminal-green/80 h-32 overflow-hidden flex flex-col justify-end"
            >
                {logs.map((log, index) => (
                    <div key={index} className="truncate">
                        <span className="text-terminal-dim mr-2">{'>'}</span>
                        {log}
                    </div>
                ))}
                <div className="animate-pulse text-terminal-green">_</div>
            </div>
        </div>
    );
};

import React, { useState, useEffect } from 'react';
import { useSystemStats } from '../../hooks/useSystemStats';
import { useKernelVersion } from '../../hooks/useKernelVersion';

export const StatusBar: React.FC = () => {
    const [time, setTime] = useState(new Date());
    const { cpu, memory } = useSystemStats();
    const kernelVersion = useKernelVersion();

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="border-b border-terminal-dim pb-2 mb-8 flex justify-between items-center text-xs sm:text-sm sticky top-0 bg-terminal-black z-40 pt-2">
            <div className="flex gap-4">
                <span>USER: guest</span>
                <span>HOST: portfolio</span>
                <span className="hidden sm:inline">KERNEL: {kernelVersion}</span>
            </div>
            <div className="flex gap-4">
                <span>CPU: {cpu}%</span>
                <span>MEM: {memory}%</span>
                <span>{time.toLocaleTimeString()}</span>
            </div>
        </div>
    );
};

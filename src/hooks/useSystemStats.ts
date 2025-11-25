import { useState, useEffect } from 'react';
import { randomInt, clamp } from '../lib/utils';

export const useSystemStats = () => {
    const [stats, setStats] = useState({
        cpu: 12,
        memory: 45
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => {
                // Random walk for CPU: -5% to +5%, clamped between 5% and 90%
                const cpuChange = randomInt(-5, 5);
                const newCpu = clamp(prev.cpu + cpuChange, 5, 90);

                // Random walk for Memory: -2% to +2%, clamped between 20% and 80%
                const memChange = randomInt(-2, 2);
                const newMem = clamp(prev.memory + memChange, 20, 80);

                return { cpu: newCpu, memory: newMem };
            });
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return stats;
};

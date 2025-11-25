import { useState, useEffect } from 'react';

interface KernelRelease {
    moniker: string;
    version: string;
}

interface KernelData {
    releases: KernelRelease[];
}

export const useKernelVersion = () => {
    const [version, setVersion] = useState<string>('5.15.0-generic');

    useEffect(() => {
        const fetchKernelVersion = async () => {
            try {
                const response = await fetch('https://corsproxy.io/?https://www.kernel.org/releases.json');
                if (!response.ok) throw new Error('Failed to fetch');

                const data: KernelData = await response.json();
                const stableRelease = data.releases.find(r => r.moniker === 'stable');

                if (stableRelease) {
                    setVersion(`${stableRelease.version}-generic`);
                }
            } catch (error) {
                console.error('Failed to fetch kernel version:', error);
                // Fallback is already set in initial state
            }
        };

        fetchKernelVersion();
    }, []);

    return version;
};

import React, { useState, useEffect } from 'react';
import { CONFIG } from '../../utils/config';
import { formatUptime } from '../../lib/utils';
import { useTypewriter } from '../../hooks/useTypewriter';

import { HackingStatus } from './HackingStatus';
import { MatrixRain } from '../ui/MatrixRain';

interface WhoamiProps {
    user: any;
}

export const Whoami: React.FC<WhoamiProps> = ({ user }) => {
    const { displayText } = useTypewriter(CONFIG.personal.bio, 30);
    const [uptime, setUptime] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setUptime(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="mb-12">
            <div className="text-terminal-green mb-4">
                <pre className="font-mono text-xs sm:text-sm leading-none opacity-50 hidden sm:block">
                    {`
                ██╗  ██╗ █████╗ ███╗   ███╗██████╗  ██████╗ ███████╗████████╗ ██████╗ 
                ██║  ██║██╔══██╗████╗ ████║██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝██╔═══██╗
                ███████║███████║██╔████╔██║██████╔╝██║   ██║███████╗   ██║   ██║   ██║
                ██╔══██║██╔══██║██║╚██╔╝██║██╔══██╗██║   ██║╚════██║   ██║   ██║   ██║
                ██║  ██║██║  ██║██║ ╚═╝ ██║██████╔╝╚██████╔╝███████║   ██║   ╚██████╔╝
                ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚═════╝  ╚═════╝ ╚══════╝   ╚═╝    ╚═════╝                                                                                     
`}
                </pre>
            </div>

            {user?.avatar_url && (
                <div className="mb-8 border border-terminal-dim p-4 relative">
                    <div className="absolute top-0 left-0 bg-terminal-dim text-terminal-black px-2 text-xs">AVATAR</div>
                    <div className="mt-4 flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-terminal-green opacity-30 blur group-hover:opacity-75 transition duration-200"></div>
                            <img
                                src={user.avatar_url}
                                alt={user.name}
                                className="relative w-32 h-32 sm:w-40 sm:h-40 grayscale hover:grayscale-0 transition-all duration-300 border border-terminal-green"
                            />
                            <div className="absolute inset-0 bg-terminal-green/10 pointer-events-none mix-blend-overlay"></div>
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            <h3 className="text-xl font-bold text-terminal-green mb-2">{user.name}</h3>
                            <p className="text-terminal-dim text-sm mb-4">@{user.login}</p>
                            <p className="text-sm leading-relaxed max-w-2xl">
                                {user.bio}
                            </p>
                            <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-4 text-xs font-mono text-terminal-dim">
                                <span>ID: {user.id}</span>
                                <span>CREATED: {new Date(user.created_at).toLocaleDateString()}</span>
                                <span>PUBLIC_REPOS: {user.public_repos}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="border border-terminal-dim p-4 relative">
                    <div className="absolute top-0 left-0 bg-terminal-dim text-terminal-black px-2 text-xs">USER_INFO</div>
                    <div className="mt-4 space-y-2">
                        <div className="flex">
                            <span className="w-24 text-terminal-dim">User:</span>
                            <span className="text-terminal-green font-bold">{user?.name || CONFIG.personal.name}</span>
                        </div>
                        <div className="flex">
                            <span className="w-24 text-terminal-dim">Role:</span>
                            <span>{CONFIG.personal.title}</span>
                        </div>
                        <div className="flex">
                            <span className="w-24 text-terminal-dim">Location:</span>
                            <span>{user?.location || 'Unknown'}</span>
                        </div>
                        <div className="flex">
                            <span className="w-24 text-terminal-dim">Shell:</span>
                            <span>/bin/zsh</span>
                        </div>
                        <div className="flex">
                            <span className="w-24 text-terminal-dim">Uptime:</span>
                            <span>{formatUptime(uptime)}</span>
                        </div>
                    </div>
                </div>

                <div className="border border-terminal-dim p-4 relative">
                    <div className="absolute top-0 left-0 bg-terminal-dim text-terminal-black px-2 text-xs">BIO</div>
                    <div className="mt-4">
                        <p className="text-sm leading-relaxed min-h-[3rem]">
                            {displayText}
                            <span className="animate-pulse">_</span>
                        </p>
                        <div className="mt-4 flex flex-col gap-2 font-mono text-xs">
                            <div className="flex items-center gap-2">
                                <span className="text-terminal-dim">PGP:</span>
                                <span className="text-terminal-green">8F3D 2A1B 9C4E 5F6G 7H8I</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-terminal-dim">STATUS:</span>
                                <span className="text-terminal-green animate-pulse">● ONLINE</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-terminal-dim">SECURITY:</span>
                                <span className="text-terminal-green">ENCRYPTED (AES-256)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <HackingStatus />

            <div className="mt-8 border border-terminal-dim relative h-64">
                <div className="absolute top-0 left-0 bg-terminal-dim text-terminal-black px-2 text-xs z-10">MATRIX_LINK</div>
                <div className="w-full h-full">
                    <MatrixRain />
                </div>
            </div>
        </div>
    );
};

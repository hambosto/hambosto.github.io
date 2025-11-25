import React from 'react';
import { CONFIG } from '../../utils/config';
import { randomInt } from '../../lib/utils';

export const NetworkConnections: React.FC = () => {
    const connections = [
        { name: 'GITHUB', url: CONFIG.social.github, port: 443, protocol: 'HTTPS', status: 'ESTABLISHED' },
        { name: 'LINKEDIN', url: CONFIG.social.linkedin, port: 443, protocol: 'HTTPS', status: 'ESTABLISHED' },
        { name: 'TWITTER', url: CONFIG.social.twitter, port: 443, protocol: 'HTTPS', status: 'ESTABLISHED' },
        { name: 'EMAIL', url: `mailto:${CONFIG.social.email}`, port: 25, protocol: 'SMTP', status: 'READY' },
        { name: 'RESUME', url: CONFIG.personal.resume || '#', port: 21, protocol: 'FTP', status: 'AVAILABLE' },
    ];

    return (
        <div className="mb-12">
            <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="mr-2">{'>'}</span> NETWORK_CONNECTIONS
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-sm">
                    <thead>
                        <tr className="border-b border-terminal-dim text-terminal-dim">
                            <th className="py-2 px-4">PROTOCOL</th>
                            <th className="py-2 px-4">LOCAL_ADDRESS</th>
                            <th className="py-2 px-4">FOREIGN_ADDRESS</th>
                            <th className="py-2 px-4">STATE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {connections.map((conn, i) => (
                            <tr key={i} className="hover:bg-terminal-dim/20 transition-colors group">
                                <td className="py-2 px-4 text-terminal-dim">{conn.protocol}</td>
                                <td className="py-2 px-4 text-terminal-dim">127.0.0.1:{randomInt(10000, 60000)}</td>
                                <td className="py-2 px-4">
                                    <a href={conn.url} target="_blank" rel="noreferrer" className="text-terminal-green group-hover:underline flex items-center">
                                        {conn.name}
                                        <span className="text-terminal-dim ml-1">:{conn.port}</span>
                                    </a>
                                </td>
                                <td className="py-2 px-4 text-terminal-green">{conn.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

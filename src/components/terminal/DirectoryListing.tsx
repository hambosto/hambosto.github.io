import React from 'react';

interface DirectoryListingProps {
    data: any;
}

export const DirectoryListing: React.FC<DirectoryListingProps> = ({ data }) => {
    const projects = data?.repos || [];

    return (
        <div className="mb-12">
            <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="mr-2">{'>'}</span> DIRECTORY_LISTING ./projects/
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-sm">
                    <thead>
                        <tr className="border-b border-terminal-dim text-terminal-dim">
                            <th className="py-2 px-4">PERMISSIONS</th>
                            <th className="py-2 px-4">USER</th>
                            <th className="py-2 px-4">SIZE</th>
                            <th className="py-2 px-4">DATE</th>
                            <th className="py-2 px-4">NAME</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((repo: any, i: number) => (
                            <tr key={i} className="hover:bg-terminal-dim/20 transition-colors group cursor-pointer">
                                <td className="py-2 px-4 text-terminal-dim">drwxr-xr-x</td>
                                <td className="py-2 px-4 text-terminal-dim">root</td>
                                <td className="py-2 px-4 text-terminal-dim">{repo.size || '4096'}</td>
                                <td className="py-2 px-4 text-terminal-dim">{new Date(repo.updated_at).toLocaleDateString()}</td>
                                <td className="py-2 px-4">
                                    <a href={repo.html_url} target="_blank" rel="noreferrer" className="text-terminal-green group-hover:underline">
                                        {repo.name}/
                                    </a>
                                    <div className="text-xs text-terminal-dim mt-1 line-clamp-1">
                                        {repo.description || 'No description available'}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 text-terminal-dim text-sm">
                Total {projects.length} directories
            </div>
        </div>
    );
};

import React from 'react';
import { CONFIG } from '../../utils/config';

export const LogHistory: React.FC = () => {
    return (
        <div className="mb-12">
            <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="mr-2">{'>'}</span> LOG_HISTORY
            </h2>

            <div className="space-y-6 font-mono text-sm">
                {CONFIG.workExperience.map((exp, i) => (
                    <div key={i} className="relative pl-6 border-l border-terminal-dim">
                        <div className="absolute -left-[5px] top-0 w-2 h-2 bg-terminal-green rounded-full"></div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <span className="text-terminal-green font-bold">[{exp.startDate} - {exp.endDate || 'PRESENT'}]</span>
                            <span className="text-white">{exp.position} @ {exp.company}</span>
                            <span className={`text-xs px-1 border ${!exp.endDate ? 'border-terminal-green text-terminal-green animate-pulse' : 'border-terminal-dim text-terminal-dim'}`}>
                                {!exp.endDate ? 'RUNNING' : 'COMPLETED'}
                            </span>
                        </div>
                        <div className="text-terminal-dim space-y-1">
                            {(exp.achievements || []).map((log, j) => (
                                <div key={j} className="flex">
                                    <span className="mr-2">$</span>
                                    <span>{log}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

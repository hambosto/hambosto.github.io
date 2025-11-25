import React from 'react';
import { CONFIG } from '../../utils/config';

export const Modules: React.FC = () => {


    return (
        <div className="mb-12">
            <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="mr-2">{'>'}</span> LOADED_MODULES
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(CONFIG.customSkills).map(([category, skills], i) => (
                    <div key={i} className="border border-terminal-dim p-4">
                        <h3 className="text-terminal-green font-bold mb-3 border-b border-terminal-dim pb-2 uppercase">
                            {category}
                        </h3>
                        <ul className="space-y-2">
                            {skills.map((skill, j) => (
                                <li key={j} className="flex items-center text-sm">
                                    <span className="text-terminal-dim mr-2">[+]</span>
                                    <span>{skill.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

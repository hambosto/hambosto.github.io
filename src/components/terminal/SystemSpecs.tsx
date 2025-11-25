import React from 'react';
import { CONFIG } from '../../utils/config';

export const SystemSpecs: React.FC<any> = () => {
    const hardware = [
        ...CONFIG.customSkills.languages,
        ...CONFIG.customSkills.databases,
        ...CONFIG.customSkills.architecture,
        ...CONFIG.customSkills.api,
        ...CONFIG.customSkills.auth
    ];
    const modules = [
        ...CONFIG.customSkills.cloud,
        ...CONFIG.customSkills.devops,
        ...CONFIG.customSkills.os,
        ...CONFIG.customSkills.messaging
    ];

    return (
        <div className="mb-12 border-l-2 border-terminal-green pl-4">
            <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="mr-2">{'>'}</span> SYSTEM_SPECS
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-terminal-dim mb-2">// HARDWARE_INFO (SKILLS)</h3>
                    <div className="space-y-1">
                        {hardware.map((skill, i) => (
                            <div key={i} className="flex justify-between hover:bg-terminal-dim/20 px-2">
                                <span>{skill.name}</span>
                                <span className="text-terminal-dim">[{skill.level}%]</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-terminal-dim mb-2">// KERNEL_MODULES (TOOLS)</h3>
                    <div className="space-y-1">
                        {modules.map((tool, i) => (
                            <div key={i} className="flex justify-between hover:bg-terminal-dim/20 px-2">
                                <span>{tool.name}</span>
                                <span className="text-terminal-dim">[ACTIVE]</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

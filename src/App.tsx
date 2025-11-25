import { useRef, useState } from 'react';
import { useGitHub } from './hooks/useGitHub';
import { CONFIG } from './utils/config';
import { TerminalLayout } from './components/layout/TerminalLayout';
import { StatusBar } from './components/terminal/StatusBar';
import { CommandPrompt } from './components/ui/CommandPrompt';
import { Whoami } from './components/terminal/Whoami';
import { SystemSpecs } from './components/terminal/SystemSpecs';
import { LogHistory } from './components/terminal/LogHistory';
import { DirectoryListing } from './components/terminal/DirectoryListing';
import { Modules } from './components/terminal/Modules';
import { MailClient } from './components/terminal/MailClient';
import { NetworkConnections } from './components/terminal/NetworkConnections';
import { HackerMode } from './components/terminal/HackerMode';

function App() {
    const { data } = useGitHub(CONFIG.github.username);
    const [isHackerMode, setIsHackerMode] = useState(false);

    const whoamiRef = useRef<HTMLDivElement>(null);
    const specsRef = useRef<HTMLDivElement>(null);
    const logsRef = useRef<HTMLDivElement>(null);
    const projectsRef = useRef<HTMLDivElement>(null);
    const modulesRef = useRef<HTMLDivElement>(null);
    const networkRef = useRef<HTMLDivElement>(null);
    const mailRef = useRef<HTMLDivElement>(null);

    const handleCommand = (cmd: string) => {
        const command = cmd.toLowerCase().trim();

        const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
            ref.current?.scrollIntoView({ behavior: 'smooth' });
        };

        switch (command) {
            case 'whoami':
            case 'neofetch':
                scrollTo(whoamiRef);
                break;
            case 'cat about.md':
            case 'specs':
                scrollTo(specsRef);
                break;
            case 'tail -f experience.log':
            case 'log':
                scrollTo(logsRef);
                break;
            case 'ls projects':
            case 'ls':
                scrollTo(projectsRef);
                break;
            case 'modules':
            case 'stack':
                scrollTo(modulesRef);
                break;
            case 'netstat':
            case 'social':
            case 'connect':
                scrollTo(networkRef);
                break;
            case 'mail':
            case 'contact':
                scrollTo(mailRef);
                break;
            case 'hack':
                setIsHackerMode(true);
                break;
            case 'help':
                alert('Available commands: whoami, specs, log, ls, modules, netstat, mail, hack');
                break;
            case 'clear':
                window.scrollTo(0, 0);
                break;
            default:
                // Optional: Show error message in a real terminal buffer
                console.log(`Command not found: ${command}`);
        }
    };

    if (isHackerMode) {
        return <HackerMode onExit={() => setIsHackerMode(false)} />;
    }

    return (
        <TerminalLayout>
            <div className="max-w-4xl mx-auto p-4 sm:p-8 pb-32">
                <StatusBar />

                <div ref={whoamiRef}><Whoami user={data?.user} /></div>
                <div ref={specsRef}><SystemSpecs /></div>
                <div ref={logsRef}><LogHistory /></div>
                <div ref={modulesRef}><Modules /></div>
                <div ref={projectsRef}><DirectoryListing data={data} /></div>
                <div ref={networkRef}><NetworkConnections /></div>
                <div ref={mailRef}><MailClient /></div>

                <div className="fixed bottom-0 left-0 right-0 bg-terminal-black p-4 border-t border-terminal-dim z-50">
                    <div className="max-w-4xl mx-auto">
                        <CommandPrompt onCommand={handleCommand} />
                        <div className="text-xs text-terminal-dim mt-2">
                            Try commands: whoami, specs, log, ls, modules, netstat, mail, hack
                        </div>
                    </div>
                </div>
            </div>
        </TerminalLayout>
    );
}

export default App;


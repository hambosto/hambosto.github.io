import React, { useState, useRef, useEffect } from 'react';

interface CommandPromptProps {
    onCommand: (command: string) => void;
    currentPath?: string;
}

export const CommandPrompt: React.FC<CommandPromptProps> = ({ onCommand, currentPath = '~' }) => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            const cmd = input.trim();
            setHistory(prev => [cmd, ...prev]);
            setHistoryIndex(-1);
            onCommand(cmd);
            setInput('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex < history.length - 1) {
                const newIndex = historyIndex + 1;
                setHistoryIndex(newIndex);
                setInput(history[newIndex]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setInput(history[newIndex]);
            } else if (historyIndex === 0) {
                setHistoryIndex(-1);
                setInput('');
            }
        }
    };

    // Keep focus on input
    useEffect(() => {
        const handleClick = () => inputRef.current?.focus();
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    return (
        <form onSubmit={handleSubmit} className="flex items-center w-full mt-4">
            <span className="text-terminal-green mr-2">guest@portfolio:{currentPath}$</span>
            <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none outline-none text-terminal-green font-mono caret-terminal-green"
                autoFocus
                spellCheck={false}
                autoComplete="off"
            />
        </form>
    );
};

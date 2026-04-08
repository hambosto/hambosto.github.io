import { useState, useCallback, useEffect, useRef } from 'react';

type Op = '+' | '-' | '*' | '/' | '^' | '%';

interface HistoryItem {
    id: number;
    expression: string;
    result: string;
}

export const CalculatorApp: React.FC = () => {
    const [display, setDisplay] = useState('0');
    const [expression, setExpression] = useState('');
    const [isRadian, setIsRadian] = useState(true);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [memory, setMemory] = useState(0);
    const [prev, setPrev] = useState<string | null>(null);
    const [op, setOp] = useState<Op | null>(null);
    const [waiting, setWaiting] = useState(false);
    const [parenthesisCount, setParenthesisCount] = useState(0);
    const historyRef = useRef<HTMLDivElement>(null);
    const historyId = useRef(0);

    useEffect(() => {
        const saved = localStorage.getItem('calculator-history');
        if (saved) {
            try {
                setHistory(JSON.parse(saved));
            } catch {
                // Ignore
            }
        }
        const savedMem = localStorage.getItem('calculator-memory');
        if (savedMem) {
            try {
                setMemory(parseFloat(savedMem));
            } catch {
                // Ignore
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('calculator-history', JSON.stringify(history.slice(0, 50)));
    }, [history]);

    useEffect(() => {
        localStorage.setItem('calculator-memory', String(memory));
    }, [memory]);

    useEffect(() => {
        if (historyRef.current) {
            historyRef.current.scrollTop = historyRef.current.scrollHeight;
        }
    }, [history]);

    const playSound = useCallback((freq = 800) => {
        try {
            const ctx = new (
                window.AudioContext ||
                (window as unknown as { webkitAudioContext: typeof AudioContext })
                    .webkitAudioContext
            )();
            if (ctx.state === 'suspended') ctx.resume();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = freq;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } catch {
            // Ignore audio errors
        }
    }, []);

    const evaluate = useCallback(
        (expr: string): string => {
            try {
                let evalExpr = expr
                    .replace(/π/g, String(Math.PI))
                    .replace(/e/g, String(Math.E))
                    .replace(/×/g, '*')
                    .replace(/−/g, '-')
                    .replace(/÷/g, '/')
                    .replace(/√\(/g, 'Math.sqrt(')
                    .replace(/sin\(/g, isRadian ? 'Math.sin(' : 'Math.sin(Math.PI*')
                    .replace(/cos\(/g, isRadian ? 'Math.cos(' : 'Math.cos(Math.PI*')
                    .replace(/tan\(/g, isRadian ? 'Math.tan(' : 'Math.tan(Math.PI*')
                    .replace(/log\(/g, 'Math.log10(')
                    .replace(/ln\(/g, 'Math.log(')
                    .replace(/\^/g, '**')
                    .replace(/(\d+)\(/g, '$1*(')
                    .replace(/\)(\d+)/g, ')*$1')
                    .replace(/\)\(/g, ')*(')
                    .replace(/(\d)π/g, '$1*π')
                    .replace(/π(\d)/g, 'π*$1')
                    .replace(/(\d)e/g, '$1*e')
                    .replace(/e(\d)/g, 'e*$1');

                if (!isRadian) {
                    evalExpr = evalExpr.replace(
                        /(Math\.sin|Math\.cos|Math\.tan)\(Math\.PI\*/g,
                        '$1('
                    );
                    if (evalExpr.includes('Math.PI*')) {
                        const sinMatch = evalExpr.match(/Math\.sin\(Math\.PI\*(\d+(?:\.\d+)?)\)/g);
                        if (sinMatch) {
                            sinMatch.forEach((m) => {
                                const num = m.replace('Math.sin(Math.PI*', '').replace(')', '');
                                evalExpr = evalExpr.replace(m, `Math.sin(${num}/180*Math.PI)`);
                            });
                        }
                    }
                }

                const result = Function(`"use strict"; return (${evalExpr})`)();
                if (typeof result === 'number' && isFinite(result)) {
                    return Number.isInteger(result)
                        ? String(result)
                        : result.toPrecision(10).replace(/\.?0+$/, '');
                }
                return 'Error';
            } catch {
                return 'Error';
            }
        },
        [isRadian]
    );

    const inputDigit = useCallback(
        (d: string) => {
            playSound(600 + Math.random() * 200);
            if (waiting) {
                setDisplay(d);
                setWaiting(false);
            } else {
                setDisplay(display === '0' ? d : display + d);
            }
        },
        [display, waiting, playSound]
    );

    const inputFunction = useCallback(
        (fn: string) => {
            playSound(900);
            setDisplay((prev) => (prev === '0' ? fn + '(' : prev + fn + '('));
        },
        [playSound]
    );

    const inputConstant = useCallback(
        (c: string) => {
            playSound(700);
            setDisplay((prev) => (prev === '0' ? c : prev + c));
        },
        [playSound]
    );

    const clear = useCallback(() => {
        playSound(200);
        setDisplay('0');
        setExpression('');
        setPrev(null);
        setOp(null);
        setWaiting(false);
        setParenthesisCount(0);
    }, [playSound]);

    const clearEntry = useCallback(() => {
        playSound(250);
        setDisplay('0');
    }, [playSound]);

    const backspace = useCallback(() => {
        playSound(300);
        setDisplay((prev) => (prev.length === 1 ? '0' : prev.slice(0, -1)));
    }, [playSound]);

    const toggleSign = useCallback(() => {
        playSound(500);
        if (display !== '0' && display !== 'Error') {
            setDisplay((prev) => (prev.startsWith('-') ? prev.slice(1) : '-' + prev));
        }
    }, [display, playSound]);

    const percent = useCallback(() => {
        playSound(400);
        try {
            const result = parseFloat(display) / 100;
            setDisplay(String(result));
        } catch {
            setDisplay('Error');
        }
    }, [display, playSound]);

    const openParen = useCallback(() => {
        playSound(850);
        setDisplay((prev) => (prev === '0' ? '(' : prev + '('));
        setParenthesisCount((prev) => prev + 1);
    }, [playSound]);

    const closeParen = useCallback(() => {
        if (parenthesisCount > 0) {
            playSound(850);
            setDisplay((prev) => prev + ')');
            setParenthesisCount((prev) => prev - 1);
        }
    }, [parenthesisCount, playSound]);

    const doOperation = useCallback(
        (nextOp: Op) => {
            playSound(550);
            if (prev === null) {
                setPrev(display);
            } else if (op && !waiting) {
                const result = evaluate(`${prev}${op}${display}`);
                setDisplay(result);
                setPrev(result);
            }
            setOp(nextOp);
            setWaiting(true);
        },
        [display, op, prev, waiting, evaluate, playSound]
    );

    const equals = useCallback(() => {
        playSound(650);
        let finalExpr = prev ? `${prev}${op}${display}` : display;
        const result = evaluate(finalExpr);
        setDisplay(result);
        setExpression(`${finalExpr} =`);
        historyId.current += 1;
        setHistory((prev) => [...prev, { id: historyId.current, expression: finalExpr, result }]);
        setPrev(null);
        setOp(null);
        setWaiting(true);
        setParenthesisCount(0);
    }, [display, op, prev, evaluate, playSound]);

    const decimal = useCallback(() => {
        playSound(700);
        if (waiting) {
            setDisplay('0.');
            setWaiting(false);
        } else if (!display.includes('.')) {
            setDisplay(display + '.');
        }
    }, [display, waiting, playSound]);

    const memoryClear = useCallback(() => {
        playSound(200);
        setMemory(0);
    }, [playSound]);

    const memoryRecall = useCallback(() => {
        playSound(500);
        setDisplay((prev) => (prev === '0' ? String(memory) : prev + String(memory)));
    }, [memory, playSound]);

    const memoryAdd = useCallback(() => {
        playSound(450);
        setMemory((prev) => prev + parseFloat(display));
    }, [display, playSound]);

    const memorySubtract = useCallback(() => {
        playSound(450);
        setMemory((prev) => prev - parseFloat(display));
    }, [display, playSound]);

    const factorial = useCallback(() => {
        playSound(750);
        const n = parseInt(display);
        if (n < 0 || isNaN(n)) {
            setDisplay('Error');
            return;
        }
        let result = 1;
        for (let i = 2; i <= n; i++) result *= i;
        setDisplay(String(result));
    }, [display, playSound]);

    const square = useCallback(() => {
        playSound(600);
        const n = parseFloat(display);
        setDisplay(String(n * n));
    }, [display, playSound]);

    const sqrt = useCallback(() => {
        playSound(800);
        setDisplay((prev) => (prev === '0' ? '√(' : '√('));
    }, [playSound]);

    const toggleRadDeg = useCallback(() => {
        playSound(400);
        setIsRadian((prev) => !prev);
    }, [playSound]);

    const formatDisplay = (d: string) => {
        if (d === 'Error') return 'Error';
        if (d.length > 15) {
            try {
                return parseFloat(d).toExponential(6);
            } catch {
                return d;
            }
        }
        return d;
    };

    const btnGroups = [
        [
            { label: 'MC', action: memoryClear, color: 'blue', desc: 'Memory Clear' },
            { label: 'MR', action: memoryRecall, color: 'blue', desc: 'Memory Recall' },
            { label: 'M+', action: memoryAdd, color: 'blue', desc: 'Memory Add' },
            { label: 'M-', action: memorySubtract, color: 'blue', desc: 'Memory Subtract' },
        ],
        [
            { label: '2nd', action: () => {}, color: 'orange', desc: 'Second Function' },
            { label: 'π', action: () => inputConstant('π'), color: 'orange', desc: 'Pi' },
            { label: 'e', action: () => inputConstant('e'), color: 'orange', desc: 'Euler number' },
            { label: 'C', action: clearEntry, color: 'gray', desc: 'Clear Entry' },
        ],
        [
            { label: 'AC', action: clear, color: 'gray', desc: 'All Clear' },
            {
                label: '()',
                action: parenthesisCount > 0 ? closeParen : openParen,
                color: 'orange',
                desc: 'Parentheses',
                dynamicLabel: parenthesisCount > 0 ? ')' : '(',
            },
            { label: '%', action: percent, color: 'orange', desc: 'Percent' },
            { label: '÷', action: () => doOperation('/'), color: 'orange', desc: 'Divide' },
        ],
        [
            { label: 'sin', action: () => inputFunction('sin'), color: 'purple', desc: 'Sine' },
            { label: 'cos', action: () => inputFunction('cos'), color: 'purple', desc: 'Cosine' },
            { label: 'tan', action: () => inputFunction('tan'), color: 'purple', desc: 'Tangent' },
            { label: '×', action: () => doOperation('*'), color: 'orange', desc: 'Multiply' },
        ],
        [
            {
                label: 'sin⁻¹',
                action: () => inputFunction('asin'),
                color: 'purple',
                desc: 'Arc Sine',
            },
            {
                label: 'cos⁻¹',
                action: () => inputFunction('acos'),
                color: 'purple',
                desc: 'Arc Cosine',
            },
            {
                label: 'tan⁻¹',
                action: () => inputFunction('atan'),
                color: 'purple',
                desc: 'Arc Tangent',
            },
            { label: '−', action: () => doOperation('-'), color: 'orange', desc: 'Subtract' },
        ],
        [
            { label: 'x²', action: square, color: 'purple', desc: 'Square' },
            { label: 'xʸ', action: () => doOperation('^'), color: 'purple', desc: 'Power' },
            { label: 'n!', action: factorial, color: 'purple', desc: 'Factorial' },
            { label: '+', action: () => doOperation('+'), color: 'orange', desc: 'Add' },
        ],
        [
            { label: '√', action: sqrt, color: 'purple', desc: 'Square Root' },
            {
                label: 'log',
                action: () => inputFunction('log'),
                color: 'purple',
                desc: 'Logarithm',
            },
            {
                label: 'ln',
                action: () => inputFunction('ln'),
                color: 'purple',
                desc: 'Natural Log',
            },
            { label: '=', action: equals, color: 'orange wide', desc: 'Equals' },
        ],
        [
            {
                label: isRadian ? 'RAD' : 'DEG',
                action: toggleRadDeg,
                color: 'blue',
                desc: 'Toggle Radians/Degrees',
            },
            { label: '⌫', action: backspace, color: 'gray', desc: 'Backspace' },
            { label: '±', action: toggleSign, color: 'gray', desc: 'Toggle Sign' },
        ],
    ];

    const numPad = [
        ['7', '8', '9'],
        ['4', '5', '6'],
        ['1', '2', '3'],
        ['0', '.', '00'],
    ];

    const getKeyPress = (key: string) => {
        if (key >= '0' && key <= '9') inputDigit(key);
        else if (key === '.') decimal();
        else if (key === '+') doOperation('+');
        else if (key === '-') doOperation('-');
        else if (key === '*') doOperation('*');
        else if (key === '/') doOperation('/');
        else if (key === '^') doOperation('^');
        else if (key === 'Enter' || key === '=') equals();
        else if (key === 'Escape') clear();
        else if (key === 'Backspace') backspace();
        else if (key === '(') openParen();
        else if (key === ')') closeParen();
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                (e.key >= '0' && e.key <= '9') ||
                e.key === '.' ||
                e.key === '+' ||
                e.key === '-' ||
                e.key === '*' ||
                e.key === '/' ||
                e.key === '^' ||
                e.key === '(' ||
                e.key === ')' ||
                e.key === 'Enter' ||
                e.key === '=' ||
                e.key === 'Escape' ||
                e.key === 'Backspace'
            ) {
                e.preventDefault();
                getKeyPress(e.key);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [inputDigit, decimal, doOperation, equals, clear, backspace, openParen, closeParen]);

    return (
        <div className="h-full flex" style={{ backgroundColor: 'var(--color-bg)' }}>
            {showHistory && (
                <div
                    className="w-48 border-r flex flex-col"
                    style={{
                        borderColor: 'var(--color-border)',
                        backgroundColor: 'var(--color-bg-light)',
                    }}
                >
                    <div
                        className="p-2 text-xs font-bold"
                        style={{
                            borderBottom: '1px solid var(--color-border)',
                            color: 'var(--color-text)',
                        }}
                    >
                        History
                    </div>
                    <div ref={historyRef} className="flex-1 overflow-y-auto p-2 space-y-2">
                        {history.length === 0 ? (
                            <div
                                className="text-xs text-center"
                                style={{ color: 'var(--color-text-muted)' }}
                            >
                                No history
                            </div>
                        ) : (
                            history
                                .slice()
                                .reverse()
                                .map((item) => (
                                    <div
                                        key={item.id}
                                        className="text-xs p-1 rounded"
                                        style={{ backgroundColor: 'var(--color-bg)' }}
                                    >
                                        <div style={{ color: 'var(--color-text-muted)' }}>
                                            {item.expression}
                                        </div>
                                        <div
                                            className="font-bold"
                                            style={{ color: 'var(--color-primary)' }}
                                        >
                                            {item.result}
                                        </div>
                                    </div>
                                ))
                        )}
                    </div>
                    <button
                        onClick={() => {
                            setHistory([]);
                            localStorage.removeItem('calculator-history');
                        }}
                        className="p-2 text-xs border-t"
                        style={{
                            borderColor: 'var(--color-border)',
                            color: 'var(--color-text-muted)',
                        }}
                    >
                        Clear History
                    </button>
                </div>
            )}
            <div className="flex-1 flex flex-col">
                <div
                    className="p-2 flex items-center justify-between"
                    style={{ borderBottom: '1px solid var(--color-border)' }}
                >
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold" style={{ color: 'var(--color-text)' }}>
                            Scientific
                        </span>
                        <span
                            className="text-[10px] px-1.5 py-0.5 rounded"
                            style={{
                                backgroundColor: isRadian
                                    ? 'var(--color-success)'
                                    : 'var(--color-warning)',
                                color: 'var(--color-bg)',
                            }}
                        >
                            {isRadian ? 'RAD' : 'DEG'}
                        </span>
                        {memory !== 0 && (
                            <span
                                className="text-[10px] px-1.5 py-0.5 rounded"
                                style={{
                                    backgroundColor: 'var(--color-primary-glow)',
                                    color: 'var(--color-primary)',
                                }}
                            >
                                M
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className="text-xs p-1 rounded"
                        style={{
                            color: showHistory ? 'var(--color-primary)' : 'var(--color-text-muted)',
                        }}
                    >
                        <i className={`fas ${showHistory ? 'fa-eye-slash' : 'fa-history'}`} />
                    </button>
                </div>
                <div className="flex-1 p-2 flex flex-col justify-end">
                    <div
                        className="text-right text-2xl font-mono mb-2 px-2"
                        style={{
                            color: 'var(--color-text-muted)',
                            minHeight: 24,
                            wordBreak: 'break-all',
                        }}
                    >
                        {expression}
                    </div>
                    <div
                        className="text-right text-4xl font-mono px-2 pb-2"
                        style={{ color: 'var(--color-text)', wordBreak: 'break-all' }}
                    >
                        {formatDisplay(display)}
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-1">
                    {btnGroups.map((group, gi) => (
                        <div key={gi} className="flex gap-1 mb-1">
                            {group.map((btn, bi) => (
                                <button
                                    key={bi}
                                    onClick={btn.action}
                                    className={`flex-1 text-sm font-bold rounded transition-all active:scale-95 ${btn.color.includes('wide') ? 'col-span-2' : ''}`}
                                    style={{
                                        backgroundColor:
                                            btn.color === 'orange'
                                                ? 'var(--color-primary)'
                                                : btn.color === 'purple'
                                                  ? 'var(--color-surface)'
                                                  : btn.color === 'blue'
                                                    ? 'var(--color-bg-light)'
                                                    : 'var(--color-bg)',
                                        color:
                                            btn.color === 'orange'
                                                ? 'var(--color-bg)'
                                                : 'var(--color-text)',
                                        border: '1px solid var(--color-border)',
                                        padding: '8px 2px',
                                    }}
                                    title={btn.desc}
                                >
                                    {'dynamicLabel' in btn ? btn.dynamicLabel : btn.label}
                                </button>
                            ))}
                        </div>
                    ))}
                    <div className="flex gap-1 mb-1">
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className="flex-1 text-xs font-bold rounded transition-all active:scale-95"
                            style={{
                                backgroundColor: 'var(--color-bg-light)',
                                color: 'var(--color-text-muted)',
                                border: '1px solid var(--color-border)',
                            }}
                        >
                            {showHistory ? 'Hide' : 'Hist'}
                        </button>
                    </div>
                    {numPad.map((row, ri) => (
                        <div key={ri} className="flex gap-1 mb-1">
                            {row.map((num, ni) => (
                                <button
                                    key={ni}
                                    onClick={() =>
                                        num === '00'
                                            ? (inputDigit('0'), inputDigit('0'))
                                            : inputDigit(num)
                                    }
                                    className="flex-1 text-xl font-bold rounded transition-all active:scale-95"
                                    style={{
                                        backgroundColor: 'var(--color-surface)',
                                        color: 'var(--color-text)',
                                        border: '1px solid var(--color-border)',
                                    }}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

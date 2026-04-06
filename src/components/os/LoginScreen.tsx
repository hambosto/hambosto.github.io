import { useState, type FormEvent, type KeyboardEvent } from 'react';

interface LoginScreenProps {
    onLogin: () => void;
    avatarUrl?: string;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, avatarUrl }) => {
    const [password, setPassword] = useState('');
    const [shake, setShake] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (password === '' || password === 'guest' || password === 'password') {
            onLogin();
        } else {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            setPassword('');
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') handleSubmit(e as any);
    };

    return (
        <div className="login-screen" style={{ backgroundColor: '#050505' }}>
            <div className={`flex flex-col items-center ${shake ? 'animate-pulse' : ''}`}>
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt="User"
                        className="login-avatar"
                        style={{ borderColor: 'var(--color-border-active)' }}
                    />
                ) : (
                    <div
                        className="login-avatar flex items-center justify-center text-3xl"
                        style={{
                            backgroundColor: 'var(--color-bg)',
                            borderColor: 'var(--color-border-active)',
                        }}
                    >
                        <i className="fas fa-user" style={{ color: 'var(--color-text-dim)' }} />
                    </div>
                )}
                <h2 className="mb-1 text-lg" style={{ color: 'var(--color-primary)' }}>
                    guest
                </h2>
                <p className="text-xs mb-6" style={{ color: 'var(--color-text-dim)' }}>
                    Portfolio OS
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="login-input"
                        placeholder="Press Enter to login"
                        style={{
                            backgroundColor: 'var(--color-bg)',
                            borderColor: 'var(--color-border)',
                            color: 'var(--color-text)',
                            caretColor: 'var(--color-primary)',
                        }}
                        autoFocus
                    />
                    <button
                        type="submit"
                        className="login-btn"
                        style={{
                            backgroundColor: 'var(--color-primary-dark)',
                            color: 'var(--color-bg-dark)',
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.backgroundColor =
                                'var(--color-primary)';
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.backgroundColor =
                                'var(--color-primary-dark)';
                        }}
                    >
                        LOGIN
                    </button>
                </form>
                <p className="text-xs mt-6" style={{ color: 'var(--color-text-dim)' }}>
                    Hint: just press Enter
                </p>
            </div>
        </div>
    );
};

import { useState, type FormEvent } from 'react';

interface LoginScreenProps {
    onLogin: () => void;
    avatarUrl?: string;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, avatarUrl }) => {
    const [password, setPassword] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onLogin();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onLogin();
        }
    };

    return (
        <div className="login-screen">
            <div className="flex flex-col items-center">
                {avatarUrl ? (
                    <img src={avatarUrl} alt="User" className="login-avatar" />
                ) : (
                    <div
                        className="login-avatar flex items-center justify-center text-2xl"
                        style={{ backgroundColor: 'var(--color-bg)' }}
                    >
                        <i className="fas fa-user" style={{ color: 'var(--color-text-muted)' }} />
                    </div>
                )}
                <h2
                    className="mb-0.5 text-base font-semibold"
                    style={{ color: 'var(--color-text)' }}
                >
                    guest
                </h2>
                <p className="text-xs mb-8" style={{ color: 'var(--color-text-muted)' }}>
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
                        autoFocus
                    />
                    <button type="submit" className="login-btn">
                        LOGIN
                    </button>
                </form>
                <p className="text-[11px] mt-8" style={{ color: 'var(--color-text-muted)' }}>
                    Hint: just press Enter
                </p>
            </div>
        </div>
    );
};

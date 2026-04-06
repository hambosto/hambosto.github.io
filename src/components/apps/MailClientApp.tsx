import React, { useState, type FormEvent, type ChangeEvent } from 'react';
import { CONFIG } from '../../utils/config';

export const MailClientApp: React.FC = () => {
    const [status, setStatus] = useState<'IDLE' | 'SENDING' | 'SENT' | 'ERROR'>('IDLE');
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setStatus('SENDING');
        try {
            const response = await fetch('https://formspree.io/f/xkgjvwpz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, _replyto: formData.email }),
            });
            if (response.ok) {
                setStatus('SENT');
                setFormData({ name: '', email: '', subject: '', message: '' });
                setTimeout(() => setStatus('IDLE'), 5000);
            } else {
                setStatus('ERROR');
                setTimeout(() => setStatus('IDLE'), 3000);
            }
        } catch {
            setStatus('ERROR');
            setTimeout(() => setStatus('IDLE'), 3000);
        }
    };

    const fieldStyle: React.CSSProperties = {
        background: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        outline: 'none',
        color: 'var(--color-text)',
        fontFamily: "'Fira Code', monospace",
        fontSize: '13px',
        padding: '8px 12px',
        width: '100%',
        caretColor: 'var(--color-primary)',
        borderRadius: '2px',
        transition: 'border-color 0.2s, box-shadow 0.2s',
    };

    return (
        <div className="h-full flex flex-col" style={{ backgroundColor: '#0a0a0a' }}>
            <div
                className="flex items-center gap-2 px-3 py-2 text-xs font-mono"
                style={{
                    borderBottom: '1px solid var(--color-border)',
                    backgroundColor: '#111111',
                }}
            >
                <i className="fas fa-envelope" style={{ color: 'var(--color-primary)' }} />
                <span style={{ color: 'var(--color-text)' }}>Compose — New Message</span>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
                <div
                    className="flex items-center gap-3 mb-6 p-3 rounded-sm"
                    style={{
                        backgroundColor: '#111111',
                        border: '1px solid var(--color-border)',
                    }}
                >
                    <i
                        className="fas fa-user-circle text-xl"
                        style={{ color: 'var(--color-primary)' }}
                    />
                    <div>
                        <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                            To:
                        </div>
                        <div className="text-sm" style={{ color: 'var(--color-text)' }}>
                            {CONFIG.personal.email}
                        </div>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {[
                        {
                            id: 'name',
                            label: 'Your Name',
                            placeholder: 'John Doe',
                            type: 'text',
                            icon: 'fa-user',
                        },
                        {
                            id: 'email',
                            label: 'Reply-To',
                            placeholder: 'your@email.com',
                            type: 'email',
                            icon: 'fa-reply',
                        },
                        {
                            id: 'subject',
                            label: 'Subject',
                            placeholder: 'Connection Request',
                            type: 'text',
                            icon: 'fa-tag',
                        },
                    ].map((field) => (
                        <div key={field.id}>
                            <label
                                htmlFor={field.id}
                                className="text-xs mb-1 block"
                                style={{ color: 'var(--color-text-dim)' }}
                            >
                                <i
                                    className={`fas ${field.icon} mr-1`}
                                    style={{ color: 'var(--color-primary)' }}
                                />
                                {field.label}
                            </label>
                            <input
                                id={field.id}
                                name={field.id}
                                type={field.type}
                                value={(formData as any)[field.id]}
                                onChange={handleChange}
                                style={fieldStyle}
                                placeholder={field.placeholder}
                                required
                                onFocus={(e) => {
                                    (e.target as HTMLElement).style.borderColor =
                                        'var(--color-primary)';
                                    (e.target as HTMLElement).style.boxShadow =
                                        '0 0 0 1px var(--color-primary-glow)';
                                }}
                                onBlur={(e) => {
                                    (e.target as HTMLElement).style.borderColor =
                                        'var(--color-border)';
                                    (e.target as HTMLElement).style.boxShadow = 'none';
                                }}
                            />
                        </div>
                    ))}
                    <div>
                        <label
                            htmlFor="message"
                            className="text-xs mb-1 block"
                            style={{ color: 'var(--color-text-dim)' }}
                        >
                            <i
                                className="fas fa-align-left mr-1"
                                style={{ color: 'var(--color-primary)' }}
                            />
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full resize-none"
                            style={{ ...fieldStyle, height: 160, lineHeight: 1.6 }}
                            placeholder="Write your message here..."
                            required
                            onFocus={(e) => {
                                (e.target as HTMLElement).style.borderColor =
                                    'var(--color-primary)';
                                (e.target as HTMLElement).style.boxShadow =
                                    '0 0 0 1px var(--color-primary-glow)';
                            }}
                            onBlur={(e) => {
                                (e.target as HTMLElement).style.borderColor = 'var(--color-border)';
                                (e.target as HTMLElement).style.boxShadow = 'none';
                            }}
                        />
                    </div>
                    <div
                        className="flex items-center justify-between pt-4"
                        style={{ borderTop: '1px solid var(--color-border)' }}
                    >
                        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                            {status === 'SENT' && '✓ Message sent successfully'}
                            {status === 'ERROR' && '✗ Transmission failed'}
                            {status === 'SENDING' && '⟳ Encrypting & sending...'}
                        </span>
                        <button
                            type="submit"
                            disabled={status !== 'IDLE'}
                            className="px-6 py-2 text-xs font-bold rounded-sm border transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                                borderColor: 'var(--color-primary)',
                                color:
                                    status === 'IDLE'
                                        ? 'var(--color-bg-dark)'
                                        : 'var(--color-text-dim)',
                                backgroundColor:
                                    status === 'IDLE'
                                        ? 'var(--color-primary)'
                                        : 'var(--color-bg-light)',
                            }}
                            onMouseEnter={(e) => {
                                if (status === 'IDLE') {
                                    (e.currentTarget as HTMLElement).style.boxShadow =
                                        '0 0 12px var(--color-primary-glow-strong)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                            }}
                        >
                            <i className="fas fa-paper-plane mr-1" /> SEND
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

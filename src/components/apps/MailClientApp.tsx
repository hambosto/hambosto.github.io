import React, { useState, type FormEvent, type ChangeEvent } from 'react';
import { CONFIG } from '../../utils/config';

type FormData = Record<string, string>;

export const MailClientApp: React.FC = () => {
    const [status, setStatus] = useState<'IDLE' | 'SENDING' | 'SENT' | 'ERROR'>('IDLE');
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

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

    const inputStyle: React.CSSProperties = {
        background: 'var(--color-bg-light)',
        border: '1px solid var(--color-border)',
        outline: 'none',
        color: 'var(--color-text)',
        fontFamily: 'var(--font-sans)',
        fontSize: '13px',
        padding: '10px 12px',
        width: '100%',
        caretColor: 'var(--color-primary)',
        borderRadius: '8px',
        transition: 'border-color 0.15s, box-shadow 0.15s',
    };

    return (
        <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
            {/* Header */}
            <div
                className="flex items-center gap-2 px-4 py-3"
                style={{ borderBottom: '1px solid var(--color-border)' }}
            >
                <i className="fas fa-envelope text-sm" style={{ color: 'var(--color-primary)' }} />
                <span className="text-[13px] font-semibold" style={{ color: 'var(--color-text)' }}>
                    Contact
                </span>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
                {/* Recipient */}
                <div
                    className="flex items-center gap-3 mb-5 p-3 rounded-xl"
                    style={{
                        backgroundColor: 'var(--color-bg-light)',
                        border: '1px solid var(--color-border)',
                    }}
                >
                    <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'var(--color-primary-glow)' }}
                    >
                        <i
                            className="fas fa-user text-xs"
                            style={{ color: 'var(--color-primary)' }}
                        />
                    </div>
                    <div>
                        <div className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                            To:
                        </div>
                        <div
                            className="text-[13px] font-medium"
                            style={{ color: 'var(--color-text)' }}
                        >
                            {CONFIG.personal.email}
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    {[
                        { id: 'name', label: 'Name', placeholder: 'Your name', type: 'text' },
                        {
                            id: 'email',
                            label: 'Email',
                            placeholder: 'your@email.com',
                            type: 'email',
                        },
                        {
                            id: 'subject',
                            label: 'Subject',
                            placeholder: "What's this about?",
                            type: 'text',
                        },
                    ].map((field) => (
                        <div key={field.id}>
                            <label
                                htmlFor={field.id}
                                className="text-[11px] font-medium mb-1.5 block"
                                style={{ color: 'var(--color-text-muted)' }}
                            >
                                {field.label}
                            </label>
                            <input
                                id={field.id}
                                name={field.id}
                                type={field.type}
                                value={formData[field.id]}
                                onChange={handleChange}
                                style={inputStyle}
                                placeholder={field.placeholder}
                                required
                                onFocus={(e) => {
                                    (e.target as HTMLElement).style.borderColor =
                                        'var(--color-primary)';
                                    (e.target as HTMLElement).style.boxShadow =
                                        '0 0 0 3px var(--color-primary-glow)';
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
                            className="text-[11px] font-medium mb-1.5 block"
                            style={{ color: 'var(--color-text-muted)' }}
                        >
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full resize-none"
                            style={{ ...inputStyle, height: 140, lineHeight: 1.6 }}
                            placeholder="Write your message..."
                            required
                            onFocus={(e) => {
                                (e.target as HTMLElement).style.borderColor =
                                    'var(--color-primary)';
                                (e.target as HTMLElement).style.boxShadow =
                                    '0 0 0 3px var(--color-primary-glow)';
                            }}
                            onBlur={(e) => {
                                (e.target as HTMLElement).style.borderColor = 'var(--color-border)';
                                (e.target as HTMLElement).style.boxShadow = 'none';
                            }}
                        />
                    </div>
                    <div
                        className="flex items-center justify-between pt-3"
                        style={{ borderTop: '1px solid var(--color-border)' }}
                    >
                        <span
                            className="text-[12px]"
                            style={{
                                color:
                                    status === 'SENT'
                                        ? 'var(--color-success)'
                                        : status === 'ERROR'
                                          ? 'var(--color-error)'
                                          : 'var(--color-text-muted)',
                            }}
                        >
                            {status === 'SENT' && 'Message sent!'}
                            {status === 'ERROR' && 'Failed to send'}
                            {status === 'SENDING' && 'Sending...'}
                        </span>
                        <button
                            type="submit"
                            disabled={status !== 'IDLE'}
                            className="px-5 py-2 text-[12px] font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                                color: 'var(--color-bg-dark)',
                                backgroundColor: 'var(--color-primary)',
                            }}
                            onMouseEnter={(e) => {
                                if (status === 'IDLE')
                                    (e.currentTarget as HTMLElement).style.opacity = '0.9';
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.opacity = '1';
                            }}
                        >
                            <i className="fas fa-paper-plane mr-1.5" /> Send
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

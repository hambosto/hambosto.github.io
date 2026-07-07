/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, useCallback } from 'react';

interface Notification {
    id: string;
    title: string;
    message: string;
    icon: string;
    type: 'info' | 'success' | 'warning' | 'error';
    duration?: number;
}

let notificationId = 0;
const listeners = new Set<(n: Notification) => void>();

export function pushNotification(opts: Omit<Notification, 'id'>) {
    const notif: Notification = { ...opts, id: `notif-${++notificationId}` };
    listeners.forEach((fn) => fn(notif));
    return notif.id;
}

export const NotificationToast: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        const handler = (n: Notification) => {
            setNotifications((prev) => [...prev, n]);
            if (n.duration !== 0) {
                setTimeout(() => {
                    setNotifications((prev) => prev.filter((x) => x.id !== n.id));
                }, n.duration ?? 4000);
            }
        };
        listeners.add(handler);
        return () => {
            listeners.delete(handler);
        };
    }, []);

    const dismiss = useCallback((id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const typeStyles = {
        info: {
            icon: 'fa-solid fa-info-circle',
            color: 'var(--color-primary)',
        },
        success: {
            icon: 'fa-solid fa-check-circle',
            color: 'var(--color-success)',
        },
        warning: {
            icon: 'fa-solid fa-exclamation-triangle',
            color: 'var(--color-warning)',
        },
        error: {
            icon: 'fa-solid fa-times-circle',
            color: 'var(--color-error)',
        },
    };

    return (
        <div className="fixed top-4 right-4 z-[99997] flex flex-col gap-2 max-w-xs w-full pointer-events-none">
            {notifications.map((n) => {
                const style = typeStyles[n.type];
                return (
                    <div
                        key={n.id}
                        className="pointer-events-auto rounded-xl p-3 animate-slide-up flex items-start gap-3"
                        style={{
                            backgroundColor: 'var(--color-bg)',
                            border: '1px solid var(--color-border)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                        }}
                    >
                        <i
                            className={`${style.icon} text-sm mt-0.5`}
                            style={{ color: style.color }}
                        />
                        <div className="flex-1 min-w-0">
                            <div
                                className="text-[13px] font-semibold"
                                style={{ color: 'var(--color-text)' }}
                            >
                                {n.title}
                            </div>
                            <div
                                className="text-[11px] mt-0.5 leading-relaxed"
                                style={{ color: 'var(--color-text-muted)' }}
                            >
                                {n.message}
                            </div>
                        </div>
                        <button
                            className="text-xs shrink-0 opacity-50 hover:opacity-100 transition-opacity"
                            style={{ color: 'var(--color-text-muted)' }}
                            onClick={() => dismiss(n.id)}
                        >
                            <i className="fa-solid fa-xmark" />
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

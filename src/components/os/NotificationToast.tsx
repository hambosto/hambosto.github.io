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
            border: 'var(--color-primary)',
            icon: 'fa-solid fa-info-circle',
            color: 'var(--color-primary)',
        },
        success: {
            border: 'var(--color-success)',
            icon: 'fa-solid fa-check-circle',
            color: 'var(--color-success)',
        },
        warning: {
            border: 'var(--color-warning)',
            icon: 'fa-solid fa-exclamation-triangle',
            color: 'var(--color-warning)',
        },
        error: {
            border: 'var(--color-error)',
            icon: 'fa-solid fa-times-circle',
            color: 'var(--color-error)',
        },
    };

    return (
        <div className="fixed top-4 right-4 z-[99997] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
            {notifications.map((n) => {
                const style = typeStyles[n.type];
                return (
                    <div
                        key={n.id}
                        className="pointer-events-auto rounded-sm border p-3 animate-slide-up flex items-start gap-3"
                        style={{
                            backgroundColor: 'var(--color-bg-light)',
                            borderColor: style.border,
                            boxShadow: `0 4px 16px rgba(0,0,0,0.6), 0 0 1px ${style.border}`,
                        }}
                    >
                        <i
                            className={`${style.icon} text-sm mt-0.5`}
                            style={{ color: style.color }}
                        />
                        <div className="flex-1 min-w-0">
                            <div
                                className="text-xs font-bold"
                                style={{ color: 'var(--color-text)' }}
                            >
                                {n.title}
                            </div>
                            <div
                                className="text-[11px] mt-0.5"
                                style={{ color: 'var(--color-text-dim)' }}
                            >
                                {n.message}
                            </div>
                        </div>
                        <button
                            className="text-xs shrink-0"
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

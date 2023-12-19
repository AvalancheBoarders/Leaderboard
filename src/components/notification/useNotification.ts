import { useState } from 'react';
import { type notifiactionType } from './Notification';
import { Notification } from './Notification';

/**
 * Returns a notification object and various functions to show notifications in a certain way.
 * These functions handle the state of the notification object and can show notification
 * temporarily when eg setTimeout is used.
 */
export default function useNotificaiton(): {
    notification: Notification;
    toggle: () => void;
    showTemporarily: (text: string, notifiactionType?: notifiactionType) => void;
} {
    const [notification, setNotification] = useState<Notification>({
        visible: false,
        text: '',
        type: Notification.defaultType(),
    });

    const toggle = (): void => {
        setNotification((prev) => ({ ...prev, visible: !prev.visible }));
    };

    const showTemporarily = (text: string, notifiactionType?: notifiactionType): void => {
        setNotification({
            visible: true,
            text,
            type: notifiactionType === undefined ? Notification.defaultType() : notifiactionType,
        });
        setTimeout(() => {
            setNotification(Notification.emptyNotification());
        }, 2000);
    };

    return {
        notification,
        toggle,
        showTemporarily,
    };
}
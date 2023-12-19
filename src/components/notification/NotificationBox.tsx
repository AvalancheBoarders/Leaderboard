import * as React from 'react';
import './notification.css';
import { type Notification } from './Notification';

export interface INotificationProps {
    notification: Notification;
}

/**
 * Renders a fixed notification box at the bottom lefft
 * @param notification notification object which visibility, type, name etc..
 */
export default function NotificationBox({ notification }: INotificationProps): JSX.Element {
    const className = `notification ${notification.type}`;
    return <>{notification.visible && <div className={className}>{notification.text}</div>}</>;
}
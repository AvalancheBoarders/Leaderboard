export type notifiactionType = 'successful' | 'warning' | 'error';

export class Notification {
    visible: boolean;
    text: string;
    type: notifiactionType;

    constructor(visible: boolean, text: string, type?: notifiactionType) {
        this.visible = visible;
        this.text = text;
        this.type = type === undefined ? Notification.defaultType() : type;
    }

    static defaultType(): notifiactionType {
        return 'successful';
    }

    static emptyNotification(): Notification {
        return { visible: false, text: '', type: Notification.defaultType() };
    }
}
export interface IHighlightProps {
    text: string;
}

export function Highlight({ text }: IHighlightProps) {
    return <p className="font-bold text-ava-primary">{text}</p>;
}

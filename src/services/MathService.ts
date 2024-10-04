export class MathService {
    public static round(value: number, decimals: number) {
        const multiplier = Math.pow(10, decimals);
        return Math.round(value * multiplier) / multiplier;
    }
}

export class UtilService {
    public static sum(values: number[]) {
        return values.reduce((prev, curr) => prev + curr, 0);
    }
}

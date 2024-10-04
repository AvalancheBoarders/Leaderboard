export class UtilService {
    public static sum(values: number[]) {
        return values.reduce((prev, curr) => prev + curr, 0);
    }

    public static round(value: number, decimals: number) {
        const multiplier = Math.pow(10, decimals);
        return Math.round(value * multiplier) / multiplier;
    }

    /** Sort two items by date. */
    public static sortDate(a: string, b: string, newToOld: boolean = true) {
        const order = newToOld ? 1 : -1;

        if (a > b) {
            return -1 * order;
        } else if (a < b) {
            return 1 * order;
        } else {
            return 0;
        }
    }

    /**
     * Returns the date in string format in the form of: 7 Okt 2024
     * @param date formate YYYY-MM-DD
     */
    public static formatDate(date: string): string {
        const monthNamesAbr = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Okt", "Nov", "Dec"];
        const yearMonthDay: string[] = date.split("-");
        const year = parseInt(yearMonthDay[0]);
        const month = parseInt(yearMonthDay[1]);
        const day = parseInt(yearMonthDay[2]);
        return day + " " + monthNamesAbr[month - 1] + " " + year;
    }
}

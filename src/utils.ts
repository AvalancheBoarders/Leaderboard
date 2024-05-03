/**
 * Returns the date in string format in the form of: 7 Okt 2024
 * @param date formate YYYY-MM-DD
 */
export const formatDate = (date: string): string => {
    const monthNamesAbr = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Okt", "Nov", "Dec"]
    const yearMonthDay: string[] = date.split("-")
    const year = parseInt(yearMonthDay[0])
    const month = parseInt(yearMonthDay[1])
    const day = parseInt(yearMonthDay[2])
    console.log(year, month, day)
    return day + " " + monthNamesAbr[month-1] + " " + year;
}
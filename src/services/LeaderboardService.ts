import { IBill, ILeaderboard, ILeaderboardItem, IUserDrinkData, LeaderBoardMode } from "../models/models";
import { UtilService } from "./UtilService";

export class LeaderboardService {
    public static aggregate(bills: IBill[], dates: [Date, Date]): IUserDrinkData[] {
        const leaderboard: IUserDrinkData[] = [];
        for (const bill of bills) {
            if (UtilService.withinDates(new Date(bill.date), dates)) {
                for (const item of bill.items) {
                    if (leaderboard.some((el: IUserDrinkData) => el.user.userID === item.user.userID)) {
                        for (const it in leaderboard) {
                            if (leaderboard[it].user.userID === item.user.userID) {
                                leaderboard[it].quantity += item.quantity;
                                leaderboard[it].quantityShots += item.quantityShots;
                                leaderboard[it].evenings += 1;
                                if (item.quantity + item.quantityShots > leaderboard[it].maxInOneNight) {
                                    leaderboard[it].maxInOneNight = item.quantity + item.quantityShots;
                                    leaderboard[it].maxInOneNightBeers = item.quantity;
                                    leaderboard[it].maxInOneNightShots = item.quantityShots;
                                }
                                break;
                            }
                        }
                    } else {
                        leaderboard.push({
                            user: item.user,
                            quantity: item.quantity,
                            quantityShots: item.quantityShots,
                            evenings: 1,
                            maxInOneNight: item.quantity + item.quantityShots,
                            maxInOneNightShots: item.quantityShots,
                            maxInOneNightBeers: item.quantity,
                        });
                    }
                }
            }
        }
        return leaderboard;
    }

    private static formatValueDivision(values: number[], percentage: boolean = false): string {
        const total = UtilService.sum(values);
        if (percentage) {
            return values
                .reduce((prev, curr) => prev + `${UtilService.round(100 * (curr / total), 0)}% | `, "")
                .slice(0, -3);
        }
        return values.reduce((prev, curr) => prev + `${curr} | `, "").slice(0, -3);
    }

    private static mostDrinksOneNight(drinkingStats: IUserDrinkData[]): ILeaderboardItem[] {
        return drinkingStats.map((item) => {
            return {
                user: item.user,
                values: [item.maxInOneNightBeers, item.maxInOneNightShots],
                sublabel: this.formatValueDivision([item.maxInOneNightBeers, item.maxInOneNightShots]),
                label: `${item.maxInOneNight} drinks`,
            };
        });
    }

    private static mostDrinks(drinkingStats: IUserDrinkData[]): ILeaderboardItem[] {
        return drinkingStats.map((item) => {
            return {
                user: item.user,
                values: [item.quantity, item.quantityShots],
                sublabel: this.formatValueDivision([item.quantity, item.quantityShots]),
                label: `${item.quantity + item.quantityShots} drinks`,
            };
        });
    }

    private static mostEvenings(drinkingStats: IUserDrinkData[]): ILeaderboardItem[] {
        return drinkingStats.map((item) => {
            return { user: item.user, values: [item.evenings], sublabel: null, label: `${item.evenings} evenings` };
        });
    }

    private static mostDrinksRatio(drinkingStats: IUserDrinkData[]): ILeaderboardItem[] {
        return drinkingStats.map((item) => {
            return {
                user: item.user,
                values: [
                    UtilService.round(item.quantity / item.evenings, 1),
                    UtilService.round(item.quantityShots / item.evenings, 1),
                ],
                sublabel: this.formatValueDivision([item.quantity, item.quantityShots], true),
                label: `${UtilService.round((item.quantity + item.quantityShots) / item.evenings, 1)} d/n`,
            };
        });
    }

    public static stackedBarsBackground(values: number[]): string {
        const total = UtilService.sum(values);
        let background = `linear-gradient(to right, #009579 0%`;
        const colors = ["#009579", "#05715dff"];
        for (let i = 0; i < values.length - 1; i++) {
            const v = 100 * (UtilService.sum(values.slice(0, i + 1)) / total);
            background += `, ${colors[i]} ${v}%, ${colors[i + 1]} ${v}%`;
        }
        background += `, ${colors[values.length - 1]} 100%`;
        return background;
    }

    public static computeStats(leaderboardMode: LeaderBoardMode, drinkingStats: IUserDrinkData[]): ILeaderboard {
        let stats: ILeaderboardItem[];
        if (leaderboardMode === LeaderBoardMode.MOST_DRINKS) {
            stats = this.mostDrinks(drinkingStats);
        } else if (leaderboardMode === LeaderBoardMode.MOST_DRINKS_RATIO) {
            stats = this.mostDrinksRatio(drinkingStats);
        } else if (leaderboardMode === LeaderBoardMode.MOST_EVENINGS) {
            stats = this.mostEvenings(drinkingStats);
        } else if (leaderboardMode === LeaderBoardMode.MOST_DRINKS_ONE_NIGHT) {
            stats = this.mostDrinksOneNight(drinkingStats);
        } else {
            console.log("set default leaderboardmode");
            stats = [];
        }

        const sorted = stats.sort((a, b) => UtilService.sum(b.values) - UtilService.sum(a.values));
        const maxStat = sorted.length === 0 ? 0 : UtilService.sum(sorted[0].values);
        return { values: sorted, max: maxStat };
    }
}

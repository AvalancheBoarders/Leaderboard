import * as React from "react";
import { IBill, Item, User } from "../../App";
import { useEffect, useState } from "react";

export interface ILeaderBoardProps {
    users: User[];
    bills: IBill[];
}

interface UserDrinkData extends Item {
    evenings: number;
    maxInOneNight: number;
    maxInOneNightShots: number;
    maxInOneNightBeers: number;
}

export interface LeaderBoardItem {
    user: User;
    quantity: number;
    quantityShots: number;
}

const aggregate = (bills: IBill[], users: any, yearSelected: string) => {
    const leaderboard: UserDrinkData[] = [];
    for (const bill of bills) {
        const d = new Date(bill.date);
        const dateCompare1 = new Date(yearSelected.concat("-08-01"));
        const dateCompare2 = new Date((parseInt(yearSelected) + 1).toString().concat("-08-01"));
        if (dateCompare1 < d && d < dateCompare2) {
            for (const item of bill.items) {
                if (leaderboard.some((el: UserDrinkData) => el.user.userID === item.user.userID)) {
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
};

enum LeaderBoardMode {
    MOST_DRINKS = 0,
    MOST_EVENINGS = 1,
    MOST_DRINKS_ONE_NIGHT = 2,
    MOST_DRINKS_RATIO = 3,
}

const most_drinks_one_night = (drinkingStats: UserDrinkData[]) => {
    return drinkingStats.map((item) => {
        return {
            user: item.user,
            quantity: item.maxInOneNightBeers,
            quantityShots: item.maxInOneNightShots,
        };
    });
};

const most_drinks = (drinkingStats: UserDrinkData[]) => {
    return drinkingStats.map((item) => {
        return { user: item.user, quantity: item.quantity, quantityShots: item.quantityShots };
    });
};

const most_evenings = (drinkingStats: UserDrinkData[]) => {
    return drinkingStats.map((item) => {
        return { user: item.user, quantity: item.evenings, quantityShots: item.quantityShots };
    });
};

const most_drinks_ratio = (drinkingStats: UserDrinkData[]) => {
    return drinkingStats.map((item) => {
        return {
            user: item.user,
            quantity: Math.round(((item.quantity + item.quantityShots) * 10) / item.evenings) / 10,
            quantityShots: item.quantityShots,
        };
    });
};

const compute_stats = (leaderboardMode: LeaderBoardMode, drinkingStats: UserDrinkData[]) => {
    let stats: LeaderBoardItem[];
    let label: string;
    if (leaderboardMode === LeaderBoardMode.MOST_DRINKS) {
        stats = most_drinks(drinkingStats);
        label = "drinks";
    } else if (leaderboardMode === LeaderBoardMode.MOST_DRINKS_RATIO) {
        stats = most_drinks_ratio(drinkingStats);
        label = "drinks / evening";
    } else if (leaderboardMode === LeaderBoardMode.MOST_EVENINGS) {
        stats = most_evenings(drinkingStats);
        label = "evenings";
    } else if (leaderboardMode === LeaderBoardMode.MOST_DRINKS_ONE_NIGHT) {
        stats = most_drinks_one_night(drinkingStats);
        label = "drinks";
    } else {
        console.log("set default leaderboardmode");
        stats = [];
        label = "";
    }

    const sorted = stats.sort((a, b) =>
        leaderboardMode === LeaderBoardMode.MOST_DRINKS_RATIO
            ? b.quantity - a.quantity
            : b.quantity + b.quantityShots - (a.quantity + a.quantityShots)
    );
    return {
        label: label,
        maxStat:
            leaderboardMode === LeaderBoardMode.MOST_DRINKS_RATIO
                ? sorted[0]?.quantity
                : sorted[0]?.quantity + sorted[0]?.quantityShots,
        statsList: stats,
    };
};

export function LeaderBoard({ users, bills }: ILeaderBoardProps) {
    const [yearSelected, setYearSelected] = useState<string>(new Date().getFullYear().toString());
    const [drinkingStats, setDrinkingStats] = useState(
        aggregate(bills, users, yearSelected).sort(
            (a, b) => b.quantity + b.quantityShots - (a.quantity + a.quantityShots)
        )
    );
    const totalDrinks = drinkingStats.reduce((partialSum, a) => partialSum + a.quantity, 0);
    const [leaderboardMode, setLeaderboardMode] = useState<LeaderBoardMode>(LeaderBoardMode.MOST_DRINKS);
    const [leaderboard, setLeaderboard] = useState<{
        maxStat: number;
        label: string;
        statsList: LeaderBoardItem[];
    }>({ label: "drinks", maxStat: 100, statsList: most_drinks(drinkingStats) });

    const eves = bills.filter((item) => {
        const d = new Date(item.date);
        const dateCompare1 = new Date(yearSelected.concat("-08-01"));
        const dateCompare2 = new Date((parseInt(yearSelected) + 1).toString().concat("-08-01"));
        if (dateCompare1 < d && d < dateCompare2) {
            return true;
        } else {
            return false;
        }
    });

    const handleInput = (value: string) => {
        if (value.includes("20")) {
            setYearSelected(() => value as string);
        } else {
            setLeaderboardMode(() => parseInt(value) as LeaderBoardMode); // Hacky - value is a string of the enum number value
        }
    };

    useEffect(() => {
        setLeaderboard(() => compute_stats(leaderboardMode, drinkingStats));
    }, [leaderboardMode, drinkingStats]);

    useEffect(() => {
        setDrinkingStats(
            aggregate(bills, users, yearSelected).sort(
                (a, b) => b.quantity + b.quantityShots - (a.quantity + a.quantityShots)
            )
        );
    }, [bills, users, yearSelected]);

    // i think i need to be permanently banned from using inline logic
    return (
        <>
            <div className="leaderboard-header">
                <h1 className="text-2xl font-bold text-center text-ava-primary">Avalanche Drinking Leaderboard</h1>
                <div className="p-2">
                    <div className="relative w-full h-7 bg-bar-bg rounded overflow-hidden">
                        <div className="h-full bg-bar-fill" style={{ width: `${(totalDrinks * 100) / 1500}%` }}></div>
                        <span className="right-1 text-white font-bold font-quick absolute top-1/2 -translate-y-1/2 text-sm">
                            Progress {totalDrinks} / 1500 drinks
                        </span>
                    </div>
                </div>
                <div className="flex flex-row p-2 justify-between items-center mb-1">
                    <div className="flex flex-col w-40 font-quick">
                        <div className="row">
                            <Highlight text={"Total drinks:"} />
                            <p>{totalDrinks}</p>
                        </div>
                        <div className="row">
                            <Highlight text={"Evenings:"} />
                            <p>{eves.length}</p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between gap-1 w-4/12">
                        <select
                            className="p-0 mr-2"
                            onChange={(e) => handleInput(e.target.value)}
                            value={leaderboardMode}
                        >
                            <option value={LeaderBoardMode.MOST_DRINKS}>Most drinks</option>
                            <option value={LeaderBoardMode.MOST_DRINKS_ONE_NIGHT}>Most drinks in one night</option>
                            <option value={LeaderBoardMode.MOST_EVENINGS}>Most loyal member</option>
                            <option value={LeaderBoardMode.MOST_DRINKS_RATIO}>Most drinks / night</option>
                        </select>
                        <select className="p-0 mr-2" onChange={(e) => handleInput(e.target.value)} value={yearSelected}>
                            <option value={2024}>2024</option>
                            <option value={2023}>2023</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="overflow-y-auto">
                {leaderboard.statsList.map((leaderboardItem, idx) => (
                    <div className="flex flex-row justify-between px-2 py-02 gap-02" key={leaderboardItem.user.userID}>
                        <p className="w-28 overflow-hidden text-nowrap">
                            {idx + 1}. {leaderboardItem.user.firstName}
                        </p>
                        <div className="relative w-full h-7 rounded overflow-hidden bg-bar-bg">
                            <span className="left-1 text-white font-bold font-quick absolute top-1/2 -translate-y-1/2 text-sm">
                                {leaderboardMode === LeaderBoardMode.MOST_DRINKS_RATIO
                                    ? `${Math.round((leaderboardItem.quantity * 100) / (leaderboardItem.quantity + leaderboardItem.quantityShots))}% | ${100 - Math.round((leaderboardItem.quantity * 100) / (leaderboardItem.quantity + leaderboardItem.quantityShots))}%`
                                    : leaderboardMode !== LeaderBoardMode.MOST_EVENINGS
                                      ? `${leaderboardItem.quantity} | ${leaderboardItem.quantityShots}`
                                      : ""}
                            </span>
                            <div
                                className="h-full bg-bar-fill"
                                style={{
                                    width: `${
                                        ((leaderboardMode === LeaderBoardMode.MOST_DRINKS_RATIO
                                            ? leaderboardItem.quantity
                                            : leaderboardItem.quantity + leaderboardItem.quantityShots) *
                                            100) /
                                        leaderboard.maxStat
                                    }%`,
                                    background: `${
                                        leaderboardItem.quantityShots > 0 &&
                                        leaderboardMode !== LeaderBoardMode.MOST_EVENINGS
                                            ? `linear-gradient(to right, #009579 0%, #009579 ${(leaderboardItem.quantity * 100) / (leaderboardItem.quantity + leaderboardItem.quantityShots)}%, #05715dff ${(leaderboardItem.quantity * 100) / (leaderboardItem.quantity + leaderboardItem.quantityShots)}%, #05715dff 100%)`
                                            : ``
                                    }`,
                                }}
                            ></div>
                            <span className="right-1 text-white font-bold font-quick absolute top-1/2 -translate-y-1/2 text-sm">
                                {leaderboardMode === LeaderBoardMode.MOST_DRINKS_RATIO
                                    ? leaderboardItem.quantity
                                    : leaderboardItem.quantity + leaderboardItem.quantityShots}{" "}
                                {leaderboard.label}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export interface IHighlightProps {
    text: string;
}

export function Highlight({ text }: IHighlightProps) {
    return <p className="font-bold text-ava-primary">{text}</p>;
}

import * as React from "react";
import { useEffect, useState } from "react";
import { IBill, ILeaderboard, IUser, IUserDrinkData } from "../../models/models";
import { LeaderboardService } from "../../services/LeaderboardService";
import { UtilService } from "../../services/UtilService";

export interface ILeaderBoardProps {
    users: IUser[];
    bills: IBill[];
}

export enum LeaderBoardMode {
    MOST_DRINKS = 0,
    MOST_EVENINGS = 1,
    MOST_DRINKS_ONE_NIGHT = 2,
    MOST_DRINKS_RATIO = 3,
}

export function LeaderBoard({ users, bills }: ILeaderBoardProps) {
    const [yearSelected, setYearSelected] = useState<string>(new Date().getFullYear().toString());
    const [leaderboard, setLeaderboard] = useState<ILeaderboard>({ values: [], max: 0 });
    const [drinkingStats, setDrinkingStats] = useState<IUserDrinkData[]>(
        LeaderboardService.aggregate(bills, yearSelected)
    );
    const totalDrinks = drinkingStats.reduce((partialSum, a) => partialSum + a.quantity, 0);
    const [leaderboardMode, setLeaderboardMode] = useState<LeaderBoardMode>(LeaderBoardMode.MOST_DRINKS);

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

    const handleYearInput = (value: string) => {
        setYearSelected(() => value as string);
    };

    const handleModeInput = (value: string) => {
        setLeaderboardMode(() => parseInt(value) as LeaderBoardMode); // Hacky - value is a string of the enum number value
    };

    useEffect(() => {
        setLeaderboard(() => LeaderboardService.computeStats(leaderboardMode, drinkingStats));
    }, [leaderboardMode, drinkingStats]);

    useEffect(() => {
        setDrinkingStats(LeaderboardService.aggregate(bills, yearSelected));
    }, [bills, users, yearSelected]);

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
                            onChange={(e) => handleModeInput(e.target.value)}
                            value={leaderboardMode}
                        >
                            <option value={LeaderBoardMode.MOST_DRINKS}>Most drinks</option>
                            <option value={LeaderBoardMode.MOST_DRINKS_ONE_NIGHT}>Most drinks in one night</option>
                            <option value={LeaderBoardMode.MOST_EVENINGS}>Most loyal member</option>
                            <option value={LeaderBoardMode.MOST_DRINKS_RATIO}>Most drinks / night</option>
                        </select>
                        <select
                            className="p-0 mr-2"
                            onChange={(e) => handleYearInput(e.target.value)}
                            value={yearSelected}
                        >
                            <option value={2024}>2024</option>
                            <option value={2023}>2023</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="overflow-y-auto">
                {leaderboard.values.map((leaderboardItem, idx) => (
                    <div className="flex flex-row justify-between px-2 py-02 gap-02" key={leaderboardItem.user.userID}>
                        <p className="w-28 overflow-hidden text-nowrap">
                            {idx + 1}. {leaderboardItem.user.firstName}
                        </p>
                        <div className="relative w-full h-7 rounded overflow-hidden bg-bar-bg">
                            <span className="left-1 text-white font-bold font-quick absolute top-1/2 -translate-y-1/2 text-xs">
                                {leaderboardItem.sublabel}
                            </span>
                            <div
                                className="h-full bg-bar-fill"
                                style={{
                                    width: `${100 * (UtilService.sum(leaderboardItem.values) / leaderboard.max)}%`,
                                    background: LeaderboardService.stackedBarsBackground(leaderboardItem.values),
                                }}
                            ></div>
                            <span className="right-1 text-white font-bold font-quick absolute top-1/2 -translate-y-1/2 text-sm">
                                {leaderboardItem.label}
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

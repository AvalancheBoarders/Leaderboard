import * as React from "react";
import { LeaderBoard } from "./leaderboard/Leaderboard";
import { BillDisplay } from "./leaderboard/BillDisplay";
import { IBill, ILeaderboard, IUserDrinkData, LeaderBoardMode } from "../models/models";
import { useState } from "react";
import { LeaderboardService } from "../services/LeaderboardService";
import { Highlight } from "../components/highlight/Highlight";
import { UtilService } from "../services/UtilService";

export interface IHomeProps {
    bills: IBill[];
}

const academicYears: { [index: string]: [Date, Date] } = {
    "23-24": [new Date("2023-09-01"), new Date("2024-08-14")],
    "24-25": [new Date("2024-09-01"), new Date("2025-09-01")],
};

export function Home({ bills }: IHomeProps) {
    const [yearSelected, setYearSelected] = useState<string>("24-25");
    const [leaderboardMode, setLeaderboardMode] = useState<LeaderBoardMode>(LeaderBoardMode.MOST_DRINKS);

    const [drinkingStats, setDrinkingStats] = useState<IUserDrinkData[]>(
        LeaderboardService.aggregate(bills, academicYears[yearSelected])
    );
    const [leaderboard, setLeaderboard] = useState<ILeaderboard>({ values: [], max: 0 });
    const [totalDrinks, setTotalDrinks] = useState(drinkingStats.reduce((partialSum, a) => partialSum + a.quantity, 0));

    const eves = bills.filter((item) => UtilService.withinDates(new Date(item.date), academicYears[yearSelected]));

    const handleYearInput = (value: string) => {
        setYearSelected(() => value as string);
    };

    const handleModeInput = (value: string) => {
        setLeaderboardMode(() => parseInt(value) as LeaderBoardMode); // Hacky - value is a string of the enum number value
    };

    React.useEffect(() => {
        setTotalDrinks(drinkingStats.reduce((partialSum, a) => partialSum + a.quantity, 0));
    }, [drinkingStats]);

    React.useEffect(() => {
        setLeaderboard(() => LeaderboardService.computeStats(leaderboardMode, drinkingStats));
    }, [leaderboardMode, drinkingStats]);

    React.useEffect(() => {
        setDrinkingStats(LeaderboardService.aggregate(bills, academicYears[yearSelected]));
    }, [bills, yearSelected]);

    return (
        <div>
            <div className="h-leaderboard flex flex-col">
                <div className="leaderboard-header">
                    <h1 className="text-2xl font-bold text-center text-ava-primary">Avalanche Drinking Leaderboard</h1>
                    <div className="p-2">
                        <div className="relative w-full h-7 bg-bar-bg rounded overflow-hidden">
                            <div
                                className="h-full bg-bar-fill"
                                style={{ width: `${(totalDrinks * 100) / 1500}%` }}
                            ></div>
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
                                <option value={"24-25"}>2024</option>
                                <option value={"23-24"}>2023</option>
                            </select>
                        </div>
                    </div>
                </div>
                <LeaderBoard leaderboard={leaderboard} />
            </div>
            <div className="h-bottom-bar overflow-scroll">
                <BillDisplay bills={eves} />
            </div>
        </div>
    );
}

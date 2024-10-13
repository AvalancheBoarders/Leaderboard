import * as React from "react";
import { ILeaderboard } from "../../models/models";
import { LeaderboardService } from "../../services/LeaderboardService";
import { UtilService } from "../../services/UtilService";
import { useFeatures } from "../../services/useFeatures";

export interface ILeaderBoardProps {
    leaderboard: ILeaderboard;
}

export function LeaderBoard({ leaderboard }: ILeaderBoardProps) {
    const { getColor } = useFeatures();

    return (
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
                                background: LeaderboardService.stackedBarsBackground(leaderboardItem.values, [
                                    "#009579",
                                    getColor()?.value ?? "#05715d",
                                ]),
                            }}
                        ></div>
                        <span className="right-1 text-white font-bold font-quick absolute top-1/2 -translate-y-1/2 text-sm">
                            {leaderboardItem.label}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

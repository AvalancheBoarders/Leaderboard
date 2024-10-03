import * as React from "react";
import { LeaderBoard } from "./leaderboard/Leaderboard";
import { BillDisplay } from "./leaderboard/BillDisplay";
import { IUser, IBill } from "../models/models";

export interface IHomeProps {
    users: IUser[];
    bills: IBill[];
}

export function Home({ users, bills }: IHomeProps) {
    return (
        <div className="">
            <div className="h-leaderboard flex flex-col">
                <LeaderBoard users={users} bills={bills} />
            </div>
            <div className="h-bottom-bar overflow-scroll">
                <BillDisplay bills={bills} />
            </div>
        </div>
    );
}

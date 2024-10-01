import * as React from "react";
import { IBill, User } from "../App";
import { LeaderBoard } from "./leaderboard/Leaderboard";
import { BillDisplay } from "./leaderboard/BillDisplay";

export interface IHomeProps {
    users: User[];
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

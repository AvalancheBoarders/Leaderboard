import * as React from 'react';
import { IBill, Item, User } from './App';
import './leaderboard.css';
import { useEffect, useMemo, useState } from 'react';

export interface ILeaderBoardProps {
    users: User[];
    bills: IBill[];
}

interface UserDrinkData extends Item {
    evenings: number;
    maxInOneNight: number;
}

export interface LeaderBoardItem {
    user: User;
    quantity: number;
}

const aggregate = (bills: IBill[], users: any) => {
    const leaderboard: UserDrinkData[] = []
    for (const bill of bills) {
        for (const item of bill.items) {
            if (leaderboard.some((el: UserDrinkData) => el.user.userID === item.user.userID)) {
                for (const it in leaderboard) {
                    if (leaderboard[it].user.userID === item.user.userID) {
                        leaderboard[it].quantity += item.quantity;
                        leaderboard[it].evenings += 1;
                        if (item.quantity > leaderboard[it].maxInOneNight) {
                            leaderboard[it].maxInOneNight = item.quantity;
                        }
                        break;
                    }
                  }
            } else {
                leaderboard.push({user: item.user, quantity: item.quantity, evenings: 1, maxInOneNight: item.quantity})
            }
        }
    }
    return leaderboard;
}

enum LeaderBoardMode {
    MOST_DRINKS = 0,
    MOST_EVENINGS = 1,
    MOST_DRINKS_ONE_NIGHT = 2,
    MOST_DRINKS_RATIO = 3,
}

const most_drinks_one_night = (drinkingStats: UserDrinkData[]) => {
    return drinkingStats.map((item) => {
        return {user: item.user, quantity: item.maxInOneNight};
    });
}

const most_drinks = (drinkingStats: UserDrinkData[]) => {
    return drinkingStats.map((item) => {
        return {user: item.user, quantity: item.quantity};
    });
}

const most_evenings = (drinkingStats: UserDrinkData[]) => {
    return drinkingStats.map((item) => {
        return {user: item.user, quantity: item.evenings};
    });
}

const most_drinks_ratio = (drinkingStats: UserDrinkData[]) => {
    return drinkingStats.map((item) => {
        return {user: item.user, quantity: Math.round(item.quantity * 10 / item.evenings) / 10};
    });
}

const compute_stats = (leaderboardMode: LeaderBoardMode, drinkingStats: UserDrinkData[]) => {
    let stats: LeaderBoardItem[];
    let label: string;
    if (leaderboardMode === LeaderBoardMode.MOST_DRINKS) {
        stats = most_drinks(drinkingStats);
        label = "drinks";
    } else if (leaderboardMode === LeaderBoardMode.MOST_DRINKS_RATIO) {
        stats = most_drinks_ratio(drinkingStats);
        label = "drinks";
    } else if (leaderboardMode === LeaderBoardMode.MOST_EVENINGS) {
        stats = most_evenings(drinkingStats);
        label = "nights";
    } else if (leaderboardMode === LeaderBoardMode.MOST_DRINKS_ONE_NIGHT) {
        stats = most_drinks_one_night(drinkingStats);
        label = "drinks";
    } else {
        console.log("set default leaderboardmode")
        stats = [];
        label = "";
    }
    return {label: label, maxStat: stats.sort((a, b) => b.quantity - a.quantity)[0]?.quantity, statsList: stats}
}

export function LeaderBoard ({users, bills}: ILeaderBoardProps) {
    const [drinkingStats, setDrinkingStats] = useState(aggregate(bills, users).sort((a, b) => b.quantity - a.quantity));
    const totalDrinks = drinkingStats.reduce((partialSum, a) => partialSum + a.quantity, 0)
    const [leaderboardMode, setLeaderboardMode] = useState<LeaderBoardMode>(LeaderBoardMode.MOST_DRINKS);
    const [leaderboard, setLeaderboard] = useState<{maxStat: number, label: String, statsList: LeaderBoardItem[]}>({label: "drinks", maxStat:100, statsList: most_drinks(drinkingStats)});

    const handleInput = (value: any) => {
        setLeaderboardMode(() => parseInt(value) as LeaderBoardMode) // Hacky - value is a string of the enum number value
    }

    useEffect(() => {
        setLeaderboard(() => compute_stats(leaderboardMode, drinkingStats))
    }, [leaderboardMode, drinkingStats])

    useEffect(() => {
        setDrinkingStats(aggregate(bills, users).sort((a, b) => b.quantity - a.quantity))
    }, [bills, users])

    return (
        <>
            <div className='leaderboard-header'>
                <h1 className='title'>Avalanche Drinking Leaderboard</h1>
                <div className='leaderboard-subheader'>
                    <div className='major-stats'>
                        <div className='row'><p className='highlight'>Total drinks:</p><p>{totalDrinks}</p></div>
                        <div className='row'><p className='highlight'>Evenings:</p><p>{bills.length}</p></div>
                    </div>
                    <div>
                        <select className="leaderboard-mode-select" onChange={(e) => handleInput(e.target.value)} value={leaderboardMode}>
                            <option value={LeaderBoardMode.MOST_DRINKS}>Most drinks</option>
                            <option value={LeaderBoardMode.MOST_DRINKS_ONE_NIGHT}>Most drinks in one night</option>
                            <option value={LeaderBoardMode.MOST_EVENINGS}>Most loyal member</option>
                            <option value={LeaderBoardMode.MOST_DRINKS_RATIO}>Most drinks / night</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="leaderboard-container">
                {leaderboard.statsList.map((leaderboardItem, idx) => (
                    <div className="leaderboard-item" key={leaderboardItem.user.userID}>
                        <p className='leaderboard-username'>{idx+1}. {leaderboardItem.user.firstName}</p>
                        <div className="progress">
                            <div className="progress-fill" style={{width: `${(leaderboardItem.quantity * 100) / leaderboard.maxStat}%`}}></div>
                            <span className="progress-text">{leaderboardItem.quantity} {leaderboard.label}</span>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

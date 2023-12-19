import * as React from 'react';
import { IBill, Item, User } from './App';
import './leaderboard.css';

export interface ILeaderBoardProps {
    users: User[];
    bills: IBill[];
}

const aggregate = (bills: IBill[], users: any) => {
    const leaderboard: Item[] = []
    console.log(bills, users)
    for (const bill of bills) {
        for (const item of bill.items) {
            if (leaderboard.some((el: Item) => el.user.userID === item.user.userID)) {
                for (const it in leaderboard) {
                    if (leaderboard[it].user.userID === item.user.userID) {
                        leaderboard[it].quantity += item.quantity;
                       break;
                    }
                  }
            } else {
                leaderboard.push({user: item.user, quantity: item.quantity})
            }
        }
    }
    console.log(leaderboard);
    return leaderboard;
}
export function LeaderBoard ({users, bills}: ILeaderBoardProps) {

    const leaderboard = aggregate(bills, users).sort((a, b) => b.quantity - a.quantity);
    const MaxDrinks = leaderboard[0]?.quantity;
    const totalDrinks = leaderboard.reduce((partialSum, a) => partialSum + a.quantity, 0)

    return (
        <>
            <div className='leaderboard-header'>
                <h1 className='title'>Avalanche Drinking Leaderboard</h1>
                <div className='major-stats'>
                    <div className='row'><p className='highlight'>Total drinks:</p><p>{totalDrinks}</p></div>
                    <div className='row'><p className='highlight'>Evenings:</p><p>{bills.length}</p></div>
                </div>
            </div>
            <div className="leaderboard-container">
                {leaderboard.map((user, idx) => (
                    <div className="leaderboard-item" key={user.user.userID}>
                        <p className='leaderboard-username'>{idx+1}. {user.user.firstName}</p>
                        <div className="progress">
                            <div className="progress-fill" style={{width: `${(user.quantity *100) / MaxDrinks}%`}}></div>
                            <span className="progress-text">{user.quantity} drinks</span>
                        </div>
                        {/* <p>{user.quantity}</p> */}
                    </div>
                ))}
            </div>
        </>
    );
}

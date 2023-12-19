import * as React from 'react';
import { IBill, Item, User } from './App';

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


  return (
    <div>
      <h1>Avalanche Drinking Leaderboard</h1>
      <div>
        {aggregate(bills, users).map((user) => (
            <div key={user.user.userID}>
                <p>{user.user.firstName} {user.user.lastName}</p>
                <p>{user.quantity}</p>
            </div>
        ))}
      </div>
    </div>
  );
}

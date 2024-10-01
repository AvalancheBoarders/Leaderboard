import * as React from "react";
import { User } from "../../App";

export interface IUsersDisplayProps {
    users: User[];
}

export function UsersDisplay({ users }: IUsersDisplayProps) {
    return (
        <div className="flex flex-col items-start p-4">
            <p>Users in database</p>
            <div className="user-list">
                {users.map((u: User) => (
                    <p className="px-2 py-0" key={"userID" + u.userID}>
                        {u.firstName} {u.lastName} - {u.userID}
                    </p>
                ))}
            </div>
        </div>
    );
}

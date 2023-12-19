import * as React from 'react';
import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from './firebase-config';
import './UsersDisplay.css';
import { User } from './App';

export interface IUsersDisplayProps {
    users: User[];
}

export function UsersDisplay ({users}: IUsersDisplayProps) {
    console.log("user display render", users);

    return (
        <div className="users-display">
            <p>Users in database</p>
            <div className="user-list">
                {users.map((u: User) => (
                    <p className="user-item" key={"userID" + u.userID}>{u.firstName} {u.lastName} - {u.userID}</p>
                ))}
            </div>
        </div>
    );
}

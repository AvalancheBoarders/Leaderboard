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
    // const [user, setUser] = useState<any>([]);
    // const usersCollectionRef = collection(db, "users");

    // useEffect(() => {
    //     const getUsers = async () => {
    //         const data = await getDocs(usersCollectionRef);
    //         // console.log(data.docs.map((d) => (d.data())));
    //         setUser(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
    //     }
    //     getUsers();
    // }, [])

    return (
        <div className="users-display">
            <p>Users</p>
            {/* <div>{user.map((u: any) => (<p key={u.id}>{u.name}{u.id}</p>))}</div> */}
            <div>
                {users.map((u: User) => (
                    <p key={"userID" + u.userID}>{u.firstName} {u.lastName}</p>
                ))}
            </div>
        </div>
    );
}

import * as React from 'react';
import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from './firebase-config';
import './UsersDisplay.css';

export interface IUsersDisplayProps {
}

export function UsersDisplay (props: IUsersDisplayProps) {
    console.log("user display render");
    const [user, setUser] = useState<any>([]);
    const usersCollectionRef = collection(db, "users");

    useEffect(() => {
        const getUsers = async () => {
            const data = await getDocs(usersCollectionRef);
            // console.log(data.docs.map((d) => (d.data())));
            setUser(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
        }
        getUsers();
    }, [])

    return (
        <div className="users-display">
            <p>Users</p>
            {/* <div>{user.map((u: any) => (<p key={u.id}>{u.name}{u.id}</p>))}</div> */}
            <div>
                {user.map((u: any) => (
                    <p key={u.id}>{u.name}</p>
                ))}
            </div>
        </div>
    );
}

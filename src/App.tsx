import React, { useState, useEffect } from 'react';
import './App.css';
import { auth, db } from './firebase-config';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import SignIn from './SignIn';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { UsersDisplay } from './UsersDisplay';
import { CreateBill } from './CreateBill';
import useNotificaiton from './components/notification/useNotification';
import NotificationBox from './components/notification/NotificationBox';
import Button from './components/button/Button';
import { BillDisplay } from './BillDisplay';
import { LeaderBoard } from './Leaderboard';


export interface User {
    userID: string;
    firstName: string;
    lastName: string;
}

export interface Item {
    user: User;
    quantity: number;
}
export interface IBill {
    date: string;
    items: Item[]
}

function App() {
    console.log("heyy")
    const [firstName, setFirstname] = useState<string>("");
    const [lastName, setLastname] = useState<string>("");
    const { notification, showTemporarily } = useNotificaiton()
    
    const usersCollectionRef = collection(db, "users");
    const billsCollectionRef = collection(db, "bills");
    const [authUser, setAuthUser] = useState<any>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [bills, setBills] = useState<IBill[]>([]);

    const getUsers = async () => {
        const data = await getDocs(usersCollectionRef);
        console.log(data.docs.map((d) => (d.data())));
        const dataUsers: any = data.docs.map((doc) => ({...doc.data(), id: doc.id}))
        setUsers(dataUsers.map((user: any) => {
            const u: User = {userID: user.id, firstName: user.firstName, lastName: user.lastName};
            return u;
        }))
    }

    const getBills = async () => {
        if (users === null || users === undefined || users.length === 0) {
            return;
        }

        const data = await getDocs(billsCollectionRef);
        const dataBills: any = data.docs.map((doc) => ({...doc.data(), id: doc.id})).filter((bill: any) => bill.items.length > 0)
        setBills(dataBills.map((bill: any) => {
            const date = bill.date;
            const newItems: Item[] = bill.items.map((item: any) => {
                const user = users.find((u) => u.userID === item.userID)
                console.log("find user", item.userID, users);
                if (user === null || user === undefined) {
                    console.log("couldnt find user", item.userID, users);
                    return {};
                }
                const newItem: Item = {quantity: parseInt(item.quantity), user: user}
                return newItem;
            })
            const newBill: IBill = {date: date, items: newItems};
            console.log("newbill", newBill);
            return newBill;
        }))
    }

    useEffect(() => {
        getUsers();
    }, [])

    useEffect(() => {
        getBills();
    }, [users])

    const createUser = async () => {
        await addDoc(usersCollectionRef, {firstName: firstName, lastName: lastName}).then(() => {
            showTemporarily("User added", 'successful');
            getUsers()
        }).catch((err) => {
            console.log(err);
            showTemporarily("Failed to add user", 'error');
        })
    }

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user);
            } else {
                setAuthUser(null)
            }
        })

        return () => {
            listen();
        }
    }, []);

    const userSignOut = () => {
        signOut(auth).then(() => {
            console.log("Signed out succesfully")
        }).catch((err) => {
            console.log(err);
        })
    }

    

    return (
        <div className="App">
            <NotificationBox notification={notification}/>
            <div className="content">

                <div className='avalanche-content'>
                    <div className="leaderboard-wrapper">
                        <LeaderBoard users={users} bills={bills}/>
                    </div>
                    <div className='bill-wrapper'>
                        <BillDisplay bills={bills}/>
                    </div>
                </div>

                {!authUser && <SignIn/>}
                {authUser &&
                <>
                    <div className='signedin-container'>
                        <p>{`Signed In as ${authUser.email}`}</p>
                        <Button onClick={() => userSignOut()} text={'Sign out'}/>
                    </div>
                    <CreateBill users={users}/>
                    <div className='user-creation-container'>
                        <div>
                            <input placeholder="firstname..." onChange={(e) => {setFirstname(e.target.value)}}/>
                            <input placeholder="lastname..." onChange={(e) => {setLastname(e.target.value)}}/>
                            <Button onClick={() => createUser()} text={'Create User'}/>
                        </div>
                        <UsersDisplay users={users}/>
                    </div>
                </>
                }
            </div>
        </div>
    );
}

export default App;

import React, { useState, useEffect } from 'react';
import './App.css';
import { auth, db } from './firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { BillDisplay } from './BillDisplay';
import { LeaderBoard } from './Leaderboard';
import { SideBar } from './SideBar';
import { ControlPanel } from './pages/ControlPanel';

export interface User {
    userID: string;
    firstName: string;
    lastName: string;
}

export interface Item {
    user: User;
    quantity: number;
    quantityShots: number;
}
export interface IBill {
    date: string;
    items: Item[]
}

export type Screen = "home" | "login" | "mine";

function App() {
    const usersCollectionRef = collection(db, "users");
    const billsCollectionRef = collection(db, "bills");
    const [authUser, setAuthUser] = useState<any>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [bills, setBills] = useState<IBill[]>([]);
    const [sidebar, setSidebar] = useState(false);
    const [screen, setScreen] = useState<Screen>('home')

    const showSidebar = () => setSidebar(!sidebar);

    const getUsers = async () => {
        const data = await getDocs(usersCollectionRef);
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
                if (user === null || user === undefined) {
                    return {};
                }
                console.log(item.quantityShots)
                const newItem: Item = {quantity: parseInt(item.quantity), quantityShots: item.quantityShots === undefined ? 0 : parseInt(item.quantityShots), user: user}
                return newItem;
            })
            const newBill: IBill = {date: date, items: newItems};
            return newBill;
        }))
    }

    useEffect(() => {
        getUsers();
    }, [])

    useEffect(() => {
        getBills();
    }, [users])

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

    const handleSetScreen = (screen: Screen) => {
        showSidebar();
        setScreen(screen);
    }

    return (
        <div className="App">
            <SideBar active={sidebar} activeScreen={screen} setScreen={(screen: Screen) => handleSetScreen(screen)}/>
            <div className="content">
            <button className="hamburger-menu items-center" type="button" onClick={() => showSidebar()}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/>
                </svg>
            </button>

            {screen === 'home' && 
                <div className='avalanche-content'>
                    <div className="leaderboard-wrapper">
                        <LeaderBoard users={users} bills={bills}/>
                    </div>
                    <div className='bill-wrapper'>
                        <BillDisplay bills={bills}/>
                    </div>
                </div>
                }
                {screen === 'login' && <ControlPanel users={users} authUser={authUser} getUsers={getUsers}/>}
            {screen === 'mine' && <p>hoi</p>}
            </div>
        </div>
    );
}

export default App;

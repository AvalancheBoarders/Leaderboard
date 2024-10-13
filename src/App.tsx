import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { SideBar } from "./pages/SideBar";
import { ControlPanel } from "./pages/ControlPanel";
import { HamburgerMenu } from "./pages/HamburgerMenu";
import { Home } from "./pages/Home";
import { IBill, IBillLine, IUser } from "./models/models";
import { Settings } from "./pages/Settings";

export type Screen = "home" | "login" | "mine" | "settings";

function App() {
    const usersCollectionRef = collection(db, "users");
    const billsCollectionRef = collection(db, "bills");
    const [authUser, setAuthUser] = useState<any>(null);
    const [users, setUsers] = useState<IUser[]>([]);
    const [bills, setBills] = useState<IBill[]>([]);
    const [sidebar, setSidebar] = useState(false);
    const [screen, setScreen] = useState<Screen>("home");

    const showSidebar = () => setSidebar(!sidebar);

    const getUsers = async () => {
        const data = await getDocs(usersCollectionRef);
        const dataUsers: any = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setUsers(
            dataUsers.map((user: any) => {
                const u: IUser = {
                    userID: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                };
                return u;
            })
        );
    };

    const getBills = async () => {
        if (users === null || users === undefined || users.length === 0) {
            return;
        }

        const data = await getDocs(billsCollectionRef);
        const dataBills: any = data.docs
            .map((doc) => ({ ...doc.data(), id: doc.id }))
            .filter((bill: any) => bill.items.length > 0);
        setBills(
            dataBills.map((bill: any) => {
                const date = bill.date;
                const newItems: IBillLine[] = bill.items.map((item: any) => {
                    const user = users.find((u) => u.userID === item.userID);
                    if (user === null || user === undefined) {
                        return {};
                    }

                    const newItem: IBillLine = {
                        quantity: parseInt(item.quantity),
                        quantityShots: item.quantityShots === undefined ? 0 : parseInt(item.quantityShots),
                        user: user,
                    };
                    return newItem;
                });
                const newBill: IBill = { date: date, items: newItems };
                return newBill;
            })
        );
    };

    useEffect(() => {
        getUsers();
    }, []);

    useEffect(() => {
        getBills();
    }, [users]);

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user);
            } else {
                setAuthUser(null);
            }
        });

        return () => {
            listen();
        };
    }, []);

    const handleSetScreen = (screen: Screen) => {
        showSidebar();
        setScreen(screen);
    };

    return (
        <div className="w-full flex flex-row justify-center">
            <SideBar active={sidebar} activeScreen={screen} setScreen={(screen: Screen) => handleSetScreen(screen)} />
            <div className="w-full sm:w-1/2">
                <HamburgerMenu showSidebar={showSidebar} />
                {screen === "home" && <Home bills={bills} />}
                {screen === "login" && <ControlPanel users={users} authUser={authUser} getUsers={getUsers} />}
                {screen === "mine" && <p>hoi</p>}
                {screen === "settings" && <Settings />}
            </div>
        </div>
    );
}

export default App;

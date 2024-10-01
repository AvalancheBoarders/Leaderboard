import * as React from "react";
import { UsersDisplay } from "./controlpanel/UsersDisplay";
import Button from "../components/button/Button";
import { auth, db } from "../firebase-config";
import { signOut } from "firebase/auth";
import { CreateBill } from "./controlpanel/CreateBill";
import { User } from "../App";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import useNotificaiton from "../components/notification/useNotification";
import NotificationBox from "../components/notification/NotificationBox";
import SignIn from "./controlpanel/SignIn";

export interface IControlPanelProps {
    users: User[];
    getUsers: () => void;
    authUser: any;
}

export function ControlPanel({ authUser, users, getUsers }: IControlPanelProps) {
    const usersCollectionRef = collection(db, "users");
    const { notification, showTemporarily } = useNotificaiton();
    const [firstName, setFirstname] = useState<string>("");
    const [lastName, setLastname] = useState<string>("");

    const userSignOut = () => {
        signOut(auth)
            .then(() => {
                console.log("Signed out succesfully");
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const createUser = async () => {
        if (firstName.trim() === "" || lastName.trim() === "") {
            showTemporarily("Failed to add user - add name", "error");
            return;
        }
        await addDoc(usersCollectionRef, {
            firstName: firstName,
            lastName: lastName,
        })
            .then(() => {
                showTemporarily("User added", "successful");
                getUsers();
            })
            .catch((err) => {
                console.log(err);
                showTemporarily("Failed to add user", "error");
            });
    };

    if (authUser === null) {
        return <SignIn />;
    } else {
        return (
            <div>
                <NotificationBox notification={notification} />
                <div className="flex flex-row border-gray-500 rounded border-4 p-2 gap-4">
                    <p>{`Signed In as ${authUser.email}`}</p>
                    <Button onClick={() => userSignOut()} text={"Sign out"} />
                </div>
                <CreateBill users={users} />
                <div className="border-4 border-gray-500 p-4">
                    <div>
                        <input
                            placeholder="firstname..."
                            onChange={(e) => {
                                setFirstname(e.target.value);
                            }}
                        />
                        <input
                            placeholder="lastname..."
                            onChange={(e) => {
                                setLastname(e.target.value);
                            }}
                        />
                        <Button onClick={() => createUser()} text={"Create User"} />
                    </div>
                    <UsersDisplay users={users} />
                </div>
            </div>
        );
    }
}

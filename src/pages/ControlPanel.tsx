import * as React from "react";
import { UsersDisplay } from "./controlpanel/UsersDisplay";
import Button from "../components/button/Button";
import { auth, db } from "../firebase-config";
import { signOut } from "firebase/auth";
import { CreateBill } from "./controlpanel/CreateBill";
import { useState } from "react";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import useNotificaiton from "../components/notification/useNotification";
import NotificationBox from "../components/notification/NotificationBox";
import SignIn from "./controlpanel/SignIn";
import { IFeature, IUser } from "../models/models";
import { useFeatures } from "../services/useFeatures";
import { ColorFeature } from "../components/ColorFeature";

export interface IControlPanelProps {
    users: IUser[];
    getUsers: () => void;
    authUser: any;
}

export function ControlPanel({ authUser, users, getUsers }: IControlPanelProps) {
    const usersCollectionRef = collection(db, "users");
    const { features, getColor } = useFeatures();
    const colorFeature = getColor(features);
    console.log(colorFeature);
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

    const handleFeatureActiveToggle = async (feature: IFeature) => {
        await updateDoc(doc(db, "features", feature.id), {
            active: !feature.active,
        })
            .then((res) => {
                showTemporarily("Activeness toggled", "successful");
            })
            .catch((e) => {
                showTemporarily("oopsie failed", "error");
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
                <div>
                    {features.map((f) => (
                        <div className="border-4 border-gray-500 p-4">
                            <div className="flex flex-row gap-2">
                                <p>{f.name}</p> <p>{f.value}</p>
                                <p>{f.active ? "true" : "false"}</p>
                                <Button onClick={() => handleFeatureActiveToggle(f)} text={"toggle active"} />
                            </div>
                        </div>
                    ))}
                    <ColorFeature colorFeature={colorFeature} />
                </div>
            </div>
        );
    }
}

import { addDoc, collection } from "firebase/firestore";
import * as React from "react";
import { db } from "../../firebase-config";
import { useState } from "react";
import Button from "../../components/button/Button";
import NotificationBox from "../../components/notification/NotificationBox";
import useNotification from "../../components/notification/useNotification";
import { IUser, IUserDrinks } from "../../models/models";
import { UtilService } from "../../services/UtilService";

export interface ICreateBillProps {
    users: IUser[];
}

export function CreateBill({ users }: ICreateBillProps) {
    const { notification, showTemporarily } = useNotification();
    const usersCollectionRef = collection(db, "users");
    const billCollectionRef = collection(db, "bills");
    const [userID, setUserID] = useState<string>("default");
    const [date, setDate] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(0);
    const [quantityShots, setQuantityShots] = useState<number>(0);
    const [bill, setBill] = useState<IUserDrinks[]>([]);

    const createUser = async () => {
        await addDoc(billCollectionRef, { date: date });
    };

    const AddExpense = () => {
        if (userID === "default") {
            showTemporarily("No user to add", "warning");
            return;
        }

        if (bill.some((u: IUserDrinks) => u.userID === userID)) {
            setBill((prev) =>
                prev.map((u: IUserDrinks) => {
                    if (u.userID !== userID) {
                        return u;
                    } else {
                        // console.log(typeof u.quantity, typeof quantity)
                        showTemporarily("Quanity accumulated", "warning");
                        return { ...u, quantity: u.quantity + quantity };
                    }
                })
            );
            return;
        }
        const ud: IUserDrinks = {
            billID: "1",
            userID: userID,
            quantity: quantity,
            quantityShots: quantityShots,
            date: date ? date : "",
        };
        setBill((prev) => [...prev, ud]);
    };

    const RemoveExpense = (userID: string) => {
        if (!bill.some((u: IUserDrinks) => u.userID === userID)) {
            showTemporarily("Couldnt find item", "warning");
            return;
        }

        setBill((prev) => prev.filter((u: IUserDrinks) => u.userID !== userID));
        showTemporarily("Item removed", "successful");
    };

    const ClearBill = () => {
        console.log("clearbill");
        setDate(null);
        setBill([]);
        setUserID("default");
        setQuantity(0);
        showTemporarily("cleared bill", "successful");
    };

    const SubmitBill = async () => {
        if (date === null) {
            showTemporarily("Date not set", "warning");
            return;
        }
        const newBill = bill.map((item) => ({ ...item, date: date }));
        await addDoc(billCollectionRef, {
            date: date,
            items: newBill.map((item) => ({
                userID: item.userID,
                quantity: item.quantity,
                quantityShots: item.quantityShots,
            })),
        });
        ClearBill();
        showTemporarily("Bill saved", "successful");
        console.log("submit bill");
    };

    return (
        <div>
            <div className="border-4 border-gray-500">
                <NotificationBox notification={notification} />
                <div className="bill-input-container">
                    <Button onClick={() => ClearBill()} text={"Clear bill"} />
                    <div>
                        <p>Bill date</p>
                        <input
                            placeholder="date..."
                            type="date"
                            onChange={(e: any) => {
                                setDate(e.target.value);
                            }}
                        />
                    </div>
                    <div>
                        <p>Add item</p>
                        <div className="row">
                            <select onChange={(e) => setUserID(e.target.value)} value={userID}>
                                <option value="default" disabled>
                                    Choose here
                                </option>
                                {users
                                    .sort((a: IUser, b: IUser) => (a.firstName > b.firstName ? 1 : -1))
                                    .map((user) => {
                                        return (
                                            <option key={"option" + user.userID} value={user.userID}>
                                                {user.firstName} {user.lastName}
                                            </option>
                                        );
                                    })}
                            </select>
                            <input
                                placeholder="beers quantity..."
                                type="number"
                                onChange={(e: any) => {
                                    setQuantity(parseInt(e.target.value));
                                }}
                            />
                            <input
                                placeholder="shots quantity..."
                                type="number"
                                onChange={(e: any) => {
                                    setQuantityShots(parseInt(e.target.value));
                                }}
                            />
                            <Button onClick={() => AddExpense()} text={"Add"} />
                        </div>
                    </div>
                    <Button onClick={() => SubmitBill()} text={"Submit bill"} />
                </div>

                <div className="bg-slate-100 p-4">
                    <div className="flex flex-row font-bold">
                        <p>Current bill:</p>
                        <p>Date: {date !== null && UtilService.formatDate(date)}</p>
                    </div>
                    {bill.map((item: IUserDrinks) => {
                        const firstName = users.find((u: IUser) => u.userID === item.userID)?.firstName;
                        return (
                            <div
                                className="flex flex-row justify-between p-2 border-b-2 border-ava-primary"
                                key={"lll" + item.userID + item.quantity}
                            >
                                <p>{firstName}</p>
                                <div className="row">
                                    <p>{item.quantity}</p>
                                    <p>{item.quantityShots}</p>
                                    <Button onClick={() => RemoveExpense(item.userID)} text={"X"} theme="red-white" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

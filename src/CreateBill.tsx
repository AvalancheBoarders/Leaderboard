import { addDoc, collection } from 'firebase/firestore';
import * as React from 'react';
import { db } from './firebase-config';
import { useState } from 'react';
import { User } from './App';
import './bill.css';
import Button from './components/button/Button';
import NotificationBox from './components/notification/NotificationBox';
import useNotification from './components/notification/useNotification';

export interface ICreateBillProps {
    users: User[];
}

interface UserDrinks {
    billID: string;
    userID: string;
    quantity: number;
    date: string;
}

export function CreateBill ({users}: ICreateBillProps) {
    const { notification, showTemporarily } = useNotification();
    const usersCollectionRef = collection(db, "users");
    const billCollectionRef = collection(db, "bills");
    const [userID, setUserID] = useState<string>("default");
    const [date, setDate] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(0);
    const [bill, setBill] = useState<UserDrinks[]>([]);

    const createUser = async () => {
        await addDoc(billCollectionRef, {date: date})
    }

    const AddExpense = () => {
        if (userID === "default") {
            showTemporarily("No user to add", 'warning');
            return;
        }
        const ud: UserDrinks = {billID: '1', userID: userID, quantity: quantity, date: date ? date : ""};
        setBill((prev) => ([...prev, ud]))
    }

    const ClearBill = () => {
        console.log("clearbill")
        setDate(null);
        setBill([]);
        setUserID("default");
        setQuantity(0);
        showTemporarily("cleared bill", 'successful');
    }

    const SubmitBill = async () => {
        if (date === null) {
            showTemporarily("Date not set", 'warning');
            return;
        }
        const newBill = bill.map((item) => ({...item, date: date}))
        await addDoc(billCollectionRef, {date: date, items: newBill.map((item) => ({userID: item.userID, quantity: item.quantity}))})
        showTemporarily("Bill saved", 'successful');
        console.log("submit bill");
    }

  return (
    <div>
        <div className='bill-creation-container'>
            <NotificationBox notification={notification}/>
            <div className='bill-input-container'>
            <Button onClick={() => ClearBill()} text={'Clear bill'}/>
                <div><p>Bill date</p><input placeholder="date..." type='date' onChange={(e:any) => {setDate(e.target.value)}}/></div>
                <div>
                    <p>Add item</p>
                    <div className="row">
                        <select onChange={(e) => setUserID(e.target.value)} value={userID}>
                        <option value="default" disabled>Choose here</option>
                            {users.sort((a: User, b: User) => a.firstName > b.firstName ? 1 : -1).map((user) => {
                                return (<option key={"option" + user.userID} value={user.userID}>{user.firstName} {user.lastName}</option>)
                            })}
                        </select>
                        <input placeholder="quantity..." type='number' onChange={(e:any) => {setQuantity(e.target.value)}}/>
                        <Button onClick={() => AddExpense()} text={'Add'}/>
                    </div>
                </div>
                <Button onClick={() => SubmitBill()} text={'Submit bill'}/>
            </div>


            <div className='bill-container'>
                
                <div className='bill-header'>
                    <p>Current bill:</p><p>Date: {date}</p>
                </div>
                {bill.map((item: UserDrinks) => {
                    const firstName = users.find((u: User) => u.userID === item.userID)?.firstName;
                    return (
                        <div className="bill-item" key={"lll" + item.userID + item.quantity}><p>{firstName}</p><p>{item.quantity}</p></div>
                    )
                })}
            </div>
        </div>
    </div>
  );
}

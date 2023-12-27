
import * as React from 'react';
import { IBill } from './App';
import './bill.css';

export interface IBillDisplayProps {
    bills: IBill[];
}

export function BillDisplay ({bills}: IBillDisplayProps) {

    if (bills === undefined || bills.length <= 0) {
        return <></>
    }

    return (
        <div className='bills-container'>
            {bills.map((bill, idx) => (
                <Bill key={"bill-item" + bill.date + idx} date={bill.date} items={bill.items}/>
            ))}
        </div>
    );
}

function Bill ({date, items} : IBill) {

    if (items === undefined || items.length <= 0) {
        return <></>
    }

    return (
        <div className="bill-container small">
            <div className='bill-header'><p>Date: {date}</p></div>
            {items.map((item) => (
                <div className="bill-item" key={"bill-item" + date + item.user.userID + item.quantity}>
                        <p key={item.user.firstName + date}>{item.user.firstName}</p>
                        <p key={item.user.firstName + date + item.quantity}>{item.quantity}</p>
                </div>
            ))}
            
        </div>
    )
}

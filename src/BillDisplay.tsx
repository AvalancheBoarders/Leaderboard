
import * as React from 'react';
import { IBill } from './App';
import './bill.css';
import { formatDate } from './utils';

export interface IBillDisplayProps {
    bills: IBill[];
}

/** Sort two items by date. */
const sortDate = (a: string, b: string, newToOld: boolean = true) => {
    const order = newToOld ? 1 : -1;

    if ( a > b) {
        return -1 * order;
    } else if ( a < b) {
        return 1 * order
    } else {
        return 0;
    }

}
export function BillDisplay ({bills}: IBillDisplayProps) {

    if (bills === undefined || bills.length <= 0) {
        return <></>
    }

    return (
        <div className='bills-container'>
            {bills.sort((a: IBill, b: IBill) => sortDate(a.date, b.date)).map((bill, idx) => (
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
            <div className='bill-header'><p>Date: {formatDate(date)}</p></div>
            {items.map((item) => (
                <div className="bill-item" key={"bill-item" + date + item.user.userID + item.quantity}>
                        <p key={item.user.firstName + date}>{item.user.firstName}</p>
                        <p key={item.user.firstName + date + item.quantity}>{item.quantity}</p>
                </div>
            ))}
            
        </div>
    )
}

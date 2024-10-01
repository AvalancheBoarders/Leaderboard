import * as React from "react";
import { IBill } from "../../App";
import { formatDate } from "../../utils";

export interface IBillDisplayProps {
    bills: IBill[];
}

/** Sort two items by date. */
const sortDate = (a: string, b: string, newToOld: boolean = true) => {
    const order = newToOld ? 1 : -1;

    if (a > b) {
        return -1 * order;
    } else if (a < b) {
        return 1 * order;
    } else {
        return 0;
    }
};
export function BillDisplay({ bills }: IBillDisplayProps) {
    if (bills === undefined || bills.length <= 0) {
        return <></>;
    }

    return (
        <div className="flex flex-row justify-start overflow-auto whitespace-nowrap">
            {bills
                .sort((a: IBill, b: IBill) => sortDate(a.date, b.date))
                .map((bill, idx) => (
                    <Bill key={"bill-item" + bill.date + idx} date={bill.date} items={bill.items} />
                ))}
        </div>
    );
}

function Bill({ date, items }: IBill) {
    if (items === undefined || items.length <= 0) {
        return <></>;
    }

    return (
        <div className="p-4">
            <div className="flex flex-row font-bold">
                <p>Date: {formatDate(date)}</p>
            </div>
            {items.map((item) => (
                <div
                    className="flex flex-row justify-between p-2 border-b-2 border-ava-primary"
                    key={"bill-item" + date + item.user.userID + item.quantity}
                >
                    <p key={item.user.firstName + date}>{item.user.firstName}</p>
                    <p key={item.user.firstName + date + item.quantity}>{item.quantity + " | " + item.quantityShots}</p>
                </div>
            ))}
        </div>
    );
}

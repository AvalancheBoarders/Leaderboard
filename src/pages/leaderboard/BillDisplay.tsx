import * as React from "react";
import { IBill } from "../../models/models";
import { UtilService } from "../../services/UtilService";

export interface IBillDisplayProps {
    bills: IBill[];
}

export function BillDisplay({ bills }: IBillDisplayProps) {
    if (bills === undefined || bills.length <= 0) {
        return <></>;
    }

    return (
        <div className="flex flex-row justify-start overflow-auto whitespace-nowrap">
            {bills
                .sort((a: IBill, b: IBill) => UtilService.sortDate(a.date, b.date))
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
                <p>Date: {UtilService.formatDate(date)}</p>
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

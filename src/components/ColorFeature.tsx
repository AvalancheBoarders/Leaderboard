import * as React from "react";
import { useState } from "react";
import Button from "../components/button/Button";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import useNotificaiton from "../components/notification/useNotification";
import NotificationBox from "../components/notification/NotificationBox";
import { IFeature } from "../models/models";

interface IColorFeature {
    colorFeature: IFeature | null;
}
export function ColorFeature({ colorFeature }: IColorFeature) {
    const { notification, showTemporarily } = useNotificaiton();
    const [usercColor, setUserColor] = useState<string>(colorFeature?.value ?? "");

    const handleColorChange = (color: string) => {
        setUserColor(color);
    };

    const handleColorSubmit = async () => {
        const id = colorFeature?.id;
        if (id === undefined) {
            showTemporarily("oopsie failed", "error");
            return;
        }
        await updateDoc(doc(db, "features", id), {
            value: usercColor,
        })
            .then((res) => {
                showTemporarily("Updated", "successful");
            })
            .catch((e) => {
                showTemporarily("oopsie failed", "error");
            });
    };

    return (
        <div>
            <NotificationBox notification={notification} />
            <div>
                <h1>Color</h1>
                <div className="flex flex-row gap-4 items-center">
                    <input
                        className="p-0 m-0 w-24"
                        onChange={(e) => handleColorChange(e.target.value)}
                        type="color"
                        id="favcolor"
                        value={usercColor}
                    ></input>
                    <Button onClick={handleColorSubmit} text={"Submit color"} />
                </div>
            </div>
        </div>
    );
}

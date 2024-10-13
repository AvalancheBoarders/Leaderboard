import * as React from "react";
import { useEffect, useState } from "react";
import { useFeatures } from "../services/useFeatures";
import Button from "../components/button/Button";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import useNotificaiton from "../components/notification/useNotification";
import NotificationBox from "../components/notification/NotificationBox";

export function Settings() {
    const { features, getColor } = useFeatures();
    const colorFeature = getColor();
    const { notification, showTemporarily } = useNotificaiton();
    const [usercColor, setUserColor] = useState<string>(colorFeature?.value ?? "");

    useEffect(() => {
        setUserColor(getColor()?.value ?? "");
    }, [features]);

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
        <div className="p-5">
            <NotificationBox notification={notification} />
            <div className="w-full text-center text-2xl text-ava-primary font-bold">
                <h1>Settings</h1>
            </div>
            {colorFeature?.active && (
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
            )}
        </div>
    );
}

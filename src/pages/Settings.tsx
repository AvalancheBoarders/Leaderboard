import * as React from "react";
import { useFeatures } from "../services/useFeatures";
import { ColorFeature } from "../components/ColorFeature";

export function Settings() {
    const { features, getColor } = useFeatures();
    const colorFeature = getColor(features);

    return (
        <div className="p-5">
            <div className="w-full text-center text-2xl text-ava-primary font-bold">
                <h1>Settings</h1>
            </div>
            {colorFeature?.active && <ColorFeature colorFeature={colorFeature} />}
        </div>
    );
}

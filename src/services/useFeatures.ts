import { useEffect, useState } from "react";
import { IFeature } from "../models/models";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";

export function useFeatures(): { features: IFeature[]; getColor: () => IFeature | null } {
    const [features, setFeatures] = useState<IFeature[]>([]);

    const getFeatures = async () => {
        const data = await getDocs(collection(db, "features"));
        const dataFeatures: any = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setFeatures(
            dataFeatures.map((feature: any) => {
                const f: IFeature = {
                    name: feature.name,
                    value: feature.value,
                    active: feature.active,
                    id: feature.id,
                };
                return f;
            })
        );
    };

    const getColor = (): IFeature | null => {
        const colorFeature = features.filter((f) => f.name === "color");
        if (colorFeature.length !== 1) {
            return null;
        }

        return colorFeature[0];
    };

    useEffect(() => {
        getFeatures();
    }, []);

    return { features, getColor };
}

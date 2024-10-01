import { onAuthStateChanged, signOut } from "firebase/auth";
import * as React from "react";
import { auth } from "../../firebase-config";
import { useEffect, useState } from "react";

export function AuthDetails() {
    const [authUser, setAuthUser] = useState<any>(null);

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user);
            } else {
                setAuthUser(null);
            }
        });

        return () => {
            listen();
        };
    }, []);

    const userSignOut = () => {
        signOut(auth)
            .then(() => {
                console.log("Signed out succesfully");
            })
            .catch((err) => {
                console.log(err);
            });
    };
    return (
        <div>
            Auth details{" "}
            {authUser ? (
                <div>
                    <p>{`Signed In as ${authUser.email}`}</p>
                    <button onClick={() => userSignOut()}>Sign out</button>
                </div>
            ) : (
                <p>Signed out</p>
            )}
        </div>
    );
}

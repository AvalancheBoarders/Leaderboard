import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase-config";
import Button from "../../components/button/Button";
import NotificationBox from "../../components/notification/NotificationBox";
import useNotificaiton from "../../components/notification/useNotification";

function SignIn() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const { notification, showTemporarily } = useNotificaiton();

    const signIn = (e: any) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((creds) => {
                console.log(creds);
                showTemporarily("Sign in succesful!", "successful");
            })
            .catch((err: any) => {
                console.log(err);
                showTemporarily("Sign in failed", "error");
            });
    };

    return (
        <div className="flex flex-col justify-center items-center w-full h-dvh p-2">
            <NotificationBox notification={notification} />
            <input type="email" placeholder="Email..." value={email} onChange={(e) => setEmail(e.target.value)} />
            <input
                type="password"
                placeholder="Password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={(e: any) => signIn(e)} text={"Sign in"} />
        </div>
    );
}

export default SignIn;

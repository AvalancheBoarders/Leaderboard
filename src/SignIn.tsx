import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase-config';

type Props = {}

function SignIn({}: Props) {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const signIn = (e: any) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password).then((creds) => {
            console.log(creds)
        }).catch((err: any) => {
            console.log(err)
        })
    }

    return (
        <div>
            SignIn
            <input 
                type="email" 
                placeholder='Email...' 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
            />
            <input 
                type="password" 
                placeholder='Password...' 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={(e) => signIn(e)}>Log in</button>
        </div>
    )
}

export default SignIn
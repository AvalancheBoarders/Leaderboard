import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase-config';
import Button from './components/button/Button';
// import './app.css';

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
        <div className="signin-container">
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
            {/* <Button onClick={(e) => signIn(e)}>Sign in</button> */}
            <Button onClick={(e:any) => signIn(e)} text={'Sign in'}/>
        </div>
    )
}

export default SignIn
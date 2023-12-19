import React, { useState, useEffect } from 'react';
import './App.css';
import { auth, db } from './firebase-config';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import SignIn from './SignIn';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { UsersDisplay } from './UsersDisplay';
import { CreateBill } from './CreateBill';


export interface User {
    userID: string;
    firstName: string;
    lastName: string;
}

function App() {
    console.log("heyy")
    const [newName, setNewName] = useState<string>("");
    
    const usersCollectionRef = collection(db, "users");
    const [authUser, setAuthUser] = useState<any>(null);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const getUsers = async () => {
            const data = await getDocs(usersCollectionRef);
            console.log(data.docs.map((d) => (d.data())));
            const dataUsers: any = data.docs.map((doc) => ({...doc.data(), id: doc.id}))
            setUsers(dataUsers.map((user: any) => {
                const u: User = {userID: user.id, firstName: user.firstName, lastName: user.lastName};
                return u;
            }))
        }
        getUsers();
    }, [])

    const createUser = async () => {
        await addDoc(usersCollectionRef, {name: newName})
    }

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user);
            } else {
                setAuthUser(null)
            }
        })

        return () => {
            listen();
        }
    }, []);

    const userSignOut = () => {
        signOut(auth).then(() => {
            console.log("Signed out succesfully")
        }).catch((err) => {
            console.log(err);
        })
    }

    

    return (
        <div className="App">
            <div className="content">
                <SignIn/>
                <div>Auth details {authUser ? 
                    <div>
                        <p>{`Signed In as ${authUser.email}`}</p>
                        <button onClick={() => userSignOut()}>Sign out</button>
                    </div> : <p>Signed out</p>}
                </div>
                <UsersDisplay users={users}/>
                <CreateBill users={users}/>
                {authUser && <div>
                    <input placeholder="name..." onChange={(e) => {setNewName(e.target.value)}}/>
                    <button onClick={createUser}>Create USer</button>
                </div>}

            </div>
        </div>
    );
}

export default App;

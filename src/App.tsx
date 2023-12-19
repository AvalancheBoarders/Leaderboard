import React, { useState, useEffect } from 'react';
import './App.css';
import { auth, db } from './firebase-config';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import SignIn from './SignIn';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { UsersDisplay } from './UsersDisplay';
import { CreateBill } from './CreateBill';
import useNotificaiton from './components/notification/useNotification';
import NotificationBox from './components/notification/NotificationBox';
import Button from './components/button/Button';


export interface User {
    userID: string;
    firstName: string;
    lastName: string;
}

function App() {
    console.log("heyy")
    const [firstName, setFirstname] = useState<string>("");
    const [lastName, setLastname] = useState<string>("");
    const { notification, showTemporarily } = useNotificaiton()
    
    const usersCollectionRef = collection(db, "users");
    const [authUser, setAuthUser] = useState<any>(null);
    const [users, setUsers] = useState<User[]>([]);

    const getUsers = async () => {
        const data = await getDocs(usersCollectionRef);
        console.log(data.docs.map((d) => (d.data())));
        const dataUsers: any = data.docs.map((doc) => ({...doc.data(), id: doc.id}))
        setUsers(dataUsers.map((user: any) => {
            const u: User = {userID: user.id, firstName: user.firstName, lastName: user.lastName};
            return u;
        }))
    }
    useEffect(() => {
        getUsers();
    }, [])

    const createUser = async () => {
        await addDoc(usersCollectionRef, {firstName: firstName, lastName: lastName}).then(() => {
            showTemporarily("User added", 'successful');
            getUsers()
        }).catch((err) => {
            console.log(err);
            showTemporarily("Failed to add user", 'error');
        })
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
            <NotificationBox notification={notification}/>
            <div className="content">
                <SignIn/>
                {authUser &&
                <>
                    <div>Auth details {authUser ? 
                        <div>
                            <p>{`Signed In as ${authUser.email}`}</p>
                            <button onClick={() => userSignOut()}>Sign out</button>
                        </div> : <p>Signed out</p>}
                    </div>
                    <CreateBill users={users}/>
                    <div>
                        <input placeholder="firstname..." onChange={(e) => {setFirstname(e.target.value)}}/>
                        <input placeholder="lastname..." onChange={(e) => {setLastname(e.target.value)}}/>
                        <Button onClick={() => createUser()} text={'Create User'}/>
                    </div>
                    <UsersDisplay users={users}/>
                </>
                }
            </div>
        </div>
    );
}

export default App;

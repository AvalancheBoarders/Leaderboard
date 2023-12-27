import * as React from 'react';
import './sidebar.css';
import { Screen } from './App';

export interface ISideBarProps {
    active: boolean;
    activeScreen: Screen;
    setScreen: (screen: Screen) => void;
}

export function SideBar ({active, activeScreen, setScreen}: ISideBarProps) {
  return (
    <ul className={active ? 'sidebar active' : 'sidebar'}>
        <li className={activeScreen === 'home' ? 'menu-bar active' : 'menu-bar'} onClick={() => setScreen('home')}>Home</li>
        <li className={activeScreen === 'login' ? 'menu-bar active' : 'menu-bar'} onClick={() => setScreen('login')}>Login</li>
    </ul>
  );
}

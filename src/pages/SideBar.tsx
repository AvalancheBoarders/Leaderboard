import * as React from "react";
import "./sidebar.css";
import { Screen } from "../App";
import { SettingsSVG } from "../assets/SettingsSVG";

export interface ISideBarProps {
    active: boolean;
    activeScreen: Screen;
    setScreen: (screen: Screen) => void;
}

export function SideBar({ active, activeScreen, setScreen }: ISideBarProps) {
    return (
        <ul className={active ? "sidebar active" : "sidebar"}>
            <li className={activeScreen === "home" ? "menu-bar active" : "menu-bar"} onClick={() => setScreen("home")}>
                Home
            </li>
            <li
                className={activeScreen === "login" ? "menu-bar active" : "menu-bar"}
                onClick={() => setScreen("login")}
            >
                Control panel
            </li>
            {/* <li className={activeScreen === "mine" ? "menu-bar active" : "menu-bar"} onClick={() => setScreen("mine")}>
                Mine!
            </li> */}
            <li className="mt-auto mb-4 ml-4" onClick={() => setScreen("settings")}>
                <div className={activeScreen === "settings" ? "w-10 h-10 bg-white rounded p-1" : "w-10 h-10"}>
                    <SettingsSVG fill={activeScreen === "settings" ? "#5bcbf5" : "white"} />
                </div>
            </li>
        </ul>
    );
}

import React from "react";
import "./Topbar.css";
import { Logo } from "..";
import { default as MenuIcon } from "./MenuIcon";
import { Link } from "react-router-dom";

export default function Topbar({ setSidebarHidden }) {
  return (
    <header className="topbar">
      <div id="menu" onClick={() => setSidebarHidden(false)}>
        <MenuIcon />
      </div>
      <div className="centerLogo">
        <Logo />
      </div>
    </header>
  );
}

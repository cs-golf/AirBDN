import React from "react";
import "./Topbar.css";
import { default as MenuIcon } from "./MenuIcon";
import { Link } from "react-router-dom";

export default function Topbar({ setSidebarHidden }) {
  return (
    <header className="topbar">
      <div id="menu" onClick={() => setSidebarHidden(false)}>
        <MenuIcon />
      </div>
      <Link className="linkTop" to="/" style={{ textDecoration: "none" }}>
        <img className="topBanner bannerDark" src="banner_dark.png" alt="banner" />
        <img className="topBanner bannerLight" src="banner_dark.png" alt="banner" />
      </Link>
    </header>
  );
}

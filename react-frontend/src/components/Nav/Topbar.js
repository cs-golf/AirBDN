<<<<<<< Updated upstream
import React from 'react'
import './Topbar.css'
import { Logo } from '..'
import { default as MenuIcon } from './MenuIcon'

export default function Topbar({ setPage, setSidebarHidden }) {
	return (
		<header className='topbar'>
			<div id='menu' onClick={() => setSidebarHidden(false)}>
				<MenuIcon />
			</div>
			<div className='centerLogo'>
				<Logo onClick={() => setPage('home')} />
			</div>
		</header>
	)
}
=======
import React from "react";
import "./Topbar.css";
import { default as MenuIcon } from "./MenuIcon";
import { Link } from "react-router-dom";
import banner_light from "../banner_light.png";
import banner_dark from "../banner_dark.png";
import { useMediaPredicate } from "react-media-hook";

export default function Topbar({ setSidebarHidden }) {
  const darkMode = useMediaPredicate("(prefers-color-scheme: dark)");

  return (
    <div className="topbar">
      <div id="menu" onClick={() => setSidebarHidden(false)}>
        <MenuIcon />
      </div>
      <div className="bannerContainer">
        <Link to="/" style={{ textDecoration: "none" }}>
          {darkMode ? (
            <img className="bannerImage" src={banner_dark} alt="banner" />
          ) : (
            <img className="bannerImage" src={banner_light} alt="banner" />
          )}
        </Link>
      </div>
    </div>
  );
}
>>>>>>> Stashed changes

<<<<<<< HEAD
<<<<<<< Updated upstream
import React, { useRef, useEffect } from 'react'
import { useOnClickAway } from '../hooks'

import './Sidebar.css'
import { display } from '../../config.json'
import { Logo } from '..'

function Sidebar({ sidebarHidden, setSidebarHidden, setMapDisplayValue, page, setPage }) {
	const sidebar = useRef(null)

	useOnClickAway(sidebar, () => setSidebarHidden(true))

	let hideSidebar = bool =>
		bool ? sidebar.current.classList.add('hidden') : sidebar.current.classList.remove('hidden')

	useEffect(() => hideSidebar(sidebarHidden), [sidebarHidden])

	const pageNav = (
		<ul className='pageNav'>
			{Object.keys(display.pages).map(key => (
				<li className='listItem' key={key} onClick={() => setPage(key)}>
					{display.pages[key]}
				</li>
			))}
		</ul>
	)

	const mapValueNav = (
		<ul className='mapValueNav'>
			{Object.keys(display.values).map(key => (
				<li className='listItem' key={key} onClick={() => setMapDisplayValue(key)}>
					{display.values[key]}
				</li>
			))}
		</ul>
	)

	return (
		<div className='sidebar' ref={sidebar}>
			<Logo className='logo' onClick={() => setPage('home')} />
			{pageNav}
			{page === 'home' && mapValueNav}
		</div>
	)
}

export default Sidebar
=======
import React, { useRef, useEffect } from "react";
import { useOnClickAway } from "../hooks";

import "./Sidebar.css";
import { display } from "../../config.json";
import { Link } from "react-router-dom";
import banner_light from "../banner_light.png";
import banner_dark from "../banner_dark.png";

import { useMediaPredicate } from "react-media-hook";

function Sidebar({
  sidebarHidden,
  setSidebarHidden,
  setDisplayedStat,
  displayedStat
}) {
  const sidebar = useRef(null);
  const darkMode = useMediaPredicate("(prefers-color-scheme: dark)");

  useOnClickAway(sidebar, () => setSidebarHidden(true));

  let hideSidebar = bool =>
    bool
      ? sidebar.current.classList.add("hidden")
      : sidebar.current.classList.remove("hidden");

  useEffect(() => hideSidebar(sidebarHidden), [sidebarHidden]);

  const currentPage = window.location.pathname;

  const pageNav = (
    <nav>
      <ul className="pageNav">
        <div className="sidebarBanner">
          <Link to="/" style={{ textDecoration: "none" }}>
            {darkMode ? (
              <img className="bannerImage" src={banner_dark} alt="logo" />
            ) : (
              <img className="bannerImage" src={banner_light} alt="logo" />
            )}
          </Link>
        </div>
        <Link to="/" style={{ textDecoration: "none" }}>
          <li
            className={
              currentPage === "/" ? "listItem activeListItem" : "listItem"
            }
          >
            Home
          </li>
        </Link>
        <Link to="/about" style={{ textDecoration: "none" }}>
          <li
            className={
              currentPage === "/about" ? "listItem activeListItem" : "listItem"
            }
          >
            About us
          </li>
        </Link>
        <Link to="/help" style={{ textDecoration: "none" }}>
          <li
            className={
              currentPage === "/help" ? "listItem activeListItem" : "listItem"
            }
          >
            How you can help
          </li>
        </Link>
      </ul>
    </nav>
  );

  const mapValueNav = (
    <ul className="mapValueNav">
      {Object.keys(display.values).map(key => (
        <li
          className={
            displayedStat === key ? "listItem activeListItem" : "listItem"
          }
          key={key}
          onClick={() => setDisplayedStat(key)}
        >
          {display.values[key]}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="sidebar" ref={sidebar}>
      {pageNav}
      {setDisplayedStat && mapValueNav}
    </div>
  );
}

export default Sidebar;
>>>>>>> Stashed changes
=======
import React, { useRef, useEffect } from "react";
import { useOnClickAway } from "../hooks";

import "./Sidebar.css";
import { display } from "../../config.json";
import { Link } from "react-router-dom";

function Sidebar({
  sidebarHidden,
  setSidebarHidden,
  setDisplayedStat,
  displayedStat
}) {
  const sidebar = useRef(null);

  useOnClickAway(sidebar, () => setSidebarHidden(true));

  let hideSidebar = bool =>
    bool
      ? sidebar.current.classList.add("hidden")
      : sidebar.current.classList.remove("hidden");

  useEffect(() => hideSidebar(sidebarHidden), [sidebarHidden]);

  const currentPage = window.location.pathname;

  const pageNav = (
    <nav>
      <ul className="pageNav">
        <Link to="/" style={{ textDecoration: "none" }}>
          <img
            className="sidebarBanner bannerDark"
            src="banner_dark.png"
            alt="logo"
          />
          <img
            className="sidebarBanner bannerLight"
            src="banner_dark.png"
            alt="logo"
          />
        </Link>
        <Link to="/" style={{ textDecoration: "none" }}>
          <li
            className={
              currentPage === "/" ? "listItem activeListItem" : "listItem"
            }
          >
            Map
          </li>
        </Link>
        <Link to="/about" style={{ textDecoration: "none" }}>
          <li
            className={
              currentPage === "/about" ? "listItem activeListItem" : "listItem"
            }
          >
            About us
          </li>
        </Link>
        <Link to="/help" style={{ textDecoration: "none" }}>
          <li
            className={
              currentPage === "/help" ? "listItem activeListItem" : "listItem"
            }
          >
            How you can help
          </li>
        </Link>
      </ul>
    </nav>
  );

  const mapValueNav = (
    <ul className="mapValueNav">
      {Object.keys(display.values).map(key => (
        <li
          className={
            displayedStat === key ? "listItem activeListItem" : "listItem"
          }
          key={key}
          onClick={() => setDisplayedStat(key)}
        >
          {display.values[key]}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="sidebar" ref={sidebar}>
      {pageNav}
      {setDisplayedStat && mapValueNav}
    </div>
  );
}

export default Sidebar;
>>>>>>> 04b0315337a027f09e7f9662a53591c3eab37053

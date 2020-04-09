import React, { useRef, useEffect } from "react";
import { useOnClickAway } from "../hooks";

import "./Sidebar.css";
import { display } from "../../config.json";
import { Logo } from "..";
import { Link } from "react-router-dom";

function Sidebar({ sidebarHidden, setSidebarHidden, setMapDisplayValue }) {
  const sidebar = useRef(null);

  useOnClickAway(sidebar, () => setSidebarHidden(true));

  let hideSidebar = bool =>
    bool
      ? sidebar.current.classList.add("hidden")
      : sidebar.current.classList.remove("hidden");

  useEffect(() => hideSidebar(sidebarHidden), [sidebarHidden]);

  const pageNav = (
    <nav>
      <ul className="pageNav">
        <Logo className="logo" />
        <Link to="/" style={{ textDecoration: "none" }}>
          <li className="listItem">Home</li>
        </Link>
        <Link to="/about" style={{ textDecoration: "none" }}>
          <li className="listItem">About us</li>
        </Link>
        <Link to="/help" style={{ textDecoration: "none" }}>
          <li className="listItem">How you can help</li>
        </Link>
      </ul>
    </nav>
  );

  const mapValueNav = (
    <ul className="mapValueNav">
      {Object.keys(display.values).map(key => (
        <li
          className="listItem"
          key={key}
          onClick={() => setMapDisplayValue(key)}
        >
          {display.values[key]}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="sidebar" ref={sidebar}>
      {pageNav}
      {setMapDisplayValue && mapValueNav}
    </div>
  );
}

export default Sidebar;

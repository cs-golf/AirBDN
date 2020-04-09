import React from "react";
import "./Logo.css";
import { Link } from "react-router-dom";

export default ({ onClick }) => (
  <Link to="/" style={{ textDecoration: "none" }}>
    <div className="logo" onClick={onClick}>
      <img className="logoIcon" src="logo512s.png" alt="logo" />
      AirBDN
    </div>
  </Link>
);

import React from "react";
import "./Datadownload.css";

export default function Newsletter({ darkMode }) {
    // css objects
    const baseStyle = {
      marginTop: "60px",
      // width: "80%",
      // height: "80%",
      // marginLeft: "10%",
      textAlign: "center",
      fontSize: "2em"
      // marginLeft: "15%",
      // width: "70%",
      // marginTop: "60px"
    };

    const pageStyle = darkMode
        ? { ...baseStyle, color: "#FFF" }
        : { ...baseStyle, color: "#000" };

    return (
        <div style={pageStyle}>
            <h1>About Us</h1>
        </div>
    );
}
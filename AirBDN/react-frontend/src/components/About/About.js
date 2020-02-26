import React from "react";
import "./About.css";

export default function About({ darkMode }) {
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
    ? { ...baseStyle, color: "#000" }
    : { ...baseStyle, color: "#FFF" };

  return (
    <div style={pageStyle}>
        <h1>About us</h1>
     
      <p1>
      Basic Text which will be changed with the text i am writing on word.
      </p1>
        
    </div>
  );
}

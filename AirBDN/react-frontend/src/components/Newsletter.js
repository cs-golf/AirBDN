import React from "react";
import { TextField, Card } from "@material-ui/core";

export default function Newsletter({ darkMode }) {
  // css objects
  const baseStyle = {
    color: "#FFF",
    marginLeft: "15%",
    width: "70%",
    marginTop: "60px",
    textAlign: "center",
    fontSize: "3em"
  };

  const pageStyle = darkMode ? { ...baseStyle } : { ...baseStyle };

  return (
    <form noValidate autoComplete="off">
      <div style={pageStyle}>
        Sign up for our newsletter to receive news and
        alerts regarding the air quality in Aberdeen
        <TextField label="Email" type="email" autoComplete="current-email" />
      </div>
    </form>
  );
}

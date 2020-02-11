import React from "react";
import {
  AppBar,
  Link,
  IconButton,
  Typography,
  Toolbar,
  Box
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

export default function Header({ darkMode, viewRes, setPage }) {
  //css
  const baseAppbar = {
    position: "fixed",
    height: "50px"
  };

  const appbarStyle = darkMode
    ? {
        ...baseAppbar,
        backgroundColor: "#303f9f"
      }
    : {
        ...baseAppbar,
        backgroundColor: "#b2ebf2"
      };

  const textStyle = darkMode
    ? { marginRight: "15px", color: "#DDD" }
    : { marginRight: "15px", color: "#555" };

  return (
    <AppBar style={appbarStyle} position="static">
      <Toolbar variant="dense">
        {/* <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton> */}

        <Box flexGrow={1}>
          <Typography variant="h4" style={textStyle}>
            AirBDN
          </Typography>
        </Box>

        <Typography variant="h5">
          <Link
            href="#"
            color="inherit"
            underline="none"
            style={textStyle}
            onClick={() => setPage("home")}
          >
            Home
          </Link>
          <Link
            href="#"
            color="inherit"
            underline="none"
            style={textStyle}
            onClick={() => setPage("newsletter")}
          >
            Newsletter
          </Link>
          <Link
            href="#"
            color="inherit"
            underline="none"
            style={textStyle}
            onClick={() => setPage("about")}
          >
            About
          </Link>
          <Link
            href="#"
            color="inherit"
            underline="none"
            style={textStyle}
            onClick={() => setPage("datadownload")}
          >
            Data Download  
          </Link>
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

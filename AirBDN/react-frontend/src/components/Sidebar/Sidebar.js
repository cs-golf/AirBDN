import React, { useState } from "react";
import {
  AppBar,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import "./Sidebar.css";
import axios from "axios";

function ResponsiveDrawer({ setTargetValue }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
//   axios.get(`/api/info`).then(resp => {
//     console.log(resp.data);
//   });
  const drawer = (
    <div className="drawer">
      <img src="logo192.png" alt="logo" />
      <div className="toolbar" />
      <Divider />
      <List>
        <ListItem button key={"Inbox"}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary={"Inbox"} />
        </ListItem>
      </List>
      <Divider />
      <List>
        {[
          "P1",
          "P2",
          "temperature",
          "pressure",
          "humidity",
          "pressure_at_sealevel"
        ].map(value => (
          <ListItem button key={value}>
            <ListItemText
              primary={value}
              onClick={() => setTargetValue(value)}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <React.Fragment>
      <div id="portrait">
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className={"menuButton"}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6">AirBDN</Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
        >
          {drawer}
        </Drawer>
      </div>
      <div id="landscape">
        <Drawer variant="permanent" open>
          {drawer}
        </Drawer>
      </div>
    </React.Fragment>
  );
}

export default ResponsiveDrawer;

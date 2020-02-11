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
import { heatmap } from "../../config.json";

function Sidebar({ setTargetValue }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const sidebarContent = (
    <div className="sidebar">
      <img src="logo192.png" alt="logo" />
      <div className="toolbar" />
      <Divider />
      <List>
        <ListItem button key={"Inbox"}>
          <ListItemIcon>``
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary={"Inbox"} />
        </ListItem>
      </List>
      <Divider />
      <List>
        {Object.keys(heatmap.redValues).map(value => (
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
              edge="start"
              onClick={toggleSidebar}
              className={"menuButton"}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6">AirBDN</Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="temporary"
          open={sidebarOpen}
          onClose={toggleSidebar}
          ModalProps={{ keepMounted: true }}
        >
          {sidebarContent}
        </Drawer>
      </div>
      <div id="landscape">
        <Drawer variant="permanent" open>
          {sidebarContent}
        </Drawer>
      </div>
    </React.Fragment>
  );
}

export default Sidebar;

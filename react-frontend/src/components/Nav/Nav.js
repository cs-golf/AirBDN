import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import { useWindowSize } from "../hooks";

export default ({ setMapDisplayValue }) => {
  const [width, height] = useWindowSize();
  const [sidebarHidden, setSidebarHidden] = useState(true);

  return (
    <React.Fragment>
      <Sidebar
        sidebarHidden={sidebarHidden}
        setSidebarHidden={setSidebarHidden}
        setMapDisplayValue={setMapDisplayValue}
      />
      {width < height && <Topbar setSidebarHidden={setSidebarHidden} />}
    </React.Fragment>
  );
};

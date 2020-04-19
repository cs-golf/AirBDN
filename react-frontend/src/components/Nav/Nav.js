import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import { useWindowSize } from "../hooks";

export default ({ setDisplayedStat, displayedStat }) => {
  const [width, height] = useWindowSize();
  const [sidebarHidden, setSidebarHidden] = useState(true);

  return (
    <React.Fragment>
      <Sidebar
        sidebarHidden={sidebarHidden}
        setSidebarHidden={setSidebarHidden}
        setDisplayedStat={setDisplayedStat}
        displayedStat={displayedStat}
      />
      {width < height && <Topbar setSidebarHidden={setSidebarHidden} />}
    </React.Fragment>
  );
};

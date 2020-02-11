import React, { useState } from "react";
import { Map, Sidebar } from "./components";

const App = () => {
  // state
  const [page, setPage] = useState("home");
  const [targetValue, setTargetValue] = useState("P1");

  return (
    <React.Fragment>
      <Sidebar setTargetValue={setTargetValue} />
      <Map targetValue={targetValue} />
    </React.Fragment>
  );
};

export default App;

import React, { useState } from "react";
import { Map, Sidebar, SensorPage, About, DataDownload } from "./components";

const App = () => {
  // state
  const [page, setPage] = useState("Home");
  const [targetValue, setTargetValue] = useState("sensors");

  return (
    <React.Fragment>
      <Sidebar setTargetValue={setTargetValue} setPage={setPage} page={page} />
      {page === "Home" && <Map targetValue={targetValue} setPage={setPage} />}
      {page === "SensorPage" && <SensorPage />}
      {page === "About" && <About />}
      {page === "DataDownload" && <Datadownload />}
    </React.Fragment>
  );
};

export default App;

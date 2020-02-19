import React, { useState } from "react";
import { Map, Sidebar, SensorPage, About, Datadownload } from "./components";

const App = () => {
  // state
  const [page, setPage] = useState("home");
  const [targetValue, setTargetValue] = useState("sensors");
  const [sensorId, setSensorId] = useState();

  return (
    <React.Fragment>
      <Sidebar setTargetValue={setTargetValue} setPage={setPage} page={page} />
<<<<<<< Updated upstream
      {page === "Home" && <Map targetValue={targetValue} setPage={setPage} />}
      {page === "SensorPage" && <SensorPage />}
      {page === "About" && <About />}
     {/*{page === "DataDownload" && <Datadownload />}*/}
=======
      {page === "home" && (
        <Map
          targetValue={targetValue}
          setPage={setPage}
          setSensorId={setSensorId}
        />
      )}
      {page === "sensorPage" && <SensorPage sensorId={sensorId} />}
      {page === "about" && <About />}
      {/* {page === "DataDownload" && <Datadownload />} */}
>>>>>>> Stashed changes
    </React.Fragment>
  );
};

export default App;

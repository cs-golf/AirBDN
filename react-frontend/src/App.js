import React, { useState } from "react";
import { Map, Nav, ChartPage, About, HelpPage } from "./components";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const App = () => {
  // state
  const [mapDisplayValue, setMapDisplayValue] = useState("sensors");
  const [sensorId, setSensorId] = useState();

  return (
    <Router>
      {/* A <Switch> looks through its children <Route>s and
		  renders the first one that matches the current URL. */}
      <Switch>
        <Route path="/charts">
          <Nav setMapDisplayValue={setMapDisplayValue} />
          <div className={"pageContent"}>
            <ChartPage
              sensorId={sensorId}
              setSensorId={setSensorId}
              mapDisplayValue={mapDisplayValue}
              setMapDisplayValue={setMapDisplayValue}
            />
          </div>
        </Route>

        <Route path="/about">
          <Nav />
          <div className={"pageContent"}>
            <About />
          </div>
        </Route>

        <Route path="/help">
          <Nav />
          <div className={"pageContent"}>
            <HelpPage />
          </div>
        </Route>

        <Route path="/">
          <Nav setMapDisplayValue={setMapDisplayValue} />
          <div className={"pageContent"}>
            <Map mapDisplayValue={mapDisplayValue} setSensorId={setSensorId} />
          </div>
        </Route>
      </Switch>
    </Router>
  );
};

export default App;

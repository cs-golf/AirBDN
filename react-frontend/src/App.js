import React, { useState, useEffect } from "react";
import { Map, Nav, ChartPage, About, HelpPage } from "./components";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { getInfo, getReadings } from "./components/call_api";

const getRelativeDate = (dd = 0, date = new Date()) =>
  new Date(date.setDate(date.getDate() + dd));

// groups readings with same timestamp
const groupByTimestamp = readings => {
  let out = readings.reduce((rv, x) => {
    (rv[x["timestamp"]["$date"]] = rv[x["timestamp"]["$date"]] || []).push(x);
    return rv;
  }, {});
  return Object.values(out);
};

const initStartDate = getRelativeDate(-4);
const initEndDate = new Date();
window.latestData = getInfo();
let allReadings = getReadings(initStartDate, initEndDate);
window.rawBigData = allReadings;
window.groupedData = allReadings.then(groupByTimestamp);

const App = () => {
  // state
  const [displayedStat, setDisplayedStat] = useState("pm10");
  const [sensorId, setSensorId] = useState();
  const [startDate, setStartDate] = useState(initStartDate);
  const [endDate, setEndDate] = useState(initEndDate);

  useEffect(() => {
    window.groupedData = getReadings(startDate, endDate).then(groupByTimestamp);
  }, [startDate, endDate]);

  return (
    <Router>
      {/* A <Switch> looks through its children <Route>s and
		  renders the first one that matches the current URL. */}
      <Switch>
        <Route path="/charts">
          <Nav
            displayedStat={displayedStat}
            setDisplayedStat={setDisplayedStat}
          />
          <div className={"pageContent"}>
            <ChartPage
              sensorId={sensorId}
              setSensorId={setSensorId}
              displayedStat={displayedStat}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
            />
          </div>
        </Route>

        <Route path="/about">
          <Nav displayedStat={displayedStat} />
          <div className={"pageContent"}>
            <About />
          </div>
        </Route>

        <Route path="/help">
          <Nav displayedStat={displayedStat} />
          <div className={"pageContent"}>
            <HelpPage />
          </div>
        </Route>

        <Route path="/">
          <Nav
            displayedStat={displayedStat}
            setDisplayedStat={setDisplayedStat}
          />
          <div className={"pageContent"}>
            <Map
              setDisplayedStat={setDisplayedStat}
              displayedStat={displayedStat}
              setSensorId={setSensorId}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
            />
          </div>
        </Route>
      </Switch>
    </Router>
  );
};

export default App;

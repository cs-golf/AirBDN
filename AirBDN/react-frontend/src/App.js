import React, { useState } from "react";
import { useMediaPredicate } from "react-media-hook";
import { Map, Sidebar } from "./components";

const App = () => {
  // media checks
  const [darkMode] = useState(
    useMediaPredicate("prefers-color-scheme: dark")
    // false
  );
  const [xs_bool] = useState(useMediaPredicate("max-height: 600px"));
  const [sm_bool] = useState(useMediaPredicate("max-height: 900px"));
  const [md_bool] = useState(useMediaPredicate("max-height: 1200px"));
  const [lg_bool] = useState(useMediaPredicate("max-height: 1800px"));

  const viewRes = xs_bool
    ? "xs" //phone
    : sm_bool
    ? "sm" //tablets portrait
    : md_bool
    ? "md" //tablets landscape
    : lg_bool
    ? "lg" //desktops
    : "xl"; //big desktops (4k)

  // css objects
  // const baseBackground = {
  //   height: "100vh",
  //   marginTop: "-1px",
  //   paddingTop: "1px"
  // };

  // const backgroundStyle = darkMode
  //   ? { ...baseBackground, backgroundColor: "#171717" }
  //   : { ...baseBackground, backgroundColor: "#ffffff" };

  // page set
  const [page, setPage] = useState("home");
  const [targetValue, setTargetValue] = useState("P1");

  return (
    <React.Fragment>
      <Sidebar setTargetValue={setTargetValue}/>
      <Map darkMode={darkMode} targetValue={targetValue}/>
    </React.Fragment>
  );
};

export default App;

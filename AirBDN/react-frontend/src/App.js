import React, { useState } from "react";
import { useMediaPredicate } from "react-media-hook";
import "./App.css";
//components
import Header from "./components/Header";
import Map from "./components/Map";
import Newsletter from "./components/Newsletter";
import Graph from "./components/Graph";
import DataDownload from ".components/DataDownload";

const App = () => {
  // media checks
  const [darkMode] = useState(
    useMediaPredicate("(prefers-color-scheme: dark)")
  );

  const [xs_bool] = useState(useMediaPredicate("(max-height: 600px)"));
  const [sm_bool] = useState(useMediaPredicate("(max-height: 900px)"));
  const [md_bool] = useState(useMediaPredicate("(max-height: 1200px)"));
  const [lg_bool] = useState(useMediaPredicate("(max-height: 1800px)"));

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
  const baseBackground = {
    height: "100vh",
    marginTop: "-1px",
    paddingTop: "1px"
  };

  const backgroundStyle = darkMode
    ? { ...baseBackground, backgroundColor: "#333333" }
    : { ...baseBackground, backgroundColor: "#ffffff" };

  // page set
  const [page, setPage] = useState("home");

  return (
    <div style={backgroundStyle}>
      <Header darkMode={darkMode} viewRes={viewRes} setPage={setPage} />
      {page === "Home" && <Map darkMode={darkMode} />}
      {page === "Newsletter" && <Newsletter darkMode={darkMode} />}
      {page === "About" && <div>test</div>}
    </div>
  );
};

export default App;

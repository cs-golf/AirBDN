import React, { useEffect } from "react";
import axios from "axios";

const getInfo = async () => {
  let response = await axios.get(`https://airbdn-api.herokuapp.com/info`);
  return `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(response.data)
  )}`;
};

export default () => {
  let setDownload = async () => {
    let dl = document.getElementById("downloadAnchorElem");
    dl.setAttribute("href", await getInfo());
    dl.setAttribute("download", "data.json");
  };

  useEffect(() => {
    setDownload();
  }, []);

  return <a id="downloadAnchorElem">Download raw data</a>;
};

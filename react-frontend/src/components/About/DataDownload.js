import React, { useEffect } from "react";
import axios from "axios";

const getInfo = async () => {
  let response = await axios.get(`https://airbdn-api.herokuapp.com/api/info`);
  return `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(response.data)
  )}`;
};

export default () => {
  useEffect(() => {
    var dlAnchorElem = document.getElementById("downloadAnchorElem");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "scene.json");
    dlAnchorElem.click();
  }, []);

  return <a id="downloadAnchorElem">test</a>;
};

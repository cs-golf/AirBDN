import React, { useEffect } from "react";

const jsonify = object_or_array =>
  `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(object_or_array)
  )}`;

const DataDownload = ({ sensorId }) => {
  const setDownload = async sensorId => {
    let toDownload = await window.rawBigData;
    const dl = document.getElementById("downloadElem");
    dl.setAttribute(
      "href",
      jsonify(toDownload.filter(reading => reading.location_id === sensorId))
    );
    dl.setAttribute("download", "data.json");
  };

  useEffect(() => {
    setDownload(sensorId);
  }, []);

  return (
    <h4 className="download">
      You can download <a id="downloadElem">raw chart data here,</a>
      <br />
      or <a href="https://airbdn-api.herokuapp.com">use our API</a> for more
      comprehensive data, and more specificity within queries.
    </h4>
  );
};

export default DataDownload;

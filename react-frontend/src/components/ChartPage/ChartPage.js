<<<<<<< Updated upstream
import React from 'react'
import SensorChart from './SensorChart'

const SensorPage = ({ sensorId }) => {
	return (
		<SensorChart
			sensorId={sensorId}
			startDate={'2020-01-01'}
			endDate={'2020-01-04'}
			displayValue={'pm10'}
			labelSparsity={24}
		/>
	)
}

export default SensorPage
=======
import React, { useState, useEffect } from "react";
import Chart from "./Chart";
import DataDownload from "./DataDownload";
import "./ChartPage.css";

import DatePicker from "react-date-picker";

import { useHistory } from "react-router-dom";

const getAddress = async (id) => {
  let data = await window.latestData;
  return data.find((s) => s._id === id)
    ? data.find((s) => s._id === id).display_name
    : null;
};

const ChartPage = ({
  sensorId,
  displayedStat,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  const history = useHistory();
  if (!sensorId) history.push("/");

  const [address, setAddress] = useState("");
  useEffect(() => {
    getAddress(sensorId).then(setAddress);
  }, []);

  return (
    <div className="chartPage">
      <h1 className="text">{address}</h1>
      <Chart
        sensorId={sensorId}
        startDate={startDate}
        endDate={endDate}
        displayedStat={displayedStat}
      />
      <div className="chartPageDatePicker">
        <DatePicker
          calendarClassName="popUpCalendar"
          clearIcon={null}
          calendarIcon={null}
          value={startDate}
          onChange={setStartDate}
        />
        →
        <DatePicker
          calendarClassName="popUpCalendar"
          clearIcon={null}
          calendarIcon={null}
          value={endDate}
          onChange={setEndDate}
        />
      </div>
      <DataDownload sensorId={sensorId} />
    </div>
  );
};

export default ChartPage;
>>>>>>> Stashed changes

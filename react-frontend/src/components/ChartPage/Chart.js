import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { display } from "../../config.json";

const Chart = ({
  sensorId,
  startDate,
  endDate,
  displayedStat,
  labelSparsity = 5
}) => {
  const [data, setData] = useState();

  const findSensor = timestampArray =>
    timestampArray.find(sensor => sensor.location_id === sensorId);

  useEffect(() => {
    window.groupedData
      .then(data =>
        data
          .map(findSensor)
          .filter(exists => exists)
          .filter(reading => reading[displayedStat])
          .map(reading => reading[displayedStat])
          .reverse()
      )
      .then(data => {
        let labels = Array(data.length).fill("");
        setData({
          labels,
          datasets: [
            {
              label: display.values[displayedStat],
              lineTension: 0.3,
              backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              pointRadius: 0,
              pointHoverRadius: 0,
              pointHitRadius: 0,
              pointBorderWidth: 0,
              data
            }
          ]
        });
      });
  }, [sensorId, displayedStat, startDate, endDate]);

  return (
    <div className="chartCard">
      <Line id="chart" data={data} />
    </div>
  );
};
export default Chart;

import React from "react";
import { Line } from "react-chartjs-2";
import "./SensorPage.css";

const data = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "My First dataset",
      fill: true,
      lineTension: 0.3,
      backgroundColor: "rgba(75,192,192,0.4)",
      borderColor: "rgba(75,192,192,1)",
      //   borderCapStyle: "butt",
      //   borderDash: [],
      //   borderDashOffset: 0.0,
      //   borderJoinStyle: "miter",
      pointBorderColor: "rgba(75,192,192,1)",
      pointBackgroundColor: "#fff",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(75,192,192,1)",
      pointHoverBorderColor: "rgba(220,220,220,1)",
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [65, 59, 80, 81, 56, 55, 40]
    }
  ]
};

export default function SensorPage() {
  return (
    <div id="chart">
      <Line data={data} />
    </div>
  );
}

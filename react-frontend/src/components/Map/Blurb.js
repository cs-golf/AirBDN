<<<<<<< HEAD
import React, { useRef, useState } from "react";
import "./Blurb.css";
import { useOnClickAway } from "../hooks";
import info_icon from "./info_icon.png";
import aqi_scale from "./aqi_scale.png";
import temp_scale from "./temp_scale.png";
import pa_scale from "./pa_scale.png";
import hum_scale from "./hum_scale.png";

export default function Blurb({ displayedStat }) {
  const blurb = useRef(null);
  const [blurbHidden, setBlurbHidden] = useState(true);

  useOnClickAway(blurb, () => setBlurbHidden(true));

  return (
    <div ref={blurb}>
      <div className="scaleContainer">
        {(displayedStat === "pm10" || displayedStat === "pm25") && (
          <img className="legendImage aqiScale" src={aqi_scale} alt="scale" />
        )}
        {displayedStat === "temperature" && (
          <img className="legendImage tempScale" src={temp_scale} alt="scale" />
        )}
        {displayedStat === "pressure" && (
          <img className="legendImage paScale" src={pa_scale} alt="scale" />
        )}
        {displayedStat === "humidity" && (
          <img className="legendImage humScale" src={hum_scale} alt="scale" />
        )}
      </div>

      <div className="infoContainer">
        <img
          onClick={() => setBlurbHidden(!blurbHidden)}
          className="legendImage infoImage"
          src={info_icon}
          alt="info"
        />
      </div>
      {!blurbHidden && (
        <div className="blurbContainer">
          <p>
            The Air Quality Index (AQI) depicts the air pollution on a range
            from 0 (least harmfull) to 500 (most harmfull).
          </p>
          <p>
            To view a different statistic on the heatmap, select it in the
            sidebar.
          </p>
          <p>
            To view more comprehensive data in form of a chart, click on a
            sensor.
          </p>
          <p>
            To view historical data, use the timeline navigation hidden under
            the arrow at the bottom of the home page.
          </p>
        </div>
      )}
    </div>
  );
}
=======
import React, { useRef, useState } from "react";
import "./Blurb.css";
import { useOnClickAway } from "../hooks";

export default function Blurb() {
  const blurb = useRef(null);
  const [blurbHidden, setBlurbHidden] = useState(true);

  useOnClickAway(blurb, () => setBlurbHidden(true));

  return (
    <div ref={blurb}>
      <div className="infoIcon" onClick={() => setBlurbHidden(!blurbHidden)}>
        🛈
      </div>
      {!blurbHidden && (
        <div className="blurbContainer">
          <p>
            The Air Quality Index (AQI) depicts the air pollution on a range
            from 0 (least harmfull) to 500 (most harmfull).
          </p>
          <p>
            To view a different statistic on the heatmap, select it in the
            sidebar.
          </p>
          <p>
            To view more comprehensive data in form of a chart, click on a
            sensor.
          </p>
          <p>
            To view historical data, use the timeline navigation hidden under
            the arrow at the bottom of the home page.
          </p>
        </div>
      )}
    </div>
  );
}
>>>>>>> 04b0315337a027f09e7f9662a53591c3eab37053

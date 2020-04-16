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

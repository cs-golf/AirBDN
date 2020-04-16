import React, { useState, useRef, useEffect } from "react";
import "./Scrub.css";
import { useOnClickAway } from "../hooks";
import DatePicker from "react-date-picker";

let Scrub = ({
  scrubValue,
  setScrubValue,
  startDate,
  setStartDate,
  endDate,
  setEndDate
}) => {
  const popUp = useRef(null);
  const toggle = useRef(null);

  let toggleScrub = (bool = !popUp.current.classList.contains("active")) => {
    bool
      ? popUp.current.classList.add("active")
      : popUp.current.classList.remove("active");
    bool
      ? toggle.current.classList.add("active")
      : toggle.current.classList.remove("active");
  };

  useOnClickAway(popUp, () => toggleScrub(false));

  return (
    <div className="popUp" ref={popUp}>
      <input
        type="range"
        className="scrub"
        min={0}
        max={9999}
        value={scrubValue}
        onChange={e => setScrubValue(e.target.value)}
      />
      <button className="toggle" ref={toggle} onClick={() => toggleScrub()}>
        ⮝
      </button>
      <div className="scrubDatePicker">
        <DatePicker
          clearIcon={null}
          calendarIcon={null}
          value={startDate}
          onChange={setStartDate}
        />
        →
        <DatePicker
          clearIcon={null}
          calendarIcon={null}
          value={endDate}
          onChange={setEndDate}
        />
      </div>
    </div>
  );
};

export default Scrub;

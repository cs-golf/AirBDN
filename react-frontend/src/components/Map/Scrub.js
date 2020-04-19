<<<<<<< HEAD
<<<<<<< Updated upstream
import React, { useState, useRef, useEffect } from 'react'
import './Scrub.css'
import { useOnClickAway } from '../hooks'

let Scrub = ({ scrubValue, setScrubValue }) => {
	const popUp = useRef(null)
	let toggleScrub = (bool = !popUp.current.classList.contains('active')) =>
		bool ? popUp.current.classList.add('active') : popUp.current.classList.remove('active')

	useOnClickAway(popUp, () => toggleScrub(false))

	return (
		<div className='popUp' ref={popUp}>
			<input
				type='range'
				className='scrub'
				min={0}
				max={9999}
				value={scrubValue}
				onChange={e => setScrubValue(e.target.value)}
			/>
			<button className='toggle' onClick={() => toggleScrub()}>
				^
			</button>
		</div>
	)
}

export default Scrub
=======
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
  setEndDate,
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
        onChange={(e) => setScrubValue(e.target.value)}
      />
      <button className="toggle" ref={toggle} onClick={() => toggleScrub()}>
        V
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
>>>>>>> Stashed changes
=======
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
>>>>>>> 04b0315337a027f09e7f9662a53591c3eab37053

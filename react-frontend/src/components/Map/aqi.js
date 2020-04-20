let breakpoints = {
  pm25: ["0.0-12.0", "12.1-35.4", "35.5-55.4", "55.5-150.4", "150.5-250.4"],
  pm10: ["0-54", "54.1-154", "154.1-254", "254.1-354", "354.1-424"]
};

let aqi = {
  pm25: {
    "0.0": 0,
    "12.0": 50,
    "12.1": 51,
    "35.4": 100,
    "35.5": 101,
    "55.4": 200,
    "55.5": 201,
    "150.4": 300,
    "150.5": 301,
    "250.4": 400,
    "250.5": 401,
    max: 500.4
  },
  pm10: {
    "0": 0,
    "54": 50,
    "54.1": 51,
    "154": 100,
    "154.1": 101,
    "254": 200,
    "254.1": 201,
    "354": 300,
    "354.1": 301,
    "424": 400,
    "424.1": 401,
    max: 604
  }
};

export let calculateAqi = parameter => concentration => {
  let paramBreakpoints = breakpoints[parameter];
  let paramAqi = aqi[parameter];

  let iP = 0;

  for (let i = 0; i < paramBreakpoints.length; i++) {
    let arrBreakpointRange = paramBreakpoints[i].split("-");
    let bpLow = parseFloat(arrBreakpointRange[0]);
    let bpHigh = parseFloat(arrBreakpointRange[1]);

    if (concentration >= bpLow && concentration <= bpHigh) {
      let iLow = paramAqi[arrBreakpointRange[0]];
      let iHigh = paramAqi[arrBreakpointRange[1]];
      iP = Math.round(
        ((iHigh - iLow) / (bpHigh - bpLow)) * (concentration - bpLow) + iLow
      );
      break;
    }
  }

  return iP;
};

export let getAqiPM10 = calculateAqi("pm10");
export let getAqiPM25 = calculateAqi("pm25");

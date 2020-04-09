import axios from "axios";

export const getInfo = async () => {
  setTimeout(() => (window.latestData = getInfo()), 150000);
  let resp = await axios.get(`https://airbdn-api.herokuapp.com/info`);
  return resp.data;
};

export const getReadings = async (grouped = true) => {
  // helper functions
  let getRelativeDate = (dd = 0, date = new Date()) =>
    new Date(date.setDate(date.getDate() + dd));
  let parseDate = date =>
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

  let resp = await axios.get("https://airbdn-api.herokuapp.com/readings", {
    params: { after: parseDate(getRelativeDate(-7)) }
  });

  let groupByDate = readings => {
    let out = readings.reduce((rv, x) => {
      (rv[x["timestamp"]["$date"]] = rv[x["timestamp"]["$date"]] || []).push(x);
      return rv;
    }, {});
    return Object.values(out);
  };

  return grouped ? groupByDate(resp.data) : resp.data;
};

export const getMapData = async scrubValue => {
  let data = await window.latestData;
  if (scrubValue == 10000) return data;

  let weekOfData = await window.weekOfData;
  let n = Math.floor((scrubValue * weekOfData.length) / 10000);
  return data.map(sensor => {
    let copy = sensor;
    let match = weekOfData[n].filter(a => a.location_id === sensor._id);
    if (match[0]) {
      for (let key in match[0]) {
        if (key !== "_id" && key !== "location_id" && key !== "timestamp")
          copy.recent_values[key] = match[0][key];
      }
    }
    return copy;
  });
};

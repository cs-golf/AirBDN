import axios from "axios";

export const getInfo = async () => {
  // setTimeout(() => (window.latestData = getInfo()), 150000);
  let resp = await axios.get(`https://airbdn-api.herokuapp.com/info`);
  console.log(resp.data.length)
  return resp.data;
};

export const getReadings = async (startDate, endDate) => {
  // Date() => "yyyy=mm=dd"
  let parseDate = date =>
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

  // calls api start --> end
  let resp = await axios.get("https://airbdn-api.herokuapp.com/readings", {
    params: { after: parseDate(startDate), before: parseDate(endDate) }
  });

  return resp.data;
};

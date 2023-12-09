import { backendJSPort } from "../util/Constants.js";
import Axios from "axios";

export const getHistoricalSalesData = async (
  state,
  startDate,
  endDate,
  category
) => {
  try {
    console.log(
      "Fetching " +
        category +
        " grocery sales data in " +
        state +
        " from " +
        startDate +
        " to " +
        endDate
    );
    const response = await Axios.get(
      "http://localhost:" +
        backendJSPort +
        "/api/get/grocery_sales_data" +
        "/" +
        state +
        "/" +
        startDate +
        "/" +
        endDate +
        "/" +
        category
    );
    if (response.data.length === 0) {
      console.log("Grocery data retrieval failed");
      console.log(response);
    } else {
      console.log("Grocery data retrieval successful");
    }
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getHistoricalWeatherData = async (
  state,
  latLngArrayPromise,
  startDate,
  endDate
) => {
  try {
    console.log(
      "Fetching historical weather data for " +
        state +
        " from " +
        startDate +
        " to " +
        endDate
    );
    const latLngArray = await latLngArrayPromise;
    let returnArray = [];
    for (let i = 0; i < latLngArray.length; i++) {
      let latLngObj = latLngArray[i];
      let lat = latLngObj.lat;
      let lng = latLngObj.lng;
      const response = await Axios.get(
        "https://archive-api.open-meteo.com/v1/archive?latitude=" +
          lat +
          "&longitude=" +
          lng +
          "&start_date=" +
          startDate +
          "&end_date=" +
          endDate +
          "&daily=weather_code,temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum,rain_sum,snowfall_sum" +
          "&timezone=America%2FChicago"
      );
      if (response.data.length === 0) {
        console.log("Weather data retrieval failed");
      } else {
        console.log("Weather data retrieval successful");
        returnArray.push(response);
      }
    }
    return returnArray;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getDefaultCitiesFromDB_ByState = async (state) => {
  try {
    const response = await Axios.get(
      "http://localhost:" + backendJSPort + "/api/get/default_cities/" + state
    );
    if (response.data.length === 0) {
      console.log("No deafult cities found in database.");
    } else {
      console.log("Default cities found in database.");
    }
    return new Promise((resolve) => {
      resolve(response);
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

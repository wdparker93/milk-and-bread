import React, { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import {
  getHistoricalSalesData,
  getHistoricalWeatherData,
  getDefaultCitiesFromDB_ByState,
} from "../../data_agent/HistoricalSalesAnalysisDataAgent.js";
import "../css/AnalyticsTabHistoricalSalesAnalysis.css";
import UsStates from "./UsStates.js";
import GroceryCategories from "./GroceryCategories.js";
import { Chart } from "chart.js/auto";
import {
  minGrocerySalesDataDate,
  maxGrocerySalesDataDate,
} from "../../util/Constants.js";
import { celsiusToFahrenheit } from "../../util/UtilFunctions.js";
import { getGeoCodeFromAddress } from "../../util/ApiFunctions.js";

function AnalyticsTabHistoricalSalesAnalysis() {
  const [historicalSalesData, setHistoricalSalesData] = useState(null);
  const [historicalWeatherData, setHistoricalWeatherData] = useState(null);
  //const [defaultCities, setDefaultCities] = useState(null);
  //const [latLngArray, setLatLngArray] = useState(null);
  const [usStateSelection, setUsStateSelection] = useState("--");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [categorySelection, setCategorySelection] = useState("--");

  const handleUsStateChange = (event) => {
    setUsStateSelection(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategorySelection(event.target.value);
  };

  const retrieveWeatherData = async () => {
    if (verifyValidReportingParams()) {
      let defaultCities = await fetchDefaultCities();
      let latLngArray = buildLatLngArray(defaultCities);
      await fetchHistoricalWeatherData(latLngArray);
    } else {
      //TODO : Render error window
    }
  };

  const fetchHistoricalSalesData = async () => {
    try {
      const response = await getHistoricalSalesData(
        usStateSelection,
        startDate,
        endDate,
        categorySelection
      );
      setHistoricalSalesData(response.data);
    } catch (error) {
      console.error("Error fetching historical sales data:", error.message);
    }
  };

  const fetchDefaultCities = async () => {
    try {
      const response = await getDefaultCitiesFromDB_ByState(usStateSelection);
      //setDefaultCities(response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching default cities from database:",
        error.message
      );
    }
  };

  const buildLatLngArray = async (defaultCities) => {
    try {
      let tempLatLngArray = [];
      await Promise.all(
        defaultCities.map(async (city) => {
          const response = await getGeoCodeFromAddress(city.city_state_key);
          tempLatLngArray.push(response.results[0].locations[0].latLng);
        })
      );
      //setLatLngArray(tempLatLngArray);
      return tempLatLngArray;
    } catch (error) {
      console.error(
        "Error building lat/lng array from default cities:",
        error.message
      );
    }
  };

  const fetchHistoricalWeatherData = async (latLngArray) => {
    //Sanitize weather data and get it into the plot.
    try {
      const response = await getHistoricalWeatherData(
        usStateSelection,
        latLngArray,
        startDate,
        endDate
      );
      if (response.length > 0) {
        let dataToProcess = [];
        for (let i = 0; i < response.length; i++) {
          dataToProcess.push(response[i].data.daily);
        }
        processHistoricalWeatherData(dataToProcess);
      }
    } catch (error) {
      console.error("Error fetching historical weather data:", error.message);
    }
  };

  const processHistoricalWeatherData = (locationsWeatherData) => {
    let weatherObjDictionary = {};
    for (let j = 0; j < locationsWeatherData.length; j++) {
      const weatherData = locationsWeatherData[j];
      for (let i = 0; i < weatherData.time.length; i++) {
        let weatherObj = null;
        let snowfallSumArray = null;
        let minTempArray = null;
        let meanTempArray = null;
        let previousSunday = getPreviousSunday(weatherData.time[i]);
        if (weatherObjDictionary.hasOwnProperty(previousSunday)) {
          weatherObj = weatherObjDictionary[previousSunday];
          snowfallSumArray = weatherObj["snowfallSumArray"];
          minTempArray = weatherObj["minTempArray"];
          meanTempArray = weatherObj["meanTempArray"];
        } else {
          weatherObj = new Object();
          snowfallSumArray = [];
          minTempArray = [];
          meanTempArray = [];
        }
        snowfallSumArray.push(weatherData.snowfall_sum[i]);
        minTempArray.push(
          celsiusToFahrenheit(weatherData.temperature_2m_min[i])
        );
        meanTempArray.push(
          celsiusToFahrenheit(weatherData.temperature_2m_mean[i])
        );
        weatherObj.snowfallSumArray = snowfallSumArray;
        weatherObj.minTempArray = minTempArray;
        weatherObj.meanTempArray = meanTempArray;
        weatherObjDictionary[previousSunday] = weatherObj;
      }
    }
    if (Object.keys(weatherObjDictionary).length > 0) {
      let weatherStateArray =
        generateWeeklyWeatherAverages(weatherObjDictionary);
      console.log(weatherStateArray);
      setHistoricalWeatherData(weatherStateArray);
    }
  };

  const verifyValidReportingParams = () => {
    let validParams = false;
    if (
      usStateSelection !== "--" &&
      categorySelection !== "--" &&
      startDate !== "" &&
      endDate !== "" &&
      startDate < endDate
    ) {
      validParams = true;
    }
    return validParams;
  };

  const getPreviousSunday = (date) => {
    const currentDate = new Date(date);
    const dayOfWeek = currentDate.getDay();
    const difference = dayOfWeek === 6 ? -1 : dayOfWeek;
    let previousSunday = new Date(currentDate);
    previousSunday.setDate(currentDate.getDate() - difference);
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const previousSundayString = previousSunday.toLocaleDateString(
      "en-US",
      options
    );
    return previousSundayString;
  };

  const generateWeeklyWeatherAverages = (weatherObjDictionary) => {
    let returnArray = [];
    for (let key in weatherObjDictionary) {
      let dataObj = weatherObjDictionary[key];
      let returnObj = new Object();
      let avgMeanTemp = 0;
      let avgMinTemp = 0;
      let avgSnowfall = 0;
      //Average mean temperatures
      for (let i = 0; i < dataObj.meanTempArray.length; i++) {
        avgMeanTemp += dataObj.meanTempArray[i];
      }
      avgMeanTemp /= dataObj.meanTempArray.length;
      //Average min temperatures
      for (let i = 0; i < dataObj.minTempArray.length; i++) {
        avgMinTemp += dataObj.minTempArray[i];
      }
      avgMinTemp /= dataObj.minTempArray.length;
      //Average snowfall
      for (let i = 0; i < dataObj.snowfallSumArray.length; i++) {
        avgSnowfall += dataObj.snowfallSumArray[i];
      }
      avgSnowfall /= dataObj.snowfallSumArray.length;
      //Update object
      returnObj.date = key;
      returnObj.avgMeanTemp = avgMeanTemp;
      returnObj.avgMinTemp = avgMinTemp;
      returnObj.avgSnowfall = avgSnowfall;
      returnArray.push(returnObj);
    }
    return returnArray;
  };

  useEffect(() => {
    fetchHistoricalSalesData();
  }, []);

  useEffect(() => {
    if (historicalSalesData) {
      retrieveWeatherData();
    }
  }, [historicalSalesData]);

  useEffect(() => {
    if (historicalWeatherData) {
      createLineChart();
    }
  }, [historicalWeatherData]);

  const createLineChart = () => {
    console.log(historicalSalesData);
    console.log(historicalWeatherData);
    const ctx = document
      .getElementById("historicalSalesChart")
      .getContext("2d");

    // Check if a chart instance already exists
    const existingChart = Chart.getChart("historicalSalesChart");

    // If a chart instance exists, destroy it
    if (existingChart) {
      existingChart.destroy();
    }

    new Chart(ctx, {
      type: "line",
      data: {
        labels: historicalSalesData.map((entry) => entry.date),
        datasets: [
          {
            label: "Dollars Sold",
            data: historicalSalesData.map((entry) => entry.dollars_sold),
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
            fill: false,
            yAxisID: "dollarsAxis",
          },
          {
            label: "Units Sold",
            data: historicalSalesData.map((entry) => entry.units_sold),
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 2,
            fill: false,
            yAxisID: "unitsAxis",
          },
          {
            label: "Avg. Snowfall",
            data: historicalWeatherData.map((entry) => entry.avgSnowfall),
            borderColor: "rgba(0, 0, 0, 1)",
            borderWidth: 2,
            fill: false,
            yAxisID: "avgSnowfallAxis",
          },
        ],
      },
      options: {
        scales: {
          x: {
            position: "bottom",
          },
          y: [
            {
              type: "linear",
              position: "left",
              id: "dollarsAxis",
            },
            {
              type: "linear",
              position: "left",
              id: "unitsAxis",
            },
            {
              type: "linear",
              position: "right",
              id: "avgSnowfallAxis",
            },
          ],
        },
      },
    });
  };

  return (
    <>
      <div id="historical-sales-data-content-wrapper">
        <canvas id="historicalSalesChart"></canvas>
        <div id="historical-sales-data-parameter-buttons-wrapper">
          <div className="historical-sales-data-button-wrapper">
            <div
              className="historical-sales-data-button-label"
              id="state-label"
            >
              <p className="historical-sales-data-button-label-text">State</p>
            </div>
            <select
              id="historical-sales-data-state-selector"
              onChange={handleUsStateChange}
            >
              <UsStates />
            </select>
          </div>
          <div className="historical-sales-data-button-wrapper">
            <div
              className="historical-sales-data-button-label"
              id="start-date-label"
            >
              <p className="historical-sales-data-button-label-text">
                Start Date
              </p>
            </div>
            <input
              type="date"
              id="historical-sales-data-start-date-selector"
              onChange={handleStartDateChange}
              min={minGrocerySalesDataDate}
              max={maxGrocerySalesDataDate}
            />
          </div>
          <div className="historical-sales-data-button-wrapper">
            <div
              className="historical-sales-data-button-label"
              id="end-date-label"
            >
              <p className="historical-sales-data-button-label-text">
                End Date
              </p>
            </div>
            <input
              type="date"
              id="historical-sales-data-end-date-selector"
              onChange={handleEndDateChange}
              min={minGrocerySalesDataDate}
              max={maxGrocerySalesDataDate}
            />
          </div>
          <div className="historical-sales-data-button-wrapper">
            <div
              className="historical-sales-data-button-label"
              id="category-label"
            >
              <p className="historical-sales-data-button-label-text">
                Grocery Category
              </p>
            </div>
            <select
              id="historical-sales-data-category-selector"
              onChange={handleCategoryChange}
            >
              <GroceryCategories />
            </select>
          </div>
          <div className="historical-sales-data-button-wrapper">
            <button
              id="build-analytics-report-button"
              onClick={fetchHistoricalSalesData}
            >
              <strong>Build Analyltics Report</strong>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AnalyticsTabHistoricalSalesAnalysis;

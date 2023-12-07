import { getLocationSummaryRecords } from "../../data_agent/SummaryAnalysisDataAgent.js";
import "../css/AnalyticsTabSummaryTable.css";
import { useEffect, useState } from "react";
import { includesSnowOrSleet } from "../../util/UtilFunctions.js";

let columnNameArr = [
  {
    locationId: "Location ID",
    address: "Address",
    currentWeather: "Current Weather",
    snowOrSleetIn7DForecast: "Snow or Sleet in 7D Forecast",
    breadInv: "Bread Inv.",
    breadCost: "Bread Cost ($)",
    milkInv: "Milk Inv.",
    milkCost: "Milk Cost ($)",
  },
];

function AnalyticsTabSummaryTable(params) {
  const [summaryDataArr, setSummaryDataArr] = useState([]);

  const populateSummaryDataArr = async (locationObjects) => {
    try {
      const response = await getLocationSummaryRecords();
      let summaryData = response.data;
      console.log(locationObjects);
      if (summaryData.length > 0) {
        console.log("1");
        const newSummaryDataArr = [];
        for (let i = 0; i < summaryData.length; i++) {
          console.log("2");
          let summaryObj = new Object();
          let entry = summaryData[i];
          // Build summaryObj which will get mapped to component HTML
          summaryObj.locationId = entry["location_id"];
          summaryObj.address = entry["user_entered_address"];
          let currentWeatherString = "Weather data refresh required";
          let snowOrSleetExpected = "No";
          if (
            locationObjects !== undefined &&
            locationObjects[entry["location_id"]] !== undefined &&
            locationObjects[entry["location_id"]].forecastData !== undefined
          ) {
            console.log("3");
            currentWeatherString =
              locationObjects[entry["location_id"]].forecastData[0][
                "shortForecast"
              ];
            for (
              let j = 0;
              j < locationObjects[entry["location_id"]].forecastData.length;
              j++
            ) {
              let forecast =
                locationObjects[entry["location_id"]].forecastData[j];
              if (
                includesSnowOrSleet(forecast["shortForecast"]) ||
                includesSnowOrSleet(forecast["detailedForecast"])
              ) {
                snowOrSleetExpected = "Yes";
              }
            }
          }
          summaryObj.currentWeather = currentWeatherString;
          summaryObj.snowOrSleetIn7DForecast = snowOrSleetExpected;
          summaryObj.breadInv = entry["bread_inv"];
          summaryObj.breadCost = parseFloat(entry["bread_cost"]).toFixed(2);
          summaryObj.milkInv = entry["milk_inv"];
          summaryObj.milkCost = parseFloat(entry["milk_cost"]).toFixed(2);
          newSummaryDataArr.push(summaryObj);
        }
        setSummaryDataArr(newSummaryDataArr);
      }
    } catch (error) {
      console.error("Error fetching summary data:", error.message);
    }
  };

  const generateColumnNames = () => {
    if (summaryDataArr.length > 0) {
      return columnNameArr.map((el) => (
        <LocationSummaryElement elementData={el} key={el.locationId} />
      ));
    }
  };

  const generateSummaryReport = () => {
    console.log("4");
    if (summaryDataArr.length > 0) {
      return summaryDataArr.map((el) => (
        <LocationSummaryElement elementData={el} key={el.locationId} />
      ));
    }
  };

  const LocationSummaryElement = (props) => {
    const { elementData } = props;
    const {
      locationId,
      address,
      currentWeather,
      snowOrSleetIn7DForecast,
      breadInv,
      breadCost,
      milkInv,
      milkCost,
    } = elementData;
    let optionalBackgroundChange = "";
    if (includesSnowOrSleet(currentWeather)) {
      optionalBackgroundChange = "red";
    } else if (snowOrSleetIn7DForecast === "Yes") {
      optionalBackgroundChange = "gold";
    }
    return (
      <>
        <div className="location-summary-analysis-entries">
          <div className="location-summary-analysis-location-id-column">
            <div
              className="location-summary-analysis-location-id-row"
              style={{ background: optionalBackgroundChange }}
            >
              {locationId}
            </div>
          </div>
          <div className="location-summary-analysis-address-column">
            <div
              className="location-summary-analysis-address-row"
              style={{ background: optionalBackgroundChange }}
            >
              {address}
            </div>
          </div>
          <div className="location-summary-analysis-current-weather-column">
            <div
              className="location-summary-analysis-current-weather-row"
              style={{ background: optionalBackgroundChange }}
            >
              {currentWeather}
            </div>
          </div>
          <div className="location-summary-analysis-snow-sleet-expected-column">
            <div
              className="location-summary-analysis-snow-sleet-expected-row"
              style={{ background: optionalBackgroundChange }}
            >
              {snowOrSleetIn7DForecast}
            </div>
          </div>
          <div className="location-summary-analysis-bread-inv-column">
            <div
              className="location-summary-analysis-bread-inv-row"
              style={{ background: optionalBackgroundChange }}
            >
              {breadInv}
            </div>
          </div>
          <div className="location-summary-analysis-bread-cost-column">
            <div
              className="location-summary-analysis-bread-cost-row"
              style={{ background: optionalBackgroundChange }}
            >
              {breadCost}
            </div>
          </div>
          <div className="location-summary-analysis-milk-inv-column">
            <div
              className="location-summary-analysis-milk-inv-row"
              style={{ background: optionalBackgroundChange }}
            >
              {milkInv}
            </div>
          </div>
          <div className="location-summary-analysis-milk-cost-column">
            <div
              className="location-summary-analysis-milk-cost-row"
              style={{ background: optionalBackgroundChange }}
            >
              {milkCost}
            </div>
          </div>
        </div>
      </>
    );
  };

  useEffect(() => {
    populateSummaryDataArr(params.locationObjects);
  }, [params.locationObjects]);

  return (
    <>
      <h2 id="location-summary-header">Location Summary</h2>
      <div className="location-summary-contents">
        <div className="location-summary-column-names">
          {generateColumnNames()}
        </div>
        <div className="location-summary-analysis">
          {generateSummaryReport()}
        </div>
      </div>
    </>
  );
}

export default AnalyticsTabSummaryTable;

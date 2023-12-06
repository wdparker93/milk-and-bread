import { Marker, Popup } from "react-leaflet";
import React from "react";
import { Icon, extend } from "leaflet";
import "../css/Markers.css";
import { red, green } from "../../util/Constants.js";
import { includesSnowOrSleet } from "../../util/UtilFunctions.js";
import MarkerPopupForecastData from "./MarkerPopupForecastData.js";

let latLngCoordsObjArr = [];

var dangerIcon = new Icon({
  iconUrl: "./media/red-danger-symbol.png",
  iconSize: [28, 28], // size of the icon
});

var cautionIcon = new Icon({
  iconUrl: "./media/yellow-caution-sign.png",
  iconSize: [28, 28], // size of the icon
});

var defaultIcon = new Icon({
  iconUrl: "./media/marker-icon.png",
  iconSize: [20, 32], // size of the icon
  iconAnchor: [10, 32],
  popupAnchor: [0, -32],
});

const toggle7DForecastVisibility = () => {
  let extendedForecastData = document.getElementById(
    "marker-popup-7d-forecast-data"
  );
  extendedForecastData.classList.toggle(
    "marker-popup-7d-forecast-data-visible"
  );
};

function Markers(params) {
  const MarkerElement = (props) => {
    const { elementData } = props;
    const {
      id,
      address,
      lat,
      lng,
      milk,
      milkCost,
      bread,
      breadCost,
      currentWeather,
      snowSleetAnticipated,
      currentlySnowingOrSleeting,
      forecastData,
    } = elementData;
    let locationId = id;
    let iconToUse = defaultIcon;
    let yesNoColor = green;
    if (currentlySnowingOrSleeting === "Yes") {
      iconToUse = dangerIcon;
      yesNoColor = red;
    } else if (snowSleetAnticipated === "Yes") {
      iconToUse = cautionIcon;
      yesNoColor = red;
    }
    return (
      <>
        <Marker
          className="leaflet-map-marker"
          key={locationId}
          position={[lat, lng]}
          icon={iconToUse}
        >
          <Popup>
            <span className="popup-content-wrapper">
              <h3 style={{ margin: "0 0 10px 0" }}>Location Overview</h3>
              <p style={{ margin: "0 0 2px 0" }}>
                <strong>Id : </strong>
                {locationId}
              </p>
              <p style={{ margin: "0 0 2px 0" }}>
                <strong>Address : </strong>
                {address}
              </p>
              <p style={{ margin: "0 0 2px 0" }}>
                <strong>Milk : </strong>
                {milk} unit(s) @ ${milkCost} each
              </p>
              <p style={{ margin: "0 0 2px 0" }}>
                <strong>Bread : </strong>
                {bread} unit(s) @ ${breadCost} each
              </p>
              <hr></hr>
              <p style={{ margin: "0 0 2px 0" }}>
                <strong>Current Weather : </strong>
                {currentWeather}
              </p>
              <p style={{ margin: "0 0 10px 0" }}>
                <strong>Snow or Sleet in 7-Day Forecast :</strong>{" "}
                <strong style={{ color: yesNoColor }}>
                  {snowSleetAnticipated}
                </strong>
                <button
                  className="show-7d-forecast-button"
                  onClick={() => toggle7DForecastVisibility()}
                >
                  Expand Forecast
                </button>
                <MarkerPopupForecastData forecastData={forecastData} />
              </p>
              <hr></hr>
              <button
                className="update-inventory-button"
                onClick={() => params.updateInvHandler(locationId)}
              >
                Manage Inventory
              </button>
              <button
                className="delete-location-button"
                onClick={() => params.deleteLocationHandler(locationId)}
              >
                Delete Location
              </button>
            </span>
          </Popup>
        </Marker>
      </>
    );
  };

  const retrieveMarkerData = () => {
    return latLngCoordsObjArr.map((el) => <MarkerElement elementData={el} />);
  };

  const populateMarkerData = () => {
    for (const key in params.locationObjectsData) {
      const location = params.locationObjectsData[key];
      let markerObj = new Object();
      const id = location["id"];
      const address = location["userEnteredAddress"];
      const lat = location["coords"][0];
      const lng = location["coords"][1];
      const bread = location["bread"];
      const breadCost = location["breadCost"];
      const milk = location["milk"];
      const milkCost = location["milkCost"];
      const forecastData = location["forecastData"];
      let currentWeather = "";
      let snowSleetAnticipated = "No";
      let currentlySnowingOrSleeting = "No";
      if (forecastData != undefined && forecastData.length > 0) {
        currentWeather =
          forecastData[0]["shortForecast"] +
          " @ " +
          forecastData[0]["temperature"] +
          "°" +
          forecastData[0]["temperatureUnit"];
        if (includesSnowOrSleet(currentWeather)) {
          currentlySnowingOrSleeting = "Yes";
        }
        for (let i = 0; i < forecastData.length; i++) {
          let detailedForecast = forecastData[i]["detailedForecast"];
          let shortForecast = forecastData[i]["shortForecast"];
          if (
            includesSnowOrSleet(detailedForecast) ||
            includesSnowOrSleet(shortForecast)
          ) {
            snowSleetAnticipated = "Yes";
          }
        }
      }
      //console.log(currentWeather);
      markerObj.id = id;
      markerObj.address = address;
      markerObj.lat = lat;
      markerObj.lng = lng;
      markerObj.milk = milk;
      markerObj.milkCost = milkCost;
      markerObj.bread = bread;
      markerObj.breadCost = breadCost;
      markerObj.currentWeather = currentWeather;
      markerObj.snowSleetAnticipated = snowSleetAnticipated;
      markerObj.currentlySnowingOrSleeting = currentlySnowingOrSleeting;
      markerObj.forecastData = forecastData;
      latLngCoordsObjArr.push(markerObj);
    }
  };

  latLngCoordsObjArr = [];
  populateMarkerData();

  return (
    <>
      <div className="marker-element">{retrieveMarkerData()}</div>
    </>
  );
}

export default Markers;

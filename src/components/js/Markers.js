import { Marker, Popup } from "react-leaflet";
import React, { useState } from "react";
import { Icon } from "leaflet";

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

function Markers(params) {
  const MarkerElement = (props) => {
    const { elementData } = props;
    const {
      id,
      lat,
      lng,
      milk,
      bread,
      currentWeather,
      snowSleetAnticipated,
      currentlySnowingOrSleeting,
    } = elementData;
    let locationId = id;
    let iconToUse = defaultIcon;
    if (currentlySnowingOrSleeting == "Yes") {
      iconToUse = dangerIcon;
    } else if (snowSleetAnticipated == "Yes") {
      iconToUse = cautionIcon;
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
            <span>
              <h3>Location Overview</h3>
              <p>Id : {locationId}</p>
              <p>Milk : {milk}</p>
              <p>Bread : {bread}</p>
              <p>Current Weather : {currentWeather}</p>
              <p>Snow or Sleet in 7-Day Forecast : {snowSleetAnticipated}</p>
              <button
                className="update-inventory-button"
                onClick={() => params.updateInvHandler(locationId)}
              >
                Manage Inventory
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
    for (let i = 0; i < params.locationObjectsData.length; i++) {
      let markerObj = new Object();
      let id = params.locationObjectsData[i].key;
      let lat = params.locationObjectsData[i].coords[0];
      let lng = params.locationObjectsData[i].coords[1];
      let milk = params.locationObjectsData[i].milk;
      let bread = params.locationObjectsData[i].bread;
      const forecastData = params.locationObjectsData[i].forecastData;
      let currentWeather = "";
      let snowSleetAnticipated = "No";
      let currentlySnowingOrSleeting = "No";
      if (forecastData.length > 0) {
        currentWeather =
          forecastData[0]["shortForecast"] +
          " @ " +
          forecastData[0]["temperature"] +
          "°" +
          forecastData[0]["temperatureUnit"];
        if (
          currentWeather.toLowerCase().includes("snow") ||
          currentWeather.toLowerCase().includes("sleet")
        ) {
          currentlySnowingOrSleeting = "Yes";
        }
        if (currentlySnowingOrSleeting == "No") {
          for (let i = 0; i < forecastData.length; i++) {
            let detailedForecast =
              forecastData[i]["detailedForecast"].toLowerCase();
            let shortForecast = forecastData[i]["shortForecast"].toLowerCase();
            if (
              detailedForecast.includes("snow") ||
              detailedForecast.includes("sleet") ||
              shortForecast.includes("snow") ||
              shortForecast.includes("sleet")
            ) {
              snowSleetAnticipated = "Yes";
            }
          }
        }
      }
      //console.log(currentWeather);
      markerObj.id = id;
      markerObj.lat = lat;
      markerObj.lng = lng;
      markerObj.milk = milk;
      markerObj.bread = bread;
      markerObj.currentWeather = currentWeather;
      markerObj.snowSleetAnticipated = snowSleetAnticipated;
      markerObj.currentlySnowingOrSleeting = currentlySnowingOrSleeting;
      latLngCoordsObjArr.push(markerObj);
    }
  };

  latLngCoordsObjArr = [];
  populateMarkerData();

  return (
    <>
      <div className="marker-test-from-return">{retrieveMarkerData()}</div>
    </>
  );
}

export default Markers;

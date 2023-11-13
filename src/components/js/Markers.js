import { Marker, Popup } from "react-leaflet";
import React, { useState } from "react";

let latLngCoordsObjArr = [];

function Markers(params) {
  const MarkerElement = (props) => {
    const { elementData } = props;
    const { id, lat, lng, milk, bread, currentWeather, snowSleetAnticipated } =
      elementData;
    let locationId = id;
    return (
      <>
        <Marker
          className="leaflet-map-marker"
          key={locationId}
          position={[lat, lng]}
        >
          <Popup>
            <span>
              <h3>Location Overview</h3>
              <p>Id : {locationId}</p>
              <p>Milk : {milk}</p>
              <p>Bread : {bread}</p>
              <p>Current Weather : {currentWeather}</p>
              <p>Snow or Sleet Forecasted : {snowSleetAnticipated}</p>
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
      if (forecastData.length > 0) {
        currentWeather =
          forecastData[0]["shortForecast"] +
          " @ " +
          forecastData[0]["temperature"] +
          "°" +
          forecastData[0]["temperatureUnit"];
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
      //console.log(currentWeather);
      markerObj.id = id;
      markerObj.lat = lat;
      markerObj.lng = lng;
      markerObj.milk = milk;
      markerObj.bread = bread;
      markerObj.currentWeather = currentWeather;
      markerObj.snowSleetAnticipated = snowSleetAnticipated;
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

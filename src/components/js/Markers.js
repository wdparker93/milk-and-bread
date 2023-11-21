import { Marker, Popup } from "react-leaflet";
import React from "react";
import { Icon } from "leaflet";
import { red, green } from "../../util/Constants.js";

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
      address,
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
            <span>
              <h3>Location Overview</h3>
              <p>Id : {locationId}</p>
              <p>Address : {address}</p>
              <p>Milk : {milk}</p>
              <p>Bread : {bread}</p>
              <p>Current Weather : {currentWeather}</p>
              <p>
                Snow or Sleet in 7-Day Forecast :{" "}
                <strong style={{ color: yesNoColor }}>
                  {snowSleetAnticipated}
                </strong>
              </p>
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
    for (const key in params.locationObjectsData) {
      const location = params.locationObjectsData[key];
      let markerObj = new Object();
      const id = location["id"];
      const address = location["userEnteredAddress"];
      const lat = location["coords"][0];
      const lng = location["coords"][1];
      const bread = location["bread"];
      const milk = location["milk"];
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
        if (
          currentWeather.toLowerCase().includes("snow") ||
          currentWeather.toLowerCase().includes("sleet")
        ) {
          currentlySnowingOrSleeting = "Yes";
        }
        if (currentlySnowingOrSleeting === "No") {
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
      markerObj.address = address;
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
      <div className="marker-element">{retrieveMarkerData()}</div>
    </>
  );
}

export default Markers;

import "./App.css";
import Axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

function App() {
  /*
  const mapQuestKey = "ghmpUiVTD8GQkci0Vv1pLFj1L4T9BSbA";
  const [mapImageSource, setMapImageSource] = useState(
    "https://www.mapquestapi.com/staticmap/v5/map?key=" +
      mapQuestKey +
      "&center=Kansas&zoom=3&type=map&size=350,200@2x"
  );
  */
  const defaultCenter = [37.5, -95.0];
  const defaultZoom = 4;
  const minZoom = 0;
  const maxZoom = 12;
  const [usRegionSelection, setUsRegionSelection] = useState("--");
  const [usStateSelection, setUsStateSelection] = useState("--");
  const [mapZoomLevel, setMapZoomLevel] = useState({ defaultZoom });

  const mapRef = useRef();

  const handleMapRefresh = (event) => {};

  const handleRegionChange = (event) => {
    //setUsRegionSelection(event.target.value);
  };

  const handleUsStateChange = (event) => {
    //TODO : Case/Switch statement for zoom level for each state
    //TODO : Zoom in on Georgia, USA. Not Georgia in the eastern hemisphere.
    setUsStateSelection(event.target.value);
    if (event.target.value != "--") {
      setMapZoomLevel(5);
    } else {
      setMapZoomLevel(3);
      setUsStateSelection("Kansas");
    }
  };

  return (
    <div className="App">
      <div className="header" id="main-header">
        <div id="main-header-text">
          <h1 id="main-title">
            Milk and Bread : Exploring Praoctive, Climate-Driven Supply Chain
            Optimization
          </h1>
        </div>
        <div id="secondary-headers">
          <h2 id="secondary-title">
            Leverage real-time weather forecasts to optimize supply networks of
            milk and bread.
          </h2>
          <h2 id="data-source-explanation">
            Data Sources :{" "}
            <a
              class="data-link"
              href="https://www.weatherapi.com/my/"
              target="_blank"
            >
              WeatherAPI
            </a>
            &nbsp;and&nbsp;
            <a
              className="data-link"
              href="https://leafletjs.com/"
              target="_blank"
            >
              Leaflet
            </a>
            .
          </h2>
        </div>
      </div>
      <div id="map-section">
        <div id="map-control-panel-wrapper">
          <h3>Map Control Panel</h3>
          <div id="map-control-panel-button-wrapper">
            <div
              className="map-control-panel-element"
              id="region-selector-wrapper"
            >
              <p
                className="map-control-panel-element-text"
                id="region-selector-label"
              >
                Select Region
              </p>
              <select id="region-selector" onChange={handleRegionChange}>
                <option value="--">--</option>
                <option value="West">West</option>
                <option value="Midwest">Midwest</option>
                <option value="South">South</option>
                <option value="Northeast">Northeast</option>
              </select>
            </div>
            <div
              className="map-control-panel-element"
              id="state-selector-wrapper"
            >
              <p
                className="map-control-panel-element-text"
                id="state-selector-label"
              >
                Select State
              </p>
              <select id="state-selector" onChange={handleUsStateChange}>
                <option value="--">--</option>
                <option value="Alabama">Alabama</option>
                <option value="Arizona">Arizona</option>
                <option value="Arkansas">Arkansas</option>
                <option value="California">California</option>
                <option value="Colorado">Colorado</option>
                <option value="Connecticut">Connecticut</option>
                <option value="Delaware">Delaware</option>
                <option value="Florida">Florida</option>
                <option value="Georgia">Georgia</option>
                <option value="Idaho">Idaho</option>
                <option value="Illinois">Illinois</option>
                <option value="Indiana">Indiana</option>
                <option value="Iowa">Iowa</option>
                <option value="Kansas">Kansas</option>
                <option value="Kentucky">Kentucky</option>
                <option value="Louisiana">Louisiana</option>
                <option value="Maine">Maine</option>
                <option value="Maryland">Maryland</option>
                <option value="Massachusetts">Massachusetts</option>
                <option value="Michigan">Michigan</option>
                <option value="Minnesota">Minnesota</option>
                <option value="Mississippi">Mississippi</option>
                <option value="Missouri">Missouri</option>
                <option value="Montana">Montana</option>
                <option value="Nebraska">Nebraska</option>
                <option value="Nevada">Nevada</option>
                <option value="New Hampshire">New Hampshire</option>
                <option value="New Jersey">New Jersey</option>
                <option value="New Mexico">New Mexico</option>
                <option value="New York">New York</option>
                <option value="North Carolina">North Carolina</option>
                <option value="North Dakota">North Dakota</option>
                <option value="Ohio">Ohio</option>
                <option value="Oklahoma">Oklahoma</option>
                <option value="Oregon">Oregon</option>
                <option value="Pennsylvania">Pennsylvania</option>
                <option value="Rhode Island">Rhode Island</option>
                <option value="South Carolina">South Carolina</option>
                <option value="South Dakota">South Dakota</option>
                <option value="Tennessee">Tennessee</option>
                <option value="Texas">Texas</option>
                <option value="Utah">Utah</option>
                <option value="Vermont">Vermont</option>
                <option value="Virginia">Virginia</option>
                <option value="Washington">Washington</option>
                <option value="West Virginia">West Virginia</option>
                <option value="Wisconsin">Wisconsin</option>
                <option value="Wyoming">Wyoming</option>
              </select>
            </div>
            <div
              className="map-control-panel-element"
              id="map-refresh-button-wrapper"
            >
              <p
                className="map-ctonrol-panel-element-text"
                id="map-refresh-button-label"
              >
                Refresh Map
              </p>
              <button id="refresh-button" onClick={handleMapRefresh}>
                Refresh Map
              </button>
            </div>
          </div>
        </div>
        <br />
        <MapContainer
          id="leaflet-map-image"
          center={defaultCenter}
          zoom={defaultZoom}
          scrollWheelZoom={true}
          minZoom={minZoom}
          maxZoom={maxZoom}
        >
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
        </MapContainer>
      </div>
    </div>
  );
}

export default App;

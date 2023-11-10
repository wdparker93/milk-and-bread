import "./App.css";
import Axios from "axios";
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { latLng } from "leaflet";
import Markers from "./components/js/Markers.js";
import UsStates from "./components/js/UsStates.js";

function App() {
  const mapQuestKey = "ghmpUiVTD8GQkci0Vv1pLFj1L4T9BSbA";
  const defaultCenter = [37.5, -95.0];
  const defaultZoom = 4;
  const minZoom = 0;
  const maxZoom = 12;
  const [usRegionSelection, setUsRegionSelection] = useState("--");
  const [usStateSelection, setUsStateSelection] = useState("--");
  const [mapZoomLevel, setMapZoomLevel] = useState({ defaultZoom });
  const [markersOutputComponent, setMarkersOutputComponent] = useState("");
  const [latLngCoords, setLatLngCoords] = useState([]);
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [addressLine3, setAddressLine3] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressState, setAddressState] = useState("");
  const [addressZip, setAddressZip] = useState("");

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  });

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

  /**
   * Reference https://developer.mapquest.com/documentation/geocoding-api/address/get
   * @param {*} address
   */
  const getGeocodeFromAddress = () => {
    let address = addressLine1;
    address = address.length > 0 ? address + ", " : address + "";
    address = address + addressLine2;
    address = addressLine2.length > 0 ? address + ", " : address + "";
    address = address + addressLine3;
    address = addressLine3.length > 0 ? address + ", " : address + "";
    address = address + addressCity + ", " + addressState + " " + addressZip;
    console.log(address);
    fetch(
      "https://www.mapquestapi.com/geocoding/v1/address?key=" +
        mapQuestKey +
        "&location=" +
        address
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        } else {
          return response.json();
        }
      })
      .then((data) => {
        //console.log(data.results[0].locations[0]);
        //console.log(data.results[0].locations[0].latLng["lat"]);
        const lat = data.results[0].locations[0].latLng["lat"];
        const lng = data.results[0].locations[0].latLng["lng"];
        const newCoords = [lat, lng];
        var existingCoords = latLngCoords;
        let addToMarkerLocationsArray = true;
        for (let i = 0; i < existingCoords.length; i++) {
          if (newCoords[0] == existingCoords[i][0]) {
            if (newCoords[1] == existingCoords[i][1]) {
              addToMarkerLocationsArray = false;
            }
          }
        }
        if (addToMarkerLocationsArray) {
          existingCoords.push(newCoords);
          setLatLngCoords(existingCoords);
        }
        console.log(latLngCoords);
        updateMarkersOutputComponent();
      });
  };

  /**
   * Adds a latitude-longitude coordinate to the latLngCoords
   * state variable.
   *
   * @param {*} latLngArray
   */
  const addMarker = (latLngArray) => {
    //TODO : Add the coordinate
  };

  /**
   * Builds the Marker element to append to the dynamic map using
   * the latLngCoords state variable for the coordinates to add.
   */
  const updateMarkersOutputComponent = () => {
    /*const coordinates = [
      [37.5, -95.0],
      [40, -90.0],
    ];*/
    const coordinates = latLngCoords;
    setMarkersOutputComponent(<Markers latLngCoordsData={coordinates} />);
  };

  const handleAddressLine1Change = (event) => {
    setAddressLine1(event.target.value);
  };

  const handleAddressLine2Change = (event) => {
    setAddressLine2(event.target.value);
  };

  const handleAddressLine3Change = (event) => {
    setAddressLine3(event.target.value);
  };

  const handleAddressCityChange = (event) => {
    setAddressCity(event.target.value);
  };

  const handleAddressStateChange = (event) => {
    setAddressState(event.target.value);
  };

  const handleAddressZipChange = (event) => {
    setAddressZip(event.target.value);
  };

  //console.log("About to update the markers element");
  //updateMarkersOutputComponent();

  return (
    <div className="App">
      <div className="header" id="main-header">
        <div id="main-header-text">
          <h1 id="main-title">
            Milk and Bread : Exploring Proactive, Climate-Driven Supply Chain
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
        <div class="map-column-element">
          <div id="interactive-map-wrapper">
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
                    Region Focus
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
                    State Focus
                  </p>
                  <select id="state-selector" onChange={handleUsStateChange}>
                    <UsStates />
                  </select>
                </div>
                <div
                  className="map-control-panel-element"
                  id="map-refresh-button-wrapper"
                >
                  <p
                    className="map-control-panel-element-text"
                    id="map-refresh-button-label"
                  >
                    Refresh Weather Data
                  </p>
                  <button
                    id="refresh-button"
                    onClick={updateMarkersOutputComponent}
                  >
                    Refresh Weather Data
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
              <div>{markersOutputComponent}</div>
            </MapContainer>
          </div>
          <div id="add-marker-at-address-panel-wrapper">
            <h3>Add Location At Address</h3>
            <div
              className="add-marker-at-address-panel-element"
              id="map-address-line-1"
            >
              <p
                className="map-control-panel-element-text"
                id="map-address-line-1-field-label"
              >
                Address Line 1
              </p>
              <input type="text" onChange={handleAddressLine1Change} />
            </div>
            <div
              className="add-marker-at-address-panel-element"
              id="map-address-line-2"
            >
              <p
                className="map-control-panel-element-text"
                id="map-address-line-2-field-label"
              >
                Address Line 2
              </p>
              <input type="text" onChange={handleAddressLine2Change} />
            </div>
            <div
              className="add-marker-at-address-panel-element"
              id="map-address-line-3"
            >
              <p
                className="map-control-panel-element-text"
                id="map-address-line-3-field-label"
              >
                Address Line 3
              </p>
              <input type="text" onChange={handleAddressLine3Change} />
            </div>
            <div
              className="add-marker-at-address-panel-element"
              id="map-address-city"
            >
              <p
                className="map-control-panel-element-text"
                id="map-address-city-field-label"
              >
                City
              </p>
              <input type="text" onChange={handleAddressCityChange} />
            </div>
            <div className="map-control-panel-element" id="map-address-state">
              <p
                className="map-control-panel-element-text"
                id="map-address-state-field-label"
              >
                State
              </p>
              <select
                id="add-marker-at-address-state-selector"
                onChange={handleAddressStateChange}
              >
                <UsStates />
              </select>
            </div>
            <div
              className="add-marker-at-address-panel-element"
              id="map-address-zip"
            >
              <p
                className="map-control-panel-element-text"
                id="map-address-zip-field-label"
              >
                Zip
              </p>
              <input type="text" onChange={handleAddressZipChange} />
            </div>
            <div
              className="add-marker-at-address-panel-element"
              id="map-address-add-marker"
            >
              <button
                id="add-marker-at-address-button"
                onClick={getGeocodeFromAddress}
              >
                <strong>Add Location</strong>
              </button>
            </div>
          </div>
          <div id="update-inventory-at-location-panel-wrapper">
            <h3>Update Inventory at Location</h3>
            <div
              className="update-location-supply-panel-element"
              id="update-location-add-supply"
            >
              <button id="update-location-supply-button" onClick={null}>
                <strong>Update Location Supply</strong>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

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
  const [locationObjects, setLocationObjects] = useState([]);
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [addressLine3, setAddressLine3] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressState, setAddressState] = useState("");
  const [addressZip, setAddressZip] = useState("");
  const [locationObjKey, setLocationObjKey] = useState(1);
  const [invEditLocationKey, setInvEditLocationKey] = useState("--");
  const [invEditMilkNew, setInvEditMilkNew] = useState("");
  const [invEditBreadNew, setInvEditBreadNew] = useState("");

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
   * Adds a latitude-longitude coordinate to the locationObjects
   * state variable.
   */
  const addLocation = () => {
    let address = buildAddress();
    getGeocodeAddMarker(address);
  };

  /**
   * Builds address with the addLocationAtAddress fields
   *
   * @returns address
   */
  const buildAddress = () => {
    let address = addressLine1;
    address = address.length > 0 ? address + ", " : address + "";
    address = address + addressLine2;
    address = addressLine2.length > 0 ? address + ", " : address + "";
    address = address + addressLine3;
    address = addressLine3.length > 0 ? address + ", " : address + "";
    address = address + addressCity + ", " + addressState + " " + addressZip;
    return address;
  };

  /**
   * Reference https://developer.mapquest.com/documentation/geocoding-api/address/get
   * @param {*} address
   */
  const getGeocodeAddMarker = (address) => {
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
        const lat = data.results[0].locations[0].latLng["lat"];
        const lng = data.results[0].locations[0].latLng["lng"];
        const coords = [lat, lng];
        let locationObj = new Object();
        let key = "location-" + locationObjKey;
        locationObj.key = key;
        locationObj.coords = coords;
        locationObj.milk = 0;
        locationObj.bread = 0;
        var existingLocationObjects = locationObjects;
        let addToMarkerLocationsArray = true;
        for (let i = 0; i < existingLocationObjects.length; i++) {
          if (coords[0] == existingLocationObjects[i].coords[0]) {
            if (coords[1] == existingLocationObjects[i].coords[1]) {
              addToMarkerLocationsArray = false;
            }
          }
        }
        if (addToMarkerLocationsArray) {
          existingLocationObjects.push(locationObj);
          setLocationObjects(existingLocationObjects);
          setLocationObjKey(key + 1);
        }
        updateMarkersOutputComponent();
      });
  };

  const updateExistingMarkerInv = (locationKey) => {
    console.log("updateExistingMarkerInv");
    setInvEditLocationKey(locationKey);
    var invEditLocationId = document.getElementById(
      "update-inv-location-id-field"
    );
    invEditLocationId.value = locationKey;
    var invEditMilkCurrent = document.getElementById(
      "update-inv-at-location-milk-current-field"
    );
    var invEditBreadCurrent = document.getElementById(
      "update-inv-at-location-bread-current-field"
    );
    for (let i = 0; i < locationObjects.length; i++) {
      const locationObject = locationObjects[i];
      if (locationKey == locationObject.key) {
        invEditMilkCurrent.value = locationObject.milk;
        invEditBreadCurrent.value = locationObject.bread;
      }
    }
  };

  /**
   * Builds the Marker element to append to the dynamic map using
   * the locationObjects state variable for the coordinates to add.
   */
  const updateMarkersOutputComponent = () => {
    const locationObjArray = locationObjects;
    setMarkersOutputComponent(
      <Markers
        locationObjectsData={locationObjArray}
        updateInvHandler={updateExistingMarkerInv}
      />
    );
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

  const handleInvEditMilkNewChange = (event) => {
    setInvEditMilkNew(event.target.value);
  };

  const handleInvEditBreadNewChange = (event) => {
    setInvEditBreadNew(event.target.value);
  };

  const handleUpdateInvAtLocation = () => {
    let locationObjectsTemp = locationObjects;
    for (let i = 0; i < locationObjectsTemp.length; i++) {
      let locationObject = locationObjectsTemp[i];
      console.log(invEditBreadNew);
      console.log(invEditMilkNew);
      if (locationObject.key == invEditLocationKey) {
        locationObject.milk = invEditMilkNew;
        locationObject.bread = invEditBreadNew;
        locationObjectsTemp[i] = locationObject;
        console.log(locationObject);
        setLocationObjects(locationObjectsTemp);
      }
    }
    var invEditMilkCurrent = document.getElementById(
      "update-inv-at-location-milk-current-field"
    );
    invEditMilkCurrent.value = invEditMilkNew;
    var invEditBreadCurrent = document.getElementById(
      "update-inv-at-location-bread-current-field"
    );
    invEditBreadCurrent.value = invEditBreadNew;
    updateMarkersOutputComponent();
  };

  //console.log({ updateExistingMarkerInv });
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
      <div id="map-inv-mgmt-row" class="body-row">
        <div id="map-column" class="body-column">
          <div id="map-section-wrapper">
            <div id="map-control-panel-wrapper">
              <h3>Map Control Panel</h3>
              <div id="map-control-panel-buttons-wrapper">
                <div
                  className="map-control-panel-element-wrapper"
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
                  className="map-control-panel-element-wrapper"
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
                  className="map-control-panel-element-wrapper"
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
              <button id="add-marker-at-address-button" onClick={addLocation}>
                <strong>Add Location</strong>
              </button>
            </div>
          </div>
        </div>
        <div id="inv-mgmt-column" class="body-column">
          <div id="update-inv-at-location-panel-wrapper">
            <h3>Location Inventory</h3>
            <div id="update-inv-at-location-controls-wrapper">
              <div
                id="update-inv-at-location-control-panel-column-1"
                className="update-inv-at-location-control-panel-column"
              >
                <div
                  className="update-inv-at-location-element"
                  id="update-inv-location-id"
                >
                  <p
                    className="update-inv-at-location-element-text"
                    id="update-inv-location-id-label"
                  >
                    <strong>Location ID</strong>
                  </p>
                  <select
                    class="udpate-inv-at-location-field"
                    id="update-inv-location-id-field"
                    type="text"
                    onChange={null}
                  >
                    <option value="--">--</option>
                    <option value="location-1">location-1</option>
                  </select>
                </div>
                <div
                  className="update-location-supply-panel-element"
                  id="update-location-add-supply"
                >
                  <button
                    id="update-location-supply-button"
                    onClick={handleUpdateInvAtLocation}
                  >
                    <strong>Update Inventory</strong>
                  </button>
                </div>
              </div>
              <div
                id="update-inv-at-location-control-panel-column-2"
                className="update-inv-at-location-control-panel-column"
              >
                <strong>Milk</strong>
                <div id="milk-current-new-number-fields">
                  <div
                    className="update-inv-at-location-element"
                    id="update-inv-milk-current"
                  >
                    <p
                      className="update-inv-at-location-element-text"
                      id="update-inv-milk-current-label"
                    >
                      Current
                    </p>
                    <input
                      class="udpate-inv-at-location-number-field"
                      type="number"
                      readonly="true"
                      disabled="true"
                      id="update-inv-at-location-milk-current-field"
                    />
                  </div>
                  <div
                    className="update-inv-at-location-element"
                    id="update-inv-milk-new"
                  >
                    <p
                      className="update-inv-at-location-element-text"
                      id="update-inv-milk-new-label"
                    >
                      New
                    </p>
                    <input
                      class="udpate-inv-at-location-number-field"
                      id="update-inv-milk-new-field"
                      type="number"
                      onChange={handleInvEditMilkNewChange}
                    />
                  </div>
                </div>
              </div>
              <div
                id="update-inv-at-location-control-panel-column-3"
                className="update-inv-at-location-control-panel-column"
              >
                <strong>Bread</strong>
                <div id="bread-current-new-number-fields">
                  <div
                    className="update-inv-at-location-element"
                    id="update-inv-bread-current"
                  >
                    <p
                      className="update-inv-at-location-element-text"
                      id="update-inv-bread-current-label"
                    >
                      Current
                    </p>
                    <input
                      class="udpate-inv-at-location-number-field"
                      type="number"
                      readonly="true"
                      disabled="true"
                      id="update-inv-at-location-bread-current-field"
                    />
                  </div>
                  <div
                    className="update-inv-at-location-element"
                    id="update-inv-bread-new"
                  >
                    <p
                      className="update-inv-at-location-element-text"
                      id="update-inv-bread-new-label"
                    >
                      New
                    </p>
                    <input
                      class="udpate-inv-at-location-number-field"
                      id="update-inv-bread-new-field"
                      type="number"
                      onChange={handleInvEditBreadNewChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

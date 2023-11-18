import "./App.css";
import Axios from "axios";
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import AppHeader from "./components/js/AppHeader.js";
import Markers from "./components/js/Markers.js";
import UsStates from "./components/js/UsStates.js";
import Locations from "./components/js/Locations.js";
import AnalyticsTabSummaryTable from "./components/js/AnalyticsTabSummaryTable.js";
import AnalyticsTabRiskAnalysis from "./components/js/AnalyticsTabRiskAnalysis.js";
import AnalyticsTabProfitabilityAnalysis from "./components/js/AnalyticsTabProfitabilityAnalysis.js";
import AnalyticsTabPerformanceTracking from "./components/js/AnalyticsTabPerformanceTracking.js";

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
  const [analyticsTabOutputComponent, setAnalyticsTabOutputComponent] =
    useState(<AnalyticsTabSummaryTable />);
  const [locationObjects, setLocationObjects] = useState([]);
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [addressLine3, setAddressLine3] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressState, setAddressState] = useState("");
  const [addressZip, setAddressZip] = useState("");
  const [locationObjKey, setLocationObjKey] = useState(1);
  //const [invEditLocationKey, setInvEditLocationKey] = useState("--");
  //const [invEditMilkNew, setInvEditMilkNew] = useState("");
  //const [invEditBreadNew, setInvEditBreadNew] = useState("");
  const [forecastData, setForecastData] = useState("");

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  });

  useEffect(() => {
    // This effect runs whenever forecastData is updated
    updateMarkersOutputComponent();
  }, [locationObjects, forecastData]);

  const refreshWeatherData = () => {
    fetchBaseNwsApiCall();
    //updateMarkersOutputComponent();
  };

  /**
   * https://api.weather.gov/gridpoints/{office}/{gridX},{gridY}/forecast
   * -> For example: https://api.weather.gov/gridpoints/TOP/31,80/forecast
   * https://api.weather.gov/points/{latitude},{longitude}
   * -> For example: https://api.weather.gov/points/39.7456,-97.0892
   * https://api.weather.gov/alerts/active?area={state}
   * -> For example: https://api.weather.gov/alerts/active?area=KS
   */
  const fetchBaseNwsApiCall = async () => {
    try {
      let tempLocationObjects = [];
      if (locationObjects.length > 0) {
        for (let i = 0; i < locationObjects.length; i++) {
          let locationObj = locationObjects[i];
          let latLng = locationObj.coords;
          const response = await fetch(
            "https://api.weather.gov/points/" + latLng[0] + "," + latLng[1]
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          const returnData = await fetchGridPointWeatherForecast(data);
          console.log(returnData);
          setForecastData(returnData);
          locationObj.forecastData = returnData;
          tempLocationObjects.push(locationObj);
          //console.log(tempLocationObjects);
          setLocationObjects(tempLocationObjects);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const fetchGridPointWeatherForecast = async (nwsWeatherAPiBaseResults) => {
    try {
      const forecastApiUrl = nwsWeatherAPiBaseResults.properties.forecast;
      const response = await fetch(forecastApiUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.properties.periods;
    } catch (error) {
      throw new Error("Error fetching data: " + error.message);
    }
  };

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
        setLocationObjKey(locationObjKey + 1);
        locationObj.key = key;
        locationObj.coords = coords;
        locationObj.milk = 0;
        locationObj.bread = 0;
        locationObj.forecastData = [];
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
        }
        updateMarkersOutputComponent();
      });
  };

  /**
   * Baseline driver for map marker/location updates.
   *
   * Builds the Marker element to append to the dynamic map using
   * the locationObjects state variable for the coordinates to add.
   *
   * Data passed to markers via the locationObjArray
   * Members of locationObjArray
   *   1. location key
   *   2. lat/lng array
   *   3. milk inventory
   *   4. bread inventory
   *   5. weather forecast data
   */
  const updateMarkersOutputComponent = () => {
    const locationObjArray = locationObjects;
    //console.log(locationObjArray);
    setMarkersOutputComponent(
      <Markers
        locationObjectsData={locationObjArray}
        updateInvHandler={initializeInvUpdatePanel}
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
    //setInvEditMilkNew(event.target.value);
  };

  const handleInvEditBreadNewChange = (event) => {
    //setInvEditBreadNew(event.target.value);
  };

  /**
   * Populates the inventory update panel with the inventory
   * values of the location currently selected.
   *
   * @param {*} locationKey
   */
  const initializeInvUpdatePanel = (locationKey) => {
    console.log("initializeInvUpdatePanel");
    //setInvEditLocationKey(locationKey);
    let invEditCurrentFields = getInvEditCurrentFields();
    let invEditLocationId = invEditCurrentFields[0];
    let invEditMilkCurrent = invEditCurrentFields[1];
    let invEditBreadCurrent = invEditCurrentFields[2];

    invEditLocationId.value = locationKey;

    for (let i = 0; i < locationObjects.length; i++) {
      const locationObject = locationObjects[i];
      if (locationKey == locationObject.key) {
        invEditMilkCurrent.value = locationObject.milk;
        invEditBreadCurrent.value = locationObject.bread;
      }
    }
  };

  const getInvEditCurrentFields = () => {
    let returnArray = [];
    var invEditLocationId = document.getElementById(
      "update-inv-location-id-field"
    );
    var invEditMilkCurrent = document.getElementById(
      "update-inv-at-location-milk-current-field"
    );
    var invEditBreadCurrent = document.getElementById(
      "update-inv-at-location-bread-current-field"
    );
    returnArray.push(invEditLocationId);
    returnArray.push(invEditMilkCurrent);
    returnArray.push(invEditBreadCurrent);
    return returnArray;
  };

  const getInvEditNewFields = () => {
    let returnArray = [];
    var invEditLocationId = document.getElementById(
      "update-inv-location-id-field"
    );
    var invEditMilkNew = document.getElementById("update-inv-milk-new-field");
    var invEditBreadNew = document.getElementById("update-inv-bread-new-field");
    returnArray.push(invEditLocationId);
    returnArray.push(invEditMilkNew);
    returnArray.push(invEditBreadNew);
    return returnArray;
  };

  /**
   * Updates the inventory of the currently selected location
   * to the values set in the "New" fields.
   */
  const executeInventoryUpdate = () => {
    let locationObjectsTemp = locationObjects;
    let invEditNewFields = getInvEditNewFields();
    let invEditLocationId = invEditNewFields[0];
    let invEditMilkNew = invEditNewFields[1];
    let invEditBreadNew = invEditNewFields[2];
    for (let i = 0; i < locationObjectsTemp.length; i++) {
      let locationObject = locationObjectsTemp[i];
      if (locationObject.key === invEditLocationId.value) {
        if (invEditMilkNew.value !== "" && invEditMilkNew.value >= 0) {
          locationObject.milk = invEditMilkNew.value;
        }
        if (invEditBreadNew.value !== "" && invEditBreadNew.value >= 0) {
          locationObject.bread = invEditBreadNew.value;
        }
        locationObjectsTemp[i] = locationObject;
        console.log(locationObject);
        setLocationObjects(locationObjectsTemp);
      }
    }
    //Clear value fields to reset for another change
    invEditMilkNew.value = "";
    invEditBreadNew.value = "";
    let invEditCurrentFields = getInvEditCurrentFields();
    let invEditMilkCurrent = invEditCurrentFields[1];
    let invEditBreadCurrent = invEditCurrentFields[2];
    invEditMilkCurrent.value = "";
    invEditBreadCurrent.value = "";
    updateMarkersOutputComponent();
    //resetInvUpdatePanel();
  };

  const fillInvManagementFields = (event) => {
    const locationKeyToSet = event.target.value;
    //setInvEditLocationKey(locationKeyToSet);
    let invEditCurrentFields = getInvEditCurrentFields();
    let invEditMilkCurrent = invEditCurrentFields[1];
    let invEditBreadCurrent = invEditCurrentFields[2];
    let currentInvMilkValueToSet = "";
    let currentInvBreadValueToSet = "";
    //invEditBreadCurrent.value = invEditBreadNew;
    if (locationKeyToSet !== "--") {
      for (let i = 0; i < locationObjects.length; i++) {
        const locationObject = locationObjects[i];
        if (locationKeyToSet == locationObject.key) {
          currentInvMilkValueToSet = locationObject.milk;
          currentInvBreadValueToSet = locationObject.bread;
        }
      }
    }
    invEditMilkCurrent.value = currentInvMilkValueToSet;
    invEditBreadCurrent.value = currentInvBreadValueToSet;
  };

  const chooseAnalyticsTabOutputComponent = (event) => {
    const param = event.target.value;
    if (param == "summaryTable") {
      setAnalyticsTabOutputComponent(<AnalyticsTabSummaryTable />);
    } else if (param == "invRiskAnalysis") {
      setAnalyticsTabOutputComponent(<AnalyticsTabRiskAnalysis />);
    } else if (param == "profitabilityAnalysis") {
      setAnalyticsTabOutputComponent(<AnalyticsTabProfitabilityAnalysis />);
    } else if (param == "performanceTracking") {
      setAnalyticsTabOutputComponent(<AnalyticsTabPerformanceTracking />);
    }
  };

  return (
    <div className="App">
      <AppHeader />
      <div id="map-inv-mgmt-row" className="body-row">
        <div id="map-column" className="body-column">
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
                  <button id="refresh-button" onClick={refreshWeatherData}>
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
        <div id="inv-update-analytics-column" className="body-column">
          <div id="inv-update-panel">
            <h3 className="inv-update-analytics-panel-title">
              Update Location Inventory
            </h3>
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
                    className="udpate-inv-at-location-field"
                    id="update-inv-location-id-field"
                    type="text"
                    onChange={fillInvManagementFields}
                  >
                    <Locations locationObjectsData={locationObjects} />
                  </select>
                </div>
                <div
                  className="update-location-supply-panel-element"
                  id="update-location-add-supply"
                >
                  <button
                    id="update-location-supply-button"
                    onClick={executeInventoryUpdate}
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
                      className="udpate-inv-at-location-number-field"
                      type="number"
                      readOnly={true}
                      disabled={true}
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
                      className="udpate-inv-at-location-number-field"
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
                      className="udpate-inv-at-location-number-field"
                      type="number"
                      readOnly={true}
                      disabled={true}
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
                      className="udpate-inv-at-location-number-field"
                      id="update-inv-bread-new-field"
                      type="number"
                      onChange={handleInvEditBreadNewChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="location-analytics-panel">
            <h3 className="inv-update-analytics-panel-title">
              Location Analytics
            </h3>
            <div className="analytics-tab">
              <button
                className="tab-btn"
                onClick={chooseAnalyticsTabOutputComponent}
                value="summaryTable"
              >
                Location Summary
              </button>
              <button
                className="tab-btn"
                onClick={chooseAnalyticsTabOutputComponent}
                value="invRiskAnalysis"
              >
                Inv. Risk Analysis
              </button>
              <button
                className="tab-btn"
                onClick={chooseAnalyticsTabOutputComponent}
                value="profitabilityAnalysis"
              >
                Profitability Analysis
              </button>
              <button
                className="tab-btn"
                onClick={chooseAnalyticsTabOutputComponent}
                value="performanceTracking"
              >
                Perf. Tracking
              </button>
            </div>
            <div className="analytics-tab-content">
              {analyticsTabOutputComponent}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

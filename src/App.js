import "./App.css";
import Axios from "axios";
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  backendPort,
  mapQuestKey,
  defaultCenter,
  defaultZoom,
  bounds,
  minZoom,
  maxZoom,
} from "./util/Constants.js";
import { initLocationsFromDB } from "./util/InitFunctions.js";
import {
  getNextLocationIdNumber,
  isUpdatedForecast,
  buildNewLocationObject,
  deleteLocationFromMap_ById,
} from "./util/UtilFunctions.js";
import {
  locationExistsInDB,
  deleteLocationInDB_ById,
  insertLocationIntoDB,
} from "./util/DBUtilFunctions.js";
import AppHeader from "./components/js/AppHeader.js";
import Markers from "./components/js/Markers.js";
import Paths from "./components/js/Paths.js";
import MapControlPanel from "./components/js/MapControlPanel.js";
import AddLocationAtAddressPanel from "./components/js/AddLocationAtAddressPanel.js";
import LocationMgmtPanel from "./components/js/LocationMgmtPanel.js";
import AnalyticsPanel from "./components/js/AnalyticsPanel.js";
import AnalyticsTabSummaryTable from "./components/js/AnalyticsTabSummaryTable.js";
import AnalyticsTabRiskAnalysis from "./components/js/AnalyticsTabRiskAnalysis.js";
import AnalyticsTabProfitabilityAnalysis from "./components/js/AnalyticsTabProfitabilityAnalysis.js";
import AnalyticsTabPerformanceTracking from "./components/js/AnalyticsTabPerformanceTracking.js";

function App() {
  const [usRegionSelection, setUsRegionSelection] = useState("--");
  const [usStateSelection, setUsStateSelection] = useState("--");
  const [markersOutputComponent, setMarkersOutputComponent] = useState("");
  const [pathsOutputComponent, setPathsOutputComponent] = useState("");
  const [analyticsTabOutputComponent, setAnalyticsTabOutputComponent] =
    useState(<AnalyticsTabSummaryTable />);
  const [locationObjects, setLocationObjects] = useState({});
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [addressLine3, setAddressLine3] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressState, setAddressState] = useState("");
  const [addressZip, setAddressZip] = useState("");
  const [locationObjKey, setLocationObjKey] = useState(1);

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  });

  useEffect(() => {
    // This effect runs whenever locationObjects gets updated
    updateMarkersOutputComponent();
    updatePathsOutputComponent();
  }, [locationObjects]);

  /**
   * Runs on page load
   */
  useEffect(() => {
    const fetchLocationsFromDB = async () => {
      try {
        const dbLocations = await initLocationsFromDB();
        setLocationObjects(dbLocations);
        const nextLocationNumber = getNextLocationIdNumber(dbLocations);
        setLocationObjKey(nextLocationNumber);
      } catch (error) {
        console.error(error);
      }
    };
    fetchLocationsFromDB();
  }, []);

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
      let tempLocationObjects = {};
      if (Object.keys(locationObjects).length > 0) {
        for (const key in locationObjects) {
          let locationObj = locationObjects[key];
          if (!isUpdatedForecast(locationObj)) {
            let coords = locationObj["coords"];
            const response = await fetch(
              "https://api.weather.gov/points/" + coords[0] + "," + coords[1]
            );
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            const data = await response.json();
            const returnData = await fetchGridPointWeatherForecast(data);
            console.log(returnData);
            locationObj["forecastData"] = returnData;
          }
          tempLocationObjects[locationObj["id"]] = locationObj;
        }
        setLocationObjects(tempLocationObjects);
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
        let locationObjBuildResult = buildNewLocationObject(
          address,
          data,
          locationObjKey
        );
        const locationObj = locationObjBuildResult[0];
        const locationObjId = locationObjBuildResult[1];
        const nextLocationObjKey = locationObjBuildResult[2];
        setLocationObjKey(nextLocationObjKey);
        var existingLocationObjects = locationObjects;
        if (!locationExistsInDB(locationObj)) {
          existingLocationObjects[locationObjId] = locationObj;
          insertLocationIntoDB(locationObj);
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
    const locationObjMap = locationObjects;
    //console.log(locationObjArray);
    setMarkersOutputComponent(
      <Markers
        locationObjectsData={locationObjMap}
        updateInvHandler={initializeInvUpdatePanel}
        deleteLocationHandler={handleLocationDelete_ById}
      />
    );
  };

  const updatePathsOutputComponent = () => {
    const pathObjMap = locationObjects;
    setPathsOutputComponent(<Paths locationObjectsData={pathObjMap} />);
  };

  /**
   * Handler passed to marker objects that deletes
   * locations from the database and map of location objects
   *
   * @param {} locationId
   */
  const handleLocationDelete_ById = async (locationId) => {
    const responseStatus = await deleteLocationInDB_ById(locationId);
    console.log(responseStatus);
    if (responseStatus === 200) {
      let tempLocationObjects = locationObjects;
      tempLocationObjects = deleteLocationFromMap_ById(
        locationId,
        tempLocationObjects
      );
      console.log(tempLocationObjects);
      setLocationObjects(tempLocationObjects);
      //IDK why the useEffect hook isn't picking up on the
      //change to locationObjects.
      updateMarkersOutputComponent();
    }
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

  /**
   * Populates the inventory update panel with the inventory
   * values of the location currently selected.
   *
   * @param {*} locationKey
   */
  const initializeInvUpdatePanel = (locationKey) => {
    let invEditCurrentFields = getInvEditCurrentFields();
    let invEditLocationId = invEditCurrentFields[0];
    let invEditMilkCurrent = invEditCurrentFields[1];
    let invEditBreadCurrent = invEditCurrentFields[2];

    invEditLocationId.value = locationKey;

    const locationObject = locationObjects[locationKey];
    invEditBreadCurrent.value = locationObject["bread"];
    invEditMilkCurrent.value = locationObject["milk"];
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
    const locationObject = locationObjectsTemp[invEditLocationId.value];
    if (invEditBreadNew.value !== "" && invEditBreadNew.value >= 0) {
      locationObject["bread"] = invEditBreadNew.value;
    }
    if (invEditMilkNew.value !== "" && invEditMilkNew.value >= 0) {
      locationObject["milk"] = invEditMilkNew.value;
    }
    locationObjectsTemp[invEditLocationId.value] = locationObject;
    setLocationObjects(locationObjectsTemp);
    /*
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
    */
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
        if (locationKeyToSet === locationObject.key) {
          currentInvMilkValueToSet = locationObject.milk;
          currentInvBreadValueToSet = locationObject.bread;
        }
      }
    }
    invEditMilkCurrent.value = currentInvMilkValueToSet;
    invEditBreadCurrent.value = currentInvBreadValueToSet;
  };

  const chooseAnalyticsTabOutputComponent = (event) => {
    const param = event;
    if (param === "summaryTable") {
      setAnalyticsTabOutputComponent(<AnalyticsTabSummaryTable />);
    } else if (param === "invRiskAnalysis") {
      setAnalyticsTabOutputComponent(<AnalyticsTabRiskAnalysis />);
    } else if (param === "profitabilityAnalysis") {
      setAnalyticsTabOutputComponent(<AnalyticsTabProfitabilityAnalysis />);
    } else if (param === "performanceTracking") {
      setAnalyticsTabOutputComponent(<AnalyticsTabPerformanceTracking />);
    }
  };

  const getLocationSummary = (event) => {
    Axios.get("http://localhost:" + backendPort + "/api/get/location/").then(
      (response) => {
        console.log(response);
      }
    );
  };

  const updateDbLocationInv = (locationObjects) => {
    /*
    //Need to udpate for inventory functionality
    console.log("Updating locations: ");
    console.log(locationObjects);
    let paramMap = {};
    for (const key in locationObjects) {
      paramMap[key] = JSON.stringify(locationObjects[key]["forecastData"]);
    }
    console.log(paramMap);
    const queryString = qs.stringify(paramMap);
    Axios.post(
      "http://localhost:" + backendPort + "/api/update/location/" + queryString
    ).then((response) => {
      console.log(response);
    });
    */
  };

  return (
    <div className="App">
      <AppHeader />
      <div id="map-inv-mgmt-row" className="body-row">
        <div id="map-column" className="body-column">
          <div id="map-section-wrapper">
            <MapControlPanel
              handleRegionChange={getLocationSummary}
              handleUsStateChange={handleUsStateChange}
              refreshWeatherData={refreshWeatherData}
            />
            <br />
            <MapContainer
              id="leaflet-map-image"
              center={defaultCenter}
              zoom={defaultZoom}
              scrollWheelZoom={true}
              maxBounds={bounds}
              minZoom={minZoom}
              maxZoom={maxZoom}
            >
              <TileLayer
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <div>{markersOutputComponent}</div>
              <div>{pathsOutputComponent}</div>
            </MapContainer>
          </div>
          <AddLocationAtAddressPanel
            handleAddressLine1Change={handleAddressLine1Change}
            handleAddressLine2Change={handleAddressLine2Change}
            handleAddressLine3Change={handleAddressLine3Change}
            handleAddressCityChange={handleAddressCityChange}
            handleAddressStateChange={handleAddressStateChange}
            handleAddressZipChange={handleAddressZipChange}
            addLocation={addLocation}
          />
        </div>
        <div id="inv-update-analytics-column" className="body-column">
          <LocationMgmtPanel
            fillInvManagementFields={fillInvManagementFields}
            locationObjects={locationObjects}
            executeInventoryUpdate={executeInventoryUpdate}
          />
          <AnalyticsPanel
            chooseAnalyticsTabOutputComponent={
              chooseAnalyticsTabOutputComponent
            }
            analyticsTabOutputComponent={analyticsTabOutputComponent}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

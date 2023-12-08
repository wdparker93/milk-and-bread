import React, { useState } from "react";
import UsStates from "./UsStates.js";
import LoadingResultsAnimation from "./LoadingResultsAnimation.js";
import "../css/MapControlPanel.css";
import { fetchTopUSCities } from "../../data_agent/python/DefaultCitiesDataAgent.js";

function MapControlPanel(params) {
  const [loading, setLoading] = useState(false);

  const handleRegionChange = (event) => {
    params.handleRegionChange(event);
  };

  const handleUsStateChange = (event) => {
    params.handleUsStateChange(event);
  };

  const toggleAddLocationVisibility = () => {
    let addressPanel = document.getElementById(
      "add-marker-at-address-panel-wrapper"
    );
    addressPanel.classList.toggle("collapsible-address-panel-expanded");
    let mapColumn = document.getElementById("map-column");
    mapColumn.classList.toggle("map-column-address-pane-visible");
    let invAnalyticsColumn = document.getElementById(
      "inv-update-analytics-column"
    );
    invAnalyticsColumn.classList.toggle(
      "inv-update-analytics-column-address-pane-visible"
    );
  };

  const handleFetchTopUSCities = async () => {
    try {
      setLoading(true); // Set loading to true before fetching
      await fetchTopUSCities();
      console.log(
        "Most populous U.S. cities fetched and inserted into DB successfully."
      );
    } catch (error) {
      console.error("Error fetching top U.S. cities:", error);
    } finally {
      setLoading(false); // Set loading back to false after fetching
    }
  };

  return (
    <>
      <div id="map-control-panel-wrapper">
        <div id="map-control-panel-header-block">
          <h3 id="map-control-panel-header-title">Map Control Panel</h3>
          <button
            id="toggle-add-location-panel-visibility"
            onClick={() => toggleAddLocationVisibility()}
          >
            <strong>Show / Hide Add Location Panel</strong>
          </button>
        </div>
        <hr id="map-control-panel-header-buttons-divider"></hr>
        <div id="map-control-panel-buttons-wrapper">
          <div id="map-selector-fields-wrapper">
            <div
              className="map-control-panel-element-wrapper"
              id="region-selector-wrapper"
            >
              <p
                className="map-control-panel-element-text"
                id="region-selector-label"
              >
                Regional Focus
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
          </div>
          <div id="map-control-panel-backend-buttons-wrapper">
            <div
              className="map-control-panel-element-wrapper"
              id="map-refresh-button-wrapper"
            >
              <button
                id="refresh-button"
                onClick={() => params.refreshWeatherData()}
              >
                <strong>Refresh Weather Data</strong>
              </button>
            </div>
            <div
              className="map-control-panel-element-wrapper"
              id="fetch-default-us-cities-wrapper"
            >
              <button
                id="fetch-default-us-cities-button"
                onClick={handleFetchTopUSCities}
              >
                <strong>Fetch Default U.S. Cities</strong>
              </button>
            </div>
          </div>
        </div>
      </div>
      {loading && (
        <div className="loading-spinner">
          <LoadingResultsAnimation loadingText="Fetching Default U.S. Cities" />
        </div>
      )}
    </>
  );
}

export default MapControlPanel;

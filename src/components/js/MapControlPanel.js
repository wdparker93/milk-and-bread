import UsStates from "./UsStates.js";
import "../css/MapControlPanel.css";

function MapControlPanel(params) {
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

  return (
    <>
      <div id="map-control-panel-wrapper">
        <div id="map-control-panel-header-block">
          <h3>Map Control Panel</h3>
          <button
            id="toggle-add-location-panel-visibility"
            onClick={() => toggleAddLocationVisibility()}
          >
            <strong>Show/Hide Add Location Panel</strong>
          </button>
        </div>
        <div id="map-control-panel-buttons-wrapper">
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
              onClick={() => params.refreshWeatherData()}
            >
              <strong>Refresh Weather Data</strong>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default MapControlPanel;

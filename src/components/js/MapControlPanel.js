import UsStates from "./UsStates.js";

function MapControlPanel(params) {
  const handleRegionChange = (event) => {
    params.handleRegionChange(event);
  };

  const handleUsStateChange = (event) => {
    params.handleUsStateChange(event);
  };

  return (
    <>
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
              onClick={() => params.refreshWeatherData()}
            >
              Refresh Weather Data
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default MapControlPanel;

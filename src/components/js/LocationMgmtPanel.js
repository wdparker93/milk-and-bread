import Locations from "./Locations.js";

function LocationMgmtPanel(params) {
  const handleLocationIdChange = (event) => {
    params.fillInvManagementFields(event);
  };
  return (
    <>
      <div id="inv-update-panel">
        <h3 className="inv-update-analytics-panel-title">
          Location Management
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
                onChange={handleLocationIdChange}
              >
                <Locations locationObjectsData={params.locationObjects} />
              </select>
            </div>
            <div
              className="update-location-supply-panel-element"
              id="update-location-add-supply"
            >
              <button
                id="update-location-supply-button"
                onClick={() => params.executeInventoryUpdate()}
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
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LocationMgmtPanel;

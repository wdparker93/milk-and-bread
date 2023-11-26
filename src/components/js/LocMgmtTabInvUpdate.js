import "../css/LocMgmtTabInvUpdate.css";
import Locations from "./Locations.js";

function LocMgmtTabInvUpdate(params) {
  const handleLocationIdChange = (event) => {
    params.fillInvManagementFields(event);
  };
  return (
    <>
      <div className="update-inv-at-location-controls-wrapper">
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
          <div
            className="update-location-inv-field-wrapper"
            id="update-location-inv-milk-count-field-wrapper"
          >
            <p
              className="update-location-inv-field-label"
              id="update-location-inv-milk-count-field-label"
            >
              Inventory
            </p>
            <div
              className="update-location-inv-field-row"
              id="update-location-inv-milk-count-field-row"
            >
              <input
                className="update-location-inv-field"
                type="number"
                id="update-location-inv-milk-current-count-field"
                readOnly={true}
                disabled={true}
              />
              <p className="update-location-inv-right-arrow">
                <strong>&rarr;</strong>
              </p>
              <input
                className="update-location-inv-field"
                type="number"
                id="update-location-inv-milk-new-count-field"
              />
            </div>

            <p
              className="update-location-inv-field-label"
              id="update-location-inv-milk-cost-field-label"
            >
              Cost ($)
            </p>
            <div
              className="update-location-inv-field-row"
              id="update-location-inv-milk-cost-field-row"
            >
              <input
                className="update-location-inv-field"
                type="number"
                id="update-location-inv-milk-cost-current-field"
                readOnly={true}
                disabled={true}
              />
              <p className="update-location-inv-right-arrow">
                <strong>&rarr;</strong>
              </p>
              <input
                className="update-location-inv-field"
                type="number"
                id="update-location-inv-milk-cost-new-field"
              />
            </div>
          </div>
        </div>
        <div
          id="update-inv-at-location-control-panel-column-3"
          className="update-inv-at-location-control-panel-column"
        >
          <strong>Bread</strong>
          <div
            className="update-location-inv-field-wrapper"
            id="update-location-inv-bread-count-field-wrapper"
          >
            <p
              className="update-location-inv-field-label"
              id="update-location-inv-bread-count-field-label"
            >
              Inventory
            </p>
            <div
              className="update-location-inv-field-row"
              id="update-location-inv-bread-count-field-row"
            >
              <input
                className="update-location-inv-field"
                type="number"
                id="update-location-inv-bread-current-count-field"
                readOnly={true}
                disabled={true}
              />
              <p className="update-location-inv-right-arrow">
                <strong>&rarr;</strong>
              </p>
              <input
                className="update-location-inv-field"
                type="number"
                id="update-location-inv-bread-count-new-field"
              />
            </div>

            <p
              className="update-location-inv-field-label"
              id="update-location-inv-bread-cost-field-label"
            >
              Cost ($)
            </p>
            <div
              className="update-location-inv-field-row"
              id="update-location-inv-bread-cost-field-row"
            >
              <input
                className="update-location-inv-field"
                type="number"
                id="update-location-inv-bread-cost-current-field"
                readOnly={true}
                disabled={true}
              />
              <p className="update-location-inv-right-arrow">
                <strong>&rarr;</strong>
              </p>
              <input
                className="update-location-inv-field"
                type="number"
                id="update-location-inv-bread-cost-new-field"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LocMgmtTabInvUpdate;

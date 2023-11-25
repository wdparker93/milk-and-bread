import "../css/LocMgmtTabPathUpdate.css";
import Locations from "./Locations.js";

function LocMgmtTabPathUpdate(params) {
  let startLocation = "--";
  let endLocation = "--";
  const handleStartLocationChange = (event) => {
    startLocation = event.target.value;
    params.lookupPathFromLocations(startLocation, endLocation);
  };
  const handleEndLocationChange = (event) => {
    endLocation = event.target.value;
    params.lookupPathFromLocations(startLocation, endLocation);
  };
  return (
    <>
      <div className="update-path-controls-wrapper">
        <div
          id="update-path-control-panel-column-1"
          className="update-path-control-panel-column"
        >
          <strong>Path Endpoints</strong>
          <p
            className="update-path-weight-field-label"
            id="update-path-starting-location-field-label"
          >
            Starting Location
          </p>
          <select
            className="location-select-field"
            id="update-path-start-location-field"
            type="text"
            onChange={handleStartLocationChange}
          >
            <Locations locationObjectsData={params.locationObjects} />
          </select>
          <p
            className="update-path-weight-field-label"
            id="update-path-ending-location-field-label"
          >
            Ending Location
          </p>
          <select
            className="location-select-field"
            id="update-path-end-location-field"
            type="text"
            onChange={handleEndLocationChange}
          >
            <Locations locationObjectsData={params.locationObjects} />
          </select>
        </div>
        <div
          id="update-path-control-panel-column-2"
          className="update-path-control-panel-column"
        >
          <strong>Path Weight</strong>
          <div
            className="update-path-weight-field-wrapper"
            id="update-path-cost-field-wrapper"
          >
            <p
              className="update-path-weight-field-label"
              id="update-path-cost-field-label"
            >
              Cost ($)
            </p>
            <div
              className="update-path-field-row"
              id="update-path-cost-field-row"
            >
              <input
                className="update-path-weight-field"
                type="number"
                id="update-path-current-cost-field"
                readOnly={true}
                disabled={true}
              />
              <p className="update-path-right-arrow">
                <strong>&rarr;</strong>
              </p>
              <input
                className="update-path-weight-field"
                type="number"
                id="update-path-new-cost-field"
              />
            </div>

            <p
              className="update-path-weight-field-label"
              id="update-path-cost-field-label"
            >
              Time (hrs)
            </p>
            <div
              className="update-path-field-row"
              id="update-path-time-field-row"
            >
              <input
                className="update-path-weight-field"
                type="number"
                id="update-path-current-time-field"
                readOnly={true}
                disabled={true}
              />
              <p className="update-path-right-arrow">
                <strong>&rarr;</strong>
              </p>
              <input
                className="update-path-weight-field"
                type="number"
                id="update-path-new-time-field"
              />
            </div>
          </div>
        </div>
        <div
          id="update-path-control-panel-column-3"
          className="update-path-control-panel-column"
        >
          <div className="create-path-row">
            <img
              src="./media/create-connecting-path-image-cropped.png"
              className="create-path-image"
            ></img>
            <button
              className="path-mgmt-button"
              id="create-path-button"
              onClick={() => params.createUpdatePath()}
            >
              <strong>Create/Update</strong>
            </button>
          </div>
          <div className="delete-path-row">
            <img
              src="./media/delete-existing-path-image.png"
              className="delete-path-image"
            ></img>
            <button
              className="path-mgmt-button"
              id="delete-path-button"
              onClick={() => params.deletePath()}
            >
              <strong>Delete Path</strong>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default LocMgmtTabPathUpdate;

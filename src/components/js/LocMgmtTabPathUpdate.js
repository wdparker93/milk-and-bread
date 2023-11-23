import "../css/LocMgmtTabPathUpdate.css";
import Locations from "./Locations.js";

function LocMgmtTabPathUpdate(params) {
  const handleLocationIdChange = (event) => {
    //params.fillInvManagementFields(event);
  };
  return (
    <>
      <div className="update-path-controls-wrapper">
        <div
          id="update-path-control-panel-column-1"
          className="update-path-control-panel-column"
        >
          <strong>Starting Location</strong>
          <select
            className="location-select-field"
            id="update-path-start-location-field"
            type="text"
            onChange={handleLocationIdChange}
          >
            <Locations locationObjectsData={params.locationObjects} />
          </select>
        </div>
        <div
          id="update-path-control-panel-column-2"
          className="update-path-control-panel-column"
        >
          <strong>Ending Location</strong>
          <select
            className="location-select-field"
            id="update-path-end-location-field"
            type="text"
            onChange={handleLocationIdChange}
          >
            <Locations locationObjectsData={params.locationObjects} />
          </select>
        </div>
        <div
          id="update-path-control-panel-column-3"
          className="update-path-control-panel-column"
        >
          <div className="create-connecting-path-row">
            <img
              src="./media/create-connecting-path-image-cropped.png"
              className="create-connecting-path-image"
            ></img>
            <button
              className="path-mgmt-button"
              id="create-connecting-path-button"
              onClick={() => params.executeInventoryUpdate()}
            >
              <strong>Create Connecting Path</strong>
            </button>
          </div>
          <div className="delete-existing-path-row">
            <img
              src="./media/delete-existing-path-image.png"
              className="delete-existing-path-image"
            ></img>
            <button
              className="path-mgmt-button"
              id="delete-existing-path-button"
              onClick={() => params.executeInventoryUpdate()}
            >
              <strong>Delete Existing Path</strong>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default LocMgmtTabPathUpdate;

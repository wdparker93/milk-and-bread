import UsStates from "./UsStates.js";

function AddLocationAtAddressPanel(params) {
  const handleAddressLine1Change = (event) => {
    params.handleAddressLine1Change(event);
  };

  const handleAddressLine2Change = (event) => {
    params.handleAddressLine2Change(event);
  };

  const handleAddressLine3Change = (event) => {
    params.handleAddressLine3Change(event);
  };

  const handleAddressCityChange = (event) => {
    params.handleAddressCityChange(event);
  };

  const handleAddressStateChange = (event) => {
    params.handleAddressStateChange(event);
  };

  const handleAddressZipChange = (event) => {
    params.handleAddressZipChange(event);
  };

  return (
    <>
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
          <button
            id="add-marker-at-address-button"
            onClick={() => params.addLocation()}
          >
            <strong>Add Location</strong>
          </button>
        </div>
      </div>
    </>
  );
}

export default AddLocationAtAddressPanel;

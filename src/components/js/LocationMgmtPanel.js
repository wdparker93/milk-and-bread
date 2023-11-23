import "../css/LocationMgmtPanel.css";

function LocationMgmtPanel(params) {
  return (
    <>
      <div className="loc-mgmt-panel">
        <h3 className="inv-update-analytics-panel-title">
          Location Management
        </h3>
        <div className="loc-mgmt-tab-buttons">
          <button
            className="tab-btn"
            onClick={() => params.chooseLocMgmtTabOutputComponent("invUpdate")}
            value="invUpdate"
          >
            Update Inventory
          </button>

          <button
            className="tab-btn"
            onClick={() => params.chooseLocMgmtTabOutputComponent("pathUpdate")}
            value="pathUdate"
          >
            Update Paths
          </button>
        </div>
        <div className="locmgmt-tab-content">
          {params.locMgmtTabOutputComponent}
        </div>
      </div>
    </>
  );
}

export default LocationMgmtPanel;

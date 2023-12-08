import "../css/AnalyticsPanel.css";

function AnalyticsPanel(params) {
  return (
    <>
      <div id="location-analytics-panel">
        <h3 className="inv-update-analytics-panel-title">Location Analytics</h3>
        <div className="analytics-tab-buttons">
          <button
            className="tab-btn"
            onClick={() =>
              params.chooseAnalyticsTabOutputComponent("summaryTable")
            }
            value="summaryTable"
          >
            Location Summary
          </button>
          <button
            className="tab-btn"
            onClick={() =>
              params.chooseAnalyticsTabOutputComponent("invRiskAnalysis")
            }
            value="invRiskAnalysis"
          >
            Inv. Risk Analysis
          </button>
          <button
            className="tab-btn"
            onClick={() =>
              params.chooseAnalyticsTabOutputComponent("profitabilityAnalysis")
            }
            value="profitabilityAnalysis"
          >
            Profitability Analysis
          </button>
          <button
            className="tab-btn"
            onClick={() =>
              params.chooseAnalyticsTabOutputComponent("performanceTracking")
            }
            value="performanceTracking"
          >
            Perf. Tracking
          </button>
          <button
            className="tab-btn"
            onClick={() =>
              params.chooseAnalyticsTabOutputComponent(
                "historicalSalesAnalytics"
              )
            }
            value="historicalSalesAnalytics"
          >
            Historical Sales Analysis
          </button>
        </div>
        <div className="analytics-tab-content">
          {params.analyticsTabOutputComponent}
        </div>
      </div>
    </>
  );
}

export default AnalyticsPanel;

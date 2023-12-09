function AppHeader() {
  return (
    <>
      <div className="header" id="main-header">
        <div id="main-header-text">
          <h1 id="main-title">
            Milk and Bread : Exploring Proactive, Climate-Driven Supply Chain
            Optimization
          </h1>
        </div>
        <div id="secondary-headers">
          <h2 id="secondary-title">
            Leverage real-time weather forecasts to optimize supply networks of
            milk and bread.
          </h2>
          <h2 id="data-source-explanation">
            Data Sources :{" "}
            <a
              className="data-link"
              href="https://www.weather.gov/documentation/services-web-api"
              target="_blank"
            >
              National Weather Service
            </a>
            &nbsp;, &nbsp;
            <a
              className="data-link"
              href="https://open-meteo.com/"
              target="_blank"
            >
              Open-Meteo
            </a>
            &nbsp;, &nbsp;
            <a
              className="data-link"
              href="https://www.ers.usda.gov/data-products/weekly-retail-food-sales/"
              target="_blank"
            >
              USDA ERS
            </a>
            &nbsp;, &nbsp;
            <a
              className="data-link"
              href="https://leafletjs.com/"
              target="_blank"
            >
              Leaflet
            </a>
            &nbsp; and &nbsp;
            <a
              className="data-link"
              href="https://developer.mapquest.com/documentation/"
              target="_blank"
            >
              MapQuest
            </a>
          </h2>
        </div>
      </div>
    </>
  );
}

export default AppHeader;

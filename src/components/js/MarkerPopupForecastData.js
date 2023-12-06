import "../css/MarkerPopupForecastData.css";
import { includesSnowOrSleet } from "../../util/UtilFunctions.js";

let rowNameArr = [
  {
    forecastPeriod: "Forecast Period",
    //precipChance: "Chance of Precipitation", //For some reason precip chance is often null even when rain is expected. Omitting this.
    temperature: "Temperature",
    shortForecast: "Forecast",
  },
];

function MarkerPopupForecastData(params) {
  const ForecastRowLabels = (props) => {
    const { rowLabels } = props;
    const { forecastPeriod, precipChance, temperature, shortForecast } =
      rowLabels;
    return (
      <>
        <div className="forecast-column" id="forecast-row-labels">
          <div className="forecast-period-row" id="forecast-period-row-label">
            <strong>{forecastPeriod}</strong>
          </div>
          <div className="forecast-temperature-row" id="temperature-row-label">
            <strong>{temperature}</strong>
          </div>
          <div className="forecast-row" id="short-forecast-row-label">
            <strong>{shortForecast}</strong>
          </div>
        </div>
      </>
    );
  };

  const ForecastTableColumnElement = (props) => {
    const { columnData } = props;
    const {
      number,
      name,
      startTime,
      endTime,
      shortForecast,
      detailedForecast,
      temperature,
      temperatureUnit,
    } = columnData;
    let columnId = "forecast-column-" + { number };
    let periodRowId = "forecast-period-row-col-" + { number };
    let temperatureRowId = "temperature-row-col-" + { number };
    let forecastRowId = "forecast-row-col" + { number };
    let optionalBackgroundChange = "";
    if (
      includesSnowOrSleet(shortForecast) ||
      includesSnowOrSleet(detailedForecast)
    ) {
      optionalBackgroundChange = "red";
    }
    console.log(optionalBackgroundChange);
    return (
      <>
        <div
          className="forecast-column"
          id={columnId}
          style={{ background: optionalBackgroundChange }}
        >
          <div className="forecast-period-row" id={periodRowId}>
            {name}
          </div>
          <div className="forecast-temperature-row" id={temperatureRowId}>
            {temperature}°{temperatureUnit}
          </div>
          <div className="forecast-row" id={forecastRowId}>
            {shortForecast}
          </div>
        </div>
      </>
    );
  };

  const EmptyWeatherForecastMessage = () => {
    return (
      <>
        <div id="empty-weather-forecast-message">
          <strong>Refresh Weather Data for Extended Forecast</strong>
        </div>
      </>
    );
  };

  const generateWeatherColumn = () => {
    if (params.forecastData !== undefined) {
      return params.forecastData.map((el) => (
        <ForecastTableColumnElement columnData={el} />
      ));
    } else {
      return <EmptyWeatherForecastMessage />;
    }
  };

  const generateRowNames = () => {
    if (params.forecastData !== undefined) {
      return rowNameArr.map((el) => <ForecastRowLabels rowLabels={el} />);
    }
  };

  console.log(params.forecastData);
  return (
    <>
      <div
        className="marker-popup-7d-forecast-data-hidden"
        id="marker-popup-7d-forecast-data"
      >
        {generateRowNames()}
        {generateWeatherColumn()}
      </div>
    </>
  );
}

export default MarkerPopupForecastData;

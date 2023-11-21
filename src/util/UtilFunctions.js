export const buildLocationsFromResultSet = (locationResultSet) => {
  return new Promise((resolve) => {
    let locationMap = {};
    for (let i = 0; i < locationResultSet.length; i++) {
      const rsRow = locationResultSet[i];
      const locationId = rsRow["location_id"];
      const lat = rsRow["lat"];
      const lng = rsRow["lng"];
      const bread = rsRow["bread_inv"];
      const milk = rsRow["milk_inv"];
      const userEnteredAddress = rsRow["user_entered_address"];
      const forecastData = rsRow["forecast_data"];
      let locationObj = {};
      locationObj["id"] = locationId;
      locationObj["coords"] = [lat, lng];
      locationObj["bread"] = bread;
      locationObj["milk"] = milk;
      locationObj["userEnteredAddress"] = userEnteredAddress;
      locationObj["forecastData"] = forecastData;
      locationMap[locationId] = locationObj;
    }
    //console.log(locationMap);
    resolve(locationMap);
  });
};

export const getNextLocationIdNumber = (dbLocations) => {
  var nextNumber = 1;
  for (const key in dbLocations) {
    const currentNumber = parseInt(key.substring(key.indexOf("-") + 1));
    if (currentNumber > nextNumber) {
      nextNumber = currentNumber;
    }
  }
  nextNumber += 1;
  return nextNumber;
};

export const isUpdatedForecast = (location) => {
  let isUpdatedForecast = false;
  if ("forecastData" in location) {
    const forecastData = location["forecastData"];
    if (forecastData != undefined) {
      const forecastFirstPeriodEndTime = forecastData[0]["endTime"];
      const forecastFirstPeriodEndDateTime = new Date(
        forecastFirstPeriodEndTime
      );
      const currentDateTime = new Date(Date.now());
      //console.log(forecastFirstPeriodEndDateTime);
      //console.log(currentDateTime);
      if (currentDateTime < forecastFirstPeriodEndDateTime) {
        isUpdatedForecast = true;
      }
    }
  }
  console.log(isUpdatedForecast);
  return isUpdatedForecast;
};

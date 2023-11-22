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
  //console.log(location);
  let isUpdatedForecast = false;
  if ("forecastData" in location) {
    const forecastData = location["forecastData"];
    if (forecastData != undefined && forecastData.length > 0) {
      const forecastFirstPeriodEndTime = forecastData[0]["endTime"];
      const forecastFirstPeriodEndDateTime = new Date(
        forecastFirstPeriodEndTime
      );
      const currentDateTime = new Date(Date.now());
      if (currentDateTime < forecastFirstPeriodEndDateTime) {
        isUpdatedForecast = true;
      }
    }
  }
  //console.log(isUpdatedForecast);
  return isUpdatedForecast;
};

export const buildNewLocationObject = (address, data, locationObjKey) => {
  const lat = data.results[0].locations[0].latLng["lat"];
  const lng = data.results[0].locations[0].latLng["lng"];
  const coords = [lat, lng];
  let locationObj = {};
  let id = "location-" + locationObjKey;
  const nextLocationKey = locationObjKey + 1;
  //setLocationObjKey(locationObjKey + 1);
  locationObj["id"] = id;
  locationObj["userEnteredAddress"] = address;
  locationObj["coords"] = coords;
  locationObj["bread"] = 0;
  locationObj["milk"] = 0;
  locationObj["forecastData"] = [];
  let returnArray = [];
  returnArray.push(locationObj);
  returnArray.push(id);
  returnArray.push(nextLocationKey);
  return returnArray;
};

export const deleteLocationFromMap_ById = (locationId, locationObjects) => {
  console.log("Delete location from map by id");
  for (const key in locationObjects) {
    if (locationId === key) {
      delete locationObjects[key];
    }
  }
  return locationObjects;
};

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
      locationObj["paths"] = {};
      locationMap[locationId] = locationObj;
    }
    //console.log(locationMap);
    resolve(locationMap);
  });
};

export const buildPathsFromResultSet = (locationObjects, pathResultSet) => {
  //console.log(locationObjects);
  //console.log(pathResultSet);
  return new Promise((resolve) => {
    let locationMap = locationObjects;
    for (let i = 0; i < pathResultSet.length; i++) {
      const rsRow = pathResultSet[i];
      const startLocation = rsRow["start_location"];
      const endLocation = rsRow["end_location"];
      const cost = rsRow["cost"];
      const time = rsRow["time"];
      let locationToUpdate = locationObjects[startLocation];
      locationToUpdate["paths"][endLocation] = { cost: cost, time: time };
      //console.log(locationToUpdate);
    }
    resolve(locationMap);
  });
};

export const getNextLocationIdNumber = (dbLocations) => {
  var nextNumber = 1;
  var numberAlreadyExists = false;
  for (const key in dbLocations) {
    const currentNumber = parseInt(key.substring(key.indexOf("-") + 1));
    if (currentNumber === nextNumber) {
      numberAlreadyExists = true;
    }
    if (numberAlreadyExists && currentNumber > nextNumber) {
      nextNumber = currentNumber;
    }
  }
  if (numberAlreadyExists) {
    nextNumber += 1;
  }
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
  locationObj["paths"] = {};
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

export const getInvEditCurrentFields = () => {
  let returnArray = [];
  var invEditLocationId = document.getElementById(
    "update-inv-location-id-field"
  );
  var invEditMilkCurrent = document.getElementById(
    "update-inv-at-location-milk-current-field"
  );
  var invEditBreadCurrent = document.getElementById(
    "update-inv-at-location-bread-current-field"
  );
  returnArray.push(invEditLocationId);
  returnArray.push(invEditMilkCurrent);
  returnArray.push(invEditBreadCurrent);
  return returnArray;
};

export const getInvEditNewFields = () => {
  let returnArray = [];
  var invEditLocationId = document.getElementById(
    "update-inv-location-id-field"
  );
  var invEditMilkNew = document.getElementById("update-inv-milk-new-field");
  var invEditBreadNew = document.getElementById("update-inv-bread-new-field");
  returnArray.push(invEditLocationId);
  returnArray.push(invEditMilkNew);
  returnArray.push(invEditBreadNew);
  return returnArray;
};

export const getPathUpdateFields = () => {
  let returnMap = {};
  var pathStartLocation = document.getElementById(
    "update-path-start-location-field"
  );
  var pathEndLocation = document.getElementById(
    "update-path-end-location-field"
  );
  var pathCostCurrent = document.getElementById(
    "update-path-current-cost-field"
  );
  var pathCostNew = document.getElementById("update-path-new-cost-field");
  var pathTimeCurrent = document.getElementById(
    "update-path-current-time-field"
  );
  var pathTimeNew = document.getElementById("update-path-new-time-field");
  returnMap["startLocation"] = pathStartLocation;
  returnMap["endLocation"] = pathEndLocation;
  returnMap["costCurrent"] = pathCostCurrent;
  returnMap["costNew"] = pathCostNew;
  returnMap["timeCurrent"] = pathTimeCurrent;
  returnMap["timeNew"] = pathTimeNew;
  return returnMap;
};

export const buildPathsArrayFromLocationObjects = (locationObjects) => {
  //console.log({ locationObjects });
  let grandParentArray = [];
  let parentArray = [];
  for (const key in locationObjects) {
    let insertToParentArray = true;
    let childArray = [];
    for (const key2 in locationObjects[key]["paths"]) {
      childArray.push(locationObjects[key]["coords"]);
      childArray.push(locationObjects[key2]["coords"]);
    }
    if (childArray.length > 0 && insertToParentArray) {
      parentArray.push(childArray);
    }
  }
  grandParentArray.push(parentArray);
  return grandParentArray;
};

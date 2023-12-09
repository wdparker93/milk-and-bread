export const buildLocationsFromResultSet = (locationResultSet) => {
  return new Promise((resolve) => {
    let locationMap = {};
    for (let i = 0; i < locationResultSet.length; i++) {
      const rsRow = locationResultSet[i];
      const locationId = rsRow["location_id"];
      const lat = rsRow["lat"];
      const lng = rsRow["lng"];
      const bread = rsRow["bread_inv"];
      const breadCost = rsRow["bread_cost"];
      const milk = rsRow["milk_inv"];
      const milkCost = rsRow["milk_cost"];
      const userEnteredAddress = rsRow["user_entered_address"];
      const forecastData = rsRow["forecast_data"];
      let locationObj = {};
      locationObj["id"] = locationId;
      locationObj["coords"] = [lat, lng];
      locationObj["bread"] = bread;
      locationObj["breadCost"] = breadCost;
      locationObj["milk"] = milk;
      locationObj["milkCost"] = milkCost;
      locationObj["userEnteredAddress"] = userEnteredAddress;
      locationObj["forecastData"] = forecastData;
      locationObj["paths"] = {};
      locationMap[locationId] = locationObj;
    }
    resolve(locationMap);
  });
};

export const buildPathsFromResultSet = (locationObjects, pathResultSet) => {
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
  locationObj["breadCost"] = 0.0;
  locationObj["milk"] = 0;
  locationObj["milkCost"] = 0.0;
  locationObj["forecastData"] = [];
  locationObj["paths"] = {};
  let returnArray = [];
  returnArray.push(locationObj);
  returnArray.push(id);
  returnArray.push(nextLocationKey);
  return returnArray;
};

export const deleteLocationFromMap_ById = (locationId, locationObjects) => {
  console.log("Delete location from map state variable by id");
  for (const key in locationObjects) {
    if (locationId === key) {
      delete locationObjects[key];
    }
  }
  return locationObjects;
};

export const getInvEditCurrentFields = () => {
  let returnMap = {};
  var invEditLocationId = document.getElementById(
    "update-inv-location-id-field"
  );
  var invEditMilkCurrentCount = document.getElementById(
    "update-location-inv-milk-current-count-field"
  );
  var invEditMilkCurrentCost = document.getElementById(
    "update-location-inv-milk-cost-current-field"
  );
  var invEditBreadCurrentCount = document.getElementById(
    "update-location-inv-bread-current-count-field"
  );
  var invEditBreadCurrentCost = document.getElementById(
    "update-location-inv-bread-cost-current-field"
  );
  returnMap["invEditLocationId"] = invEditLocationId;
  returnMap["invEditMilkCurrentCount"] = invEditMilkCurrentCount;
  returnMap["invEditMilkCurrentCost"] = invEditMilkCurrentCost;
  returnMap["invEditBreadCurrentCount"] = invEditBreadCurrentCount;
  returnMap["invEditBreadCurrentCost"] = invEditBreadCurrentCost;
  return returnMap;
};

export const getInvEditNewFields = () => {
  let returnMap = {};
  var invEditLocationId = document.getElementById(
    "update-inv-location-id-field"
  );
  var invEditMilkNewCount = document.getElementById(
    "update-location-inv-milk-new-count-field"
  );
  var invEditMilkNewCost = document.getElementById(
    "update-location-inv-milk-cost-new-field"
  );
  var invEditBreadNewCount = document.getElementById(
    "update-location-inv-bread-count-new-field"
  );
  var invEditBreadNewCost = document.getElementById(
    "update-location-inv-bread-cost-new-field"
  );
  returnMap["invEditLocationId"] = invEditLocationId;
  returnMap["invEditMilkNewCount"] = invEditMilkNewCount;
  returnMap["invEditMilkNewCost"] = invEditMilkNewCost;
  returnMap["invEditBreadNewCount"] = invEditBreadNewCount;
  returnMap["invEditBreadNewCost"] = invEditBreadNewCost;
  return returnMap;
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

export const setPathUpdateFields = (pathData) => {
  var pathCostCurrent = document.getElementById(
    "update-path-current-cost-field"
  );
  var pathTimeCurrent = document.getElementById(
    "update-path-current-time-field"
  );
  pathCostCurrent.value = pathData["cost"];
  pathTimeCurrent.value = pathData["time"];
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

export const resetInvUpdatePanel = () => {
  let invEditNewFields = getInvEditNewFields();
  let invEditLocationId = invEditNewFields["invEditLocationId"];
  let invEditMilkNewCount = invEditNewFields["invEditMilkNewCount"];
  let invEditMilkNewCost = invEditNewFields["invEditMilkNewCost"];
  let invEditBreadNewCount = invEditNewFields["invEditBreadNewCount"];
  let invEditBreadNewCost = invEditNewFields["invEditBreadNewCost"];
  invEditLocationId.value = "--";
  invEditMilkNewCount.value = "";
  invEditMilkNewCost.value = "";
  invEditBreadNewCount.value = "";
  invEditBreadNewCost.value = "";
  let invEditCurrentFields = getInvEditCurrentFields();
  let invEditMilkCurrentCount = invEditCurrentFields["invEditMilkCurrentCount"];
  let invEditMilkCurrentCost = invEditCurrentFields["invEditMilkCurrentCost"];
  let invEditBreadCurrentCount =
    invEditCurrentFields["invEditBreadCurrentCount"];
  let invEditBreadCurrentCost = invEditCurrentFields["invEditBreadCurrentCost"];
  invEditMilkCurrentCount.value = "";
  invEditMilkCurrentCost.value = "";
  invEditBreadCurrentCount.value = "";
  invEditBreadCurrentCost.value = "";
};

export const finalizePathCreateUpdate = (
  endLocation,
  cost,
  time,
  locationObjectToUpdate
) => {
  let pathObjectToAdd = {};
  pathObjectToAdd["cost"] = cost;
  pathObjectToAdd["time"] = time;
  locationObjectToUpdate["paths"][endLocation] = pathObjectToAdd;
  resetPathUpdatePanel();
  return locationObjectToUpdate;
};

export const finalizePathDelete = (endLocation, locationObjectToUpdate) => {
  delete locationObjectToUpdate["paths"][endLocation];
  resetPathUpdatePanel();
  return locationObjectToUpdate;
};

export const resetPathUpdatePanel = () => {
  let pathUpdatePanelFields = getPathUpdateFields();
  let startLocation = pathUpdatePanelFields["startLocation"];
  let endLocation = pathUpdatePanelFields["endLocation"];
  let currentCost = pathUpdatePanelFields["costCurrent"];
  let newCost = pathUpdatePanelFields["costNew"];
  let currentTime = pathUpdatePanelFields["timeCurrent"];
  let newTime = pathUpdatePanelFields["timeNew"];
  startLocation.value = "--";
  endLocation.value = "--";
  currentCost.value = "";
  newCost.value = "";
  currentTime.value = "";
  newTime.value = "";
};

export const includesSnowOrSleet = (forecastString) => {
  let returnValue = false;
  if (
    forecastString.toLowerCase().includes("snow") ||
    forecastString.toLowerCase().includes("sleet")
  ) {
    returnValue = true;
  }
  return returnValue;
};

export const celsiusToFahrenheit = (celsius) => {
  return celsius * 1.8 + 32;
};

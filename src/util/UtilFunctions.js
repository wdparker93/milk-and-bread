export const testFunction = () => {
  console.log("Testing Util functionality");
};

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

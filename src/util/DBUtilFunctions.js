import { backendPort } from "../util/Constants.js";
import Axios from "axios";

export const locationExistsInDB = (locationObj) => {
  Axios.get(
    "http://localhost:" +
      backendPort +
      "/api/get/location/" +
      locationObj["id"] +
      "/" +
      locationObj["userEnteredAddress"] +
      "/" +
      locationObj["coords"][0] +
      "/" +
      locationObj["coords"][1]
  ).then((response) => {
    //console.log(response);
    if (response.data.length === 0) {
      console.log("Location not found in database.");
      return false;
    } else {
      console.log("Location found in database.");
      return true;
    }
  });
};

export const locationExistsInDB_ById = async (locationId) => {
  try {
    const response = await Axios.get(
      "http://localhost:" + backendPort + "/api/get/location/" + locationId
    );
    if (response.data.length === 0) {
      console.log("Location not found in database.");
      return false;
    } else {
      console.log("Location found in database.");
      return true;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteLocationInDB_ById = async (locationId) => {
  try {
    const locationExists = await locationExistsInDB_ById(locationId);
    if (locationExists) {
      console.log("Deleting location with locationId : " + locationId);
      const response = await Axios.post(
        "http://localhost:" + backendPort + "/api/delete/location/" + locationId
      );
      return response.status;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const insertLocationIntoDB = (locationObj) => {
  console.log(
    "Inserting location : " +
      locationObj["id"] +
      " : " +
      locationObj["userEnteredAddress"]
  );
  Axios.post(
    "http://localhost:" +
      backendPort +
      "/api/insert/location/" +
      locationObj["id"] +
      "/" +
      locationObj["coords"][0] +
      "/" +
      locationObj["coords"][1] +
      "/" +
      locationObj["bread"] +
      "/" +
      locationObj["milk"] +
      "/" +
      locationObj["userEnteredAddress"]
  ).then((response) => {
    console.log(response);
  });
};

export const lookupPath_ByLocations = async (startLocation, endLocation) => {
  try {
    console.log(
      "Looking up path with start_location = " +
        startLocation +
        " and end_location = " +
        endLocation
    );
    const response = await Axios.get(
      "http://localhost:" +
        backendPort +
        "/api/get/path/" +
        startLocation +
        "/" +
        endLocation
    );
    if (response.data.length === 0) {
      console.log("Path not found in database");
    } else {
      console.log("Path found in database");
    }
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getLocationSummary = (event) => {
  Axios.get("http://localhost:" + backendPort + "/api/get/location/").then(
    (response) => {
      console.log(response);
    }
  );
};

export const updateDbLocationInv = (locationObjects) => {
  /*
    //Need to udpate for inventory functionality
    console.log("Updating locations: ");
    console.log(locationObjects);
    let paramMap = {};
    for (const key in locationObjects) {
      paramMap[key] = JSON.stringify(locationObjects[key]["forecastData"]);
    }
    console.log(paramMap);
    const queryString = qs.stringify(paramMap);
    Axios.post(
      "http://localhost:" + backendPort + "/api/update/location/" + queryString
    ).then((response) => {
      console.log(response);
    });
    */
};

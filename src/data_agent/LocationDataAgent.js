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
      locationObj["breadCost"] +
      "/" +
      locationObj["milk"] +
      "/" +
      locationObj["milkCost"] +
      "/" +
      locationObj["userEnteredAddress"]
  ).then((response) => {
    console.log(response);
  });
};

export const getLocationSummary = (event) => {
  Axios.get("http://localhost:" + backendPort + "/api/get/location/").then(
    (response) => {
      console.log(response);
    }
  );
};

/**
 * Takes location_id and new counts/costs for milk and bread
 * and updates the database with them
 *
 * @param {} params
 */
export const updateDbLocationInv = async (params) => {
  console.log("Updating inventory for location : " + params["location_id"]);
  try {
    const response = Axios.post(
      "http://localhost:" +
        backendPort +
        "/api/update/location/inv/" +
        params["location_id"] +
        "/" +
        params["bread_inv"] +
        "/" +
        params["bread_cost"] +
        "/" +
        params["milk_inv"] +
        "/" +
        params["milk_cost"]
    );
    console.log(response);
    return new Promise((resolve) => {
      resolve(response);
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

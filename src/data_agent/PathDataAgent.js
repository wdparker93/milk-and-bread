import { backendPort } from "../util/Constants.js";
import Axios from "axios";

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

/**
 * Updates an existing path with new cost and time weight values
 *
 * @param {} params
 */
export const updateDbPath = async (params) => {
  console.log(
    "Updating path with start_location = " +
      params["start_location"] +
      " and end_location = " +
      params["end_location"]
  );
  console.log(params);
  try {
    const response = Axios.post(
      "http://localhost:" +
        backendPort +
        "/api/update/path/" +
        params["start_location"] +
        "/" +
        params["end_location"] +
        "/" +
        params["cost"] +
        "/" +
        params["time"]
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

/**
 * Creates a new path with specified endpoints and weights
 *
 * @param {} params
 */
export const createDbPath = async (params) => {
  console.log(
    "Inserting path with start_location = " +
      params["start_location"] +
      " and end_location = " +
      params["end_location"]
  );
  try {
    const response = Axios.post(
      "http://localhost:" +
        backendPort +
        "/api/insert/path/" +
        params["start_location"] +
        "/" +
        params["end_location"] +
        "/" +
        params["cost"] +
        "/" +
        params["time"]
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

/**
 * Deletes an existing path with specified endpoints
 *
 * @param {} params
 */
export const deleteDbPath = async (params) => {
  console.log(
    "Deleting path with start_location = " +
      params["start_location"] +
      " and end_location = " +
      params["end_location"]
  );
  try {
    const response = Axios.post(
      "http://localhost:" +
        backendPort +
        "/api/delete/path/" +
        params["start_location"] +
        "/" +
        params["end_location"]
    );
    return new Promise((resolve) => {
      resolve(response);
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

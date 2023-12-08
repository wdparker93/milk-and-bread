import { backendJSPort } from "../util/Constants.js";
import {
  buildLocationsFromResultSet,
  buildPathsFromResultSet,
} from "./UtilFunctions.js";
import Axios from "axios";

export const initLocationsFromDB = async () => {
  try {
    const locationResponse = await Axios.get(
      "http://localhost:" + backendJSPort + "/api/get/location/"
    );
    let returnLocationMap = await buildLocationsFromResultSet(
      locationResponse.data
    );
    const pathResponse = await Axios.get(
      "http://localhost:" + backendJSPort + "/api/get/path/"
    );
    returnLocationMap = await buildPathsFromResultSet(
      returnLocationMap,
      pathResponse.data
    );
    return returnLocationMap;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const initPathsFromDB = async (locationObjects) => {
  console.log(locationObjects);
  try {
    const response = await Axios.get(
      "http://localhost:" + backendJSPort + "/api/get/path/"
    );
    const returnPathMap = await buildPathsFromResultSet(
      locationObjects,
      response.data
    );
    return returnPathMap;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

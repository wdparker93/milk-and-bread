import { backendPort } from "../util/Constants.js";
import { buildLocationsFromResultSet } from "./UtilFunctions.js";
import Axios from "axios";

export const initLocationsFromDB = async () => {
  try {
    const response = await Axios.get(
      "http://localhost:" + backendPort + "/api/get/location/"
    );
    const returnLocationMap = await buildLocationsFromResultSet(response.data);
    return returnLocationMap;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

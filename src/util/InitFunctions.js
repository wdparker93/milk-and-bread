import { backendPort } from "../util/Constants.js";
import { buildLocationsFromResultSet } from "./UtilFunctions.js";
import Axios from "axios";

export const initLocationsFromDB = async () => {
  try {
    const response = await Axios.get(
      "http://localhost:" + backendPort + "/api/get/location/"
    );
    //console.log(response);
    const returnLocationMap = await buildLocationsFromResultSet(response.data);
    //console.log(returnLocationMap);
    return returnLocationMap;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

import { backendJSPort } from "../util/Constants.js";
import Axios from "axios";

export const getLocationSummaryRecords = async () => {
  try {
    console.log("Fetching location summary records.");
    const response = await Axios.get(
      "http://localhost:" + backendJSPort + "/api/get/location"
    );
    if (response.data.length === 0) {
      console.log("Location summary lookup failed");
    } else {
      console.log("Location summary lookup successful");
    }
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

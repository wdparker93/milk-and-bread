import { backendJSPort } from "../util/Constants.js";
import Axios from "axios";

export const getHistoricalSalesData = async (
  state,
  startDate,
  endDate,
  category
) => {
  try {
    console.log(
      "Fetching grocery sales data for {state} {date_range} {category}"
    );
    const response = await Axios.get(
      "http://localhost:" +
        backendJSPort +
        "/api/get/grocery_sales_data" +
        "/" +
        state +
        "/" +
        startDate +
        "/" +
        endDate +
        "/" +
        category
    );
    if (response.data.length === 0) {
      console.log("Grocery data retrieval failed");
      console.log(response);
    } else {
      console.log("Grocery data retrieval successful");
    }
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

import { backendPythonPort } from "../../util/Constants.js";

/**
 * Executes script on python backend server to fetch the
 * most populous U.S. cities to be used as locations.
 */
export const fetchTopUSCities = async () => {
  console.log("Fetching top 200 most populous U.S. cities for locations");
  try {
    const response = await fetch(
      "http://localhost:" + backendPythonPort + "/fetch_default_cities",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    console.log("Fetch top 200 U.S. cities results : " + result.output);
    console.log("Error(s) encountered : " + result.error);
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
};

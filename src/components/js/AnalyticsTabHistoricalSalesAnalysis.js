import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { getHistoricalSalesData } from "../../data_agent/HistoricalSalesAnalysisDataAgent.js";
import "../css/AnalyticsTabHistoricalSalesAnalysis.css";
import UsStates from "./UsStates.js";
import GroceryCategories from "./GroceryCategories.js";
import { Chart } from "chart.js/auto";

function AnalyticsTabHistoricalSalesAnalysis() {
  const [historicalSalesData, setHistoricalSalesData] = useState(null);
  const [usStateSelection, setUsStateSelection] = useState("--");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [categorySelection, setCategorySelection] = useState("--");

  const handleUsStateChange = (event) => {
    setUsStateSelection(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategorySelection(event.target.value);
  };

  const fetchHistoricalSalesData = async () => {
    try {
      if (
        usStateSelection !== "--" &&
        categorySelection !== "--" &&
        startDate !== "" &&
        endDate !== "" &&
        startDate < endDate
      ) {
        const response = await getHistoricalSalesData(
          usStateSelection,
          startDate,
          endDate,
          categorySelection
        );
        setHistoricalSalesData(response.data);
      }
    } catch (error) {
      console.error("Error fetching historical sales data:", error.message);
    }
  };

  useEffect(() => {
    fetchHistoricalSalesData();
  }, []);

  useEffect(() => {
    if (historicalSalesData) {
      createLineChart();
    }
  }, [historicalSalesData]);

  const createLineChart = () => {
    const ctx = document
      .getElementById("historicalSalesChart")
      .getContext("2d");

    // Check if a chart instance already exists
    const existingChart = Chart.getChart("historicalSalesChart");

    // If a chart instance exists, destroy it
    if (existingChart) {
      existingChart.destroy();
    }

    new Chart(ctx, {
      type: "line",
      data: {
        labels: historicalSalesData.map((entry) => entry.date),
        datasets: [
          {
            label: "Dollars Sold",
            data: historicalSalesData.map((entry) => entry.dollars_sold),
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
            fill: false,
            yAxisID: "dollarsAxis",
          },
          {
            label: "Units Sold",
            data: historicalSalesData.map((entry) => entry.units_sold),
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 2,
            fill: false,
            yAxisID: "unitsAxis",
          },
        ],
      },
      options: {
        scales: {
          x: {
            position: "bottom",
          },
          y: [
            {
              type: "linear",
              position: "left",
              id: "dollarsAxis",
            },
            {
              type: "linear",
              position: "right",
              id: "unitsAxis",
            },
          ],
        },
      },
    });
  };

  return (
    <>
      <div id="historical-sales-data-content-wrapper">
        <canvas id="historicalSalesChart"></canvas>
        <div id="historical-sales-data-parameter-buttons-wrapper">
          <div className="historical-sales-data-button-wrapper">
            <div
              className="historical-sales-data-button-label"
              id="state-label"
            >
              <p className="historical-sales-data-button-label-text">State</p>
            </div>
            <select
              id="historical-sales-data-state-selector"
              onChange={handleUsStateChange}
            >
              <UsStates />
            </select>
          </div>
          <div className="historical-sales-data-button-wrapper">
            <div
              className="historical-sales-data-button-label"
              id="start-date-label"
            >
              <p className="historical-sales-data-button-label-text">
                Start Date
              </p>
            </div>
            <input
              type="date"
              id="historical-sales-data-start-date-selector"
              onChange={handleStartDateChange}
            />
          </div>
          <div className="historical-sales-data-button-wrapper">
            <div
              className="historical-sales-data-button-label"
              id="end-date-label"
            >
              <p className="historical-sales-data-button-label-text">
                End Date
              </p>
            </div>
            <input
              type="date"
              id="historical-sales-data-end-date-selector"
              onChange={handleEndDateChange}
            />
          </div>
          <div className="historical-sales-data-button-wrapper">
            <div
              className="historical-sales-data-button-label"
              id="category-label"
            >
              <p className="historical-sales-data-button-label-text">
                Grocery Category
              </p>
            </div>
            <select
              id="historical-sales-data-category-selector"
              onChange={handleCategoryChange}
            >
              <GroceryCategories />
            </select>
          </div>
          <div className="historical-sales-data-button-wrapper">
            <button
              id="fetch-historical-grocery-sales-data"
              onClick={fetchHistoricalSalesData}
            >
              <strong>Fetch Grocery Sales Data</strong>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AnalyticsTabHistoricalSalesAnalysis;

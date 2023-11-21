const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = 5000;
const mysql = require("mysql");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "milk_and_bread_schema",
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/get/location", (req, res) => {
  const sqlSelect = `SELECT * FROM location`;
  console.log(sqlSelect);
  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.error("Error inserting into the database:", err);
      res.status(500).send("Internal Server Error");
    } else {
      console.log("Record inserted successfully");
      res.send(result);
    }
  });
});

/**
 * Get location by location_id
 */
app.get("/api/get/location/:location_id", (req, res) => {
  const locationId = req.params.location_id;
  const sqlSelect = `SELECT location_id FROM location
  WHERE location_id = ?`;
  db.query(sqlSelect, [locationId], (err, result) => {
    res.send(result);
  });
});

/**
 * Get location by multiple parameters
 */
app.get(
  "/api/get/location/:location_id/:user_entered_address/:lat/:lng",
  (req, res) => {
    const locationId = req.params.location_id;
    const user_entered_address = req.params.user_entered_address;
    const lat = req.params.lat;
    const lng = req.params.lng;
    const sqlSelect = `SELECT location_id FROM location
  WHERE location_id = ?
  OR user_entered_address = ?
  OR (lat = ? AND lng = ?)`;
    db.query(
      sqlSelect,
      [locationId, user_entered_address, lat, lng],
      (err, result) => {
        res.send(result);
      }
    );
  }
);

app.post(
  "/api/insert/location/:location_id/:lat/:lng/:bread_inv/:milk_inv/:user_entered_address",
  (req, res) => {
    const locationId = req.params.location_id;
    const lat = req.params.lat;
    const lng = req.params.lng;
    const breadInv = req.params.bread_inv;
    const milkInv = req.params.milk_inv;
    const userEnteredAddress = req.params.user_entered_address;
    const sqlInsert = `INSERT INTO location (location_id, lat, lng, bread_inv, milk_inv, user_entered_address) VALUES (?, ?, ?, ?, ?, ?)`;
    console.log(sqlInsert);
    db.query(
      sqlInsert,
      [locationId, lat, lng, breadInv, milkInv, userEnteredAddress],
      (err, result) => {
        if (err) {
          console.error("Error inserting into the database:", err);
          res.status(500).send("Internal Server Error");
        } else {
          console.log("Record inserted successfully");
          res.send(result);
        }
      }
    );
  }
);

app.post("/api/update/location/:locationObjects", (req, res) => {
  /*
  //Need to update for inventory functionality
  console.log("Update API Endpoint");
  const locationObjects = req.params.locationObjects;
  console.log(locationObjects);
  let paramsArray = [];
  let sqlUpdate = "UPDATE location ";
  sqlUpdate += "SET forecast_data = CASE ";
  for (const key in locationObjects) {
    console.log(key);
    console.log(locationObjects[key]["forecast_data"]);
    sqlUpdate += "WHEN location_id = ? THEN forecast_data = ? ";
    paramsArray.push(key);
    paramsArray.push(locationObjects[key]["forecastData"]);
  }
  sqlUpdate += "END WHERE location_id IN (";
  for (let i = 0; i < Object.keys(locationObjects).length - 1; i++) {
    sqlUpdate += "?, ";
  }
  sqlUpdate += "?);";
  for (const key in locationObjects) {
    paramsArray.push(key);
  }
  console.log(sqlUpdate);
  db.query(sqlUpdate, paramsArray, (err, result) => {
    if (err) {
      console.error("Error updating locations in the database:", err);
      res.status(500).send("Internal Server Error");
    } else {
      console.log("Record(s) updated successfully");
      res.send(result);
    }
  });
  */
});

app.listen(PORT, () => {
  console.log("Backend server is running on port " + PORT);
});

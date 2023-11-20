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
  //const usState = req.params.usState;
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

app.get("/api/get/location/:location_id", (req, res) => {
  const locationId = req.params.location_id;
  const sqlSelect = `SELECT location_id FROM location L
  WHERE L.location_id = ?`;
  db.query(sqlSelect, [locationId], (err, result) => {
    res.send(result);
  });
});

app.post(
  "/api/insert/location/:location_id/:lat/:lng/:bread_inv/:milk_inv/:user_entered_address/:forecast_data",
  (req, res) => {
    console.log("Insert API Endpoint");
    const locationId = req.params.location_id;
    const lat = req.params.lat;
    const lng = req.params.lng;
    const breadInv = req.params.bread_inv;
    const milkInv = req.params.milk_inv;
    const userEnteredAddress = req.params.user_entered_address;
    const forecastData = req.params.forecast_data;
    const sqlInsert = `INSERT INTO location (location_id, lat, lng, bread_inv, milk_inv, user_entered_address, forecast_data) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    console.log(sqlInsert);
    db.query(
      sqlInsert,
      [
        locationId,
        lat,
        lng,
        breadInv,
        milkInv,
        userEnteredAddress,
        forecastData,
      ],
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

app.listen(PORT, () => {
  console.log("Backend server is running on port " + PORT);
});

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
      console.error("Error selecting locations from the database:", err);
      res.status(500).send("Internal Server Error");
    } else {
      console.log("Record(s) selected successfully");
      res.send(result);
    }
  });
});

app.get("/api/get/path", (req, res) => {
  const sqlSelect = `SELECT * FROM path`;
  console.log(sqlSelect);
  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.error("Error selecting paths from the database:", err);
      res.status(500).send("Internal Server Error");
    } else {
      console.log("Record(s) selected successfully");
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

/**
 * Get path by start and end locations
 */
app.get("/api/get/path/:start_location/:end_location", (req, res) => {
  const startLocation = req.params.start_location;
  const endLocation = req.params.end_location;
  const sqlSelect = `SELECT * FROM path
  WHERE start_location = ?
  AND end_location = ?`;
  db.query(sqlSelect, [startLocation, endLocation], (err, result) => {
    res.send(result);
  });
});

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

app.post("/api/delete/location/:location_id", (req, res) => {
  const locationId = req.params.location_id;
  const sqlDelete = `DELETE FROM location WHERE location_id = ?`;
  console.log(sqlDelete);
  db.query(sqlDelete, [locationId], (err, result) => {
    if (err) {
      console.error("Error deleting " + locationId + " from database.", err);
      res.status(500).send("Internal Server Error");
    } else {
      console.log("Location with id " + locationId + " deleted successfully");
      res.send(result);
    }
  });
});

app.post(
  "/api/update/location/inv/:location_id/:bread_inv/:bread_cost/:milk_inv/:milk_cost",
  (req, res) => {
    const location_id = req.params.location_id;
    const bread_inv = req.params.bread_inv;
    const bread_cost = req.params.bread_cost;
    const milk_inv = req.params.milk_inv;
    const milk_cost = req.params.milk_cost;
    let sqlUpdate = "UPDATE location ";
    sqlUpdate +=
      "SET bread_inv = ?, bread_cost = ?, milk_inv = ?, milk_cost = ? ";
    sqlUpdate += "WHERE location_id = ?";
    console.log(sqlUpdate);
    db.query(
      sqlUpdate,
      [bread_inv, bread_cost, milk_inv, milk_cost, location_id],
      (err, result) => {
        if (err) {
          console.error("Error updating location in the database:", err);
          res.status(500).send("Internal Server Error");
        } else {
          console.log("Record(s) updated successfully");
          res.send(result);
        }
      }
    );
  }
);

app.post(
  "/api/update/path/:start_location/:end_location/:cost/:time",
  (req, res) => {
    const start_location = req.params.start_location;
    const end_location = req.params.end_location;
    const cost = req.params.cost;
    const time = req.params.time;
    let sqlUpdate = "UPDATE path ";
    sqlUpdate += "SET cost = ?, time = ? ";
    sqlUpdate += "WHERE start_location = ? AND end_location = ?";
    console.log(sqlUpdate);
    db.query(
      sqlUpdate,
      [cost, time, start_location, end_location],
      (err, result) => {
        if (err) {
          console.error("Error updating path in the database:", err);
          res.status(500).send("Internal Server Error");
        } else {
          console.log("Path record updated successfully");
          res.send(result);
        }
      }
    );
  }
);

app.post(
  "/api/insert/path/:start_location/:end_location/:cost/:time",
  (req, res) => {
    const startLocation = req.params.start_location;
    const endLocation = req.params.end_location;
    const cost = req.params.cost;
    const time = req.params.time;
    const sqlInsert = `INSERT INTO path (start_location, end_location, cost, time) VALUES (?, ?, ?, ?)`;
    console.log(sqlInsert);
    db.query(
      sqlInsert,
      [startLocation, endLocation, cost, time],
      (err, result) => {
        if (err) {
          console.error("Error inserting path record into the database:", err);
          res.status(500).send("Internal Server Error");
        } else {
          console.log("Path record inserted successfully");
          res.send(result);
        }
      }
    );
  }
);

app.post("/api/delete/path/:start_location/:end_location", (req, res) => {
  const startLocation = req.params.start_location;
  const endLocation = req.params.end_location;
  const sqlDelete = `DELETE FROM path WHERE start_location = ? AND end_location = ?`;
  console.log(sqlDelete);
  db.query(sqlDelete, [startLocation, endLocation], (err, result) => {
    if (err) {
      console.error("Error deleting path record into the database:", err);
      res.status(500).send("Internal Server Error");
    } else {
      console.log("Path record deleted successfully");
      res.send(result);
    }
  });
});

app.listen(PORT, () => {
  console.log("Backend server is running on port " + PORT);
});

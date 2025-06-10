import express from "express";
import { SerialPort, ReadlineParser } from "serialport";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/db/connectDB.js";
import { Server } from "socket.io";
import { SensorData } from "./src/models/sensor.model.js";

const app = express();
dotenv.config();
app.use(
  cors({
    origin: "http://localhost:5173",
    credential: true,
  })
);
connectDB();

app.use(express.json({ limit: "200kb" }));
app.use(express.urlencoded({ extended: true, limit: "200kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(bodyParser.json());

const server = app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});

// const io = new Server(server, {
//   pingTimeout:60000,
//   cors: {
//     origin: "*", // Allow frontend origin
//   },
// });

// io.on("connection", (socket) => {
//   console.log("Client connected:", socket.id);
// });

app.get("/api/v1/ir", (req, res) => {
  res.json({ irValue: sensorData });
});

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.post("/api/v1/post", (req, res) => {
  res.json("Hola is ready");
});

import DashboardRoutes from "./src/routes/dashboard.routes.js";
app.use("/api/v1/dashboard", DashboardRoutes);

import AutomationRoutes from "./src/routes/automation.routes.js";
app.use("/api/v1/automation", AutomationRoutes);
//Device Routes
import DeviceRoutes from "./src/routes/device.routes.js";
app.use("/api/v1/devices", DeviceRoutes);

//UserRoutes
import UserRoutes from "./src/routes/user.routes.js";
import mongoose from "mongoose";
app.use("/api/v1/users", UserRoutes);

// Set up Serial connection to HC-05 Bluetooth module
const bluetoothPort = new SerialPort({
  path: "/dev/rfcomm0", // Linux usually maps Bluetooth to /dev/rfcomm0
  baudRate: 9600,
});

const parser = bluetoothPort.pipe(new ReadlineParser({ delimiter: "\n" }));

bluetoothPort.on("open", () => {
  console.log("Bluetooth connection established.");
});

bluetoothPort.on("error", (err) => {
  console.error("Bluetooth error:", err.message);
});

// API endpoint to control LED via Bluetooth
app.post("/api/v1/led", (req, res) => {
  const { TempState } = req.body;

  let commandToSend = null;
  let responseMessage = null;

  // Determine which command to send
  if (TempState === "on") {
    commandToSend = "t";
    responseMessage = "Temp  command sent";
  } else if (TempState === "off") {
    commandToSend = "T";
    responseMessage = "Temperature off command sent";
  } else {
    return res.status(400).json({ message: "Invalid state combination" });
  }

  // Send command over Bluetooth
  bluetoothPort.write(commandToSend, (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to send command" });
    }

    // If command is 't' or 'T', wait for one data response
    if (["t", "T"].includes(commandToSend)) {
      parser.on("data", (data) => {
        try {
          const parsedData = JSON.parse(data);
          const unit="°C and %";
          console.log("hola");
          console.log(parsedData);
          
          sensorDataBuffer.push({
            deviceId: parsedData.deviceId,
            device:"684745644879e4020d394424", // Link to actual device (if applicable)
            value:[parsedData.temperature,parsedData.humidity], // Data value (can be an object depending on your sensor)
            unit:unit, // e.g., "°C", "%"
           // timestamp: new Date(parsedData.timestamp) || new Date(), // Timestamp
          });
          console.log("Temp:", parsedData.temperature);
          console.log("Humidity:", parsedData.humidity);
          //  io.emit("sensor-data", parsedData);
        } catch (err) {
          console.error("Invalid JSON:", data);
          console.log(err);
          
        }
      });
    } else {
      // For other commands, respond immediately
      return res.status(200).json({ message: "Command sent successfully" });
    }
    return res.status(200).json({ message: "Command sent successfully" });
  });
});

let sensorDataBuffer=[];

const saveBufferedData = async () => {
  if (sensorDataBuffer.length > 0) {
    try {
      // Bulk insert the buffered data into MongoDB
      await SensorData.insertMany(sensorDataBuffer);

      console.log(`Stored ${sensorDataBuffer.length} data entries into the database.`);

      // Clear the buffer after saving
      sensorDataBuffer = [];
    } catch (error) {
      console.error('Error saving data to database:', error);
    }
  }
};

// Set interval to save data every 15 minutes (900,000 ms)
setInterval(saveBufferedData,  30*1000); // 15 minutes in milliseconds1 * 60 *

// API route to get the latest sensor data
app.get('/sensor/data', async (req, res) => {
  try {
    const data = await SensorData.find()
      .sort({ timestamp: -1 })
      .limit(1); // Get the most recent entry
    if (!data.length) {
      return res.status(404).json({ message: 'No sensor data found' });
    }
    return res.status(200).json(data[0]);
  } catch (error) {
    console.error('Error fetching sensor data:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


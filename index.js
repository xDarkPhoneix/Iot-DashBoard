import express from "express"
import { SerialPort, ReadlineParser } from "serialport"
import bodyParser from "body-parser";


const app=express()

const PORT=8000;
app.use(bodyParser.json());



// Set up Serial connection to HC-05 Bluetooth module
const bluetoothPort = new SerialPort({
  path: '/dev/rfcomm0', // Linux usually maps Bluetooth to /dev/rfcomm0
  baudRate: 9600,
});

bluetoothPort.on('open', () => {
  console.log("Bluetooth connection established.");
});

bluetoothPort.on('error', (err) => {
  console.error("Bluetooth error:", err.message);
});

// API endpoint to control LED via Bluetooth
app.post("/api/v1/led", (req, res) => {

  let commandToSend = null;
let responseMessage = null;

// Determine which command to send
if (TempState === "on" && PressureState === "on") {
  commandToSend = "X";
  responseMessage = "Temp + Pressure command sent";
}else if (TempState === "on" && PressureState === "off") {
  commandToSend = "t";
  responseMessage = "Temp command sent";
} else if (PressureState === "on" && TempState === "off") {
  commandToSend = "p";
  responseMessage = "Pressure command sent";
} else if (TempState === "off" && PressureState === "off") {
  commandToSend = "x";
  responseMessage = "All sensors turned OFF";
} 
 else {
  return res.status(400).json({ message: "Invalid state combination" });
}

// Send command over Bluetooth
bluetoothPort.write(commandToSend, (err) => {
  if (err) {
    return res.status(500).json({ error: "Failed to send command" });
  }

  // Only wait for data if it's an ON command
  if (["t", "p", "X"].includes(commandToSend)) {
    parser.on("data", (data) => {
      console.log("Sensor Data:", data);
      // You can send this in the response if needed:
      // return res.json({ message: responseMessage, data });
    });
  }

})

})



app.get('/api/v1/ir', (req, res) => {
  res.json({ irValue: sensorData });
});

app.get("/",(req,res)=>{
    res.send("Server is ready")
})

app.post("/api/v1/post",(req,res)=>{
    res.json("Hola is ready")
})



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

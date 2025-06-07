// import express from "express"
// import { SerialPort, ReadlineParser } from "serialport"
// import bodyParser from "body-parser";


// const app=express()

// const PORT=8000;
// app.use(bodyParser.json());







// // Set up Serial connection to HC-05 Bluetooth module
// const bluetoothPort = new SerialPort({
//   path: '/dev/rfcomm0', // Linux usually maps Bluetooth to /dev/rfcomm0
//   baudRate: 9600,
// });

// bluetoothPort.on('open', () => {
//   console.log("Bluetooth connection established.");
// });

// bluetoothPort.on('error', (err) => {
//   console.error("Bluetooth error:", err.message);
// });

// // API endpoint to control LED via Bluetooth
// app.post("/api/v1/led", (req, res) => {
//   const { state } = req.body;

//   if (state === "on") {
//     bluetoothPort.write("1", (err) => {
//       if (err) return res.status(500).json({ error: "Failed to send ON" });
//       res.json({ message: "LED ON command sent" });
//     });
//   } else if (state === "off") {
//     bluetoothPort.write("0", (err) => {
//       if (err) return res.status(500).json({ error: "Failed to send OFF" });
//       res.json({ message: "LED OFF command sent" });
//     });
//   } else {
//     res.status(400).json({ error: "Invalid state. Use 'on' or 'off'" });
//   }
// });


// const port = new SerialPort({
//   path: '/dev/ttyUSB0', // Use your correct port (COMx on Windows, ttyUSBx on Linux)
//   baudRate: 9600,
// });

// const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

// let sensorData = "0";

// parser.on('data', (data) => {
//   console.log("Sensor:", data.trim());
//   sensorData = data.trim();
// });

// app.get('/api/v1/ir', (req, res) => {
//   res.json({ irValue: sensorData });
// });

// app.get("/",(req,res)=>{
//     res.send("Server is ready")
// })

// app.post("/api/v1/post",(req,res)=>{
//     res.json("Hola is ready")
// })



// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

# IoT DashBoard

A modern, responsive web dashboard designed to monitor and manage IoT devices in real-time. This project provides an intuitive interface to visualize data, control devices, and dashboard offers a seamless experience for monitoring and managing your connected devices.



---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## About

IoT DashBoard is a lightweight and scalable frontend application built to interface with IoT devices and services. It provides a clean UI for displaying sensor data, device status, and analytics, enabling users to effectively monitor their IoT ecosystem.

---

## Features

- **Real-time Data Visualization:** View live data from your IoT devices with dynamically updating charts (Temperature & Humidity Sensor)
- **Customizable Widgets:** Easily add, remove, and configure various chart widgets (Line, Bar) to create a personalized layout.
- **Drag-and-Drop Interface:** Arrange your dashboard exactly how you want it with a smooth drag-and-drop grid system.
- **Responsive Design:** A clean and fully responsive interface that works seamlessly on desktop, tablet, and mobile devices.
- **Light & Dark Modes:** Switch between light and dark themes for optimal viewing comfort.
- **Device Management:** A simulated context manages device status (online/offline) and data streams.
- **ScreenShots Of Dashboard:** [Click Here](https://github.com/xDarkPhoneix/Iot-DashBoard/tree/main/screensorts)

---

## Technologies

- **Frontend:** ReactJs
- **Backend:** NodeJs, ExpressJs, MongoDB
- **Charting:** Chart.js & react-chartjs-2  
- **Styling:** Tailwind CSS  
- **State Management:** React Context API  
- **Icons:** Lucide React  
- **Drag & Drop:** React-Grid-Layout    

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)  
- npm (comes with Node.js)  

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/xDarkPhoneix/Iot-DashBoard.git
```

Change Directory for backend

```
cd Iot-DashBoard
npm install
```

---

### Usage

Start the backend server:

```
npm start
```
Change Directory for frontend

```
cd IotFrontend
npm install
```

Start the frontend server:

```
npm run dev
```

---

### Configuration

Create and configure your .env file at the root directory to manage environment variables such as API endpoints, authentication tokens, or any other sensitive data.

```
PORT = "Your port number"
MONGODB_URI = "Your MongoDB URL to connect Database"
CORS_ORIGIN ="Your local host, for example - http://localhost:5173"
ACCESS_TOKEN_SECRET= "Your token secret key"
ACCESS_TOKEN_EXPIRY= "Expiry Period, for example - 1d"
REFRESH_TOKEN_SECRET= "Your refresh token secret key"
REFRESH_TOKEN_EXPIRY= "Expiry period for token expiry, for example - 10d"
```

---

### Contributing

## Contributions are welcome! Please follow these steps:

##### Fork the repository

##### Create your feature branch
```
git checkout -b feature/my-feature
```

##### Commit your changes 
```
git commit -m 'Add some feature'
```

##### Push to the branch 
```
git push origin feature/my-feature`
```

##### Open a pull request

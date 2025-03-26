import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "https://attendance-backend-app.up.railway.app",
  baseURL: "http://localhost:5500",
  // Change mo yung IP ADDRESS MO DITO hanggang 192.168.1.104 | port nung server

  // timeout: 5000, // Optional timeout
  // withCredentials: true, // If using cookies
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;

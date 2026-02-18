import axios from "axios";

const API = axios.create({
  baseURL: "https://ttconnect-backend.onrender.com",
  withCredentials: true
});

export default API;


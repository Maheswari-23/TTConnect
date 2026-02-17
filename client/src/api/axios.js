import axios from "axios";

const API = axios.create({
  baseURL: "https://ttconnect-api.onrender.com/api",
});

export default API;

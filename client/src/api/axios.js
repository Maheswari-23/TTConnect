import axios from "axios";

const API = axios.create({
  baseURL: "https://ttconnect.onrender.com/",
});

export default API;

import { io } from "socket.io-client";

const socket = io("https://ttconnect-backend.onrender.com");

export default socket;

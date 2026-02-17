import { io } from "socket.io-client";

const socket = io("https://ttconnect.onrender.com/");

export default socket;

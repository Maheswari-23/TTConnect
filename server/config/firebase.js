import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";

const token = await getToken(messaging, {
  vapidKey: "BJT_2JW9krQaDnub7JVbDWsy4sqtwkqjT7BdgFD2OcqnUTIwEZ4CrswRTZzJ4B4DJQ-JGFReJ41taTFGgYGPOEU"
});

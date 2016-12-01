import { Platform } from "react-native";
import Home from "./Home";
import HomeIOS from "./HomeIOS";

let comp  = (Platform.OS == "android" ? Home : HomeIOS)
export default comp

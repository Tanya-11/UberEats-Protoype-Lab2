import axios from "axios";

export default axios.create({
  baseURL: "http://18.191.91.254:3001/api",
  headers: {
    "Content-type": "application/json",
    // 'Authorization': 'Bearer ' + userLoginStatus?.token
  }
});
import axios from "axios";

export default axios.create({
  baseURL: "http://18.224.59.255:3001/api",
  headers: {
    "Content-type": "application/json",
    // 'Authorization': 'Bearer ' + userLoginStatus?.token
  }
});
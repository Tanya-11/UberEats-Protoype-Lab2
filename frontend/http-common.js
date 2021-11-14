import axios from "axios";

export default axios.create({
  baseURL: "http://3.129.16.0:3001/api",
  headers: {
    "Content-type": "application/json",
    // 'Authorization': 'Bearer ' + userLoginStatus?.token
  }
});
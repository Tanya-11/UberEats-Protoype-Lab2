import axios from "axios";

export default axios.create({
  baseURL: "http://3.141.193.70:3001/api",
  headers: {
    "Content-type": "application/json",
    // 'Authorization': 'Bearer ' + userLoginStatus?.token
  }
});
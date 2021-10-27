const { Users } = require("../models/users");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const {
  getToken,
  COOKIE_OPTIONS,
  getRefreshToken,
  verifyUser,
} = require("../../backend/auth");

async function handle_request(msg, callback) {
console.log(msg);

}


exports.handle_request = handle_request;

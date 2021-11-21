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
  if (!msg.username) {
    const Error = {
      name: "UserName Error",
      message: "The username name is required",
    };
    callback(null, { statusCode: 400, err: Error });
  } else {
    const user = await Users.find({ username: msg.username });

    if (user && user.length > 0) {
      callback("bad value", { statusCode: 400});
    } else {
      console.log("succccccc");

      const token = getToken({ _id: user._id });
      const refreshToken = getRefreshToken({ _id: user._id });
      const newUser = new Users({
        username: msg.username,
        password: msg.password,
        role: msg.role,
        refreshToken: refreshToken.push({ refreshToken }),
      });
      newUser.save((err, resp) => {
        if (err) {
          console.log(err);
          callback({ statusCode: 503, err: err }, null);
        } else {
          console.log(resp);
          callback(null, {
            success: true,
            token: token,
            user: resp._id,
            refreshToken: refreshToken,
          });
        }
      });
    }
  }
}

exports.handle_request = handle_request;

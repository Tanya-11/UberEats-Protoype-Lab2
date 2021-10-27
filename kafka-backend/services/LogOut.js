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
    console.log('in logout');
  Users.findById(msg._id).then(
    (user) => {
      const tokenIndex = user.refreshToken.findIndex(
        (item) => item.refreshToken === refreshToken
      );

      if (tokenIndex !== -1) {
        user.refreshToken.id(user.refreshToken[tokenIndex]._id).remove();
      }

      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.send(err);
          callback(null, { statusCode: 500, Error: err });
        } else {
          callback(null, { statusCode: 200 });
        }
      });
    },
    (err) => {
      console.log(err);
      callback(null, { statusCode: 500, Error: err });
    }
  );
}

exports.handle_request = handle_request;

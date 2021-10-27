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
  const refreshToken = getRefreshToken({ _id: msg._id });
  Users.findById(msg._id).then(
    (user) => {
      let address = {
        addressLine1: user?.addressLine1,
        addressLine2: user?.addressLine2,
        city: user.city,
      };
      user.refreshToken.push({ refreshToken });
      user.save((err, resp) => {
        if (err) {
          // res.statusCode = 500
          // res.send(err)
          callback(null, { statusCode: 500, err: err });
        } else {
          // res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
          // res.send({ success: true, token })
          callback(null, {
            statusCode: 200,
             'refreshToken':refreshToken,
          'address':resp?.addressLine1||'',
           'user':user._id 
          });
        }
      });
    },
    (err) => {
      console.log("err1" + err);
      callback(null, { statusCode: 500, err: err });
      // next(err)
      // res.send({ success: false })
    }
  );
}

exports.handle_request = handle_request;

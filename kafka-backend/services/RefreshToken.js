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
  // console.log(msg);

  Users.findOne({ _id: msg.userId }).then(
    (user) => {
      if (user) {
        // console.log(user);

        // Find the refresh token against the user record in database
        const tokenIndex = user.refreshToken.findIndex(
          (item) => item.refreshToken === msg.refreshToken
        );
        console.log('inrefersh');
          console.log(tokenIndex);
        if (tokenIndex === -1) {
            callback(null, {'statusCode' :401, 'err':'Unauthorized' })

        } else {
          const token = getToken({ _id: msg.userId });
          // If the refresh token exists, then create new one and replace it.
          const newRefreshToken = getRefreshToken({ _id: msg.userId });
          user.refreshToken[tokenIndex] = { refreshToken: newRefreshToken };
          console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
          console.log('inrefersh');
          console.log(newRefreshToken);
          user.save((err, resp) => {
            if (err) {
                callback(null, {'statusCode' :500, 'err':err })

            } else {
                callback(null, {'statusCode' :200, 'token':token })

            }
          });
        }
      } else {
        callback(null, {'statusCode' :401, 'err':'Unauthorized' })

        console.log("err");
      }
    },
    (err) => {
      callback(null, {'statusCode' :401, 'err':'Unauthorized' })

    }
  );
}

exports.handle_request = handle_request;

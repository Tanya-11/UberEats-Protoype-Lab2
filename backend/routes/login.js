const express = require("express");
const router = express.Router();
var kafka = require("../kafka/client");
// const Customer = require("../models/customer")
// const Restaurant = require('../models/restaurant')
const { Users } = require("../models/users");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const {
  getToken,
  COOKIE_OPTIONS,
  getRefreshToken,
  verifyUser,
} = require("../auth");

router.post("/signup", async (req, res, next) => {
  kafka.make_request("userSignup", req.body, function (err, results) {
    console.log("Inside signUp");
    console.log(err);
    console.log(results);
    if (err) {
      console.log("Inside err" + err);
      res.status(400).end();
    } else {
      console.log(results);
      res.cookie("refreshToken", results?.refreshToken, COOKIE_OPTIONS);
      res.send({ success: true, token: results.token, user: results.user });
    }
  });
});

router.post("/login", passport.authenticate("local"), (req, res, next) => {
  const token = getToken({ _id: req.user._id });
  const body = {
    _id: req.user._id,
  };
  kafka.make_request("userLogin", body, function (err, results) {
    console.log("Inside login");
    //  console.log(err);
    console.log("resilt");

    console.log(results);
    if (err) {
      console.log("Inside err" + err);
      res.status(500).end();
    } else {
      console.log("resilt" + JSON.stringify(results));
      // console.log(results);
      res.cookie("refreshToken", results.refreshToken, COOKIE_OPTIONS);
      res.send({
        success: true,
        token: token,
        address: results.address,
        user: results.user,
      });
      // res.cookie("refreshToken", results?.refreshToken, COOKIE_OPTIONS);
      // res.send({ success: true, token: results.token, user: results.user });
    }
  });
});

router.get("/refreshToken", (req, res, next) => {
  //  console.log(JSON.parse(req)+"req refreshhhhhhhhhhhhhhhhhhhhh");
  const { signedCookies = {} } = req;
  // console.log(signedCookies);
  const { refreshToken } = signedCookies;

  if (refreshToken) {
    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      const body = {
        refreshToken: refreshToken,
        userId: payload._id,
      };
      //  console.log('##################id'+JSON.stringify(payload));
      const userId = payload._id;
      //  console.log('##################id'+userId);
      kafka.make_request("refreshToken", body, function (err, results) {
        if (err) {
          console.log("Inside err" + err);
          // res.status(500).end();
          res.statusCode = 500;
          res.send(err);
        } else {
          if (results.statusCode !== 200) {
            res.status(401);
          }
          console.log(results);
          res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
          res.send(results);
        }
      });
    } catch (err) {
      res.statusCode = 401;
      res.send("Unauthorized" + err);
    }
  } else {
    res.statusCode = 401;
    res.send("Unauthorized");
  }
});

router.post("/logout", (req, res, next) => {
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;
  // console.log(req);
  const body = {
    refreshToken: refreshToken,
    _id: req.body.user,
  };
  kafka.make_request("userLogout", body, function (err, results) {
    if (err) {
      console.log("Inside err" + err);
      // res.status(500).end();
      res.statusCode = 500;
      res.send(err);
    } else {
      console.log("resilt" + results);
      // res.clearCookie("refreshToken", COOKIE_OPTIONS);
      res.status(200).clearCookie("refreshToken", {
        path: "/",
      });
      res.send({ success: true });
      // console.log(results);
      //   res.cookie("refreshToken", results.refreshToken, COOKIE_OPTIONS)
      //  res.send({ success: true, token:token,address:results.addressLine1, user:results.user })
      // res.cookie("refreshToken", results?.refreshToken, COOKIE_OPTIONS)
      // res.send({ success: true, token : results.token,user:results.user })
    }
  });
});
router.post("/book", function (req, res) {
  kafka.make_request("userSignup", req.body, function (err, results) {
    console.log("in result");
    console.log(results);
    if (err) {
      console.log("Inside err");
      res.json({
        status: "error",
        msg: "System Error, Try Again.",
      });
    } else {
      console.log("Inside else");
      res.json({
        updatedList: results,
      });

      res.end();
    }
  });
});

module.exports = router;

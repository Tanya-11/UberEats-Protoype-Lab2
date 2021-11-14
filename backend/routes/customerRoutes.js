const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");

const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const router = express.Router();
const { Users } = require("../models/users");
const { Dishes, Order } = require("../models/orders");
const orders = require("../models/orders");
var kafka = require("../kafka/client");
const { uploadFile, getFileStream } = require("../s3");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});
const filefilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: filefilter,
  // limits: { fileSize: 1000000 }
});

const {
  getToken,
  COOKIE_OPTIONS,
  getRefreshToken,
  verifyUser,
} = require("../auth");
const { response } = require("express");

router.post("/search",
 verifyUser,
  (req, res) => {
 
  let {
    city = "",
    category = "",
    searchTabText = "",
    delivery = true,
    pickUp = false,
  } = req.body.searchData;
  console.log(req.body.searchData);
  kafka.make_request(
    "fetchSearchResults",
    { city, category, searchTabText, delivery, pickUp },
    function (err, results) {
      console.log("Inside search");
      console.log(err);
      console.log(results);
      if (err) {
        console.log("Inside search" + err);
        res.status(500).end();
      } else {
        res.send(results.data);
      }
    }
  );
});

router.post("/fav-add", (req, res) => {
  console.log(req.body.restaurant);
  kafka.make_request("setFav", req.body, function (err, results) {
    console.log("SETFAV");
    console.log(err);
    console.log(results.data);
    if (err) {
      console.log("Inside err" + err);
      res.status(500).end();
    } else {
      res.send(results);
    }
  });
});

router.post("/favs", (req, res) => {
  kafka.make_request("fetchFav", req.body, function (err, results) {
    if (err) {
      res.status(500).end();
    } else {
      res.send(results);
    }
  });
});

router.post("/customer/profile", async (req, res) => {
  kafka.make_request("customerProfile", req.body, function (err, results) {
    if (err) {
      res.status(500).end();
    } else {
      res.status(results.statusCode);
      res.send(results.data);
    }
  });
});

router.post("/customer/profile/save", (req, res) => {
  //   console.log(req.body);
  kafka.make_request("setCustomerProfile", req.body, function (err, results) {
    console.log("Inside signUp");
    console.log(err);
    console.log(results);
    if (err) {
      console.log("Inside err" + err);
      res.status(500).end();
    } else {
      res.send(results.data);
    }
  });
});

router.post("/cart/placed", (req, res) => {
  //    console.log(req.body);
  kafka.make_request("placeFoodOrder", req.body, function (err, results) {
    console.log("Inside signUp");
    console.log(err);
    console.log(results);
    if (err) {
      console.log("Inside err" + err);
      res.status(500).end();
    } else {
      res.send(results);
    }
  });
});
router.post("/cancelled-orders", (req, res) => {
  console.log( req.body);

  kafka.make_request(
    "getCutomerOrdersCancelled",
    req.body,
    function (err, results) {
       if (err) {
        res.status(500).end();
      } else {
        if (results?.statusCode == 200) {
          res.status(200).send(results.data);
        } else {
          res.status(400).end();
        }
      }
    }
  );
});

router.post("/past-orders", (req, res) => {

  kafka.make_request("getCutomerOrdersPast", req.body, function (err, results) {
    if (err) {
      res.status(500).end();
    } else {
      if (results?.statusCode == 200) {
        res.status(200).send(results.data);
      } else {
        res.status(400).end();
      }
    }
  });
});

router.post("/active-orders", (req, res) => {

  kafka.make_request(
    "getCutomerOrdersActive",
    req.body,
    function (err, results) {
      if (err) {
        console.log(err);
        res.status(500).end();
      } else {
        if (results?.statusCode == 200) {
          res.status(200).send(results.data);
        } else {
          res.status(400).end();
        }
      }
    }
  );
});

router.post("/upload/photo", upload.single("image"), async (req, res) => {
  console.log("print" + req.body.username);
  console.log("img" + req.file);

  Users.findOne({ username: req.body.username })
    .then(
      async (result) => {
        console.log(result);
        const image = await uploadFile(req.file);
        await unlinkFile(req.file.path);
        console.log(image);
        console.log(req.body.description);
        //res.send({imagePath: `/images/${image.Key}`})
        result.imageURL = image.Key;
        result.save().then(
          (resp) => {
            res.send(resp);
            console.log(resp);
          },
          (err) => {
            console.log(err);
          }
        );
      },
      (err) => {
        console.log(err);
        res.status(500).json("File Upload failed");
      }
    )
    .catch((error) => {
      console.log(error);
      res.status(500).json("File Upload failed");
    });
});

router.get("/images/:key", (req, res) => {

  console.log(req.params);
  const key = req.params.key;
  const readStream = getFileStream(key);

  readStream.pipe(res);
});

module.exports = router;

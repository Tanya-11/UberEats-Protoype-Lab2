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

router.post("/search", verifyUser, (req, res) => {
  console.log(req.body.searchData);
  let {
    city = "",
    mode = "",
    category = "",
    searchTabText = "",
  } = req.body.searchData;
  console.log(mode);
  let delivery = true;
  let pickUp = false;
  if (mode === "pick") {
    delivery = false;
    pickUp = true;
  }
  Users.find(
    //         {role:'restaurant',
    //         city:city,
    //         deliveryMode:mode,
    // }
    {
      $and: [
        {
          $or: [
            { name: { $regex: `${searchTabText}`, $options: "i" } },
            {
              "dishes.dishName": { $regex: `${searchTabText}`, $options: "i" },
            },
          ],
        },

        {
          dishes: {
            $elemMatch: {
              category: { $regex: category, $options: "i" },
              //'Vegetarian'
            },
          },
        },
        {
          city: { $regex: city, $options: "i" },
          //    {"$in":[/San/]}
        },
        { delivery: { $eq: delivery } },
        { pickedUp: { $eq: pickUp } },
        { role: "restaurant" },

        // {'deliveryMode.topics.modules.classes.name':{"$in":[/math/]}}
      ],
    }
  )
    .then(
      (result) => {
        console.log("######################");
        console.log(result);

        // let restNameFilterResp=[];
        // let dishFilterResp=[];
        // let categoryFilterResp= [];
        //      result.filter(el=>{
        //     if(el.name == (searchTabText)){
        //        //  console.log(el);
        //        restNameFilterResp.push(el)
        //     }

        //     })
        //     result.filter(el=>{
        //         el.dishes.filter(item=>{
        //             if(item.dishName == (searchTabText)){
        //               //  console.log(item);
        //               dishFilterResp.push(el);
        //                // return el
        //             }

        //         })
        //     })
        //       result.filter(el=>{
        //         el.dishes.filter(item=>{
        //             if(item.category===(category)){
        //               //  console.log(item);
        //               categoryFilterResp.push(el)
        //                // return el
        //             }

        //         })
        //     })
        // //     console.log('1'+restNameFilterResp.length);
        // //     console.log('@@@@@@@@@@@@@@@@@@@@');
        // //     console.log('2'+dishFilterResp.length);
        // //     console.log('@@@@@@@@@@@@@@@@@@@@');

        // //   console.log('rw'+categoryFilterResp.length);

        // // console.log(restNameFilterResp);
        // // console.log('set');
        // if(category=='' && searchTabText==''){
        //     // console.log('less filters');

        //     // console.log(new Set([...result,...restNameFilterResp,...dishFilterResp,...categoryFilterResp]));
        //     res.status(200).json(
        //        [...new Set([...result,...restNameFilterResp,...dishFilterResp,...categoryFilterResp])
        //      ] )
        // }
        // else {
        //     // console.log(new Set([...restNameFilterResp,...dishFilterResp,...categoryFilterResp]));
        //     res.send(
        //         [...new Set([...restNameFilterResp,...dishFilterResp,...categoryFilterResp])]
        //         )

        // }

        // res.send(new Set([restNameFilterResp,dishFilterResp,categoryFilterResp]))
        //   res.send({success:true});
        res.send(result);
      },
      (err) => {
        console.log(err);
        res.statusCode = 400;
        res.send({ success: false });
      }
    )
    .catch((err) => {
      console.log(err);
      res.statusCode = 500;
      res.send({ success: false });
    });
});

router.post("/fav-add", (req, res) => {
  console.log(req.body.restaurant);
  kafka.make_request("setFav", req.body, function (err, results) {
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

router.post("/favs", (req, res) => {
  console.log("##############################################");
  console.log(req.body);
  kafka.make_request("fetchFav", req.body, function (err, results) {
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

router.get("/me", (req, res, next) => {
  // console.log('verify');
  // res.send(req.user)
});
router.post("/customer/profile", async (req, res) => {
  kafka.make_request("customerProfile", req.body, function (err, results) {
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
router.post("/cancelled-orders", verifyUser, (req, res) => {
  console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
  kafka.make_request(
    "getCutomerOrdersCancelled",
    req.body,
    function (err, results) {
      console.log("Inside order");
      console.log(err);
      console.log(results);
      if (err) {
        console.log("Inside err" + err);
        res.status(500).end();
      } else {
        res.send(results.data);
      }
    }
  );
});

router.post("/past-orders", verifyUser, (req, res) => {
  console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
  kafka.make_request("getCutomerOrdersPast", req.body, function (err, results) {
    console.log("Inside order");
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

router.post("/active-orders", verifyUser, (req, res) => {
  console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
  kafka.make_request(
    "getCutomerOrdersActive",
    req.body,
    function (err, results) {
      console.log("Inside order");
      console.log(err);
      console.log(results);
      if (err) {
        console.log("Inside err" + err);
        res.status(500).end();
      } else {
        res.send(results.data);
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
  console.log(
    "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
  );
  console.log(req.params);
  const key = req.params.key;
  const readStream = getFileStream(key);

  readStream.pipe(res);
});

module.exports = router;

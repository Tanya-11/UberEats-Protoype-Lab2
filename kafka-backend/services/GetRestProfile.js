const mongoose = require("mongoose");
const { Users } = require("../models/users");
const { Dishes, Order } = require("../models/orders");
const orders = require("../models/orders");

async function handle_request(msg, callback) {
    console.log(msg);
  Users.findOne({ username: msg }).then(
    (result) => {
      console.log(result);
      callback(null, { statusCode: 200, data: result });
    },
    (err) => {
      callback(null, { statusCode: 500, err: err });
    }
  );
}

exports.handle_request = handle_request;

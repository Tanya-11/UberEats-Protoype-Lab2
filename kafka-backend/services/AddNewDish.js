const mongoose = require("mongoose");
const { Users } = require("../models/users");
const { Dishes, Order } = require("../models/orders");
const orders = require("../models/orders");

async function handle_request(msg, callback) {
  Users.findOne({ username: msg.restRef })
    .then((user) => {
      console.log(user);
      const address = user.dishes.id(msg._id); // returns a matching subdocument
      console.log(address);
      if (address === null) {
        const dish = new Dishes({
          dishName: msg.dishName,
          ingredients: msg.ingredients,
          price: msg.price,
          description: msg.description,
          category: msg.category,
        });
        user.dishes.push(dish);
      } else {
        address.set(msg);
      }
      return user.save(); // saves document with subdocuments and triggers validation
    })
    .then((resp) => {
      console.log(resp);
     callback(null,{resp})
    })
    .catch((e) => callback({'statusCode':500, "err":err}, null));
}

exports.handle_request = handle_request;

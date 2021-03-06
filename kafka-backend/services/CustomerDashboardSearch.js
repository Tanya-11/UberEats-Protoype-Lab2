const mongoose = require('mongoose');
const {Users} = require('../models/users')
const {Dishes,Order} =  require('../models/orders')
const orders = require("../models/orders")
async function handle_request(msg, callback) {
  console.log('in');
    console.log(msg);

    Users.find(
        {
          $and: [
            {
              $or: [
                { name: { $regex: `${msg.searchTabText}`, $options: "i" } },
                {
                  "dishes.dishName": { $regex: `${msg.searchTabText}`, $options: "i" },
                },
              ],
            },
    
            {
              dishes: {
                $elemMatch: {
                  category: { $regex: msg.category, $options: "i" },
                  //'Vegetarian'
                },
              },
            },
            {
              city: { $regex: msg.city, $options: "i" },
              //    {"$in":[/San/]}
            },
            {
            $or: [
            { delivery: { $eq:msg.delivery } },
            { pickedUp: { $eq: msg.pickUp } },
            ]
          },
            { role: "restaurant" },
              ],
        }
      )
        .then(
          (result) => {

            callback(null, {'statusCode' :200, 'data':result })
        },
          (err) => {
            console.log(err);
            callback(null, {'statusCode' :400, 'err':err })

          }
        )
        .catch((err) => {
          console.log(err);
          callback(null, {'statusCode' :500, 'err':err })
        });
 
}

exports.handle_request = handle_request;

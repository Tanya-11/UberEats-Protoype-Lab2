const mongoose = require('mongoose');
const {Users} = require('../models/users')
const {Dishes,Order} =  require('../models/orders')
const orders = require("../models/orders")
async function handle_request(msg, callback) {
    Users.findOne({username:msg.username}).
    select('-refreshToken')
    .then(
       result=>{
        // console.log(result);
        callback(null, {'statusCode' :200, 'data':result })
       },
       error=>{
        callback(null, {'statusCode' :500, 'error':err })

       }
   )
   .catch(err=> callback(null, {'statusCode' :500, 'error':err }))
}

exports.handle_request = handle_request;

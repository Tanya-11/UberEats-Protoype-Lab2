const mongoose = require('mongoose');
const {Users} = require('../models/users')
const {Dishes,Order} =  require('../models/orders')
const orders = require("../models/orders")
async function handle_request(msg, callback) {

    Order.find(
        { $and: [
            {'restId':msg.user}, 
      {$or: [
        {'orderStatus':{'$in':[/Delivered/]}},
        {'orderStatus':{'$in':[/Picked/]}}, 
    
        ]},
        ]}
     
      ).then(
      resp=>{
          console.log(resp);
          callback(null, {'statusCode' :200, resp })
      },
      err=>{
          console.log(err);
          callback(null, {'statusCode' :500, 'err':err }) 
        }
  )
}

exports.handle_request = handle_request;

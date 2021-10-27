const mongoose = require('mongoose');
const {Users} = require('../models/users')
const {Dishes,Order} =  require('../models/orders')
const orders = require("../models/orders")

async function handle_request(msg, callback) {
    Order.findByIdAndUpdate(
        {'_id':msg.orderId},
        {
            '$set':{
                'orderStatus':msg.orderStatus,
                'date': msg.date
            }
        }
        // 'orders.orderStatus': msg.orderStatus
     
        ).then(
        resp=>{
         //    resp.orders.orderStatus = msg.orderStatus;
         //    resp.save((err,response)=>{
         //                     if(err) console.log(err);
         //                     else 
         //                     {
         //                         res.status(200).send(response);
         //                         console.log('in else'+response); 
         //                     } 
         //                 })
         console.log("^^^^^^^^^^^^^");
 
          console.log(resp);
          callback(null,{resp})
               
        },
        err=>{
            callback(null, {'statusCode' :500, 'err':err })

        }
    )
}

exports.handle_request = handle_request;

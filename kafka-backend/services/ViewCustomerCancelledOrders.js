const mongoose = require('mongoose');
const {Users} = require('../models/users')
const {Dishes,Order} =  require('../models/orders')
const orders = require("../models/orders")
async function handle_request(msg, callback) {
    console.log(msg);
    Order.find(
        {
            $and: [   
            {'customer.username':msg.user},
            {'orderStatus':{ $eq: 'Cancelled'}},
            ]
        }
        )
        .limit(msg.size)
        .skip(msg.size * (msg.pageNo - 1))
        .then(
        resp=>{
            console.log(resp);
           if(resp!==null){
            callback(null, {'statusCode' :200, 'data':resp })
        }
        else {
            callback({'statusCode' :400 },null )
        }

        },
        err=>{
            callback({'statusCode' :500},null )
        }
    )
}

exports.handle_request = handle_request;

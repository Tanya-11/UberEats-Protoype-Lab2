const mongoose = require('mongoose');
const {Users} = require('../models/users')
const {Dishes,Order} =  require('../models/orders')
const orders = require("../models/orders")
async function handle_request(msg, callback) {
    console.log('user'+msg);
    Order.findOne(
        {
            $and: [   
            {'customer.username':msg.user},
            {$and: [
                {'orderStatus':{ $ne: 'Delivered'}},
                {'orderStatus':{ $ne: 'PickedUp'}},
                {'orderStatus':{ $ne: 'Cancelled'}}

                ]
            }
            ]
        } 
        ).then(
        resp=>{
           console.log(resp);
           if(resp!==null){
            callback(null, {'statusCode' :200, 'data':resp })
        }
        else {
            callback(null,{'statusCode' :400 } )
        }

        },
        err=>{
            console.log(err);
            callback(null, {'statusCode' :500, 'err':err })
        }
    )
}

exports.handle_request = handle_request;

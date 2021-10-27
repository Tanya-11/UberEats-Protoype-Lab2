const mongoose = require('mongoose');
const {Users} = require('../models/users')
const {Dishes,Order} =  require('../models/orders')
const orders = require("../models/orders")
async function handle_request(msg, callback) {

    Users.updateOne({"username":msg.username},
    {
        ...msg
    }
    ).then(
        result=>{
        //    console.log("found"+JSON.stringify(result));
        callback(null, result);
          res.send(result)
        },
        err=>{
            console.error(err);
            callback(null, {'statusCode' :500, 'err':err })
        }
    )
}

exports.handle_request = handle_request;



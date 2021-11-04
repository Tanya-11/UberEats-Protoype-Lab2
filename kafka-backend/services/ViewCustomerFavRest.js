const mongoose = require('mongoose');
const {Users} = require('../models/users')
const {Dishes,Order} =  require('../models/orders')
const orders = require("../models/orders")
async function handle_request(msg, callback) {
    console.log(msg);
    Users.findOne({username:msg.user}).then(
        result=>{
            // console.log('IN FAV!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
            // console.log(result);
        if(result!==null)  callback(null, {'statusCode' :200, 'data':result.fav })
        },
        err=>{
         console.log(err);
         callback(null, {'statusCode' :500, 'err':err })

        }
     )
     .catch(err=>{
        callback(null, {'statusCode' :500, 'err':err })

     })
}

exports.handle_request = handle_request;

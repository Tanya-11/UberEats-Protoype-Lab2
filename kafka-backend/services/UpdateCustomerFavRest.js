const mongoose = require('mongoose');
const {Users} = require('../models/users')
const {Dishes,Order} =  require('../models/orders')
const orders = require("../models/orders")
async function handle_request(msg, callback) {
    Users.findOne({username:msg.user}).then(
        result=>{
             // console.log(result);
             result?.fav.push({restaurant:msg.restaurant});

             result.save((resp,error)=>{
                 if (error) {
                    callback(null, {'statusCode' :500, 'err':err })

                   } else {    
                     //   console.log(resp);   
                       res.statusCode=400;
                       res.send({success:false});   
                       callback(null, {'statusCode' :500, 'data':result.fav })
     
                    // res.send({ success: true, token })
                   }
             })
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

const mongoose = require('mongoose');
const {Users} = require('../models/users')
const {Dishes,Order} =  require('../models/orders')
const orders = require("../models/orders")
async function handle_request(msg, callback) {
    Users.findOne({username:msg.userId}
        ).then(
           user=>{
              user.name=msg.name;
              user.username = msg.username;
              user.city = msg.city
              user.state = msg.state
              user.nickName = msg.nickName,
              user.phoneNo = msg.phoneNo
              user.country = msg.country
              // user.addressLine1 = msg.addressLine1
              // user.addressLine2 = msg.addressLine2
              user.save((resp,err)=>{
                  if (err) {
                    callback(null, {'statusCode' :500, 'err':err })

                   console.log(err);
                    } else {    
                      callback(null, {'statusCode' :200, 'data':resp })

                      //   console.log(resp);   
                     // res.send({ success: true, token })
                    }
              })
           },
           error=>{
               console.log(error);           
               callback(null, {'statusCode' :500, 'err':err })

           }
       )
}

exports.handle_request = handle_request;

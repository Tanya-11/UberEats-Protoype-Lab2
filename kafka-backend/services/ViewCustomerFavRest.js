const mongoose = require('mongoose');
const {Users} = require('../models/users')
const {Dishes,Order} =  require('../models/orders')
const orders = require("../models/orders")
async function handle_request(msg, callback) {
    console.log();
    Users.findOne({username:msg.user}).then(
        result=>{
             // console.log(result.fav);
             if(msg?.restaurant){
                 if(msg.isFav===true){
                     // console.log('true');
                     result.fav.push({restaurant:msg.restaurant});
                 }
                 else{
                     // console.log('not true');
                     result.fav =  result.fav.filter(item => item.restaurant !== msg.restaurant);
 
                     // let index  = result.fav.indexOf(msg.restaurant)
                   //  console.log(found);
                     // result.fav.splice(index,1);
                  
                 }
                 result.save((resp,error)=>{
                     if (error) {
                     //  res.statusCode = 500
                     //  console.log(error);
                     // res.send(error)
                     callback(null, {'statusCode' :500, 'err':error })

                       } else {    
                         //   console.log(resp);   
                         //   res.statusCode=400;
                         //   res.send({success:false});        
                        // res.send({ success: true, token })
                        callback(null, {'statusCode' :200, 'data':result })

                       }
                 })
             } 
             callback(null, {'statusCode' :200, 'data':result?.fav })

                 
        },
        err=>{
            callback(null, {'statusCode' :500, 'err':err })

        }
     )
     .catch(error=>{
        callback(null, {'statusCode' :500, 'err':err })

     })
}

exports.handle_request = handle_request;

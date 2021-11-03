const mongoose = require('mongoose');
const {Users} = require('../models/users')
const {Dishes,Order} =  require('../models/orders')
const orders = require("../models/orders")
async function handle_request(msg, callback) {
   // console.log(msg);
    Users.findOne({username:msg.user}).then(
        result=>{
             if(msg?.restaurant && msg?.restaurant!==""){
                 if(msg.isFav===true){
                     result.fav.push({restaurant:msg.restaurant});
                 }
                 else{
                     result.fav =  result.fav.filter(item => item.restaurant !== msg.restaurant);
 
                     // let index  = result.fav.indexOf(msg.restaurant)
                   //  console.log(found);
                     // result.fav.splice(index,1);
                  
                 }
                 result.save((resp,error)=>{
                     if (error) {
                     //  res.statusCode = 500
                     // res.send(error)
                     callback(null, {'statusCode' :500, 'err':error })

                       } else {    
                           console.log(resp);   
                         //   res.statusCode=400;
                         //   res.send({success:false});        
                        // res.send({ success: true, token })
                        callback(null, {'statusCode' :200 })

                       }
                 })
                callback(null, {'statusCode' :200 })      

             } 
             else
             callback(null, {'statusCode' :400})      
        },
        err=>{
            callback(null, {'statusCode' :500, 'err':err })

        }
     )
     .catch(error=>{
        callback(null, {'statusCode' :590, 'err':error })

     })
}

exports.handle_request = handle_request;

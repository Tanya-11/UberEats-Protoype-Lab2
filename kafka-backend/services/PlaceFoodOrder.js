const mongoose = require('mongoose');
const {Users} = require('../models/users')
const {Dishes,Order} =  require('../models/orders')
const orders = require("../models/orders")
async function handle_request(msg, callback) {
    let dish = [];
    msg.orders.forEach(item=>{
       dish.push(new Dishes({
        _id:new mongoose.Types.ObjectId(),
            dishName:item.dishName,
            dishPrice: item.dishPrice,
            quantity: item.quantity,
            price : item.price
        }))
    })
   let order = new Order();
   //order._id=new mongoose.Types.ObjectId();

   order = (new Order({
    _id:new mongoose.Types.ObjectId(),
    orderStatus: msg.orderStatus,
    customer: {
        ...msg.user,
    },
      restId:msg.restId,
      dishes:dish,
      date: msg.date,
     // deliveryMode:
    //  address: 
    //  quantity: msg.quantity,
      price:msg.price,
      instructions: msg.instructions

   }));
   order.save().then(
      // (resp,error)=>{
    resp=>{
        //    console.log(resp);
           callback(null, {'statusCode' :200, 'success':true })
        },
       error=>{
           console.log(error);
           callback(null, {'statusCode' :500, 'err':err })
        }
   )
}

exports.handle_request = handle_request;

const {Users} = require('../models/users');
const passport = require("passport")
const jwt = require("jsonwebtoken");
const { getToken, COOKIE_OPTIONS, getRefreshToken,verifyUser } = require("../../backend/auth")

async function handle_msguest(msg, callback){

    const token = getToken({ _id: msg.user._id })
    //  console.log('##################id'+ msg.user);
      // console.log('msg'+JSON.stringify(msg.body));
  
     const refreshToken = getRefreshToken({ _id: msg.user._id })
     //, role:msg.user.persona
      Users.findOne({_id:msg.user._id, role:msg.body.persona}).then(
        (user) => {
  console.log(user);
  let address= 
  { 
    addressLine1: user?.addressLine1,
    addressLine2 : user?.addressLine2,
    city :user.city
  
  }
           user.refreshToken.push({'refreshToken': refreshToken })
          user.save((err, user) => {
            if (err) {
            //   res.statusCode = 500
            //   res.send(err)
            callback(null, {'statusCode' :500, 'err':err })

              console.log('err1'+err);
            } else {
                
                callback(null,{ 'success': true,'token': token,'user':user._id,'address':address,'refreshToken':refreshToken })

            //  res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
            //   res.send({ success: true, token,address:address, user:user._id })
           //  console.log('res1'+res.token);
            }
          })
        },
        err => {
        console.log('err1'+err);
        callback(null, {'statusCode' :400, 'err':err })

           // next(err)
          //  res.send({ success: false })
          }
      ).catch((err)=>{
        callback(null, {'statusCode' :401, 'err':'Unauthorized' })

      })


}

exports.handle_msguest = handle_msguest;
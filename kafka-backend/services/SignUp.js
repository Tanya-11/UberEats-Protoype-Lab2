const {Users} = require('../models/users');
const passport = require("passport")
const jwt = require("jsonwebtoken");
const { getToken, COOKIE_OPTIONS, getRefreshToken,verifyUser } = require("../../backend/auth")

async function handle_request(msg, callback) {
    console.log('in signup!!!!!!!!!!!!!!!!!!!!!');
    console.log(msg);
    if (!msg.username) {
       // res.statusCode = 500
        const Error ={
          name: "UserName Error",
          message: "The username name is required",
        }
        callback(null, {'statusCode' :500, 'err':Error })
        //res.send()
      } else {
          console.log('In mongoose');
          Users.find({username: msg.username}).then(
            res=>{
              callback(null, {'statusCode' :401, 'err':err });
            },
            err=>{
              Users.register(
                new Users({ username: msg.username }),
                msg.password,
                (err, user) => {
                  if (err) {
                //   console.log('error'+err);
                    callback(null, {'statusCode' :502, 'err':err })
                  } else {
                    //  console.log('user'+user);
                    user.username = msg.username
                    user.role= msg.persona
                    const token = getToken({ _id: user._id })
                    const refreshToken = getRefreshToken({ _id: user._id })
                //    console.log('user'+refreshToken);
                //    console.log("refresh"+user);
                    user.refreshToken.push({ refreshToken })
                    user.save((err, resp) => {
                      if (err) {
                          console.log(err);
                          callback(null, {'statusCode' :503, 'err':err })
      
                      } else { 
                          console.log(resp);
        
                          callback(null,{ 'success': true,'token': token,'user':resp._id, 'refreshToken':refreshToken })
                  
                      //   res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
                      //   res.send({ success: true, token,user:user._id })
                      }
                    })
                  }
                }
              )
            }
          )
 
       }
  }
  
  exports.handle_request = handle_request;
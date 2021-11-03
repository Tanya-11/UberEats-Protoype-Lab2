var connection =  new require('./kafka/Connection');
//topics files
//var signin = require('./services/signin.js');
/*******************************************Common Services***************************************************/
var signUp = require('./services/SignUp');
var login = require('./services/LogIn')
var logOut = require('./services/LogOut')
var refreshToken = require('./services/RefreshToken')
/*******************************************Restaurant Services***************************************************/
var setActiveOrders = require('./services/GetActiveOrders')
var setCompleteOrders = require('./services/GetCompleteOrders')
var getRestProfile = require('./services/GetRestProfile')
var setAddNewDish = require('./services/AddNewDish')
var setupdateDish = require('./services/UpdateDish')
var setOrderStatus = require('./services/UpdateOrderStatus')
var updateRestProfile = require('./services/UpdateRestProfile')

/*******************************************Customer Services***************************************************/
var fetchSearchResults = require('./services/CustomerDashboardSearch');
var placeFoodOrder = require('./services/PlaceFoodOrder')
var fetchFav = require('./services/ViewCustomerFavRest');
var setFav = require('./services/UpdateCustomerFavRest')
var customerProfile = require('./services/ViewCustomerProfile')
var setCustomerProfile = require('./services/UpdateCustomerProfile')
var getCutomerOrdersPast = require('./services/ViewCustomerPastOrders')
var getCutomerOrdersActive = require('./services/ViewCustomerActiveOrders')
var getCutomerOrdersCancelled = require('./services/ViewCustomerCancelledOrders')

require('./utils/database');


function handleTopicRequest(topic_name,fname){
    //var topic_name = 'root_topic';
    var consumer = connection.getConsumer(topic_name);
    var producer = connection.getProducer();
    // console.log('server is running ');
    consumer.on('message', function (message) {
        // console.log('message received for ' + topic_name +" ", fname);
        // console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);
        // console.log(data);
        fname.handle_request(data.data, function(err,res){
            // console.log('after handle'+res);
            var payloads = [
                { topic: data.replyTo,
                    messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data : res
                    }),
                    partition : 0
                }
            ];
            producer.send(payloads, function(err, data){
                // console.log(data);
            });
            return;
        });
        
    });
}
// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request
handleTopicRequest("userSignup",signUp)
handleTopicRequest("userLogin",login)
handleTopicRequest("userLogout",logOut)
handleTopicRequest("refreshToken",refreshToken)
/*******************************************Restaurant handleTopic***************************************************/
handleTopicRequest("setActiveOrders",setActiveOrders)
handleTopicRequest("setAddNewDish",setAddNewDish)
handleTopicRequest("setCompleteOrders",setCompleteOrders)
handleTopicRequest("setupdateDish",setupdateDish)
handleTopicRequest("setRestProfile",getRestProfile)
handleTopicRequest("setOrderStatus",setOrderStatus)
handleTopicRequest("updateRestProfile",updateRestProfile)
/*******************************************Customer handleTopic***************************************************/
handleTopicRequest("fetchSearchResults",fetchSearchResults)
handleTopicRequest("placeFoodOrder",placeFoodOrder)
handleTopicRequest("fetchFav",fetchFav)
handleTopicRequest("setFav",setFav)
handleTopicRequest("customerProfile",customerProfile)
handleTopicRequest("setCustomerProfile",setCustomerProfile)
handleTopicRequest("getCutomerOrdersPast",getCutomerOrdersPast)
handleTopicRequest("getCutomerOrdersCancelled",getCutomerOrdersCancelled)
handleTopicRequest("getCutomerOrdersActive",getCutomerOrdersActive)







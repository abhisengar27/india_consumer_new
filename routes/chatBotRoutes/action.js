var express = require('express');
var router = express.Router();
 var intentf = require("./fbactions.js");
 var intentg = require("./gActions.js");
 var ping = require("./chatbotactions.js");
//var schedule = require('node-schedule');//for scheduling messages
/////////////////

 console.log("in action");
var schedule = require('node-schedule');
var j = schedule.scheduleJob({hour: 08, minute: 17, dayOfWeek: 6}, function(){
console.log('Time for test!');
ping.searchIncmptMsg(function(){
                                           console.log("Complete");
                                       })
});
var rule = new schedule.RecurrenceRule();
rule.hour = 10;
rule.minute = 3;
 
var j1 = schedule.scheduleJob(rule, function(){
  console.log('Time for test!testtt!');
});
///////////////////////////////
var FB = require('fb');
var options = FB.options();
router.get('/test',function(req, res, next) {
    var page_access="EAAJXUREZAUrkBAFMOV2vZAb2JGNZAC0pzhDiMKclscYuOvQGLtGilxHM2vhmHst0R5I80fnuUCKaZAXnBfANdjUyXtlTycyMaPS49s2wSJVOXEbyqsJ1hsY6hy4RYaj47ev6g5wmhDKs887wnjWRQV0kdQNm2ZBVYuL7sK0FYowZDZD";
                    FB.setAccessToken('page_access');
                    FB.api('/1249008605159484', { fields: ['first_name', 'last_name'], access_token: page_access }, function (resa) {
                    console.log(resa);
                     name=resa.first_name+" "+resa.last_name
                     console.log(name);
                    res.json({success:resa})
                     });
});

router.get('/testlogin',function(req,res){
	var page_access="EAAJXUREZAUrkBAFMOV2vZAb2JGNZAC0pzhDiMKclscYuOvQGLtGilxHM2vhmHst0R5I80fnuUCKaZAXnBfANdjUyXtlTycyMaPS49s2wSJVOXEbyqsJ1hsY6hy4RYaj47ev6g5wmhDKs887wnjWRQV0kdQNm2ZBVYuL7sK0FYowZDZD";
	FB.api('oauth/access_token', {
    client_id: '658955644261049',
    client_secret: '0bb9fcaf5ed37cd0cdbc6e232b6ca454',
    redirect_uri: 'http://localhost:5000/Login',
    code: 'code'
}, function (res) {
    if(!res || res.error) {
        console.log(!res ? 'error occurred' : res.error);
        return;
    }else{
		console.log(res);
	}
 
   // var accessToken = res.access_token;
   // var expires = res.expires ? res.expires : 0;
});
	});



router.post('/oao',function(req, res, next) {
    if(req.body.originalRequest.source=='facebook')
            {
                    intentf.selectIntent(req,res);
            }else{
                intentg.selectIntent(req,res);
            }
});
// var FB = require('fb');
// var options = FB.options();
// router.get('/test',function(req, res, next) {
//     var page_access="EAAJXUREZAUrkBAFMOV2vZAb2JGNZAC0pzhDiMKclscYuOvQGLtGilxHM2vhmHst0R5I80fnuUCKaZAXnBfANdjUyXtlTycyMaPS49s2wSJVOXEbyqsJ1hsY6hy4RYaj47ev6g5wmhDKs887wnjWRQV0kdQNm2ZBVYuL7sK0FYowZDZD";
//                     FB.setAccessToken('page_access');
//                     FB.api('/1219258011496813', { fields: ['first_name', 'last_name','picture'], access_token: page_access }, function (resa) {
//                     console.log(resa);
//                      name=resa.first_name+" "+resa.last_name
//                      console.log(name);
//                     res.json({success:resa})
//                      });
// });



//////////////////////////////////////////////////////
var FBBotFramework = require('fb-bot-framework');

router.post('/fbmessage',function(req, res, next) {
// Initialize 
var bot = new FBBotFramework({
    page_token: "EAAJXUREZAUrkBAFMOV2vZAb2JGNZAC0pzhDiMKclscYuOvQGLtGilxHM2vhmHst0R5I80fnuUCKaZAXnBfANdjUyXtlTycyMaPS49s2wSJVOXEbyqsJ1hsY6hy4RYaj47ev6g5wmhDKs887wnjWRQV0kdQNm2ZBVYuL7sK0FYowZDZD",
    verify_token: "testbankkushal"
});
 
// Setup Express middleware for /webhook 
router.use('/webhook', bot.middleware());

 var sender=req.body.tosend;
 var title=req.body.title;
 var subtitle=req.body.subtitle;
 var b1_title=req.body.b1_title;
 var b1_payload=req.body.b1_payload;
 var b2_title=req.body.b2_title;
 var b2_payload=req.body.b2_payload;
 var b3_title=req.body.b3_title;
 var b3_payload=req.body.b3_payload;
 var notificationType="REGULAR";
var elements = [
    {
        "title": title,
        "image_url": "",
        "subtitle": subtitle,
        "buttons": [
            {
                "type": "postback",
                "title": b1_title,
                "payload": b1_payload
            },
             {
                "type": "postback",
                "title": b2_title,
                "payload": b2_payload
            },
            {
                "type": "postback",
                "title": b3_title,
                "payload": b3_payload
            }
        ]
    }
];
 
bot.sendGenericMessage(sender, elements, notificationType, function (err, body){
    if(err){
        console.log(err);
    }else{
    console.log(body);
   res.send();
}
})
});
/////////////////////////////////////////////////////

module.exports = router;



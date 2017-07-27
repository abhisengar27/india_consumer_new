 var botactions = require("./chatbotactions.js");

module.exports={

    selectIntent:function(req,res){
        action_v=req.body.result.action;
         switch(action_v)
                {

                    case 'GetAdminCall':     botactions.getPhoneNo(req,function(success,mob){
                                                    if(success==true){
                                                        res.json({  "speech": "Ok, Our agent will contact you shortly on "+mob+" this number",
                                                "displayText": "Ok, Our agent will contact you shortly on "+mob+" number",
                                                "contextOut": [],
                                                "source": "GetAdminCall"
                                                });
                                                    }else{
                                                        res.json({  "speech": "Sorry, We are not able to find your contact number please enter your contact number",
                                                "displayText": "Sorry, We are not able to find your contact number please enter your contact number",
                                                "contextOut": [],
                                                "source": "GetAdminCall"
                                                });
                                                    }

                                             });
                                            break;
                    case 'GetStarted':      botactions.checkcustomer(req,function(success){
                                                if(success==true)
                                                 { 
                                             res.json({
                                                 "speech": "Hi, we have found that your application is incomplete, do you want to continue here.",
                                                "displayText": "Hi, we have found that your application is incomplete, do you want to continue here.",
                                                    "data":{"facebook": { 
                                                        "attachment":{
                                                                "type":"template",
                                                                "payload":{
                                                                    "template_type":"generic",
                                                                    "elements":[
                                                                    {
                                                                        "title":"Hi, we have found that your application is incomplete",
                                                                        "image_url":"",
                                                                        "subtitle":"",
                                                                        "buttons":[
                                                                        {
                                                                            "type":"postback",
                                                                            "title":"Yes, I would like to someone to assist me.",
                                                                            "payload":"Get admin help"
                                                                        },{
                                                                            "type":"postback",
                                                                            "title":"No, I will complete application here",
                                                                            "payload":"crn: "+req.body.originalRequest.data.postback.referral.ref
                                                                        }              
                                                                        ]      
                                                                    }
                                                                    ]
                                                                }
                                                                }
                                                            }},
                                                    "contextOut": [],
                                                    "source": "GetStarted"
                                             })

                                            //   res.json({  "speech": "Hi, we have found that your application is incomplete, do you want to continue here.",
                                            //     "displayText": "Hi, we have found that your application is incomplete, do you want to continue here.",
                                            //     "contextOut": [],
                                            //     "source": "GetStarted"
                                            //     });
                                            }else if(success==false){
                                                 res.json({  "speech": "Hi your application is completed. You will recive your welcome kit shortly",
                                                "displayText": "Hi your application is completed. You will recive your welcome kit shortly",
                                                "contextOut": [],
                                                "source": "GetStarted"
                                                });
                                            }else{
                                                res.json({  "speech": "Hi, I'm Bank Agent Assistant. How can I help you?",
                                                "displayText": "Hi, I'm Bank Agent Assistant. How can I help you?",
                                                "contextOut": [],
                                                "source": "GetStarted"
                                                });
                                            }
                                            });
                                            
                                            break;
                    
                    case 'helpfromadmin':      botactions.updateHelp(req,function(success){
                                                if(success=="true")
                                                 { 
                                              res.json({  "speech": "Ok Thanks. Our Customer executive  will be calling you within few minutes",
                                                "displayText": "Ok Thanks. Our Customer executive  will be calling you within few minutes",
                                                "contextOut": [],
                                                "source": "helpfromadmin"
                                                });
                                            }
                                            });
                                         break;
                    case 'helpmanualcomplete': botactions.sendIncompleteFieldsMsg(req,function(result,crn,complete_v,field_v,sec_name){
                       
                       if(complete_v=="true"){res.json({  "speech": result,
                                                "displayText": result,
                                                "contextOut": [{"name":"helpmanualcomplete", "lifespan":2 ,"parameters":{"crn":crn,"field_var":field_v,"sec_name":sec_name}}],
                                                "source": "helpmanualcomplete"
                                                });
                                            }else{
                                                res.json({  "speech": "Your application is already submitted",
                                                "displayText": "Your application is submitted",
                                                "contextOut": [{"name":"helpmanualcomplete", "lifespan":2 ,"parameters":{"crn":crn,"field_var":field_v,"sec_name":sec_name}}],
                                                "source": "helpmanualcomplete"
                                                });
                                                }
                    });
                                                break;
                    case 'entermissingfields':  botactions.insertMissingField_test(req,function(success){
                                                if(success=="true")
                                            { 
                                                botactions.sendIncompleteFieldsMsg(req,function(result,crn,complete,field_v,sec_name){
                                                     console.log(complete);
                                                    if(complete=="true")
                                            {res.json({  "speech": result,
                                                "displayText": result,
                                                "contextOut": [{"name":"helpmanualcomplete", "lifespan":2 ,"parameters":{"crn":crn,"field_var":field_v,"sec_name":sec_name}}],
                                                "source": "helpmanualcomplete"
                                                                    });}
                                                                    else{
                                                                        botactions.updateStatus(req,function(success_u,result_data){
                                                                        if(success_u=="true")
                                                                        {res.json({  "speech": "Thanks, Your account is opened successfully and your Customer-ID="+result_data[0].core_customer_id+" BSB="+result_data[0].bank_bsb_number+" Account Number="+result_data[0].core_account_number+"",
                                                                        "displayText": "Thanks, Your account is opened successfully and your Customer-ID="+result_data[0].core_customer_id+" BSB="+result_data[0].bank_bsb_number+" Account Number="+result_data[0].core_account_number+"",
                                                                        "contextOut": [],
                                                                        "source": "entermissingfields"
                                                                    
                                                                        });}
                                                                    });
                                                                    }
                                            });
                                            }else{
                                                res.json({  "speech": "Try again",
                                                                        "displayText": "Try again",
                                                                        "contextOut": [],
                                                                        "source": "entermissingfields"});
                                            }
                                            });             
                                              

                                                break;
             case 'helpnotinterestedReason': botactions.updateReason(req,function(success){
                                                if(success=="true")
                                                 { 
                                              res.json({  "speech": "Ok Thanks for your valuable feedback",
                                                "displayText": "Ok Thanks for your valuable feedback",
                                                "contextOut": [],
                                                "source": "helpnotinterestedReason"
                                                });
                                            }
                                            });
                                                 break;
                    default :     botactions.getBalance(req,function(balance){
                                            res.json({  "speech": "Hi!! Your balance is "+balance,
                                                "displayText": "Hi!! Your balance is "+balance,
                                                "contextOut": [],
                                                "source": "getBalance"
                                                });
                                        })
                }

    }


};
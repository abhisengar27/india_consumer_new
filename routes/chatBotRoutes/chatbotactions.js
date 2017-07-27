
var request = require('request');
var msg = require("./helperbot.js");
var mongoose = require('mongoose');
//var customerDetails = require("../models/customerdetails.js"); 
var propDetails = require("../../models/OAOPropertyDetail.js");
var oaoApplicant = require("../../models/OAOApplicantSchema.js");
var apphelper = require("../oaoRoutes/OAOApplicationHelper.js");
var dbhelper = require("../oaoRoutes/OAODBHelper.js");

var Schema = mongoose.Schema;
var balanceschema = new Schema({
  accno: Number,
  balance: Number
});
var balancemodel = mongoose.model('balancemodel', balanceschema);

var self = module.exports = {
  getBalance: function (req, callback) {
    var acno = req.body.result.parameters['number'];
    balancemodel.findOne({ accno: acno }, function (err, result) {
      if (result) {
        return callback(result.balance);
      }
    });
  },


  checkcustomer: function (req, callback) {
    var app_ref = req.body.originalRequest.data.postback.referral.ref;
    var app_id = app_ref
    if(app_ref!='na'){
    dbhelper.getApplicantsRecord(app_id, function (result) {
      console.log(result);
      if (!result) {
        return callback(success = false);
      } else if (result[0].application_status == "SAV" && result[0].product_type=='Everyday Account') {
        result[0].bot_fields[0].socialId=req.body.originalRequest.data.sender['id'];
        result[0].bot_fields[0].botContacted="Y";
        dbhelper.save(result[0],function(result){
                     console.log(result)
                 })
        return callback(success = true);
      } else if( result[0].product_type=='Everyday Account'){
        result[0].bot_fields[0].socialId==req.body.originalRequest.data.sender['id'];
        result[0].bot_fields[0].botContacted="Y";
        dbhelper.save(result[0],function(result){
                     console.log(result)
                 })
        return callback(success = false);
      }else{
		  return callback(success="defaut")
	  }
    });
  }else{
    return callback(success="defaut")
  }

  },
getPhoneNo:function (req,callback){
  var socialid=req.body.originalRequest.data.sender['id'];
   oaoApplicant.find({"bot_fields.socialId":socialid},function(err,result){
      console.log(result);
      if(result){
        console.log(result[0].mobile)
      return callback(success=true,result[0].mobile)
    }else{
      return callback(success=false,result[0].mobile)
    }
   })
},

  sendRemainder: function (cutoff_v, contacted_v, remainders_v) {
    console.log("test")
    var remainders = "bot_fields.noOfRemaindersSent"
    var contacted = "bot_fields.botContacted";
    oaoApplicant.find({ "bot_fields.noOfRemaindersSent": remainders_v, application_status: 'SAV', mod_time: { $lt: cutoff_v }, "bot_fields.botContacted": contacted_v, help_flg: 'N' }, function (err, result) {
      if (err) {
        console.log(err)
      }
      else if (result) {
        console.log(result);
        if (result.length > 0) {
          for (var i = 0; i < result.length; i++) {
            var sender_id = result[i].bot_fields[0].socialId;
            var crn = result[i].application_id;
            msg.sendMessage(sender_id, crn, function (success) {
              if (success == "true") {
                self.updateContacted(sender_id, crn, (remainders_v + 1));
              }
            });
          }
        }
      }
    });

  },
  sendRemainderMail: function (cutoff_v, contacted_v, remainders_v) {
    console.log("test")
    var remainders = "bot_fields.noOfRemaindersSent"
    var contacted = "bot_fields.botContacted";
    console.log(cutoff_v + " " + contacted_v + " " + remainders_v)
    oaoApplicant.find({ "bot_fields.noOfRemaindersSent": remainders_v, application_status: 'SAV', mod_time: { $lt: cutoff_v }, "bot_fields.botContacted": contacted_v, help_flg: 'N' }, function (err, result) {
      if (err) {
        console.log(err)
      }
      else if (result) {
        if (result.length > 0) {
          for (var i = 0; i < result.length; i++) {
            // var sender_id = result[i].bot_fields[0].socialId;;
            var crn = result[i].application_id;
            var email = result[i].email;
            console.log(crn + "    " + email)
            apphelper.SendMail(email, crn, function (success) {
              console.log(success);
              if (success == "true") {
                console.log(success + "uiwqeuiyi");
                self.updateContacted(sender_id, crn, (remainders_v + 1));
              } else {
                //  logger.error(err);
                console.log(err);
              }
            });


          }
        }
      }
    });

  },


  searchIncmptMsg: function () {
    propDetails.findOne({ property_type: 'turnOnOff', property: 'Mail_Chat_Both' }, function (err, result) {
      //Based on condition call send remainder using both or either bot mail
      if (err) {
        console.log(err);
      } else if (result) {
        console.log(result)
        if ((result.property_value) == "B" || (result.property_value) == "C") {
          //Send reminders using chat
        }
        if ((result.property_value) == "M" || (result.property_value) == "B") {
          propDetails.findOne({ property_type: 'GENERIC_PROP', property: 'Reminder_Time_1' }, function (err, result_day) {
            var cutoff = new Date();
            cutoff.setDate(cutoff.getDate() - (result_day.property_value));
            console.log(cutoff + ":: " + result_day.property_value)
            self.sendRemainderMail(cutoff, 'N', '0');//first remainder not contacted
            self.sendRemainderMail(cutoff, 'Y', '0');//first remainder contacted
          });
          propDetails.findOne({ property_type: 'GENERIC_PROP', property: 'Reminder_Time_2' }, function (err, result_day1) {
            var cutoff_2 = new Date();
            console.log(cutoff_2 + ":: " + result_day1.property_value)
            cutoff_2.setDate(cutoff_2.getDate() - (result_day1.property_value));
            self.sendRemainderMail(cutoff_2, 'Y', '1');//Second remainder contacted
          });
          propDetails.findOne({ property_type: 'GENERIC_PROP', property: 'Reminder_Time_3' }, function (err, result_day2) {
            var cutoff_3 = new Date();
            console.log(cutoff_3 + ":: " + result_day2.property_value)
            cutoff_3.setDate(cutoff_3.getDate() - (result_day2.property_value));
            self.sendRemainderMail(cutoff_3, 'Y', '2');//Third remainder contacted
          });

        }
      }

    });
  },

  sendIncompleteFieldsMsg: function (req, callback) {
    var senderid = req.body.originalRequest.data.sender['id'];
    var crn = req.body.result.parameters['crn'];
    var continue_v = "false";
    oaoApplicant.find({ application_id: crn }, function (err, result) {
      if (err) { console.log(err) }
      else {
        console.log(result);
        self.checkSection(result, function (message, field_t, success, mandatory_sec) {
          if (success == true) {
            continue_v = "true";
            return callback(message, crn, continue_v, field_t, mandatory_sec)
          } else {
            continue_v = "false";
            return callback('no', crn, continue_v, field_t, mandatory_sec)
          }
        });
      }
    });
  },
  getprodCode:function(prod_desc,callback){
      propDetails.find({ property_type: 'commonCodes', property: 'PRODUCT_TYPE', property_desc: prod_desc }, function (err, prod_result) {
    console.log(prod_result)
    var  prod = prod_result[0].property_value;
    //  var sectionProd = "section_" + prod;
    //  console.log(prod+" "+sectionProd)
      return callback(prod)
    })
  },
  checkSection: function (result, callback) {
    console.log("checkschema start");
    var j = 0;
    var arr_emp = "";
    var sec = "";
    self.getprodCode(result[0].product_type,function(prod){
      for (var i = 1; i <= result[0].no_of_section; i++) {
        sec = "section_" + i;
        var prod_code= "section_" + prod;
        console.log(prod_code)
        if (result[0][prod_code][0][sec] == false) {
          console.log(sec);
          arr_emp = sec;
          break;
        }
      }
      console.log(arr_emp);
      if (arr_emp != "") {
        self.getMandatoryField(result, arr_emp,prod, function (field_t, mandatory_sec) {
          console.log(field_t);
          self.getMessage(field_t, function (message, msg_success) {
            console.log(message)
            if (msg_success = true) {
              var success = true;
              return callback(message, field_t, success, mandatory_sec);
            } else {
              var success = false;
              return callback(message, field_t, success, mandatory_sec);
            }
          });
        });
      } else {
        var success = false;
        return callback("no", "field_t", success, "mandatory_sec");
      }
    })

    console.log("checkschema end");

  },
  getMandatoryField: function (result, section,prod_code, callback) {
    var mandatory_sec = section + "_fields";
    var mand_field_prodcode="Mandatory_fields_"+prod_code;
    var mandatory_sec_field = result[0][mand_field_prodcode][0][mandatory_sec][0];
    console.log(mandatory_sec_field)
    var sec_var_str = JSON.stringify(mandatory_sec_field);
    var sec_var_json = JSON.parse(sec_var_str)
    for (var prop in sec_var_json) {
     console.log(prop)
      if (sec_var_json[prop] == false) {
        if(prop=='tfn' || prop=='exemption'){
          if(sec_var_json['exemption']==false && sec_var_json['tfn']==true){
            return callback('exemption', mandatory_sec);
          }else{
              return callback('tfn', mandatory_sec);
          }
        }else{
        return callback(prop, mandatory_sec);
      }
      }
    }
  },
  getMessage: function (field_t, callback) {
    var success = false;
    propDetails.findOne({ property_type: 'CHAT_MESSAGE', property: field_t }, function (err, result_mes) {
      if (err) {
        success = false;
        return callback("error occured", success);
      } else {
        console.log(result_mes)
        success = true;
        return callback(result_mes.property_value, success);
      }
    });
  },

  insertMissingField_test: function (req, callback) {
    var missingField = req.body.result.parameters['missingFieldData'];
    var senderid = req.body.originalRequest.data.sender['id'];
    var app_id = req.body.result.parameters['crn'];
    var field_var = req.body.result.parameters['field_var'];
    var skip_v=true;
    if(field_var=='tfn'|| field_var=='exemption' ){
      skip_v=false;
    }
    // if(field_var=='tfn' && (missingField=="No" || missingField=="NO" || missingField=="no")){

    // }
    var success;
    console.log(app_id + " " + [field_var] + " " + missingField)
    request.post({
      url: 'https://sample-latitude-dev-product.herokuapp.com/api/Applicants',
      form: {
        app_id: app_id,
        skip: skip_v,
        bot:true,
        [field_var]: missingField
      }
    }, function (err, body) {
      if (err) {
        console.log(err);
        return callback(success = "false");
      } else if (body) {
        var success = "true";
        console.log("body" + body);
        return callback(success);
      }
    });

  },
  updateStatus: function (req, callback) {
    var senderid = req.body.originalRequest.data.sender['id'];
    var crn = req.body.result.parameters['crn'];
    // request.post({
    //   url: 'https://sample-latitude-dev-product.herokuapp.com/mongoAPIRoutes/saveOrUpdateNextLoanDetailsForms321',
    //   form: { app_id: crn }
    // }, function (err, body) {
    //   if (err) {
    //     console.log(err);
    //     return callback(success = "false");
    //   } else if (body) {
    //     var success = "true";
    //     console.log("body" + body);
    //     return callback(success);
    //   }
    // });
    //call web api
    dbhelper.getApplicantsRecord(crn, function (result) {
        if(result){
          console.log(result)
        return callback(success = "true",result)
      }else{
        return callback(success = "false",result)
      }
    });
  },
  updateHelp: function (req, callback) {
    var senderid = req.body.originalRequest.data.sender['id'];
    var app_id = req.body.result.parameters['crn']
    var remainders = "bot_fields.noOfRemaindersSent"
    var contacted = "bot_fields.botContacted";
    oaoApplicant.findOneAndUpdate({ "bot_fields.socialId": senderid },
      { help_flg: 'Y', application_status: "SAV", "bot_fields.$.botContacted": 'Y', mod_time: Date.now(), "bot_fields.$.noOfRemaindersSent": '0' }, function (err, docs) {
        if (docs) {
          return callback(success = "true");
        } else if (err) {
          console.log("err " + err);
          return callback(success = "false");
        }

      })
  },
  updateReason: function (req, callback) {
    var senderid = req.body.originalRequest.data.sender['id'];
    var app_id = req.body.result.parameters['crn']
    var reason = req.body.result.parameters['reason'];
    var notinterested_reason = "bot_fields.notInterestedReason";
    var contacted = "bot_fields.botContacted";
    oaoApplicant.findOneAndUpdate({ "application_id": app_id },
      { "bot_fields.$.notInterestedReason": reason, "bot_fields.$.botContacted": 'Y', mod_time: Date.now(), application_status: "CAN" }, function (err, docs) {
        if (docs) {
          return callback(success = "true");
        } else if (err) {
          console.log("err " + err);
          return callback(success = "false");
        }

      })
  },
  updateContacted: function (sender_id, crn, remainders_v) {
    console.log("in updTE")
    var remainders = "bot_fields.noOfRemaindersSent"
    var contacted = "bot_fields.botContacted";
    oaoApplicant.findOneAndUpdate({ "application_id": crn },
      { "bot_fields.$.botContacted": 'Y', "mod_time": Date.now(), "bot_fields.$.noOfRemaindersSent": remainders_v }, function (err, docs) {
        if (docs) {
          console.log("Updated contact")
        } else if (err) {
          console.log("err " + err);
        }

      })
  },
}


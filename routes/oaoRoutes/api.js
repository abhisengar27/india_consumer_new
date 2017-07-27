var express = require('express');
var OAODBHelper = require("./OAODBHelper");

var OAOApplicantSchema = require('../../models/OAOApplicantSchema');

var OAOPropertyDetail = require('../../models/OAOPropertyDetail');

var OAOCityDetailsSchema = require('../../models/OAOCityDetailsSchema');

var OAOResidenceTypeSchema = require('../../models/OAOResidenceTypeSchema');

var OAOApplicationHelper = require("./OAOApplicationHelper.js");

var OAOEmployersSchema = require('../../models/OAOEmployersSchema');


var OAOVehicleDetailsSchema = require('../../models/OAOVehicleDetailsSchema');

var Twilio = require('twilio')('AC648253d94bd2979b66054939bb5eb55e', '0de091cc1390b4499132a9d40d09079c');

var OAOVehicleDetailsNewSchema = require('../../models/OAOVehicleDetailsNewSchema');


var OAOTypeOfEmploymentSchema = require('../../models/OAOTypeOfEmploymentSchema');

var OAORouter = express.Router();

var config = require("../../configFiles/DBconfigfile.json");

var device = require('express-device');

var appConfig = require('../../configFiles/appConfig');
var alfrescoConfig = appConfig.ALFRESCO;
var crypto = require('crypto');
var request = require('request');
var moment = require('moment');
var xmlToJson = require("xml2js");
var fs = require('fs');
var constants = require('./appConstants');
var mkdirp = require('mkdirp');
var Promise = require('bluebird');


/*
    To be uncommented 

// var twilio = require('twilio');
 
// // Find your account sid and auth token in your Twilio account Console.
// var client = twilio(' AC2c9e3ed2d5182304a8f396e076358c4c', 'b36922d05f4422fe339d997bc8c25f73');
 
// // Send the text message.
// client.sendMessage({
//   to: '7899918817',
//   from: '+16052994861',
//   body: 'Hello from Twilio!'
// });

*/

OAORouter.use(device.capture());

OAORouter.route('/sendOTP')
    .post(function (req, res) {
        try {
            OAODBHelper.getSavedRecord(req.body.mobile, req.body.dob, function (result, success) {

                if (success == true && (result !== null && result != '')) {
                    console.log(result)
                    if (result[0].dob == req.body.dob) {
                        OAOApplicationHelper.genOTP(function (otp) {
                            // OAODBHelper.getDropboxContent('GENERIC_PROP', 'EnableMsgMedia', function (Propdata) {
                            //     console.log(Propdata[0].property_value)
                            // if (Propdata[0].property_value == "Y") {
                            OAOApplicationHelper.sendOtpToMobile(req.body.mobile, otp, function (success) {
                                // console.log("success==>>:" + success)
                                // if (success) {
                                res.json({
                                    sent: true,
                                    success: true,
                                    result: result,
                                    savedApp: false
                                });
                                // }else{
                                //     res.json({
                                //     sent: false,
                                //     success: false,
                                //     result: result,
                                //     savedApp: false
                                // });
                                //}

                            });
                            //     }
                            // })

                        });
                    } else {
                        console.log("inside else")
                        res.json({
                            sent: false,
                            success: false,
                            savedApp: false
                        });
                    }

                } else {
                    res.json({
                        sent: false,
                        success: false,
                        savedApp: false
                    });
                }

            })

        } catch (e) {
            console.log("error in captha")
        }
    });


OAORouter.route('/sendOtpForVerification')
    .post(function (req, res) {
        console.log("inside this route");
        try {
            OAOApplicationHelper.genOTP(function (otp) {
                console.log('inside genOTP');
                // OAOApplicationHelper.sendOTPMessage(result[0], otp);
                console.log(req.body.email_m);
                OAOApplicationHelper.sendOtpToMail(req.body.email_m, otp, function (success) {


                    console.log(otp)
                    res.json({
                        sent: true,
                        success: true
                    });
                })
            });
        } catch (e) {
            console.log("error in otp verification");
            res.json({
                sent: false,
                success: false
            });
        }
    })

OAORouter.route('/sendMobileOTP')
    .post(function (req, res) {
        console.log("/sendMobileOTP ");
        console.log(req.body.mobile_number);
        OAOApplicationHelper.genOTP(function (otp) {
            OAOApplicationHelper.sendOtpToMobile(req.body.mobile_number, otp, function (success) {
                console.log("success==>>:" + success)
                res.json({
                    sent: success,
                });
            });

        });

    });


OAORouter.route('/verifyOTP')
    .post(function (req, res) {
        console.log("inside verifyOTP..");
        console.log("otp = " + req.body.varify_otp);
        OAOApplicationHelper.verifyOtp(req.body.varify_otp, function (success) {
            console.log(success)
            if (req.body.app_id != null && success) {

                req.session.app_id = req.body.app_id;
            }
            res.json({ success: success });
        });

    });

OAORouter.route('/getDecrypted')
    .post(function (req, res) {
        OAOApplicationHelper.decrypt(req.body.app_id, function (d_appId) {
            console.log(d_appId)
            res.json({ d_appId: d_appId });
        });

    });

OAORouter.route('/Applicants')
    .post(function (req, res) {
        var completed_by;
        console.log("existing_cust_status" + req.body.existing_cust_status) //chanda
        OAODBHelper.GenerateApplicationReferenceId(req, res, function (result) {
            var app_id_ = req.body.application_id || req.body.app_id || OAOApplicationHelper.RefIdFormater(Number(result.app_ref_id) + 1, req);

            //console.log("Admins is withing something"+req.body.adminId);
            var Oao_product_customer_details = new OAOApplicantSchema({
                product_code: req.body.product_code,
                campaign_id: req.body.campaign_id,
                product_type_code: req.body.product_type_code,
                singleORjoint: req.body.singleORjoint,
                deviceType: req.device.type,
                existing_cust_status: req.body.existing_cust_status,
                title: req.body.title,
                application_id: app_id_,
                fname: req.body.fname,
                mname: req.body.mname,
                lname: req.body.lname,
                dob: req.body.dob,
                email: req.body.email,
                mobile: req.body.mobile,
                is_aadhaar: req.body.is_aadhaar,
                aadhaar_number: req.body.aadhar,
                retrieved_aadhaar_number: req.body.retrieved_aadhaar_number,
                pan: req.body.pan,
                retrieved_pan_number: req.body.retrieved_pan_number,

                brokerid: req.body.brokerid,

                address: req.body.address,
                paddress: req.body.paddress,
                DLidState: req.body.DLidState,
                LNum: req.body.LNum,
                color: req.body.color,
                idnum: req.body.idnum,
                idstate: req.body.idstate,
                username: req.body.username,
                refnum: req.body.refnum,
                housenum: req.body.housenum,
                streetnum: req.body.streetnum,
                streetname: req.body.streetname,
                streettype: req.body.streettype,
                suburb: req.body.suburb,
                state: req.body.state,
                postcode: req.body.postcode,
                phousenum: req.body.phousenum,
                pstreetnum: req.body.pstreetnum,
                pstreetname: req.body.pstreetname,
                pstreettype: req.body.pstreettype,
                psuburb: req.body.psuburb,
                pstate: req.body.pstate,
                ppostcode: req.body.ppostcode,
                meidicarenum: req.body.meidicarenum,
                no_address_found_flag: req.body.no_address_found_flag,
                section_SAV: {},
                bot_fields: {},
                no_of_section: config.number_of_sections[req.body.product_type_code],
                Mandatory_fields_SAV: [{
                    section_1_fields: [{
                        lname: true,
                        fname: true,
                        dob: true,
                        email: true,
                        mobile: true,
                        address: false,

                        paddress: false

                    }],
                    section_2_fields: [{
                        pan: false,
                    }],
                    section_3_fields: [{

                    }]
                }]
            })
            OAODBHelper.checkExistingApplicant(req, res, function (result) {
                if (!result) {
                    OAODBHelper.save(Oao_product_customer_details, function (result) {
                        // OAODBHelper.UpdateApplicationReferenceIdGeneration(req, res, function (result) {

                        // })
                        //Send mail for Everyday
                        var data = {
                            'fname': result.fname,
                            'lname': result.lname
                        }

                        OAOApplicationHelper.SendMail(result.email, result.application_id, data, 'SAVE_SUBMISSION', function (callbackResult) {
                            console.log('Save submission mail sent status ', JSON.stringify(callbackResult));
                        })
                        res.json({ Result: result });
                    })

                } else if (result.section_SAV[0].section_1 == false) {
                    console.log("inside section 1 as false");
                    if (req.body.fname != null) {
                        result.singleORjoint = req.bodysingleORjoint
                        result.title = req.body.title
                        result.fname = req.body.fname
                        result.mname = req.body.mname
                        result.lname = req.body.lname
                        result.dob = req.body.dob
                        result.email = req.body.email,
                            result.brokerid = req.body.brokerid,
                            result.campaign_id = req.body.campaign_id,
                            result.mobile = req.body.mobile,
                            result.address = req.body.address,
                            result.paddress = req.body.paddress,
                            result.housenum = req.body.housenum,
                            result.streetnum = req.body.streetnum,
                            result.streetname = req.body.streetname,
                            result.streettype = req.body.streettype,
                            result.suburb = req.body.suburb,
                            result.state = req.body.state,
                            result.postcode = req.body.postcode,
                            result.phousenum = req.body.phousenum,
                            result.pstreetnum = req.body.pstreetnum,
                            result.pstreetname = req.body.pstreetname,
                            result.pstreettype = req.body.pstreettype,
                            result.psuburb = req.body.psuburb,
                            result.pstate = req.body.pstate,
                            result.ppostcode = req.body.ppostcode,
                            result.postal_home_address_flag = req.body.postal_home_address_flag,
                            result.no_address_found_flag = req.body.no_address_found_flag
                        if (req.body.postal_home_address_flag == false) {
                            result.paddress = req.body.address;
                            result.pstreetname = req.body.streetname;
                            result.ppostcode = req.body.postcode;
                            result.pstate = req.body.state;

                        }
                    }
                    // result.bot_fields[0].noOfRemaindersSent=req.body.remainder,//change

                    if (req.body.sec_1_v == true) {
                        result.section_SAV[0].section_1 = "true";
                        result.Mandatory_fields_SAV[0].section_1_fields[0].address = "true";
                        result.Mandatory_fields_SAV[0].section_1_fields[0].paddress = "true";
                        OAODBHelper.save(result, function (result) {

                            res.status(200).json({
                                message: 'Updated message',
                                Result: result
                            });
                        })
                    } else if (req.body.sec_1_v == false) {
                        result.section_SAV[0].section_1 = "false";
                        OAODBHelper.save(result, function (result) {

                            res.status(200).json({
                                message: 'Updated message',
                                Result: result
                            });
                        })
                    }


                } else if (result.section_SAV[0].section_2 == false) {
                    result.pan = req.body.pan;
                    result.retrieved_pan_number = req.body.retrieved_pan_number;
                    console.log("inside section 2 as false");

                    if (result.pan != null) {
                        result.section_SAV[0].section_3 = "false";
                        result.section_SAV[0].section_2 = "true";
                        result.Mandatory_fields_SAV[0].section_2_fields[0].pan = "true";

                        if (req.body.skip == true) {
                            console.log("in else")
                            if (req.body.is_admin) {
                                result.application_status = constants.ACTIVE;
                                result.section_SAV[0].section_3 = "false";
                            } else {
                                result.application_status = constants.COMPLETED;
                            }
                            result.completion_time = new Date();

                            if (req.body.adminId != undefined && req.body.adminId != "undefined") {
                                var update = {
                                    $push: {
                                        logs: { 'updated_time': new Date(), 'who': req.body.adminId, 'change_type': 6 }
                                    }
                                };
                                OAODBHelper.UpdateResumeTime(result.application_id, update, function (result) {
                                    console.log("Resume time updated");
                                    console.log(result);
                                });
                            }
                            //result.completed_by = req.body.adminId;
                            else {
                                var update = {
                                    $push: {
                                        logs: { 'updated_time': new Date(), 'who': "Applicant", 'change_type': 6 }
                                    }
                                };
                                OAODBHelper.UpdateResumeTime(result.application_id, update, function (result) {
                                    console.log("Resume time updated");
                                    console.log(result);
                                });

                            }
                            var data = {
                                'fname': result.fname,
                                'lname': result.lname,
                                'bsb_number': result.bank_bsb_number,
                                'core_customer_id': result.core_customer_id,
                                'core_account_number': result.core_account_number,
                                'product_type': result.product_type_code,
                                'application_status': result.application_status
                            }
                            /////////////// Start of Verification Check

                            // If Verfication (Auto) - true 
                            //Change the status to verified
                            //If Onboarding (Auto) - true {
                            console.log(req.body.verification_auto);
                            console.log(result.verification_auto);
                            if (req.body.verification_auto == true) {
                                result.application_status = constants.VERIFIED;


                                OAOApplicationHelper.BSB_Number(function (CallBackResult) {
                                    result.bank_bsb_number = CallBackResult;
                                })


                                if (req.body.existing_cust_status != "Y") {
                                    OAOApplicationHelper.Gen_custId(function (CallBackResult) {
                                        result.core_customer_id = CallBackResult;
                                        //OAOApplicationHelper.updateCimsProperties(result.application_id, CallBackResult);
                                    })
                                } else {
                                    result.core_customer_id = req.body.core_customer_id;
                                    //OAOApplicationHelper.updateCimsProperties(result.application_id, req.body.core_customer_id);
                                }

                                OAOApplicationHelper.Gen_coreAcc_no(function (CallBackResult) {
                                    result.core_account_number = CallBackResult;
                                })
                                //gathering data to render

                                console.log('Savings Account Data', JSON.stringify(data));
                                //final submission mail
                                OAOApplicationHelper.SendMail(result.email, result.application_id, data, 'FINAL_SUBMISSION', function (callbackResult) {
                                    console.log('Savings Account final submission mail sent', JSON.stringify(callbackResult));
                                })
                                result.application_status = constants.ONBOARDED;

                            }

                            if (result.application_status == constants.VERIFIED || result.application_status == constants.COMPLETED) {
                                OAOApplicationHelper.SendMail(result.email, result.application_id, data, 'FINAL_SUBMISSION', function (callbackResult) {
                                    console.log('Application successfully processed', JSON.stringify(callbackResult));
                                })
                            }
                            /////// 
                            /// Change the status to Onboarded ...} End for Verification check
                            /// If the status is CMP/constants.VERIFIED, then  Use Home loan mail template as submitte for processing

                            OAODBHelper.save(result, function (result) {
                                res.status(200).json({
                                    message: 'Updated message',
                                    Result: result
                                });
                            })

                        } else {
                            OAODBHelper.save(result, function (result) {
                                res.status(200).json({
                                    message: 'Updated message',
                                    Result: result
                                });
                            })
                        }
                    }

                } else if (result.section_SAV[0].section_3 == false) {
                    console.log("inside section 3 as false");
                    if (req.body.skip == true) {
                        console.log("in else")
                        result.section_SAV[0].section_3 = "true";
                        if (req.body.is_admin) {
                            result.application_status = constants.ACTIVE;
                            result.section_SAV[0].section_3 = "false";
                        } else {
                            result.application_status = constants.COMPLETED;
                        }
                        result.completion_time = new Date();

                        if (req.body.adminId != undefined && req.body.adminId != "undefined") {
                            var update = {
                                $push: {
                                    logs: { 'updated_time': new Date(), 'who': req.body.adminId, 'change_type': 6 }
                                }
                            };
                            OAODBHelper.UpdateResumeTime(result.application_id, update, function (result) {
                                console.log("Resume time updated");
                                console.log(result);
                            });
                        }
                        //result.completed_by = req.body.adminId;
                        else {
                            var update = {
                                $push: {
                                    logs: { 'updated_time': new Date(), 'who': "Applicant", 'change_type': 6 }
                                }
                            };
                            OAODBHelper.UpdateResumeTime(result.application_id, update, function (result) {
                                console.log("Resume time updated");
                                console.log(result);
                            });

                        }
                        var data = {
                            'fname': result.fname,
                            'lname': result.lname,
                            'bsb_number': result.bank_bsb_number,
                            'core_customer_id': result.core_customer_id,
                            'core_account_number': result.core_account_number,
                            'product_type': result.product_type_code,
                            'application_status': result.application_status
                        }
                        /////////////// Start of Verification Check

                        // If Verfication (Auto) - true 
                        //Change the status to verified
                        //If Onboarding (Auto) - true {
                        console.log(req.body.verification_auto);
                        console.log(result.verification_auto);
                        if (req.body.verification_auto == true) {
                            result.application_status = constants.VERIFIED;
                            OAOApplicationHelper.BSB_Number(function (CallBackResult) {
                                result.bank_bsb_number = CallBackResult;
                            })
                            if (req.body.existing_cust_status != "Y") {
                                OAOApplicationHelper.Gen_custId(function (CallBackResult) {
                                    result.core_customer_id = CallBackResult;
                                    //OAOApplicationHelper.updateCimsProperties(result.application_id, CallBackResult);
                                })
                            } else {
                                result.core_customer_id = req.body.core_customer_id;
                                //OAOApplicationHelper.updateCimsProperties(result.application_id, req.body.core_customer_id);
                            }

                            OAOApplicationHelper.Gen_coreAcc_no(function (CallBackResult) {
                                result.core_account_number = CallBackResult;
                            })
                            //gathering data to render

                            console.log('Savings Account Data', JSON.stringify(data));
                            //final submission mail
                            OAOApplicationHelper.SendMail(result.email, result.application_id, data, 'FINAL_SUBMISSION', function (callbackResult) {
                                console.log('Savings Account final submission mail sent', JSON.stringify(callbackResult));
                            })
                            result.application_status = constants.ONBOARDED;

                        }

                        if (result.application_status == constants.VERIFIED || result.application_status == constants.COMPLETED) {
                            OAOApplicationHelper.SendMail(result.email, result.application_id, data, 'FINAL_SUBMISSION', function (callbackResult) {
                                console.log('Application successfully processed', JSON.stringify(callbackResult));
                            })
                        }
                        /////// 
                        /// Change the status to Onboarded ...} End for Verification check
                        /// If the status is CMP/constants.VERIFIED, then  Use Home loan mail template as submitte for processing

                        OAODBHelper.save(result, function (result) {
                            res.status(200).json({
                                message: 'Updated message',
                                Result: result
                            });
                        })

                    } else {

                        /** here we will save details from docs upload screen */
                        console.log("tttetstsj")
                        console.log(result);
                        OAODBHelper.save(Oao_product_customer_details, function (result) {
                            res.status(200).json({
                                message: 'Updated message',
                                Result: result
                            });
                        })
                        //}
                    }
                } else {
                    res.status(404).json({
                        message: 'Page Not found',

                    });

                }


            })
        })
    });




//Salary Account
OAORouter.route('/salaryApplication')
    .post(function (req, res) {
        console.log("salaryApplication");
        var completed_by;
        console.log("existing_cust_status" + req.body.existing_cust_status) //chanda
        OAODBHelper.GenerateApplicationReferenceId(req, res, function (result) {
            console.log("sequence generator data", result, req.body);
            var app_id_ = req.body.application_id || OAOApplicationHelper.RefIdFormater(Number(result.app_ref_id) + 1, req);
            var Oao_product_customer_details = new OAOApplicantSchema({
                product_code: req.body.product_code,
                campaign_id: req.body.campaign_id,
                product_type_code: req.body.product_type_code,
                singleORjoint: req.body.singleORjoint,
                deviceType: req.device.type,
                existing_cust_status: req.body.existing_cust_status,
                title: req.body.title,
                application_id: app_id_,
                fname: req.body.fname,
                mname: req.body.mname,
                lname: req.body.lname,
                dob: req.body.dob,
                employer: req.body.employer,
                employer_email: req.body.employer_email,
                employment_letter: req.body.employment_letter,
                email: req.body.email,
                mobile: req.body.mobile,
                is_aadhaar: req.body.is_aadhaar,
                aadhaar_number: req.body.aadhar,
                retrieved_aadhaar_number: req.body.retrieved_aadhaar_number,
                pan: req.body.pan,
                brokerid: req.body.brokerid,
                address: req.body.address,
                paddress: req.body.paddress,
                username: req.body.username,
                refnum: req.body.refnum,
                housenum: req.body.housenum,
                streetnum: req.body.streetnum,
                streetname: req.body.streetname,
                streettype: req.body.streettype,
                suburb: req.body.suburb,
                state: req.body.state,
                postcode: req.body.postcode,
                phousenum: req.body.phousenum,
                pstreetnum: req.body.pstreetnum,
                pstreetname: req.body.pstreetname,
                pstreettype: req.body.pstreettype,
                psuburb: req.body.psuburb,
                pstate: req.body.pstate,
                ppostcode: req.body.ppostcode,
                no_address_found_flag: req.body.no_address_found_flag,
                section_SAL: {},
                bot_fields: {},
                no_of_section: config.number_of_sections[req.body.product_type_code],
                Mandatory_fields_SAL: [{
                    section_1_fields: [{
                        lname: true,
                        fname: true,
                        dob: true,
                        email: true,
                        mobile: true,
                        address: false,
                        paddress: false
                    }],
                    section_2_fields: [{
                        employer: false
                    }],
                    section_3_fields: [{
                        pan: false
                    }],
                    section_4_fields: [{

                    }]
                }]
            })
            OAODBHelper.checkExistingApplicant(req, res, function (result) {
                if (!result) {
                    OAODBHelper.save(Oao_product_customer_details, function (result) {
                        //Send mail for Everyday
                        var data = {
                            'fname': result.fname,
                            'lname': result.lname
                        }
                        OAOApplicationHelper.SendMail(result.email, result.application_id, data, 'SAVE_SUBMISSION', function (callbackResult) {
                            console.log('Save submission mail sent status ', JSON.stringify(callbackResult));
                        })
                        res.json({ Result: result });
                    })
                } else if (result.section_SAL[0].section_1 == false) {
                    console.log("inside section 1 as false");
                    if (req.body.fname != null) {
                        result.singleORjoint = req.bodysingleORjoint
                        result.title = req.body.title
                        result.fname = req.body.fname
                        result.mname = req.body.mname
                        result.lname = req.body.lname
                        result.dob = req.body.dob
                        result.employer = req.body.employer,
                            result.employer_email = req.body.employer_email,
                            result.email = req.body.email,
                            result.employer = req.body.employer,
                            result.employer_email = req.body.employer_email,
                            result.brokerid = req.body.brokerid,
                            result.campaign_id = req.body.campaign_id,
                            result.mobile = req.body.mobile,
                            result.address = req.body.address,
                            result.paddress = req.body.paddress,
                            result.housenum = req.body.housenum,
                            result.streetnum = req.body.streetnum,
                            result.streetname = req.body.streetname,
                            result.streettype = req.body.streettype,
                            result.suburb = req.body.suburb,
                            result.state = req.body.state,
                            result.postcode = req.body.postcode,
                            result.phousenum = req.body.phousenum,
                            result.pstreetnum = req.body.pstreetnum,
                            result.pstreetname = req.body.pstreetname,
                            result.pstreettype = req.body.pstreettype,
                            result.psuburb = req.body.psuburb,
                            result.pstate = req.body.pstate,
                            result.ppostcode = req.body.ppostcode,
                            result.postal_home_address_flag = req.body.postal_home_address_flag,
                            result.no_address_found_flag = req.body.no_address_found_flag
                        if (req.body.postal_home_address_flag == false) {
                            result.paddress = req.body.address;
                            result.pstreetname = req.body.streetname;
                            result.ppostcode = req.body.postcode;
                            result.pstate = req.body.state;
                        }
                    }
                    if (req.body.sec_1_v == true) {
                        result.section_SAL[0].section_1 = "true";
                        result.Mandatory_fields_SAL[0].section_1_fields[0].address = "true";
                        result.Mandatory_fields_SAL[0].section_1_fields[0].paddress = "true";
                        OAODBHelper.save(result, function (result) {
                            res.status(200).json({
                                message: 'Updated message',
                                Result: result
                            });
                        })
                    } else if (req.body.sec_1_v == false) {
                        result.section_SAL[0].section_1 = "false";
                        OAODBHelper.save(result, function (result) {
                            res.status(200).json({
                                message: 'Updated message',
                                Result: result
                            });
                        })
                    }
                }//sec1
                else if (result.section_SAL[0].section_2 == false) {
                    console.log("inside section 2 as false");
                    result.employment_letter = req.body.employment_letter;
                    if (result.employment_letter == true) {
                        result.section_SAL[0].section_3 = "false";
                        result.section_SAL[0].section_2 = "true";
                        result.Mandatory_fields_SAL[0].section_2_fields[0].employment_letter = "true";
                        OAODBHelper.save(result, function (result) {
                            res.status(200).json({
                                message: 'Updated message',
                                Result: result
                            });
                        })
                    }

                } //sec2

                else if (result.section_SAL[0].section_3 == false) {
                    console.log("inside section 3 as false");
                    result.pan = req.body.pan;
                    if (result.pan != null) {

                        result.section_SAL[0].section_4 = "false";
                        result.section_SAL[0].section_3 = "true";
                        result.Mandatory_fields_SAL[0].section_3_fields[0].pan = "true";

                        if (req.body.skip == true) {
                            console.log("in else")
                            if (req.body.is_admin) {
                                result.application_status = constants.ACTIVE;
                                result.section_SAL[0].section_4 = "false";
                            } else {
                                result.application_status = constants.COMPLETED;
                            }
                            result.completion_time = new Date();

                            if (req.body.adminId != undefined && req.body.adminId != "undefined") {
                                var update = {
                                    $push: {
                                        logs: { 'updated_time': new Date(), 'who': req.body.adminId, 'change_type': 6 }
                                    }
                                };
                                OAODBHelper.UpdateResumeTime(result.application_id, update, function (result) {
                                    console.log("Resume time updated");
                                    console.log(result);
                                });
                            }
                            //result.completed_by = req.body.adminId;
                            else {
                                var update = {
                                    $push: {
                                        logs: { 'updated_time': new Date(), 'who': "Applicant", 'change_type': 6 }
                                    }
                                };
                                OAODBHelper.UpdateResumeTime(result.application_id, update, function (result) {
                                    console.log("Resume time updated");
                                    console.log(result);
                                });

                            }
                            var data = {
                                'fname': result.fname,
                                'lname': result.lname,
                                'bsb_number': result.bank_bsb_number,
                                'core_customer_id': result.core_customer_id,
                                'core_account_number': result.core_account_number,
                                'product_type': result.product_type_code,
                                'application_status': result.application_status
                            }
                            /////////////// Start of Verification Check

                            // If Verfication (Auto) - true 
                            //Change the status to verified
                            //If Onboarding (Auto) - true {
                            console.log(req.body.verification_auto);
                            console.log(result.verification_auto);
                            if (req.body.verification_auto == true) {
                                result.application_status = constants.VERIFIED;


                                OAOApplicationHelper.BSB_Number(function (CallBackResult) {
                                    result.bank_bsb_number = CallBackResult;
                                })


                                if (req.body.existing_cust_status != "Y") {
                                    OAOApplicationHelper.Gen_custId(function (CallBackResult) {
                                        result.core_customer_id = CallBackResult;
                                        //OAOApplicationHelper.updateCimsProperties(result.application_id, CallBackResult);
                                    })
                                } else {
                                    result.core_customer_id = req.body.core_customer_id;
                                    //OAOApplicationHelper.updateCimsProperties(result.application_id, req.body.core_customer_id);
                                }

                                OAOApplicationHelper.Gen_coreAcc_no(function (CallBackResult) {
                                    result.core_account_number = CallBackResult;
                                })
                                //gathering data to render

                                console.log('Savings Account Data', JSON.stringify(data));
                                //final submission mail
                                OAOApplicationHelper.SendMail(result.email, result.application_id, data, 'FINAL_SUBMISSION', function (callbackResult) {
                                    console.log('Savings Account final submission mail sent', JSON.stringify(callbackResult));
                                })
                                result.application_status = constants.ONBOARDED;

                            }

                            if (result.application_status == constants.VERIFIED || result.application_status == constants.COMPLETED) {
                                OAOApplicationHelper.SendMail(result.email, result.application_id, data, 'FINAL_SUBMISSION', function (callbackResult) {
                                    console.log('Application successfully processed', JSON.stringify(callbackResult));
                                })
                            }
                            /////// 
                            /// Change the status to Onboarded ...} End for Verification check
                            /// If the status is CMP/constants.VERIFIED, then  Use Home loan mail template as submitte for processing

                            OAODBHelper.save(result, function (result) {
                                res.status(200).json({
                                    message: 'Updated message',
                                    Result: result
                                });
                            })

                        } else {
                            OAODBHelper.save(result, function (result) {
                                res.status(200).json({
                                    message: 'Updated message',
                                    Result: result
                                });
                            })
                        }

                    } else {
                        res.status(404).json({
                            message: 'Page Not found',

                        });

                    }
                }//sec3
                else if (result.section_SAL[0].section_4 == false) {
                    //generate CoreAccountNumber and core_customer_id

                    if (req.body.skip == true) {
                        console.log("in else")
                        result.section_SAL[0].section_4 = "true";
                        if (req.body.is_admin) {
                            result.application_status = constants.ACTIVE;
                            result.section_SAL[0].section_4 = "false";
                        } else {
                            result.application_status = constants.COMPLETED;
                        }
                        result.completion_time = new Date();

                        if (req.body.adminId != undefined && req.body.adminId != "undefined") {
                            var update = {
                                $push: {
                                    logs: { 'updated_time': new Date(), 'who': req.body.adminId, 'change_type': 6 }
                                }
                            };
                            OAODBHelper.UpdateResumeTime(result.application_id, update, function (result) {
                                console.log("Resume time updated");
                                console.log(result);
                            });
                        }
                        //result.completed_by = req.body.adminId;
                        else {
                            var update = {
                                $push: {
                                    logs: { 'updated_time': new Date(), 'who': "Applicant", 'change_type': 6 }
                                }
                            };
                            OAODBHelper.UpdateResumeTime(result.application_id, update, function (result) {
                                console.log("Resume time updated");
                                console.log(result);
                            });

                        }
                        var data = {
                            'fname': result.fname,
                            'lname': result.lname,
                            'bsb_number': result.bank_bsb_number,
                            'core_customer_id': result.core_customer_id,
                            'core_account_number': result.core_account_number,
                            'product_type': result.product_type_code,
                            'application_status': result.application_status
                        }
                        /////////////// Start of Verification Check

                        // If Verfication (Auto) - true 
                        //Change the status to verified
                        //If Onboarding (Auto) - true {
                        console.log(req.body.verification_auto);
                        console.log(result.verification_auto);
                        if (req.body.verification_auto == true) {
                            result.application_status = constants.VERIFIED;
                            OAOApplicationHelper.BSB_Number(function (CallBackResult) {
                                result.bank_bsb_number = CallBackResult;
                            })
                            if (req.body.existing_cust_status != "Y") {
                                OAOApplicationHelper.Gen_custId(function (CallBackResult) {
                                    result.core_customer_id = CallBackResult;
                                    //OAOApplicationHelper.updateCimsProperties(result.application_id, CallBackResult);
                                })
                            } else {
                                result.core_customer_id = req.body.core_customer_id;
                                //OAOApplicationHelper.updateCimsProperties(result.application_id, req.body.core_customer_id);
                            }

                            OAOApplicationHelper.Gen_coreAcc_no(function (CallBackResult) {
                                result.core_account_number = CallBackResult;
                            })
                            //gathering data to render

                            console.log('Savings Account Data', JSON.stringify(data));
                            //final submission mail
                            OAOApplicationHelper.SendMail(result.email, result.application_id, data, 'FINAL_SUBMISSION', function (callbackResult) {
                                console.log('Savings Account final submission mail sent', JSON.stringify(callbackResult));
                            })
                            result.application_status = constants.ONBOARDED;

                        }

                        if (result.application_status == constants.VERIFIED || result.application_status == constants.COMPLETED) {
                            OAOApplicationHelper.SendMail(result.email, result.application_id, data, 'FINAL_SUBMISSION', function (callbackResult) {
                                console.log('Application successfully processed', JSON.stringify(callbackResult));
                            })
                        }
                        /////// 
                        /// Change the status to Onboarded ...} End for Verification check
                        /// If the status is CMP/constants.VERIFIED, then  Use Home loan mail template as submitte for processing

                        OAODBHelper.save(result, function (result) {
                            res.status(200).json({
                                message: 'Updated message',
                                Result: result
                            });
                        })

                    } else {

                        /** here we will save details from docs upload screen */
                        console.log("tttetstsj")
                        console.log(result);
                        OAODBHelper.save(Oao_product_customer_details, function (result) {
                            res.status(200).json({
                                message: 'Updated message',
                                Result: result
                            });
                        })
                        //}
                    }

                }//sec4

            })//checkExistingApplicant
        })//application
    })//api

//salaryApplication

OAORouter.route('/vehicleLoanApplication')
    .post(function (req, res) {
        var completed_by;
        console.log("existing_cust_status" + req.body.existing_cust_status) //chanda
        OAODBHelper.GenerateApplicationReferenceId(req, res, function (result) {
            var app_id_ = req.body.application_id || req.body.app_id || OAOApplicationHelper.RefIdFormater(Number(result.app_ref_id) + 1, req);

            //console.log("Admins is withing something"+req.body.adminId);
            var Oao_product_customer_details = new OAOApplicantSchema({
                product_code: req.body.product_code,
                campaign_id: req.body.campaign_id,
                product_type_code: req.body.product_type_code,
                singleORjoint: req.body.singleORjoint,
                deviceType: req.device.type,
                existing_cust_status: req.body.existing_cust_status,
                title: req.body.title,
                application_id: app_id_,
                fname: req.body.fname,
                mname: req.body.mname,
                lname: req.body.lname,
                dob: req.body.dob,
                email: req.body.email,
                mobile: req.body.mobile,
                is_aadhaar: req.body.is_aadhaar,
                aadhaar_number: req.body.aadhar,
                retrieved_aadhaar_number: req.body.retrieved_aadhaar_number,
                pan: req.body.pan,
                retrieved_pan_number: req.body.retrieved_pan_number,

                brokerid: req.body.brokerid,

                address: req.body.address,
                paddress: req.body.paddress,
                DLidState: req.body.DLidState,
                LNum: req.body.LNum,
                color: req.body.color,
                idnum: req.body.idnum,
                idstate: req.body.idstate,
                username: req.body.username,
                refnum: req.body.refnum,
                housenum: req.body.housenum,
                streetnum: req.body.streetnum,
                streetname: req.body.streetname,
                streettype: req.body.streettype,
                suburb: req.body.suburb,
                state: req.body.state,
                postcode: req.body.postcode,
                phousenum: req.body.phousenum,
                pstreetnum: req.body.pstreetnum,
                pstreetname: req.body.pstreetname,
                pstreettype: req.body.pstreettype,
                psuburb: req.body.psuburb,
                pstate: req.body.pstate,
                ppostcode: req.body.ppostcode,
                meidicarenum: req.body.meidicarenum,

                fatherName: req.body.fatherName,
                noOfDependents: req.body.noOfDependents,
                maritalStatus: req.body.maritalStatus,
                gender: req.body.gender,

                designation: req.body.designation,
                workEmailId: req.body.workEmailId,
                buildingNo: req.body.buildingNo,
                workaddress: req.body.workaddress,
                officeLandLine: req.body.officeLandLine,

                currentResidence: req.body.currentResidence,
                residence_month: req.body.residence_month,
                ResidenceType: req.body.ResidenceType,
                vehicleLoanType: req.body.vehicleLoanType,
                vehicle_make: req.body.vehicle_make,
                vehicle_onroad_price: req.body.vehicle_onroad_price,
                employertype: req.body.employertype,
                netIncome: req.body.netIncome,
                Work_experience: req.body.Work_experience,
                noMonths: req.body.noMonths,
                monthlyEmiRange: req.body.monthlyEmiRange,
                loanTermRange: req.body.loanTermRange,
                loanAmountRange: req.body.loanAmountRange,
                employer: req.body.employer,
                vehicle_onroad_price: req.body.vehicle_onroad_price,
                interestPayable: req.body.interestPayable,
                totalPayableAmount: req.body.totalPayableAmount,

                no_address_found_flag: req.body.no_address_found_flag,
                section_LAA: {},
                bot_fields: {},
                no_of_section: config.number_of_sections[req.body.product_type_code],
                Mandatory_fields_LAA: [{
                    section_1_fields: [{
                        lname: true,
                        fname: true,
                        dob: true,
                        email: true,
                        mobile: true,
                        fatherName: true,
                        employer: true,
                        address: false,
                        paddress: false,
                        currentResidence: false,
                        ResidenceType: false

                    }],
                    section_2_fields: [{

                        designation: false,
                        workEmailId: false,
                        buildingNo: false,
                        workaddress: false,
                    }],
                    section_3_fields: [{

                    }]
                }]
            })
            OAODBHelper.checkExistingApplicant(req, res, function (result) {
                if (!result) {
                    OAODBHelper.save(Oao_product_customer_details, function (result) {
                        // OAODBHelper.UpdateApplicationReferenceIdGeneration(req, res, function (result) {

                        // })
                        //Send mail for Everyday
                        var data = {
                            'fname': result.fname,
                            'lname': result.lname
                        }

                        OAOApplicationHelper.SendMail(result.email, result.application_id, data, 'SAVE_SUBMISSION', function (callbackResult) {
                            console.log('Save submission mail sent status ', JSON.stringify(callbackResult));
                        })
                        res.json({ Result: result });
                    })

                    
                } else if (result.section_LAA[0].section_1 == false) {
                    console.log("inside section 1 as false");
                    if (req.body.fname != null) {
                        result.singleORjoint = req.bodysingleORjoint
                        result.title = req.body.title
                        result.fname = req.body.fname
                        result.mname = req.body.mname
                        result.lname = req.body.lname
                        result.dob = req.body.dob
                        result.email = req.body.email,
                            result.brokerid = req.body.brokerid,
                            result.campaign_id = req.body.campaign_id,
                            result.mobile = req.body.mobile,
                            result.address = req.body.address,
                            result.paddress = req.body.paddress,
                            result.housenum = req.body.housenum,
                            result.streetnum = req.body.streetnum,
                            result.streetname = req.body.streetname,
                            result.streettype = req.body.streettype,
                            result.suburb = req.body.suburb,
                            result.state = req.body.state,
                            result.postcode = req.body.postcode,
                            result.phousenum = req.body.phousenum,
                            result.pstreetnum = req.body.pstreetnum,
                            result.pstreetname = req.body.pstreetname,
                            result.pstreettype = req.body.pstreettype,
                            result.psuburb = req.body.psuburb,
                            result.pstate = req.body.pstate,
                            result.ppostcode = req.body.ppostcode,
                            result.postal_home_address_flag = req.body.postal_home_address_flag,
                            result.no_address_found_flag = req.body.no_address_found_flag,
                            result.fatherName = req.body.fatherName,
                            result.noOfDependents = req.body.noOfDependents,
                            result.maritalStatus = req.body.maritalStatus,
                            result.gender = req.body.gender,
                            result.currentResidence = req.body.currentResidence,
                            result.residence_month = req.body.residence_month,
                            result.ResidenceType = req.body.ResidenceType,
                            result.vehicleLoanType = req.body.vehicleLoanType,
                            result.vehicle_make = req.body.vehicle_make,
                            result.vehicle_onroad_price = req.body.vehicle_onroad_price,
                            result.employertype = req.body.employertype,
                            result.netIncome = req.body.netIncome,
                            result.Work_experience = req.body.Work_experience,
                            result.noMonths = req.body.noMonths,
                            result.monthlyEmiRange = req.body.monthlyEmiRange,
                            result.loanTermRange = req.body.loanTermRange,
                            result.loanAmountRange = req.body.loanAmountRange,
                            result.employer = req.body.employer,
                            result.designation = req.body.designation,
                            result.workEmailId = req.body.workEmailId,
                            result.buildingNo = req.body.buildingNo,
                            result.workaddress = req.body.workaddress,
                            result.officeLandLine = req.body.officeLandLine,
                            result.vehicle_onroad_price = req.body.vehicle_onroad_price,
                            result.interestPayable = req.body.interestPayable,
                            result.totalPayableAmount = req.body.totalPayableAmount
                        if (req.body.postal_home_address_flag == false) {
                            result.paddress = req.body.address;
                            result.pstreetname = req.body.streetname;
                            result.ppostcode = req.body.postcode;
                            result.pstate = req.body.state;

                        }
                    }
                    // result.bot_fields[0].noOfRemaindersSent=req.body.remainder,//change

                    if (req.body.sec_1_v == true) {
                        result.section_LAA[0].section_1 = "true";
                        result.section_LAA[0].section_2 = "true";
                        result.section_LAA[0].section_3 = "true";
                        result.section_LAA[0].section_4 = "true";
                        result.Mandatory_fields_LAA[0].section_1_fields[0].address = "true";
                        result.Mandatory_fields_LAA[0].section_1_fields[0].paddress = "true";
                        OAODBHelper.save(result, function (result) {

                            res.status(200).json({
                                message: 'Updated message',
                                Result: result
                            });
                        })
                    } else if (req.body.sec_1_v == false) {
                        result.section_LAA[0].section_1 = "false";
                        result.section_LAA[0].section_2 = "false";
                        result.section_LAA[0].section_3 = "false";
                        result.section_LAA[0].section_4 = "false";
                        OAODBHelper.save(result, function (result) {

                            res.status(200).json({
                                message: 'Updated message',
                                Result: result
                            });
                        })
                    }


                } else if (result.section_LAA[0].section_5 == false) {
                    result.designation = req.body.designation;
                    result.workEmailId = req.body.workEmailId,
                        result.buildingNo = req.body.buildingNo,
                        result.workaddress = req.body.workaddress,
                        console.log("inside section 2 as false");

                    if (result.designation != null && result.workEmailId != null && result.buildingNo != null && result.workaddress != null) {
                        result.section_LAA[0].section_6 = "false";
                        result.section_LAA[0].section_5 = "true";
                        // if (req.body.bot == 'true') {
                        //     if (result.tfn == "No" || result.tfn == "NO" || result.tfn == "no") {
                        //         result.Mandatory_fields_SAV[0].section_2_fields[0].tfn = "true";
                        //         result.Mandatory_fields_SAV[0].section_2_fields[0].exemption = "false";
                        //         result.section_SAV[0].section_2 = "false";
                        //     } else {
                        //         result.section_SAV[0].section_2 = "true";
                        //         result.section_SAV[0].section_3 = "false";
                        //         result.deviceType = "bot";
                        //         if (req.body.is_admin == true) {
                        //             result.application_status = "SAV";
                        //         } else {
                        //             result.application_status = "CMP";
                        //         }

                        //         result.completion_time = new Date();
                        //         if (req.body.adminId != undefined && req.body.adminId != "undefined") {
                        //             var update = {
                        //                 $push: {
                        //                     logs: { 'updated_time': new Date(), 'who': req.body.adminId, 'change_type': 6 }
                        //                 }
                        //             };
                        //             OAODBHelper.UpdateResumeTime(result.application_id, update, function(result) {
                        //                 console.log("Resume time updated");
                        //                 console.log(result);
                        //             });
                        //         }
                        //         //result.completed_by = req.body.adminId;
                        //         else {
                        //             var update = {
                        //                 $push: {
                        //                     logs: { 'updated_time': new Date(), 'who': "Applicant", 'change_type': 6 }
                        //                 }
                        //             };
                        //             OAODBHelper.UpdateResumeTime(result.application_id, update, function(result) {
                        //                 console.log("Resume time updated");
                        //                 console.log(result);
                        //             });

                        //         }
                        //         //result.completed_by = "Applicant";

                        //         OAOApplicationHelper.SendMail(result.email, result.application_id, function(callbackResult) {})
                        //         OAOApplicationHelper.BSB_Number(function(CallBackResult) {
                        //             result.bank_bsb_number = CallBackResult;
                        //         })
                        //         console.log("req.body.core_customer_id:");
                        //         if (req.body.existing_cust_status != "Y") {
                        //             OAOApplicationHelper.Gen_custId(function(CallBackResult) {
                        //                 result.core_customer_id = CallBackResult;
                        //                 OAOApplicationHelper.updateCimsProperties(result.application_id, CallBackResult);
                        //             })
                        //         } else {
                        //             result.core_customer_id = req.body.core_customer_id;
                        //             OAOApplicationHelper.updateCimsProperties(result.application_id, CallBackResult);
                        //         }
                        //         OAOApplicationHelper.Gen_coreAcc_no(function(CallBackResult) {
                        //             result.core_account_number = CallBackResult;
                        //         })

                        //     }

                        // }
                        OAODBHelper.save(result, function (result) {

                            res.status(200).json({
                                message: 'Updated message',
                                Result: result
                            });
                        })
                    } else {
                        OAODBHelper.save(result, function (result) {

                            res.status(200).json({
                                message: 'Updated message',
                                Result: result
                            });
                        })
                    }

                    //  else
                    // if (req.body.skip == true) {
                    //     console.log("in else")
                    //     result.section_SAV[0].section_2 = "true";
                    //     result.section_SAV[0].section_3 = "false";
                    //     if (req.body.is_admin == true) {
                    //         result.application_status = "SAV";
                    //     } else {
                    //         result.application_status = "CMP";
                    //     }
                    //     result.completion_time = new Date();
                    //     if (req.body.adminId != undefined && req.body.adminId != "undefined") {
                    //         var update = {
                    //             $push: {
                    //                 logs: { 'updated_time': new Date(), 'who': req.body.adminId, 'change_type': 6 }
                    //             }
                    //         };
                    //         OAODBHelper.UpdateResumeTime(result.application_id, update, function(result) {
                    //             console.log("Resume time updated");
                    //             console.log(result);
                    //         });
                    //     }
                    //     //result.completed_by = req.body.adminId;
                    //     else {
                    //         var update = {
                    //             $push: {
                    //                 logs: { 'updated_time': new Date(), 'who': "Applicant", 'change_type': 6 }
                    //             }
                    //         };
                    //         OAODBHelper.UpdateResumeTime(result.application_id, update, function(result) {
                    //             console.log("Resume time updated");
                    //             console.log(result);
                    //         });
                    //     }

                    //     OAOApplicationHelper.BSB_Number(function(CallBackResult) {
                    //         result.bank_bsb_number = CallBackResult;
                    //     })

                    //     if (req.body.existing_cust_status != "Y") {
                    //         OAOApplicationHelper.Gen_custId(function(CallBackResult) {
                    //             result.core_customer_id = CallBackResult;
                    //             OAOApplicationHelper.updateCimsProperties(result.application_id, CallBackResult);
                    //         })
                    //     } else {
                    //         result.core_customer_id = req.body.core_customer_id;
                    //         OAOApplicationHelper.updateCimsProperties(result.application_id, CallBackResult);
                    //     }

                    //     OAOApplicationHelper.Gen_coreAcc_no(function(CallBackResult) {
                    //             result.core_account_number = CallBackResult;
                    //         })
                    //         //gathering data to render
                    //     var data = {
                    //         'fname': result.fname,
                    //         'lname': result.lname,
                    //         'bsb_number': result.bank_bsb_number,
                    //         'core_customer_id': result.core_customer_id,
                    //         'core_account_number': result.core_account_number,
                    //         'product_type': result.product_type
                    //     }
                    //     console.log('Everyday Account Data', JSON.stringify(data));
                    //     //final submission mail
                    //     OAOApplicationHelper.SendMail(result.email, result.application_id, data, 'FINAL_SUBMISSION', function(callbackResult) {
                    //         console.log('Everyday Account final submission mail sent', JSON.stringify(callbackResult));
                    //     })


                    //     OAODBHelper.save(result, function(result) {
                    //         res.status(200).json({
                    //             message: 'Updated message',
                    //             Result: result
                    //         });
                    //     })

                    // }
                } else if (result.section_LAA[0].section_6 == false) {
                    console.log("inside section 6 as false");
                    result.section_LAA[0].section_6 = "true";
                    result.application_status = "CMP";

                    //  if (req.body.is_admin == true) {
                    //         result.application_status = "SAV";
                    //         result.section_SAV[0].section_3 = "false";
                    //     } else {
                    //         result.application_status = "CMP";
                    //     }
                    //     result.completion_time = new Date();
                    // result.bot_fields[0].noOfRemaindersSent=req.body.remainder,//change

                    // result.DLidState = req.body.DLidState,

                    //     result.LNum = req.body.LNum,
                    //     result.meidicarenum = req.body.meidicarenum,
                    //     result.color = req.body.color,
                    //     result.idnum = req.body.idnum,
                    //     result.idstate = req.body.idstate,
                    //     result.refnum = req.body.refnum,
                    //     result.validTo = req.body.validTo


                    // if (req.body.skip == true) {
                    //     console.log("in else")
                    //     result.section_SAV[0].section_3 = "true";
                    //     if (req.body.is_admin == true) {
                    //         result.application_status = "SAV";
                    //         result.section_SAV[0].section_3 = "false";
                    //     } else {
                    //         result.application_status = "CMP";
                    //     }
                    //     result.completion_time = new Date();

                    //     if (req.body.adminId != undefined && req.body.adminId != "undefined") {
                    //         var update = {
                    //             $push: {
                    //                 logs: { 'updated_time': new Date(), 'who': req.body.adminId, 'change_type': 6 }
                    //             }
                    //         };
                    //         OAODBHelper.UpdateResumeTime(result.application_id, update, function(result) {
                    //             console.log("Resume time updated");
                    //             console.log(result);
                    //         });
                    //     }
                    //     //result.completed_by = req.body.adminId;
                    //     else {
                    //         var update = {
                    //             $push: {
                    //                 logs: { 'updated_time': new Date(), 'who': "Applicant", 'change_type': 6 }
                    //             }
                    //         };
                    //         OAODBHelper.UpdateResumeTime(result.application_id, update, function(result) {
                    //             console.log("Resume time updated");
                    //             console.log(result);
                    //         });

                    //     }

                    //     OAOApplicationHelper.BSB_Number(function(CallBackResult) {
                    //         result.bank_bsb_number = CallBackResult;
                    //     })


                    //     if (req.body.existing_cust_status != "Y") {
                    //         OAOApplicationHelper.Gen_custId(function(CallBackResult) {
                    //             result.core_customer_id = CallBackResult;
                    //             OAOApplicationHelper.updateCimsProperties(result.application_id, CallBackResult);
                    //         })
                    //     } else {
                    //         result.core_customer_id = req.body.core_customer_id;
                    //         OAOApplicationHelper.updateCimsProperties(result.application_id, req.body.core_customer_id);
                    //     }

                    //     OAOApplicationHelper.Gen_coreAcc_no(function(CallBackResult) {
                    //             result.core_account_number = CallBackResult;
                    //         })
                    //         //gathering data to render
                    //     var data = {
                    //         'fname': result.fname,
                    //         'lname': result.lname,
                    //         'bsb_number': result.bank_bsb_number,
                    //         'core_customer_id': result.core_customer_id,
                    //         'core_account_number': result.core_account_number,
                    //         'product_type': result.product_type
                    //     }
                    //     console.log('Everyday Account Data', JSON.stringify(data));
                    //     //final submission mail
                    //     OAOApplicationHelper.SendMail(result.email, result.application_id, data, 'FINAL_SUBMISSION', function(callbackResult) {
                    //         console.log('Everyday Account final submission mail sent', JSON.stringify(callbackResult));
                    //     })


                    //     OAODBHelper.save(result, function(result) {
                    //         res.status(200).json({
                    //             message: 'Updated message',
                    //             Result: result
                    //         });
                    //     })

                    // } else {

                    /** here we will save details from docs upload screen */
                    console.log(result);
                    OAODBHelper.save(result, function (result) {
                        res.status(200).json({
                            message: 'Updated message',
                            Result: result
                        });
                    })
                    //}
                } else {
                    res.status(404).json({
                        message: 'Page Not found',

                    });

                }


            })
        })
    });



// OAO HOMELOAN Applicants

OAORouter.route('/HomeLoanApplicants')
    .post(function (req, res) {
        OAODBHelper.GenerateApplicationReferenceId(req, res, function (result) {

            var app_id_ = req.body.app_id || OAOApplicationHelper.RefIdFormater(Number(result.app_ref_id) + 1);
            console.log("body" + req.body)

            console.log(req.body)
            var Oao_product_customer_details = new OAOApplicantSchema({
                product_code: req.body.product_code,
                product_type: req.body.product_type,
                deviceType: req.device.type,
                title: req.body.title,
                existing_cust_status: req.body.existing_cust_status,
                singleORjoint: req.body.singleORjoint,
                application_id: app_id_,
                fname: req.body.fname,
                mname: req.body.mname,
                lname: req.body.lname,
                dob: req.body.dob,
                email: req.body.email,
                mobile: req.body.mobile,
                address: req.body.address,
                paddress: req.body.paddress,
                DLidState: req.body.DLidState,
                LNum: req.body.LNum,
                color: req.body.color,
                idnum: req.body.idnum,
                idstate: req.body.idstate,
                username: req.body.username,
                refnum: req.body.refnum,
                tfn: req.body.tfn,
                validTo: req.body.validTo,
                exemption: req.body.exemption,
                housenum: req.body.housenum,
                streetnum: req.body.streetnum,
                streetname: req.body.streetname,
                streettype: req.body.streettype,
                suburb: req.body.suburb,
                state: req.body.state,
                postcode: req.body.postcode,
                phousenum: req.body.phousenum,
                pstreetnum: req.body.pstreetnum,
                pstreetname: req.body.pstreetname,
                pstreettype: req.body.pstreettype,
                psuburb: req.body.psuburb,
                pstate: req.body.pstate,
                ppostcode: req.body.ppostcode,
                meidicarenum: req.body.meidicarenum,
                loantype: req.body.loantype,
                property: req.body.property,
                proptype: req.body.proptype,
                payoutbal: req.body.payoutbal,
                propaddr: req.body.propaddr,
                purchaseprice: req.body.purchaseprice,
                amtborrow: req.body.amtborrow,
                loanterm: req.body.loanterm,
                frequencyType: req.body.frequencyType,
                repaymenttype: req.body.repaymenttype,
                interesttype: req.body.interesttype,
                fixedper: req.body.fixedper,
                variableper: req.body.variableper,
                consolidateMortage: req.body.consolidateMortage,
                estvalue: req.body.estvalue,
                propaddress_m: req.body.propaddress_m,
                finInstitution: req.body.finInstitution,
                consolidateotherMortage: req.body.consolidateotherMortage,
                cc_estvalue: req.body.cc_estvalue,
                cc_finInstitution: req.body.cc_finInstitution,
                pl_estvalue: req.body.pl_estvalue,
                pl_finInstitution: req.body.pl_finInstitution,
                cl_estvalue: req.body.cl_estvalue,
                cl_finInstitution: req.body.cl_finInstitution,
                sl_estvalue: req.body.sl_estvalue,
                sl_finInstitution: req.body.sl_finInstitution,
                o_estvalue: req.body.o_estvalue,
                o_finInstitution: req.body.o_finInstitution,
                ownership: req.body.ownership,
                rentalincome: req.body.rentalincome,
                no_address_found_flag: req.body.no_address_found_flag,

                employed: req.body.employed,
                employer: req.body.employer,
                service: req.body.service,
                companyName: req.body.companyName,
                yearsEstablished: req.body.yearsEstablished,
                earnPerMonth: req.body.earnPerMonth,
                monthlyLivingExpenses: req.body.monthlyLivingExpenses,

                assets: req.body.assets,
                Liabilities: req.body.Liabilities,
                section_HML: {},
                bot_fields: {},
                Mandatory_fields_HML: [{
                    section_1_fields: [{
                        lanme: true,
                        fname: true,
                        dob: true,
                        email: true,
                        mobile: true,
                        address: false,
                        paddress: false
                    }],
                    section_2_fields: [{
                        loantype: false,
                        property: false,
                        proptype: false,
                        payoutbal: false,
                        propaddr: false,
                        purchaseprice: false,
                        ownership: false,
                        amtborrow: false,
                        loanterm: false,
                        frequencyType: false,
                        interesttype: false,
                        fixedper: false,
                        variableper: false,
                        repaymenttype: false,
                        estvalue: false,
                        propaddress_m: false,
                        finInstitution: false
                    }],
                    section_3_fields: [{
                        employed: false,
                        employer: false,
                        service: false,
                        companyName: false,
                        yearsEstablished: false,
                        earnPerMonth: false,
                        monthlyLivingExpenses: false
                    }]
                }]
            })

            console.log("sample result" + Oao_product_customer_details);
            OAODBHelper.checkExistingApplicant(req, res, function (result) {
                if (!result) {
                    OAODBHelper.save(Oao_product_customer_details, function (result) {
                        //gathering data 
                        var data = {
                            'fname': result.fname,
                            'lname': result.lname,
                            'product_type': result.product_type
                        }
                        console.log('Home Loan Application data', JSON.stringify(data));
                        OAOApplicationHelper.SendMail(result.email, result.application_id, data, 'SAVE_SUBMISSION', function (callbackResult) {
                            console.log('Home loan submission mail status', JSON.stringify(callbackResult));
                        })
                        res.json({ Result: result });
                    })

                } else if (result.section_HML[0].section_1 == false) {
                    if (req.body.fname != null) {
                        result.product_type = req.body.prod_type
                        result.singleORjoint = req.bodysingleORjoint
                        result.title = req.body.title
                        result.fname = req.body.fname
                        result.mname = req.body.mname
                        result.lname = req.body.lname
                        result.dob = req.body.dob
                        result.email = req.body.email,
                            result.mobile = req.body.mobile
                    } else {
                        result.address = req.body.address,
                            result.paddress = req.body.paddress,
                            result.housenum = req.body.housenum,
                            result.streetnum = req.body.streetnum,
                            result.streetname = req.body.streetname,
                            result.streettype = req.body.streettype,
                            result.suburb = req.body.suburb,
                            result.state = req.body.state,
                            result.postcode = req.body.postcode,
                            result.phousenum = req.body.phousenum,
                            result.pstreetnum = req.body.pstreetnum,
                            result.pstreetname = req.body.pstreetname,
                            result.pstreettype = req.body.pstreettype,
                            result.psuburb = req.body.psuburb,
                            result.pstate = req.body.pstate,
                            result.ppostcode = req.body.ppostcode,
                            result.postal_home_address_flag = req.body.postal_home_address_flag,
                            result.no_address_found_flag = req.body.no_address_found_flag
                        if (req.body.postal_home_address_flag == true) {
                            result.paddress = req.body.address;
                            result.pstreetname = req.body.streetname;
                            result.ppostcode = req.body.postcode;
                            result.pstate = req.body.state;

                        }
                    }
                    // result.bot_fields[0].noOfRemaindersSent=req.body.remainder,//change

                    if (req.body.address != null) {
                        result.section_HML[0].section_1 = "true";
                        result.Mandatory_fields_HML[0].section_1_fields[0].address = "true";
                        result.Mandatory_fields_HML[0].section_1_fields[0].paddress = "true";
                    } else {
                        result.section_HML[0].section_1 = "false";
                    }
                    OAODBHelper.save(result, function (result) {

                        res.status(200).json({
                            message: 'Updated message',
                            Result: result
                        });
                    })

                } else if (result.section_HML[0].section_2 == false) {
                    console.log("enter of section 2");
                    if (req.body.loantype != null) {
                        result.loantype = req.body.loantype,
                            result.property = req.body.property,
                            result.proptype = req.body.proptype,
                            result.payoutbal = req.body.payoutbal,
                            result.propaddr = req.body.propaddr,
                            result.purchaseprice = req.body.purchaseprice,
                            result.ownership = req.body.ownership,
                            result.rentalincome = req.body.rentalincome
                    } else {
                        result.amtborrow = req.body.amtborrow,
                            result.loanterm = req.body.loanterm,
                            result.frequencyType = req.body.frequencyType,
                            result.interesttype = req.body.interesttype,
                            result.fixedper = req.body.fixedper,
                            result.variableper = req.body.variableper,
                            result.repaymenttype = req.body.repaymenttype,
                            result.estvalue = req.body.estvalue,
                            result.propaddress_m = req.body.propaddress_m,
                            result.finInstitution = req.body.finInstitution,
                            result.consolidateMortage = req.body.consolidateMortage,
                            result.consolidateotherMortage = req.body.consolidateotherMortage,
                            result.cc_estvalue = req.body.cc_estvalue,
                            result.cc_finInstitution = req.body.cc_finInstitution,
                            result.pl_estvalue = req.body.pl_estvalue,
                            result.pl_finInstitution = req.body.pl_finInstitution,
                            result.cl_estvalue = req.body.cl_estvalue,
                            result.cl_finInstitution = req.body.cl_finInstitution,
                            result.sl_estvalue = req.body.sl_estvalue,
                            result.sl_finInstitution = req.body.sl_finInstitution,
                            result.o_estvalue = req.body.o_estvalue,
                            result.o_finInstitution = req.body.o_finInstitution

                    }


                    console.log("2nd section result" + result);
                    if (req.body.loantype != null || req.body.proptype != null) {

                        result.section_HML[0].section_2 = "false";


                        OAODBHelper.save(result, function (result) {

                            res.status(200).json({
                                message: 'Updated message',
                                Result: result
                            });
                        })
                    } else {
                        result.section_HML[0].section_2 = "true";
                        result.Mandatory_fields_HML[0].section_2_fields[0].loantype = "true";
                        result.Mandatory_fields_HML[0].section_2_fields[0].property = "true";
                        result.Mandatory_fields_HML[0].section_2_fields[0].proptype = "true";
                        result.Mandatory_fields_HML[0].section_2_fields[0].payoutbal = "true";
                        result.Mandatory_fields_HML[0].section_2_fields[0].propaddr = "true";
                        result.Mandatory_fields_HML[0].section_2_fields[0].purchaseprice = "true";
                        result.Mandatory_fields_HML[0].section_2_fields[0].ownership = "true";
                        result.Mandatory_fields_HML[0].section_2_fields[0].amtborrow = "true";
                        result.Mandatory_fields_HML[0].section_2_fields[0].loanterm = "true";
                        result.Mandatory_fields_HML[0].section_2_fields[0].frequencyType = "true";
                        result.Mandatory_fields_HML[0].section_2_fields[0].interesttype = "true";
                        result.Mandatory_fields_HML[0].section_2_fields[0].fixedper = "true";
                        result.Mandatory_fields_HML[0].section_2_fields[0].variableper = "true";
                        result.Mandatory_fields_HML[0].section_2_fields[0].repaymenttype = "true";
                        result.Mandatory_fields_HML[0].section_2_fields[0].estvalue = "true";
                        result.Mandatory_fields_HML[0].section_2_fields[0].propaddress_m = "true";
                        result.Mandatory_fields_HML[0].section_2_fields[0].finInstitution = "true";
                        OAODBHelper.save(result, function (result) {

                            res.status(200).json({
                                message: 'Updated message',
                                Result: result
                            });
                        })
                    }


                } else if (result.section_HML[0].section_3 == false) {
                    // result.bot_fields[0].noOfRemaindersSent=req.body.remainder,//change
                    if (req.body.employed != null) {
                        result.employed = req.body.employed,
                            result.employer = req.body.employer,
                            result.service = req.body.service,
                            result.companyName = req.body.companyName,
                            result.yearsEstablished = req.body.yearsEstablished,
                            result.earnPerMonth = req.body.earnPerMonth,
                            result.monthlyLivingExpenses = req.body.monthlyLivingExpenses
                        if (req.body.asset_liability == true) {
                            result.assets = req.body.assets,
                                result.Liabilities = req.body.Liabilities
                        }
                    } else if (req.body.LNum != null) {
                        result.DLidState = req.body.DLidState,
                            result.LNum = req.body.LNum,
                            result.meidicarenum = req.body.meidicarenum,
                            result.color = req.body.color,
                            result.idnum = req.body.idnum,
                            result.idstate = req.body.idstate,
                            result.refnum = req.body.refnum,
                            result.validTo = req.body.validTo
                    }
                    console.log("in sec 3" + result)
                    if (req.body.employed != null && req.body.LNum == null && req.body.skip == false) {
                        console.log("in if sec 3")
                        result.section_HML[0].section_3 = "false";
                        OAODBHelper.save(result, function (result) {
                            res.status(200).json({
                                message: 'Updated message',
                                Result: result
                            });
                        })

                    } else if (req.body.skip == true) {

                        result.section_HML[0].section_3 = "true";
                        result.application_status = "CMP";

                        result.Mandatory_fields_HML[0].section_3_fields[0].employed == "true",
                            result.Mandatory_fields_HML[0].section_3_fields[0].employer = "true",
                            result.Mandatory_fields_HML[0].section_3_fields[0].service = "true",
                            result.Mandatory_fields_HML[0].section_3_fields[0].companyName = "true",
                            result.Mandatory_fields_HML[0].section_3_fields[0].yearsEstablished = "true",
                            result.Mandatory_fields_HML[0].section_3_fields[0].earnPerMonth = "true",
                            result.Mandatory_fields_HML[0].section_3_fields[0].monthlyLivingExpenses = "true"
                        //gathering data for Home Loan
                        var data = {
                            'fname': result.fname,
                            'lname': result.lname,
                            'product_type': result.product_type
                        }
                        console.log('Final Data', JSON.stringify(data));
                        //sending mail for home loan final submission
                        OAOApplicationHelper.SendMail(result.email, result.application_id, data, 'FINAL_SUBMISSION', function (callbackResult) {
                            console.log('Home Loan Final submission mail status', JSON.stringify(callbackResult));
                        })

                        OAODBHelper.save(result, function (result) {
                            res.status(200).json({
                                message: 'Updated message',
                                Result: result
                            });
                        })

                    }
                } else {
                    res.status(404).json({
                        message: 'Page Not found',

                    });

                }
            })

        })
    });

//ends HOMELOAN


// OAO PERSONALLOAN Applicants

OAORouter.route('/PersonalLoanApplicants')
    .post(function (req, res) {
        OAODBHelper.GenerateApplicationReferenceId(req, res, function (result) {

            var app_id_ = req.body.app_id || OAOApplicationHelper.RefIdFormater(Number(result.app_ref_id) + 1);
            console.log("body" + req.body)

            console.log(req.body)
            var Oao_product_customer_details = new OAOApplicantSchema({
                product_code: req.body.product_code,
                product_type: req.body.product_type,
                singleORjoint: req.body.singleORjoint,
                existing_cust_status: req.body.existing_cust_status,
                title: req.body.title,
                application_id: app_id_,
                deviceType: req.device.type,
                fname: req.body.fname,
                mname: req.body.mname,
                lname: req.body.lname,
                dob: req.body.dob,
                email: req.body.email,
                mobile: req.body.mobile,
                address: req.body.address,
                paddress: req.body.paddress,
                DLidState: req.body.DLidState,
                LNum: req.body.LNum,
                color: req.body.color,
                idnum: req.body.idnum,
                idstate: req.body.idstate,
                username: req.body.username,
                refnum: req.body.refnum,
                tfn: req.body.tfn,
                validTo: req.body.validTo,
                exemption: req.body.exemption,
                housenum: req.body.housenum,
                streetnum: req.body.streetnum,
                streetname: req.body.streetname,
                streettype: req.body.streettype,
                suburb: req.body.suburb,
                state: req.body.state,
                postcode: req.body.postcode,
                phousenum: req.body.phousenum,
                pstreetnum: req.body.pstreetnum,
                pstreetname: req.body.pstreetname,
                pstreettype: req.body.pstreettype,
                psuburb: req.body.psuburb,
                pstate: req.body.pstate,
                ppostcode: req.body.ppostcode,
                meidicarenum: req.body.meidicarenum,

                loanreason: req.body.loanreason,

                amtborrow: req.body.amtborrow,
                loanterm: req.body.loanterm,
                frequencyType: req.body.frequencyType,
                no_address_found_flag: req.body.no_address_found_flag,

                employed: req.body.employed,
                employer: req.body.employer,
                service: req.body.service,
                companyName: req.body.companyName,
                yearsEstablished: req.body.yearsEstablished,
                earnPerMonth: req.body.earnPerMonth,
                monthlyLivingExpenses: req.body.monthlyLivingExpenses,

                assets: req.body.assets,
                Liabilities: req.body.Liabilities,
                section_PRL: {},
                bot_fields: {},
                Mandatory_fields_PRL: [{
                    section_1_fields: [{
                        lname: true,
                        fname: true,
                        dob: true,
                        email: true,
                        mobile: true,
                        address: false,
                        paddress: false
                    }],
                    section_2_fields: [{
                        amtborrow: false,
                        loanterm: false,
                        frequencyType: false,
                        loanreason: false
                    }],
                    section_3_fields: [{
                        employed: false,
                        employer: false,
                        service: false,
                        companyName: false,
                        yearsEstablished: false,
                        earnPerMonth: false,
                        monthlyLivingExpenses: false
                    }]
                }]
            })

            console.log("sample result" + Oao_product_customer_details);
            OAODBHelper.checkExistingApplicant(req, res, function (result) {
                if (!result) {
                    OAODBHelper.save(Oao_product_customer_details, function (result) {
                        var data = {
                            'fname': result.fname,
                            'lname': result.lname,
                            'product_type': result.product_type
                        }
                        console.log('Personal Load Account data', JSON.stringify(data));
                        //sending mail after save submission
                        OAOApplicationHelper.SendMail(result.email, result.application_id, data, 'SAVE_SUBMISSION', function (callbackResult) {
                            console.log('Personal load account save mail sendt status', JSON.stringify(callbackResult));
                        })
                        res.json({ Result: result });
                    })

                } else if (result.section_PRL[0].section_1 == false) {
                    if (req.body.fname != null) {
                        result.product_type = req.body.product_type
                        result.singleORjoint = req.body.singleORjoint
                        result.title = req.body.title
                        result.fname = req.body.fname
                        result.mname = req.body.mname
                        result.lname = req.body.lname
                        result.dob = req.body.dob
                        result.email = req.body.email,
                            result.mobile = req.body.mobile
                    } else {
                        result.address = req.body.address,
                            result.paddress = req.body.paddress,
                            result.housenum = req.body.housenum,
                            result.streetnum = req.body.streetnum,
                            result.streetname = req.body.streetname,
                            result.streettype = req.body.streettype,
                            result.suburb = req.body.suburb,
                            result.state = req.body.state,
                            result.postcode = req.body.postcode,
                            result.phousenum = req.body.phousenum,
                            result.pstreetnum = req.body.pstreetnum,
                            result.pstreetname = req.body.pstreetname,
                            result.pstreettype = req.body.pstreettype,
                            result.psuburb = req.body.psuburb,
                            result.pstate = req.body.pstate,
                            result.ppostcode = req.body.ppostcode,
                            result.postal_home_address_flag = req.body.postal_home_address_flag,
                            result.no_address_found_flag = req.body.no_address_found_flag
                        if (req.body.postal_home_address_flag == true) {
                            result.paddress = req.body.address;
                            result.pstreetname = req.body.streetname;
                            result.ppostcode = req.body.postcode;
                            result.pstate = req.body.state;

                        }
                    }
                    // result.bot_fields[0].noOfRemaindersSent=req.body.remainder,//change

                    if (req.body.address != null) {
                        result.section_PRL[0].section_1 = "true";
                        result.Mandatory_fields_PRL[0].section_1_fields[0].address = "true";
                        result.Mandatory_fields_PRL[0].section_1_fields[0].paddress = "true";
                    } else {
                        result.section_PRL[0].section_1 = "false";
                    }
                    OAODBHelper.save(result, function (result) {

                        res.status(200).json({
                            message: 'Updated message',
                            Result: result
                        });
                    })
                } else if (result.section_PRL[0].section_2 == false) {
                    console.log("enter of section 2");
                    if (req.body.amtborrow != null) {
                        result.amtborrow = req.body.amtborrow,
                            result.loanterm = req.body.loanterm,
                            result.frequencyType = req.body.frequencyType,
                            result.loanreason = req.body.loanreason

                    }


                    console.log("2nd section result" + result);
                    if (req.body.amtborrow != null) {

                        result.section_PRL[0].section_2 = "true";
                        result.Mandatory_fields_PRL[0].section_2_fields[0].amtborrow = "true";
                        result.Mandatory_fields_PRL[0].section_2_fields[0].loanterm = "true";
                        result.Mandatory_fields_PRL[0].section_2_fields[0].frequencyType = "true";
                        console.log("success condtion in section 2" + result);
                        OAODBHelper.save(result, function (result) {


                            res.status(200).json({
                                message: 'Updated message',
                                Result: result
                            });
                        })
                    } else {
                        console.log("false constion");
                        result.section_PRL[0].section_2 = "false";
                        OAODBHelper.save(result, function (result) {

                            res.status(200).json({
                                message: 'Updated message',
                                Result: result
                            });
                        })
                    }


                } else if (result.section_PRL[0].section_3 == false) {
                    // result.bot_fields[0].noOfRemaindersSent=req.body.remainder,//change
                    if (req.body.employed != null) {
                        result.employed = req.body.employed,
                            result.employer = req.body.employer,
                            result.service = req.body.service,
                            result.companyName = req.body.companyName,
                            result.yearsEstablished = req.body.yearsEstablished,
                            result.earnPerMonth = req.body.earnPerMonth,
                            result.monthlyLivingExpenses = req.body.monthlyLivingExpenses
                        if (req.body.asset_liability == true) {
                            result.assets = req.body.assets,
                                result.Liabilities = req.body.Liabilities
                        }
                    } else if (req.body.LNum != null) {
                        result.DLidState = req.body.DLidState,
                            result.LNum = req.body.LNum,
                            result.meidicarenum = req.body.meidicarenum,
                            result.color = req.body.color,
                            result.idnum = req.body.idnum,
                            result.idstate = req.body.idstate,
                            result.refnum = req.body.refnum,
                            result.validTo = req.body.validTo

                    }
                    console.log("in sec 3" + result)
                    if (req.body.employed != null || req.body.monthlyLivingExpenses != '' && req.body.LNum == null && req.body.skip == false) {
                        console.log("in if sec 3")
                        result.section_PRL[0].section_3 = "false";
                        OAODBHelper.save(result, function (result) {
                            res.status(200).json({
                                message: 'Updated message',
                                Result: result
                            });
                        })

                    } else if (req.body.skip == true) {

                        result.section_PRL[0].section_3 = "true";
                        result.application_status = "CMP";

                        result.Mandatory_fields_PRL[0].section_3_fields[0].employed == "true",
                            result.Mandatory_fields_PRL[0].section_3_fields[0].employer = "true",
                            result.Mandatory_fields_PRL[0].section_3_fields[0].service = "true",
                            result.Mandatory_fields_PRL[0].section_3_fields[0].companyName = "true",
                            result.Mandatory_fields_PRL[0].section_3_fields[0].yearsEstablished = "true",
                            result.Mandatory_fields_PRL[0].section_3_fields[0].earnPerMonth = "true",
                            result.Mandatory_fields_PRL[0].section_3_fields[0].monthlyLivingExpenses = "true"
                        //final submission data

                        var data = {
                            'fname': result.fname,
                            'lname': result.lname,
                            'product_type': result.product_type
                        }
                        console.log('Personal account load data', JSON.stringify(data));
                        OAOApplicationHelper.SendMail(result.email, result.application_id, data, 'FINAL_SUBMISSION', function (callbackResult) {
                            console.log('Personal account loan final submission mail status', JSON.stringify(callbackResult));
                        })
                        OAODBHelper.save(result, function (result) {
                            res.status(200).json({
                                message: 'Updated message',
                                Result: result
                            });
                        })

                    }
                } else {
                    res.status(404).json({
                        message: 'Page Not found',

                    });

                }
            })

        })
    });

//ends PERSONALLOAN


OAORouter.get('/getConfig', function (req, res) {
    res.json({ data: config });
});

OAORouter.get('/getConfig/:key/:lang', function (req, res) {
    res.json({ data: config[req.params.key][req.params.lang] });
});

OAORouter.route('/PropertyDetails/:PropertyType/:Property')
    .get(function (req, res) {
        var PropertyType = req.params.PropertyType;
        var Property = req.params.Property;
        OAODBHelper.getDropboxContent(PropertyType, Property, function (result) {
            res.json({ result: result });
        })
    });

OAORouter.route('/saveProprtyDetails')
    .post(function (req, res) {
        var oAOPropertyDetail = new OAOPropertyDetail({
            property_type: req.body.p_type,
            property: req.body.property,
            property_value: req.body.p_value,
            property_desc: req.body.desc
        });
        OAODBHelper.saveDropboxContent(oAOPropertyDetail, function (result) {
            if (!result) {
                return res.json({ result: "no record found" });
            }
            res.json({ result: result });
        })

    });
OAORouter.route('/ErrorMessages/:PropertyType')
    .get(function (req, res) {
        var PropertyType = req.params.PropertyType;
        OAODBHelper.getMessages(PropertyType, function (result) {
            res.json({ result: result });
        })
    });
OAORouter.route('/applicationReferenceIdGeneration')
    .get(function (req, res) {
        // OAODBHelper.GenerateApplicationReferenceId(req,res,function(result){
        //     res.json({result:result});
        // })
        //  OAODBHelper.updateApplicationReferenceIdGeneration(req,res,function(result){
        //     res.json({result:result});
        // });
        OAODBHelper.UpdateApplicationReferenceIdGeneration(req, res, function (result) {
            res.json({ resss: result });
        })
    });
OAORouter.route('/CoreAccountNumber')
    .get(function (req, res) {
        OAOApplicationHelper.RefIdFormater(function (result) {
            res.json({ result: result });
        })
    });
OAORouter.route('/ApplicantsRecord/:Applicants_id')
    .get(function (req, res) {
        var Applicants_id = req.params.Applicants_id;
        OAODBHelper.getApplicantsRecord(Applicants_id, function (result) {
            if (result == "") {
                res.json({ result: "no result" });
            } else {
                res.json({ result: result });
            }

        })
    });

OAORouter.route('/UpdateSection/:Applicants_id/:section/:product_type_code')
    .get(function (req, res) {
        app_id = req.params.Applicants_id;
        section = req.params.section;
        prod_type = "section_" + req.params.product_type_code;
        console.log("Product type code: " + prod_type);
        OAODBHelper.getApplicantsRecord(app_id, function (result) {
            if (result == "") {
                res.json({ result: "no result" });
            } else {
                console.log("result")
                if (result[0][prod_type][0][section] == true) {
                    result[0][prod_type][0][section] = 'false';
                }

                OAODBHelper.save(result[0], function (result) {
                    res.status(200).json({
                        message: 'Updated message',
                        Result: result
                    });
                })
            }

        })

    })

OAORouter.route('/validation')
    .post(function (req, res) {
        OAODBHelper.validation(req, res, function (result) {
            res.json({ result: result });
        })
    });

OAORouter.route('/ProductDetails/:ProductCode')
    .get(function (req, res) {
        var ProductCode = req.params.ProductCode;
        OAODBHelper.getProductContent(ProductCode, function (result) {
            res.json({ result: result });
        })
    });


//Create Cross Sell
OAORouter.route('/CrossSellApplicants').post(function (req, res) {
    console.log('Inside corss sell', req.body.app_id)
    req.body.app_id = undefined;
    req.body.application_id = undefined;
    OAODBHelper.GenerateApplicationReferenceId(req, res, function (result) {
        var app_id_ = OAOApplicationHelper.RefIdFormater(Number(result.app_ref_id) + 1, req);
        console.log('CS result', JSON.stringify(result));
        var cross_sell_details = new OAOApplicantSchema({
            product_code: req.body.product_code,
            product_type_code: req.body.product_type_code,
            singleORjoint: req.body.singleORjoint,
            deviceType: req.device.type,
            existing_cust_status: req.body.existing_cust_status,
            title: req.body.title,
            application_id: app_id_,
            fname: req.body.fname,
            mname: req.body.mname,
            lname: req.body.lname,
            dob: req.body.dob,
            email: req.body.email,
            mobile: req.body.mobile,
            brokerid: req.body.brokerid,
            address: req.body.address,
            paddress: req.body.paddress,
            DLidState: req.body.DLidState,
            LNum: req.body.LNum,
            color: req.body.color,
            idnum: req.body.idnum,
            idstate: req.body.idstate,
            username: req.body.username,
            refnum: req.body.refnum,
            tfn: req.body.tfn,
            validTo: req.body.validTo,
            exemption: req.body.exemption,
            housenum: req.body.housenum,
            streetnum: req.body.streetnum,
            streetname: req.body.streetname,
            streettype: req.body.streettype,
            suburb: req.body.suburb,
            state: req.body.state,
            postcode: req.body.postcode,
            phousenum: req.body.phousenum,
            pstreetnum: req.body.pstreetnum,
            pstreetname: req.body.pstreetname,
            pstreettype: req.body.pstreettype,
            psuburb: req.body.psuburb,
            pstate: req.body.pstate,
            ppostcode: req.body.ppostcode,
            meidicarenum: req.body.meidicarenum,
            no_address_found_flag: req.body.no_address_found_flag,
            section_SAV: {},
            bot_fields: {},
            cross_sell: {
                main_app_no: req.body.main_app_no,
                main_prod_type: req.body.main_prod_type,
                main_prod: req.body.main_prod
            }
        })
        console.log('API Cross sell', JSON.stringify(cross_sell_details));
        OAODBHelper.save(cross_sell_details, function (result) {
            res.status(200).json({
                message: 'Updated message',
                Result: result
            });
        })
    })
});





OAORouter.route('/employers')
    .get(function (req, res) {
        OAODBHelper.getEmployers(function (result) {
            res.json({ result: result });
        })
    });


OAORouter.route('/insertCities').post(function (req, res) {
    console.log("inside insertCity");
    var oaoCityDetailsSchema = new OAOCityDetailsSchema({
        city: req.body.city,
        state: req.body.state,
        priority_flag: req.body.priority_flag
    })
    oaoCityDetailsSchema.save(function (err, result) {
        if (err) {
            return res.json({ error: err });
        }
        return res.json({ result: result });
    });
});



OAORouter.route('/createEmployer').post(function (req, res) {
    console.log("createEmployer api")
    console.log(req.body);
    var oAOEmployersSchema = new OAOEmployersSchema({
        employer_name: req.body.employer_name,
        uemployer_address: req.body.userNaemployer_address,
        employer_email: req.body.employer_email,
        preferentials: [{
            loanInt: req.body.loanInt
        }],
        delete_flag: req.body.delete_flag
    })

    oAOEmployersSchema.save(function (err, result) {
        if (err) {
            return res.json({ error: err });
        }
        return res.json({ result: result });
    });


});

OAORouter.get('/generateApplicationId', (req, res) => {
    console.log("/generateApplicationId");
    OAODBHelper.GenerateApplicationReferenceId(req, res, function (result) {
        let app_id = OAOApplicationHelper.RefIdFormater(Number(result.app_ref_id) + 1, req);
        req.session.app_id = app_id;
        res.json({ error: null, data: app_id });
    });

})

OAORouter.get('/attachments/:app_id', (req, res) => {
    var dir = `uploads/${req.params.app_id}`;
    fs.exists(dir, (exists) => {
        console.log('is directory exists', exists);
        if (exists) {
            fs.readdir(dir, (err, folders) => {
                if (!err) {
                    let attachments = [];

                    folders.forEach(folder => {
                        let files = fs.readdirSync(dir + '/' + folder);
                        files.forEach(file => {
                            attachments.push(folder + '/' + file);
                        })

                    })
                    res.json({ error: null, data: attachments });
                } else {
                    res.json({ error: 'Internal error ocurred', data: null })
                }

            })
        } else {
            res.json({ error: 'Directory does not exist', data: null });
        }
    })

});

OAORouter.get('/attachments/:app_id/:doc_type', (req, res) => {
    var dir = `uploads/${req.params.app_id}/${req.params.doc_type}`;
    fs.exists(dir, (exists) => {
        console.log('is directory exists', exists);
        if (exists) {
            let attachments = [];

            let files = fs.readdir(dir, function (err, files) {
                if (!err) {

                    files.forEach(file => {
                        attachments.push(file);
                    })
                    res.json({ error: null, data: attachments });

                } else {
                    res.json({ error: 'Internal error ocurred', data: null });
                }
            });

        } else {
            res.json({ error: 'Directory does not exist', data: null });
        }
    })

});

OAORouter.get('/files/download/:app_id', (req, res) => {

    let query = { "application_id": req.params.app_id }
    let filter = { "filesUpload": 1 }
    var auth = new Buffer(alfrescoConfig.alfresco_username + ':' + alfrescoConfig.alfresco_password).toString('base64');
    var headers = { Authorization: 'Basic ' + auth };

    OAODBHelper.getApplicantsFilteredRecord(query, filter, function (err, result) {
        if (!err) {

            if (result) {

                new Promise((resolve, reject) => {

                    var docs_size = Object.keys(result.filesUpload).length;
                    if (docs_size == 0) {
                        resolve({ error: null, data: 'No upload record found' });
                    } else {
                        for (let type in result.filesUpload) {
                            if (result.filesUpload[type].length == 0) {
                                delete result.filesUpload[type];
                            }
                        }
                        docs_size = Object.keys(result.filesUpload).length;
                        if (docs_size == 0) {
                            resolve({ error: null, data: 'No upload record found' });
                        }
                    }

                    var count = 0;
                    var isCompleted = false;
                    for (var doc_type in result.filesUpload) {
                        count++;
                        var doc_type_size = result.filesUpload[doc_type].length;
                        var doc_type_content = result.filesUpload[doc_type];

                        for (var i = 0; i < doc_type_size; i++) {
                            console.log("i value is", i)
                            var reqUrl = 'http://106.51.65.119:8180/alfresco/api/-default-/public/cmis/versions/1.0/atom/content/' + doc_type_content[i].file_name + '?id=' + doc_type_content[i].file_object_id + '';
                            var dir = `uploads/${req.params.app_id}/${doc_type}`;
                            if (!fs.existsSync(dir)) {
                                mkdirp.sync(dir);
                            }
                            dir += '/' + doc_type_content[i].file_name;
                            var reqData = { url: reqUrl, headers };
                            if (i == doc_type_size - 1 && count == docs_size) {
                                isCompleted = true;
                            }
                            OAOApplicationHelper.downloadFileFromCMIS(reqData, dir, isCompleted,
                                function (err, result, completeFlag) {
                                    console.log("download res", err, result);
                                    if (!err) {

                                        if (completeFlag) {
                                            resolve({ error: null, data: "All files downloaded" })
                                        }
                                    } else {
                                        resolve({ error: "Internal error occurred", data: null });

                                    }
                                })
                        }
                    }
                }).then((response) => {
                    res.json(response);
                }).catch((err) => {
                    res.json({ error: 'Internal error occurred', data: null });
                })

            } else {
                res.json({
                    error: null,
                    data: 'No upload record found'
                });
            }

        } else {
            res.json({ error: 'Internal error occurred', data: null });
        }
    })

});


OAORouter.route('/chatBotUserDetails')
    .post(function (req, res) {
        console.log("/chatBotUserDetails:" + req.body.application_id);
        try {
            OAODBHelper.getApplicantsRecord(req.body.application_id, function (result) {
                console.log(result);
                res.status(200).json({ result: result });
            })

        } catch (e) {
            console.log("error in " + e.message);
        }
    });

OAORouter.route('/employers')
    .get(function (req, res) {
        OAODBHelper.getEmployers(function (result) {
            res.json({ result: result });
        })
    });

OAORouter.route('/employerstype')
    .get(function (req, res) {
        console.log("inside employerstype")
        OAODBHelper.getEmployerstype(function (result) {
            res.json({ result: result });
        })
    });

OAORouter.route('/getCityNames')
    .get(function (req, res) {
        console.log("Inside getCityNames");
        OAODBHelper.getCities(function (result) {
            res.json({ result: result });
        })
    });

OAORouter.route('/residenceType')
    .get(function (req, res) {
        console.log("Inside residenceType");
        OAODBHelper.residenceType(function (result) {
            res.json({ result: result });
        })
    });



OAORouter.route('/getVehicleNames/:query_v')
    .get(function (req, res) {
        var query_v = req.params.query_v;
        console.log("Inside getVehicleNames");
        OAODBHelper.getVehicles(query_v, function (result) {
            res.json({ result: result });
        })
    });

OAORouter.route('/getVehicleExShowRoomPrice/:query_v')
    .get(function (req, res) {
        var query_v = req.params.query_v;
        console.log("Inside getVehicleNames");
        OAODBHelper.getVehiclePrice(query_v, function (result) {
            res.json({ result: result });
        })
    });



module.exports = OAORouter;
var express = require('express');
var request = require("request");
var utf8 = require('utf8');
var to_json = require('xmljson').to_json;
var OAODBHelper = require("../oaoRoutes/OAODBHelper");
var OAOApplicationHelper = require("../oaoRoutes/OAOApplicationHelper.js");
var OAOApplicantSchema = require('../../models/OAOApplicantSchema');
var config_urls = require("../../configFiles/DBconfigfile.json");

var appConfig = require('../../configFiles/appConfig');
var errorCodes = require('../../configFiles/errorCodes');

var moment = require('moment');
var OAORouter = express.Router();

var aadhaar_otp_send_flag = false;
var email_otp_send_flag = false;
var mobile_otp_send_flag = false;

var product_type_name_final = "";
var product_type_code_final = "";
var single_joint_final = "";
var employer_final = "";
var aadhaar_flag_final = false;
var aadhaar_number_final = "";
var title_final = "";
var f_name_final = "";
var m_name_final = "";
var l_name_final = "";
var email_final = "";
var mobile_number_final = "";
var dob_final = "";
var address_final = "";

var house_number_final = "";
var street_name_final = "";
var suburb_final = "";
var state_final = "";
var post_code_final = "";

var postal_address_final = "";
var postal_house_number_final = "";
var postal_street_name_final = "";
var postal_suburb_final = "";
var postal_state_final = "";
var postal_post_code_final = "";

var list_models = [];
var vehicle_model_final = "";
var employers_list = [];
var ex_showroom_price_final = "";
var product_code_final = "";
var interest_final = 12;
var loan_term_final = 4;
var loan_amount_final = 0;
var emi_final = 0;
var eligibile_loan_amount_final = 0;
var eligibile_emi_final = 0;
var eligibile_tenor_final = 7;

var intent_names_array = [];
var source_intent_name = "";
var present_intent_name = ""
var previous_intent_name = "";

//vehicle loan
var vehicleLoanType_final = "";
var city_final = "";
var vehicle_make_final = "";
var vehicle_onroad_price_final = 0;
var netIncome_final = 0;
var employertype_final = "";
var work_experience_final = "";
var noMonths_final = "";
var PAT_final = "";
var SelfEmploymentProfessionalProfession_final = "";
var threeYearsIncome_final = 0;
var onroadprice_85_final = 0;
var loan_eligible_amount_final = 0;
var loanTerm_final = 0;
var loanAmount_final = "";
var max_emi_final = "";
var min_emi_final = "";
var interestPayable_final = "";
var totalPayableAmount_final = "";
var designation_final = "";
var workEmailId_final = "";
var officeLandLine_final = "";
var workaddress_final = "";
var buildingNo_final = "";
var fatherName_final = "";
var noOfDependents_final = "";
var maritalStatus_final = "";
var gender_final = "";
var monthlyEmiRange_final = "";
var loanTermRange_final = ""
var loanAmountRange_final = ""
var currentResidence_final = "";
var residence_month_final = ""
var residenceType_final = ""
var app_id_final = "";
var work_phone_number_final = ""

//vehicle loan





OAORouter.route('/chat_bot')
    .post(function (req, res) {
        console.log("chat_bot api Result:" + req.body.result)
        product_type_name_final1 = req.body.result.parameters['product_type_name'];

        if (product_type_name_final1 != null && product_type_name_final1 != undefined && product_type_name_final1 != '') {
            console.log(product_type_name_final1);
            product_type_name_final = product_type_name_final1;
        }
        console.log("Product type name:" + product_type_name_final);

        single_joint_final1 = req.body.result.parameters['single_joint'];
        if (single_joint_final1 != null && single_joint_final1 != undefined && single_joint_final1 != '') {
            single_joint_final = single_joint_final1;
        }

        title_final1 = req.body.result.parameters['title'];
        if (title_final1 != null && title_final1 != undefined && title_final1 != '') {
            title_final = title_final1;
        }
        console.log("***********   Action :" + req.body.result.action + "   ***********");
        action_v = req.body.result.action;
        source_intent_name = action_v;
        switch (action_v) {

            case 'test_intent':
                console.log("test " + req.body.result.parameters['img'])

                break;

            //savings account
            case 'savings_aadhaar_yes_intent':
                console.log("savings_aadhaar_yes_intent")
                res.json({
                    "speech": "Please enter the 12 digits of your aadhaar number",
                    "displayText": "Please enter the 12 digits of your aadhaar number",
                    "data": {},
                    "contextOut": [{ "name": "salary_aadhaar_yes_intent", "lifespan": 1 }, { "name": "vehicle_loan_aadhaar_yes_intent", "lifespan": 1 }],
                    "source": "aadhaar_otp_send_intent"
                })
                break;

            //salary account
            case 'salary_aadhaar_yes_intent':
                console.log("salary_aadhaar_yes_intent")
                res.json({
                    "speech": "Please enter the 12 digits of your aadhaar number",
                    "displayText": "Please enter the 12 digits of your aadhaar number",
                    "data": {},
                    "contextOut": [{ "name": "savings_aadhaar_yes_intent", "lifespan": 1 }, { "name": "vehicle_loan_aadhaar_yes_intent", "lifespan": 1 }],
                    "source": "aadhaar_otp_send_intent"
                })
                break;

            //loan account
            case 'vehicle_loan_aadhaar_yes_intent':
                console.log("vehicle_loan_aadhaar_yes_intent")
                res.json({
                    "speech": "Please enter the 12 digits of your aadhaar number",
                    "displayText": "Please enter the 12 digits of your aadhaar number",
                    "data": {},
                    "contextOut": [{ "name": "savings_aadhaar_yes_intent", "lifespan": 1 }, { "name": "salary_aadhaar_yes_intent", "lifespan": 1 }],
                    "source": "aadhaar_otp_send_intent"
                })
                break;

            case 'savings_aadhaar_no_intent':
                console.log("savings_aadhaar_no_intent")
                res.json({
                    "messages": [
                        {
                            "type": 0,
                            "speech": "Choose your title (Mr/Miss/Mrs/Dr/Prof)"
                        },
                    ],
                    "data": {},
                    "contextOut": [{ "name": "savings_aadhaar_no_intent", "lifespan": 1 }, { "name": "salary_aadhaar_no_intent", "lifespan": 1 }, { "name": "vehicle_loan_aadhaar_no_intent", "lifespan": 1 }],
                    "source": source_intent_name
                })
                break;

            case 'salary_aadhaar_no_intent':
                console.log("salary_aadhaar_no_intent")
                res.json({
                    "messages": [
                        {
                            "type": 0,
                            "speech": "Choose your title (Mr/Miss/Mrs/Dr/Prof)"
                        },
                    ],
                    "data": {},
                    "contextOut": [{ "name": "savings_aadhaar_no_intent", "lifespan": 1 }, { "name": "salary_aadhaar_no_intent", "lifespan": 1 }, { "name": "vehicle_loan_aadhaar_no_intent", "lifespan": 1 }],
                    "source": source_intent_name
                })
                break;

            case 'vehicle_loan_aadhaar_no_intent':
                console.log("vehicle_loan_aadhaar_no_intent")
                res.json({
                    "messages": [
                        {
                            "type": 0,
                            "speech": "Choose your title (Mr/Miss/Mrs/Dr/Prof)"
                        },
                    ],
                    "data": {},
                    "contextOut": [{ "name": "savings_aadhaar_no_intent", "lifespan": 1 }, { "name": "salary_aadhaar_no_intent", "lifespan": 1 }, { "name": "vehicle_loan_aadhaar_no_intent", "lifespan": 1 }],
                    "source": source_intent_name
                })
                break;



            //adhaar send otp
            case 'aadhaar_otp_send_intent':
                console.log("aadhaar_otp_send_intent case" + req.body.result)
                var aadhaar_number1 = req.body.result.parameters['aadhaar_number'];

                if ((!isNaN(aadhaar_number1)) && (aadhaar_number1.toString()).length == 12) {
                    console.log("this is aadhaar number ")
                    aadhaar_number1 = (aadhaar_number1.toString()).replace(/\s/g, '');
                    request({
                        url: `${appConfig.UIDAI.endPointUrl}/otp/${aadhaar_number1}`,
                        timeout: '30000'
                    },
                        function (err, response, body) {
                            // console.log(err, response, body);
                            body = JSON.parse(body);
                            if (!err) {
                                if (!body) {
                                    console.log("OTP !body");
                                    res.json({
                                        "speech": "Invalid Aadhaar..!!Pleasee enter the valid aadhaar Number",
                                        "displayText": "Invalid Aadhaar..!!Please eenter the valid aadhaar Number",
                                        "data": {},
                                        "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": "savings_aadhaar_yes_intent", "lifespan": 1, }],
                                        "source": source_intent_name
                                    })

                                } else if (body.status) {
                                    aadhaar_otp_send_flag = true;
                                    aadhaar_number_final = aadhaar_number1;//
                                    var speech1 = "I have sent an OTP to the mobile number you have registered with UIDAI, let me know the OTP which you have recieved."
                                    var speech2 = "Or if you want to change your adhaar number please enter it here"
                                    console.log("OTP successfully sent");
                                    res.json({
                                        "messages": [
                                            {
                                                "type": 0,
                                                "speech": speech1
                                            },
                                            {
                                                "type": 0,
                                                "speech": speech2
                                            }
                                        ],

                                        "data": {},
                                        "contextOut": [{}],
                                        "source": source_intent_name
                                    })

                                } else {

                                    console.log("OTP else errorCodes");
                                    let message = errorCodes[body.errorCode];
                                    res.json({
                                        "speech": "Invalid Aadhaar..!!Please enter the valid aadhaar Number",
                                        "displayText": "Invalid Aadhaar..!!Please enter the valid aadhaar Number",
                                        "data": {},
                                        "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": "savings_aadhaar_yes_intent", "lifespan": 1 }],
                                        "source": source_intent_name
                                    })
                                }

                            } else {
                                console.log("OTP else");
                                res.json({
                                    "speech": "Server Error..!!  please enter the aadhaar number and try again..!!",
                                    "displayText": "Server Error..!!  please enter the aadhaar number and try again..!!",
                                    "data": {},
                                    "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": "savings_aadhaar_yes_intent", "lifespan": 1 }],
                                    "source": source_intent_name
                                })
                            }
                        })

                } else {
                    console.log("not valid aadhaar")
                    res.json({
                        "speech": "Invalid inputs ..!!Please enter the 12 digits of your valid aadhaar Number",
                        "displayText": "Invalid inputs ..!!Please enter the 12 digits of your valid aadhaar Number",
                        "data": {},
                        "contextOut": [{ "name": "aadhaar_otp_send_intent", "lifespan": 0 }, { "name": "savings_aadhaar_yes_intent", "lifespan": 1 }],
                        "source": source_intent_name
                    })
                }
                break;
            //adhaar otp send completed


            //adhaar otp verify 
            case 'aadhaar_otp_verify_intent':
                console.log("aadhaar_otp_verify_intent case" + req.body.result)
                var aadhaar_number1 = aadhaar_number_final;
                var a_otp = req.body.result.parameters['a_otp'];
                aadhaar_number1 = (aadhaar_number1.toString()).replace(/\s/g, '');

                if ((!isNaN(a_otp)) && ((a_otp.toString()).length == 6)) {
                    console.log("this is aadhaar otp")
                    request({
                        url: `${appConfig.UIDAI.endPointUrl}/ekyc/${aadhaar_number1}/${a_otp}`,
                        timeout: '30000'
                    },
                        function (err, response, body) {
                            body = JSON.parse(body);
                            if (!err) {
                                if (!body) {
                                    console.log("!body");
                                    res.json({
                                        "speech": "Invalid OTP...!!Please enter the valid OTP",
                                        "displayText": "Invalid OTP...!!Please enter the valid OTP",
                                        "data": {},
                                        "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": "aadhaar_otp_send_intent", "lifespan": 1 }],
                                        "source": source_intent_name
                                    })

                                } else if (body.status) {
                                    aadhaar_number_final = aadhaar_number1;
                                    aadhaar_otp_send_flag = false;
                                    let kycResponse = {
                                        "addressInfo": body.addressInfo
                                    }
                                    console.log("body:" + body)

                                    let address = combineAddressInfo(body.addressInfo);
                                    kycResponse['identityInfo'] = formatIdentityInfo(body.identityInfo);
                                    kycResponse.addressInfo.address = address
                                    // getAadhaarDetails();
                                    f_name_final = kycResponse.identityInfo.fname;
                                    m_name_final = kycResponse.identityInfo.mname
                                    l_name_final = kycResponse.identityInfo.lname
                                    dob_final = kycResponse.identityInfo.dob

                                    address_final = kycResponse.addressInfo.address
                                    house_number_final = kycResponse.addressInfo.house
                                    street_name_final = kycResponse.addressInfo.street;
                                    suburb_final = kycResponse.addressInfo.dist;
                                    state_final = kycResponse.addressInfo.state;
                                    post_code_final = kycResponse.addressInfo.pc;

                                    var p_details1 = `Your OTP is confirmed,`
                                        + `\n\n I have got your details from UIDAI as below`
                                    var p_details2 = `First name: ` + kycResponse.identityInfo.fname
                                        + `\n\n Middle name: ` + kycResponse.identityInfo.mname
                                        + `\n\n Last name: ` + kycResponse.identityInfo.lname
                                        + `\n\n Date of birth: ` + kycResponse.identityInfo.dob
                                        + `\n\n`
                                        + ` Address: ` + kycResponse.addressInfo.address
                                    var p_details3 = `If you wish to change the shared aadhaar,give me the new aadhaar number. `
                                    var p_details4 = `Else, enter email id to continue with application processing.`

                                    res.json({
                                        "messages": [
                                            {
                                                "type": 0,
                                                "speech": p_details1
                                            },
                                            {
                                                "type": 0,
                                                "speech": p_details2
                                            },
                                            {
                                                "type": 0,
                                                "speech": p_details3
                                            },
                                            {
                                                "type": 0,
                                                "speech": p_details4
                                            }

                                        ],

                                        "data": {},
                                        "contextOut": [{ "name": source_intent_name, "lifespan": 1, "parameters": { "f_name": kycResponse.identityInfo.fname } }],
                                        "source": source_intent_name
                                    })
                                } else {
                                    let message = errorCodes[body.errorCode];
                                    if (!message) {
                                        message = errorCodes['default'];
                                    }
                                    console.log("message:" + message)
                                    res.json({
                                        "speech": "Invalid OTP...!!Please enter the valid OTP",
                                        "displayText": "Invalid OTP...!!Please enter the valid OTP",
                                        "data": {},
                                        "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": "aadhaar_otp_send_intent", "lifespan": 1 }],
                                        "source": source_intent_name
                                    })
                                }

                            } else {
                                console.log("err>>>>:" + err)
                                res.json({
                                    "speech": "Invalid OTP...!!Please enter the valid OTP",
                                    "displayText": "Invalid OTP...!!Please enter the valid OTP",
                                    "data": {},
                                    "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": "aadhaar_otp_send_intent", "lifespan": 1 }],
                                    "source": source_intent_name
                                })
                            }

                        })
                } else if ((!isNaN(a_otp)) && ((a_otp.toString()).length == 12)) {
                    console.log("this is not a otp it might be a aadhaar number")
                    aadhaar_number1 = a_otp;
                    request({
                        url: `${appConfig.UIDAI.endPointUrl}/otp/${aadhaar_number1}`,
                        timeout: '30000'
                    }, function (err, response, body) {
                        body = JSON.parse(body);
                        if (!err) {
                            if (!body) {
                                console.log("OTP !body");
                                res.json({
                                    "speech": "Invalid Adhaar number..!! Enter the 12 digits of valid adhaar number",
                                    "displayText": "Invalid Adhaar number..!! Enter the 12 digits of valid adhaar number",
                                    "data": {},
                                    "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": "aadhaar_otp_send_intent", "lifespan": 1 }],
                                    "source": source_intent_name
                                })

                            } else if (body.status) {
                                aadhaar_otp_send_flag = true;
                                aadhaar_number_final = aadhaar_number1;//
                                console.log("OTP successfully sent");
                                var speech1 = "I have sent an OTP to the mobile number you have registered with UIDAI, let me know the OTP which you have recieved."
                                var speech2 = "Or if you want to change your adhaar number please enter it here"
                                res.json({
                                    "messages": [
                                        {
                                            "type": 0,
                                            "speech": speech1
                                        },
                                        {
                                            "type": 0,
                                            "speech": speech2
                                        }
                                    ],
                                    "data": {},
                                    "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": "aadhaar_otp_send_intent", "lifespan": 1 }],
                                    "source": source_intent_name
                                })

                            } else {
                                console.log("OTP else got the response  errorCodes ");
                                let message = errorCodes[body.errorCode];
                                if (!message) {
                                    message = errorCodes['default'];
                                }
                                res.json({
                                    "displayText": "Please enter the valid aadhaar number and try again..!!",
                                    "data": {},
                                    "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": "aadhaar_otp_send_intent", "lifespan": 1 }],
                                    "source": source_intent_name
                                })
                            }

                        } else {
                            console.log("OTP else error in server");
                            res.json({
                                "speech": "Server Error..!!  please enter the aadhaar number and try again..!!",
                                "displayText": "Server Error..!!  please enter the aadhaar number and try again..!!",
                                "data": {},
                                "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": "aadhaar_otp_send_intent", "lifespan": 1 }],
                                "source": source_intent_name
                            })
                        }
                    })

                } else {
                    console.log("Enter a valid otp number")
                    res.json({
                        "speech": "Invalid OTP...!!Please enter the 6 digits of valid OTP",
                        "displayText": "Invalid OTP...!!Please enter the valid OTP",
                        "data": {},
                        "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": "aadhaar_otp_send_intent", "lifespan": 1 }],
                        "source": source_intent_name
                    })
                }
                break;
            //adhaar otp verify completed


            //savings_aadhaar_email_otp_send_intent (input might be adhaar_number or email)

            case 'savings_aadhaar_email_otp_send_intent':

                console.log("savings_aadhaar_email_otp_send_intent case:", req.body.result)
                var e_email = req.body.result.parameters['email'];
                if (isNaN(e_email)) {
                    console.log("this is email" + e_email);
                    var otp_email1 = e_email.toString();
                    var email_arr = otp_email1.split('tabindex="-1');
                    console.log("email_arr" + email_arr);
                    var e_mail1 = email_arr[1].toString();
                    var e_mail2 = e_mail1.substring(2, (e_mail1.length - 2))
                    console.log("email:" + e_mail2);
                    e_mail2 = e_mail2.replace(' ', '.');
                    console.log("finale email:" + e_mail2);
                    var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    if (pattern.test(e_mail2)) {
                        email_final = e_mail2;//
                        OAOApplicationHelper.genOTP(function (otp) {
                            OAOApplicationHelper.sendOtpToMail(e_mail2, otp, function (success) {
                                console.log(otp)
                                if (success) {
                                    email_final = e_mail2;
                                    var speech1 = "I have sent an OTP to your email id, share it back with me here."
                                    var speech2 = "Or if you want to change the email ,you can enter it here"
                                    console.log("OTP successfully sent");
                                    res.json({
                                        "messages": [
                                            {
                                                "type": 0,
                                                "speech": speech1
                                            },
                                            {
                                                "type": 0,
                                                "speech": speech2
                                            }
                                        ],
                                        "data": {},
                                        "contextOut": [{}],
                                        "source": source_intent_name
                                    })
                                }
                            })
                        });
                    } else {
                        console.log("this is not a email");
                        res.json({
                            "speech": "Please enter the valid email",
                            "displayText": "Please enter the valid email",
                            "data": {},
                            "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": "aadhaar_otp_verify_intent", "lifespan": 1 }],
                            "source": source_intent_name
                        })
                    }

                } //email

                else if (!isNaN(e_email) && (e_email.toString()).length == 12) {
                    console.log("this is not a email it is aadhaar number:" + e_email)
                    var aadhaar_number1 = e_email;
                    aadhaar_number1 = (aadhaar_number1.toString()).replace(/\s/g, '');
                    request({
                        url: `${appConfig.UIDAI.endPointUrl}/otp/${aadhaar_number1}`,
                        timeout: '30000'
                    },
                        function (err, response, body) {
                            body = JSON.parse(body);
                            if (!err) {
                                if (!body) {
                                    console.log("OTP !body");
                                    res.json({ error: errorCodes['default'], data: null });

                                } else if (body.status) {
                                    aadhaar_number_final = aadhaar_number1;
        
                                    var speech1 = "I have sent an OTP to the mobile number you have registered with UIDAI, let me know the OTP which you have recieved."
                                    var speech2 = "Or if you want to re-enter your adhaar number please enter it here"
                                    console.log("OTP successfully sent");
                                    res.json({
                                        "messages": [
                                            {
                                                "type": 0,
                                                "speech": speech1
                                            },
                                            {
                                                "type": 0,
                                                "speech": speech2
                                            }
                                        ],
                                        "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": "aadhaar_otp_verify_intent", "lifespan": 1 }],
                                        "source": source_intent_name
                                    })

                                } else {

                                    console.log("OTP else errorCodes");
                                    let message = errorCodes[body.errorCode];
                                    //console.log("message is", message);
                                    if (!message) {
                                        message = errorCodes['default'];
                                    }
                                    res.json({ error: message, data: null });
                                }

                            } else {
                                console.log("OTP else");
                                res.json({ error: errorCodes['default'], data: null });
                            }
                        })

                }//adhaar number

                else if ((!isNaN(e_email)) && ((e_email.toString()).length == 6)) {
                    console.log("this is aadhaar otp");
                    var aadhaar_number1 = aadhaar_number_final;
                    var a_otp = e_email;

                    request({
                        url: `${appConfig.UIDAI.endPointUrl}/ekyc/${aadhaar_number1}/${a_otp}`,
                        timeout: '30000'
                    },
                        function (err, response, body) {
                            body = JSON.parse(body);
                            if (!err) {
                                if (!body) {
                                    console.log("!body");
                                    res.json({
                                        "speech": "Invalid OTP...!!Please enter the valid OTP",
                                        "displayText": "Invalid OTP...!!Please enter the valid OTP",
                                        "data": {},
                                        "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": "aadhaar_otp_verify_intent", "lifespan": 1 }],
                                        "source": source_intent_name
                                    })

                                } else if (body.status) {
                                    aadhaar_number_final = aadhaar_number1;
                                    aadhaar_otp_send_flag = false;
                                    let kycResponse = {
                                        "addressInfo": body.addressInfo
                                    }
                                    console.log("body:" + body)
                                    let address = combineAddressInfo(body.addressInfo);
                                    kycResponse['identityInfo'] = formatIdentityInfo(body.identityInfo);
                                    kycResponse.addressInfo.address = address;
                                    //getAadhaarDetails();

                                    f_name_final = kycResponse.identityInfo.fname;
                                    m_name_final = kycResponse.identityInfo.mname
                                    l_name_final = kycResponse.identityInfo.lname
                                    dob_final = kycResponse.identityInfo.dob
                                    address_final = kycResponse.addressInfo.address
                                    house_number_final = kycResponse.addressInfo.house
                                    street_name_final = kycResponse.addressInfo.street;
                                    suburb_final = kycResponse.addressInfo.dist;
                                    state_final = kycResponse.addressInfo.state;
                                    post_code_final = kycResponse.addressInfo.pc;

                                    var p_details1 = `Your OTP is confirmed,`
                                        + `\n\n I have got your details from UIDAI as below`
                                    var p_details2 = `First name: ` + kycResponse.identityInfo.fname
                                        + `\n\n Middle name: ` + kycResponse.identityInfo.mname
                                        + `\n\n Last name: ` + kycResponse.identityInfo.lname
                                        + `\n\n Date of birth: ` + kycResponse.identityInfo.dob
                                        + `\n\n`
                                        + ` Address: ` + kycResponse.addressInfo.address
                                    var p_details3 = `If you wish to change the shared aadhaar,give me the new aadhaar number. `
                                    var p_details4 = `Else, enter email id to continue with application processing.`



                                    res.json({
                                        "messages": [
                                            {
                                                "type": 0,
                                                "speech": p_details1
                                            },
                                            {
                                                "type": 0,
                                                "speech": p_details2
                                            },
                                            {
                                                "type": 0,
                                                "speech": p_details3
                                            },
                                            {
                                                "type": 0,
                                                "speech": p_details4
                                            }
                                        ],

                                        "data": {},
                                        "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": "aadhaar_otp_verify_intent", "lifespan": 1 }],
                                        "source": source_intent_name
                                    })

                                } else {
                                    let message = errorCodes[body.errorCode];
                                    if (!message) {
                                        message = errorCodes['default'];
                                    }
                                    console.log("message:" + message)
                                    res.json({
                                        "speech": "Invalid OTP...!!Please enter the valid OTP",
                                        "displayText": "Invalid OTP...!!Please enter the valid OTP",
                                        "data": {},
                                        "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": "aadhaar_otp_verify_intent", "lifespan": 1 }],
                                        "source": source_intent_name
                                    })
                                }

                            } else {
                                console.log("err>>>>:" + err)
                                res.json({
                                    "speech": "Invalid OTP...!!Please enter the valid OTP",
                                    "displayText": "Invalid OTP...!!Please enter the valid OTP",
                                    "data": {},
                                    "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": "aadhaar_otp_verify_intent", "lifespan": 1 }],
                                    "source": source_intent_name
                                })
                            }

                        })
                }//adhaar otp

                else {
                    console.log("this is not a aadhaar number or email or correct input")
                    res.json({
                        "speech": "Please enter the valid aadhaar",
                        "displayText": "Please enter the valid aadhaar",
                        "data": {},
                        "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": "aadhaar_otp_verify_intent", "lifespan": 1 }],
                        "source": source_intent_name
                    })
                }

                break;

            //savings_aadhaar_email_otp_send_intent (input might be adhaar_number or email cmpleted


            //savings_aadhaar_email_otp_verify_intent (input can be email or email_otp)
            case 'savings_aadhaar_email_otp_verify_intent':
                var e_otp = req.body.result.parameters['e_otp'];
                console.log("inside savings_aadhaar_email_otp_verify_intent:" + e_otp);

                if (!isNaN(e_otp) && ((e_otp.toString()).length == 6)) {
                    console.log("This is OTP:" + e_otp);
                    OAOApplicationHelper.verifyOtp(e_otp, function (success) {
                        console.log("success OTP:" + success)
                        if (success) {
                            console.log("this is mobile otp");
                            res.json({
                                "speech": "Give me your mobile number.",
                                "displayText": "Give me your mobile number.",
                                "data": {},
                                "contextOut": [{}],
                                "source": source_intent_name
                            })
                        } else if (!success) {
                            console.log("this is aadhaar otp");
                        }
                        else {
                            res.json({
                                "speech": "Invalid OTP...!!Please enter the valid OTP",
                                "displayText": "Invalid OTP...!!Please enter the valid OTP",
                                "data": {},
                                "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": "savings_aadhaar_email_otp_send_intent", "lifespan": 1 }],
                                "source": source_intent_name
                            })
                        }
                    });
                } else if (isNaN(e_otp)) {
                    console.log("This is not a OTP:" + e_otp);
                    var otp_email1 = e_otp.toString();
                    var email_arr = otp_email1.split('tabindex="-1');
                    var e_mail2 = "";
                    console.log("email_arr" + email_arr);
                    if (email_arr.length > 1) {
                        var e_mail1 = email_arr[1].toString();
                        e_mail2 = e_mail1.substring(2, (e_mail1.length - 2))
                        console.log("email:" + e_mail2);
                        e_mail2 = e_mail2.replace(' ', '.');
                    }
                    console.log("final email:" + e_mail2);
                    var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    if (pattern.test(e_mail2)) {
                        console.log("This is not a OTP this is email:" + e_mail2);
                        OAOApplicationHelper.genOTP(function (otp) {
                            OAOApplicationHelper.sendOtpToMail(e_mail2, otp, function (success) {
                                console.log(otp)
                                if (success) {
                                    email_final = e_mail2;
                                    var speech1 = "I have sent an OTP to your email id, share it back with me here."
                                    var speech2 = "Or if you want to change the email ,you can enter it here"
                                    console.log("OTP successfully sent");
                                    res.json({
                                        "messages": [
                                            {
                                                "type": 0,
                                                "speech": speech1
                                            },
                                            {
                                                "type": 0,
                                                "speech": speech2
                                            }
                                        ],
                                        "data": {},
                                        "contextOut": [{}],

                                        "data": {},
                                        "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": "savings_aadhaar_email_otp_send_intent", "lifespan": 1 }],
                                        "source": source_intent_name
                                    })
                                }
                            })
                        });
                    }
                    else {
                        console.log("This is not a OTP or email:" + e_otp);
                        res.json({
                            "speech": "Enter the valid inputs.",
                            "displayText": "Enter the valid inputs.",
                            "data": {},
                            "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": "savings_aadhaar_email_otp_send_intent", "lifespan": 1 }],
                            "source": source_intent_name
                        })
                    }
                }
                else {
                    console.log("This is not a OTP or email:" + e_otp);
                    res.json({
                        "speech": "Enter the valid OTP.",
                        "displayText": "Enter the valid OTP.",
                        "data": {},
                        "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": "savings_aadhaar_email_otp_send_intent", "lifespan": 1 }],
                        "source": source_intent_name
                    })
                }
                break;
            //savings_aadhaar_email_otp_verify_intent (input can be email or email_otp) completed

            //savings_aadhaar_mobile_otp_send_intent

            case 'savings_aadhaar_mobile_otp_send_intent':
                var mobile_number1 = req.body.result.parameters['mobile'];
                console.log("inside savings_aadhaar_mobile_otp_send_intent case :" + mobile_number1);

                if (!isNaN(mobile_number1) && (mobile_number1.toString().length) == 10) {
                    var mobile_number2 = "+91" + mobile_number1;
                    try {
                        if (mobile_number2 != null && mobile_number2 != "" && mobile_number2 != undefined) {
                            OAOApplicationHelper.genOTP(function (otp) {
                                OAOApplicationHelper.sendOtpToMobile(mobile_number2, otp, function (success) {
                                    console.log(otp)
                                    if (success) {
                                        mobile_number_final = mobile_number2;
                                        var speech1 = "I have sent an OTP to your new Phone number, share it back with me here."
                                        var speech2 = "Or if you want to change the phone Number,you can enter it here"
                                        console.log("OTP successfully sent");
                                        res.json({
                                            "messages": [
                                                {
                                                    "type": 0,
                                                    "speech": speech1
                                                },
                                                {
                                                    "type": 0,
                                                    "speech": speech2
                                                }
                                            ],
                                            "data": {},
                                            "contextOut": [{}],
                                            "source": source_intent_name
                                        })
                                    } else {
                                        res.json({
                                            "speech": "Invalid input..!!. Please enter a valid phone number.",
                                            "displayText": "Invalid input..!!. Please enter a valid phone number.",
                                            "data": {},
                                            "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": "savings_aadhaar_email_otp_verify_intent", "lifespan": 1 }],
                                            "source": source_intent_name
                                        })
                                    }

                                })
                            });
                        }
                    } catch (e) {
                        console.log("error in otp send");
                    }

                } else {
                    res.json({
                        "speech": "Invalid input..!!. Please enter a valid phone number.",
                        "displayText": "Invalid input..!!. Please enter a valid phone number.",
                        "data": {},
                        "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": "savings_aadhaar_email_otp_verify_intent", "lifespan": 1 }],
                        "source": source_intent_name
                    })
                }

                break;

            //savings_aadhaar_mobile_otp_send_intent completed


            //savings_aadhaar_mobile_otp_verify_intent
            case 'savings_aadhaar_mobile_otp_verify_intent':
                var m_otp = req.body.result.parameters['m_otp'];
                console.log("inside savings_aadhaar_mobile_otp_verify_intent case:" + m_otp);

                if (!isNaN(m_otp) && (m_otp.toString()).length == 6) {
                    console.log("this is otp" + m_otp);
                    OAOApplicationHelper.verifyOtp(m_otp, function (success) {
                        console.log("success OTP:" + success)
                        if (success) {
                            res.json({
                                "speech": "",
                                "displayText": "",
                                "data": {},
                                "contextOut": [{}],
                                "source": "savings_aadhaar_mobile_otp_verify_intent"
                            })
                        } else {
                            res.json({
                                "speech": "Invalid OTP...!!Please enter the valid OTP",
                                "displayText": "Invalid OTP...!!Please enter the valid OTP",
                                "data": {},
                                "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": "savings_aadhaar_mobile_otp_send_intent", "lifespan": 1 }],
                                "source": source_intent_name
                            })
                        }
                    });
                } //otp
                else if (!isNaN(m_otp) && (m_otp.toString()).length == 10) {
                    console.log("this is not otp for mobile" + m_otp);
                    var _mobile = "+91" + m_otp;
                    try {
                        OAOApplicationHelper.genOTP(function (otp) {
                            OAOApplicationHelper.sendOtpToMobile(_mobile, otp, function (success) {
                                console.log(otp)
                                if (success) {
                                    mobile_number_final = _mobile;
                                    var speech1 = "I have sent an OTP to your Phone number, share it back with me here."
                                    var speech2 = " Or if you want to change the email ,you can enter it here"
                                    console.log("OTP successfully sent");
                                    res.json({
                                        "messages": [
                                            {
                                                "type": 0,
                                                "speech": speech1
                                            },
                                            {
                                                "type": 0,
                                                "speech": speech2
                                            }
                                        ],
                                        "data": {},
                                        "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": "savings_aadhaar_mobile_otp_send_intent", "lifespan": 1 }],
                                        "source": source_intent_name
                                    })

                                } else {
                                    res.json({
                                        "speech": "Please enter the valid phone number.",
                                        "displayText": "Please enter the valid phone number.",
                                        "data": {},
                                        "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": "savings_aadhaar_mobile_otp_send_intent", "lifespan": 1 }],
                                        "source": source_intent_name
                                    })
                                }

                            })
                        });

                    } catch (e) {
                        console.log("error in otp send");
                    }
                }//mobile
                else {
                    res.json({
                        "speech": "Please enter the valid OTP or phone number",
                        "displayText": "Please enter the valid OTP or phone number",
                        "data": {},
                        "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": "savings_aadhaar_mobile_otp_send_intent", "lifespan": 1 }],
                        "source": source_intent_name
                    })
                }
                break;
            //savings_aadhaar_mobile_otp_verify_intent completed

            //aadhaar_basicInfo_intent

            case 'aadhaar_basicInfo_intent':
                if (aadhaar_number_final != null && aadhaar_number_final != undefined && aadhaar_number_final != "") {
                    aadhaar_flag_final = true;
                }

                postal_address_final = address_final;
                postal_house_number_final = house_number_final;
                postal_street_name_final = street_name_final;
                postal_suburb_final = suburb_final;
                postal_state_final = state_final;
                postal_post_code_final = post_code_final;

                if (product_type_name_final == "Savings Account") {
                    console.log(product_type_name_final);
                    submitSavingsAccountDetails(req, res);
                } else if (product_type_name_final == "Salary Account") {
                    console.log(product_type_name_final);
                    submitSalaryAccountDetails(req, res);
                } else if (product_type_name_final == "Vehicle Loan") {
                    console.log(product_type_name_final);
                    submitVehicleLoanDetails(req, res);
                }

                break;


            case 'aadhaar_basicInfo_postal_address_intent':
                if (aadhaar_number_final != null && aadhaar_number_final != undefined && aadhaar_number_final != "") {
                    aadhaar_flag_final = true;
                }
                postal_house_number_final = req.body.result.parameters['house_number'];
                postal_street_name_final = req.body.result.parameters['street_name'];
                postal_suburb_final = req.body.result.parameters['city'];
                postal_state_final = req.body.result.parameters['state'];
                postal_post_code_final = req.body.result.parameters['pincode'];

                postal_address_final = postal_house_number_final + " " + postal_street_name_final + " " + postal_suburb_final + " " + postal_state_final + " " + postal_post_code_final;
                if (product_type_name_final == "Savings Account") {
                    console.log(product_type_name_final);
                    submitSavingsAccountDetails(req, res);
                } else if (product_type_name_final == "Salary Account") {
                    console.log(product_type_name_final);
                    submitSalaryAccountDetails(req, res);
                } else if (product_type_name_final == "Vehicle Loan") {

                }

                break;
            //*************//AADHAAR Cases completed**********************************************************************

            case 'email_otp_send':
                console.log("email_otp_send case:", req.body.result)
                var _email1 = req.body.result.parameters['email'];
                title_final = req.body.result.parameters['title'];
                f_name_final = req.body.result.parameters['f_name']
                l_name_final = req.body.result.parameters['l_name']

                var email1_arr = (_email1.toString()).split('-1">');

                console.log("email bfore:" + _email1);

                var _email = email1_arr[1];
                _email = (_email.toString()).trim();
                console.log("email_otp_send final:" + _email)
                try {
                    if (_email != null && _email != "" && _email != undefined) {
                        OAOApplicationHelper.genOTP(function (otp) {
                            OAOApplicationHelper.sendOtpToMail(_email, otp, function (success) {
                                console.log(otp)

                                if (success) {
                                    email_final = _email;
                                    res.json({
                                        "speech": "",
                                        "displayText": "",
                                        "data": {},
                                        "contextOut": [{}],
                                        "source": source_intent_name
                                    })
                                }
                            })
                        });
                    }
                } catch (e) {
                    console.log("error in otp send");
                }

                break;
            case 'email_otp_verify':
                console.log("inside email_otp_verify case OTP:", req.body.result);
                var e_otp = req.body.result.parameters['e_otp'];

                if (!isNaN(e_otp)) {
                    console.log("This is OTP:" + e_otp);
                    OAOApplicationHelper.verifyOtp(e_otp, function (success) {
                        console.log("success OTP:" + success)
                        if (success) {
                            console.log()
                            res.json({
                                "speech": "Give me your mobile number.",
                                "displayText": "Give me your mobile number.",
                                "data": {},
                                "contextOut": [],
                                "source": "email_otp_verify"
                            })
                        } else {
                            res.json({
                                "speech": "Invalid OTP...!!Please enter the valid OTP",
                                "displayText": "Invalid OTP...!!Please enter the valid OTP",
                                "data": {},
                                "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": "email_otp_send", "lifespan": 1 }],
                                "source": source_intent_name
                            })
                        }
                    });
                } else {
                    console.log("This is not a OTP this is email:" + e_otp);

                    var otp_email1 = e_otp.toString();
                    var email_arr = otp_email1.split('tabindex="-1');
                    console.log("email_arr" + email_arr);
                    var e_mail1 = email_arr[1].toString();

                    var e_mail2 = e_mail1.substring(2, (e_mail1.length - 2))
                    console.log("email:" + e_mail2);
                    e_mail2 = e_mail2.replace(' ', '.');

                    console.log("finale email:" + e_mail2);
                    var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    if (pattern.test(e_mail2)) {
                        OAOApplicationHelper.genOTP(function (otp) {
                            OAOApplicationHelper.sendOtpToMail(e_mail2, otp, function (success) {
                                console.log(otp)
                                if (success) {
                                    email_final = _email;
                                    res.json({
                                        "speech": "I have sent an OTP to your new email id, share it back with me here.Or if you still want to change the email ,you can enter it here",
                                        "displayText": "I have sent an OTP to your new email id, share it back with me here.Or if you still want to change the email ,you can enter it here",
                                        "data": {},
                                        "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": "email_otp_send", "lifespan": 1 }],
                                        "source": source_intent_name
                                    })
                                }
                            })
                        });
                    }


                }
                break;


            case 'mobile_otp_send':
                var _mobile = "+91" + req.body.result.parameters['mobile']
                console.log("email_otp_send case: " + _mobile)
                try {
                    if (_mobile != null && _mobile != "" && _mobile != undefined) {
                        OAOApplicationHelper.genOTP(function (otp) {
                            OAOApplicationHelper.sendOtpToMobile(_mobile, otp, function (success) {
                                console.log(otp)
                                mobile_number_final = _mobile;
                                res.json({
                                    "speech": "",
                                    "displayText": "",
                                    "data": {},
                                    "contextOut": [{}],
                                    "source": source_intent_name
                                })
                            })
                        });
                    }
                } catch (e) {
                    console.log("error in otp send");
                }

                break;
            case 'mobile_otp_verify':
                var m_otp = req.body.result.parameters['m_otp'];
                console.log("inside email_otp_verify case OTP:" + m_otp);
                var otp_str = m_otp.toString();
                console.log("inside email_otp_verify case OTP length2:" + otp_str.length);
                if (otp_str.length < 7) {
                    console.log("this is otp for mobile" + m_otp);
                    OAOApplicationHelper.verifyOtp(m_otp, function (success) {
                        console.log("success OTP:" + success)
                        if (success) {
                            console.log()
                            res.json({
                                "speech": "Whats your Date of birth (MM/DD/YYYY)",
                                "displayText": "Whats your Date of birth (MM/DD/YYYY)",
                                "data": {},
                                "contextOut": [],
                                "source": "mobile_otp_verify"
                            })
                        } else {
                            res.json({
                                "speech": "Invalid OTP...!!Please enter the valid OTP",
                                "displayText": "Invalid OTP...!!Please enter the valid OTP",
                                "data": {},
                                "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": "mobile_otp_send", "lifespan": 1 }],
                                "source": source_intent_name
                            })
                        }


                    });
                } else if (otp_str.length == 10) {
                    console.log("this is not otp for mobile" + m_otp);
                    var _mobile = "+91" + m_otp;
                    try {
                        if (_mobile != null && _mobile != "" && _mobile != undefined) {
                            OAOApplicationHelper.genOTP(function (otp) {
                                OAOApplicationHelper.sendOtpToMobile(_mobile, otp, function (success) {
                                    console.log(otp)
                                    mobile_number_final = _mobile;
                                    res.json({
                                        "speech": "I have sent an OTP to your new Phone number, share it back with me here.Or if you still want to change the phone Number,you can enter it here",
                                        "displayText": "I have sent an OTP to your new Phone number, share it back with me here.Or if you still want to change the phone Number,you can enter it here",
                                        "data": {},
                                        "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": "mobile_otp_send", "lifespan": 1 }],
                                        "source": source_intent_name
                                    })
                                })
                            });
                        }
                    } catch (e) {
                        console.log("error in otp send");
                    }
                }



                break;

            case 'salary_employer_details_intent':
                console.log("employer_details_intent");
                var employer_skype1 = req.body.result.parameters['employer'];
                console.log("selected employee:", employer_skype1);
                OAODBHelper.getEmployers(function (result) {
                    for (var i = 0; i < result.length; i++) {
                        console.log(result[i].employer_name, "=", employer_skype1)
                        console.log(result[i].employer_name == employer_skype1)
                        if (result[i].employer_name == employer_skype1) {
                            employer_final = employer_skype1;
                            res.json({
                                "speech": "",
                                "displayText": "",
                                "data": {},
                                "contextOut": [{}],
                                "source": "salary_employer_details_intent"
                            })
                            break;

                        }
                        else {
                            res.json({
                                "speech": "Sorry,we regret to inform you that you cannot proceed with opening a salary account for the corporate you have entered.No worries, you can still go back and open a Savings account.Or enter the currect employer and try again..!!",
                                "displayText": "Sorry,we regret to inform you that you cannot proceed with opening a salary account for the corporate you have entered.No worries, you can still go back and open a Savings account.Or enter the currect employer and try again..!!",
                                "data": {},
                                "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": "salary_single_intent", "lifespan": 1 }],
                                "source": source_intent_name
                            })
                        }
                    }

                })
                break;

            //*********************************vehicle loan cases****************************** 

            case 'vehicle_loan_model_intent':
                console.log("vehicle_loan_model_intent case")
                var vehicle_model = req.body.result.parameters['vehicle_model'];
                city_final = req.body.result.parameters['city'];
                vehicleLoanType_final = req.body.result.parameters['vehicleLoanType_final'];

                console.log("vehicle_model:" + vehicle_model);
                if (isNaN(vehicle_model)) {
                    list_models = [];
                    console.log("its not a number :" + vehicle_model)
                    OAODBHelper.getVehicles(vehicle_model, function (result) {
                        if (result.length == 0) {
                            res.json({
                                "messages": [
                                    {
                                        "type": 0,
                                        "speech": "sorry..!! there is no model like this"
                                    },
                                    {
                                        "type": 0,
                                        "speech": "Try again or select another model"
                                    }
                                ],
                                "data": {},
                                "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": "vehicle_loan_city_intent", "lifespan": 1 }],
                                "source": source_intent_name
                            })
                        }
                        else if (result.length == 1) {
                            console.log("vehi:" + result[0].vehicle_make)
                            console.log("vehi1:" + result.vehicle_make)
                            var speech1 = "You have selected the vehicle " + result[0].vehicle_make;
                            vehicle_model_final = result[0].vehicle_make;
                            OAODBHelper.getVehiclePrice((vehicle_model_final.toString()), function (result) {
                                console.log("result:" + result)
                                ex_showroom_price_final = result.ex_showroom_price;
                                console.log("ex_showroom_price_final:" + ex_showroom_price_final)
                                var speech1 = "You have selected " + vehicle_model_final + " and the Ex-showroom price for this model is Rs." + ex_showroom_price_final;
                                res.json({
                                    "messages": [
                                        {
                                            "type": 0,
                                            "speech": speech1
                                        },
                                        {
                                            "type": 2,
                                            "title": "Type of employment",
                                            "replies": [
                                                "Salaried",
                                                "Self Employment"
                                            ]
                                        }

                                    ],
                                    "data": {},
                                    "contextOut": [{}],
                                    "source": source_intent_name
                                })
                            })

                        } else {
                            for (var i = 0; i < result.length; i++) {
                                console.log("vehicle>>:" + result[i].vehicle_make)
                                list_models.push((i + 1) + `.` + result[i].vehicle_make + `\n\n`);
                            }
                            var list_models1 = "";
                            console.log("list_models:", list_models);
                            list_models1 = list_models.toString();
                            list_models1 = list_models1.replace(/,/g, '')
                            // vehicle_model_final = list_models1;

                            res.json({
                                "messages": [

                                    {
                                        "type": 0,
                                        "speech": list_models1
                                    },
                                    {
                                        "type": 0,
                                        "speech": "You can choose any model from the above list."
                                    }
                                ],
                                "data": {},
                                "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": "vehicle_loan_city_intent", "lifespan": 1 }],
                                "source": source_intent_name
                            })
                        }

                    })
                }//not a number

                else if (!isNaN(vehicle_model) && vehicle_model <= (list_models.length)) {
                    console.log("its a number :" + vehicle_model)
                    console.log("list of models already stored length:" + list_models.length)
                    console.log("list of models already stored:" + list_models)

                    var v_model1 = (list_models[vehicle_model - 1]).toString();
                    var v_model = v_model1.split('.');

                    console.log("v_model.length >0>>> " + v_model.length > 0 + " v_model.length:" + v_model.length)

                    if (v_model.length > 0) {
                        vehicle_model_final = (v_model[1].toString()).trim();
                    }

                    console.log("vehicle_model_final>>>>>>>" + vehicle_model_final.trim() + "ok")
                    OAODBHelper.getVehiclePrice(vehicle_model_final, function (result) {

                        console.log("result:" + result)
                        ex_showroom_price_final = result.ex_showroom_price;
                        console.log("ex_showroom_price_final:" + ex_showroom_price_final)
                        var speech11 = "You have selected " + vehicle_model_final + " and the Ex-showroom price for this model is Rs." + ex_showroom_price_final;
                        res.json({
                            "messages": [
                                {
                                    "type": 0,
                                    "speech": speech11
                                },
                                {
                                    "type": 2,
                                    "title": "Type of employment",
                                    "replies": [
                                        "Salaried",
                                        "Self Employment"
                                    ]
                                }

                            ],
                            "data": {},
                            "contextOut": [{}],
                            "source": source_intent_name
                        })
                    })

                } else {
                    console.log("its a number :" + vehicle_model + " but not less than arry size")
                    res.json({
                        "messages": [
                            {
                                "type": 0,
                                "speech": "Please choose the correct one"
                            }
                        ],
                        "data": {},
                        "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": "vehicle_loan_city_intent", "lifespan": 1 }],
                        "source": source_intent_name
                    })
                }
                break;


            case 'vehicle_loan_employer_intent':
                var employer1 = req.body.result.parameters['employer'];
                employertype_final = req.body.result.parameters['employment_type']
                var pre_intent_name = "vehicle_loan_employment_type_salaried_intent";
                console.log("employers_list length:" + employers_list.length)
                if (isNaN(employer1) && employers_list.length == 1 && (employer1 == "Confirm" || employer1 == "Cancel")) {
                    console.log("pakka ok")
                    if (employer1 == "Confirm") {
                        console.log("pakka Confirm")
                        res.json({
                            "messages": [
                                {
                                    "type": 0,
                                    "speech": "You have selected " + employer_final
                                },
                                {
                                    "type": 0,
                                    "speech": "Let me know your net annual income.?"
                                }
                            ],
                            "data": {},
                            "contextOut": [{}],
                            "source": source_intent_name
                        })

                    } else {
                        console.log("pakka Cancel")
                        res.json({
                            "messages": [
                                {
                                    "type": 0,
                                    "speech": "Okay..!! please enter the correct employer."
                                }
                            ],
                            "data": {},
                            "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": pre_intent_name, "lifespan": 1 }],
                            "source": source_intent_name
                        })

                    }
                }
                else if (isNaN(employer1) && employer1 != "Confirm" && employer1 != "Cancel") {
                    employers_list = [];
                    console.log("its not a number :" + employer1)
                    OAODBHelper.getEmployers_chatbot(employer1, function (result) {
                        if (result.length == 0) {
                            res.json({
                                "messages": [
                                    {
                                        "type": 0,
                                        "speech": "sorry..!! there is no Employer  like this"
                                    },
                                    {
                                        "type": 0,
                                        "speech": "Try again or select another Employer"
                                    }
                                ],
                                "data": {},
                                "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": pre_intent_name, "lifespan": 1 }],
                                "source": source_intent_name
                            })
                        }
                        else if (result.length == 1) {
                            console.log("employer:" + result[0].employer_name)
                            var speech1 = "Did you mean " + result[0].employer_name + " ?";
                            employers_list.push(result[0].employer_name);
                            employer_final = result[0].employer_name;

                            res.json({
                                "messages": [
                                    {
                                        "type": 1,
                                        "title": "",
                                        "subtitle": speech1,
                                        "imageUrl": "",
                                        "buttons": [
                                            {
                                                "text": "Confirm",
                                                "postback": ""
                                            },
                                            {
                                                "text": "Cancel",
                                                "postback": ""
                                            }
                                        ]
                                    }
                                ],
                                "data": {},
                                "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": pre_intent_name, "lifespan": 1 }],
                                "source": source_intent_name
                            })

                        } else {
                            for (var i = 0; i < result.length; i++) {
                                console.log("vehicle>>:" + result[i].employer_name)
                                employers_list.push((i + 1) + `.` + result[i].employer_name + `\n\n`);
                            }
                            var employers_list1 = "";
                            console.log("employers_list:", employers_list);
                            employers_list1 = employers_list.toString();
                            employers_list1 = employers_list1.replace(/,/g, '')

                            res.json({
                                "messages": [

                                    {
                                        "type": 0,
                                        "speech": employers_list1
                                    },
                                    {
                                        "type": 0,
                                        "speech": "You can choose your employer from the above list."
                                    }
                                ],
                                "data": {},
                                "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": pre_intent_name, "lifespan": 1 }],
                                "source": source_intent_name
                            })
                        }

                    }) //result
                }//not a number
                else if (!isNaN(employer1) && employer1 <= (employers_list.length)) {
                    console.log("its a number :" + employer1)
                    console.log("list of models already stored length:" + employers_list.length)
                    console.log("list of models already stored:" + employers_list)
                    var e_name = (employers_list[employer1 - 1]).toString();
                    var e_name1 = e_name.split('.');
                    if (e_name1.length > 0) {
                        employer_final = e_name1[1];
                    }

                    var speech11 = "You have selected " + employer_final;
                    var speech12 = "Let me know your net annual income.?";
                    res.json({
                        "messages": [
                            {
                                "type": 0,
                                "speech": speech11
                            },
                            {
                                "type": 0,
                                "speech": speech12
                            }


                        ],
                        "data": {},
                        "contextOut": [{}],
                        "source": source_intent_name
                    })
                    employers_list = [];
                } else {
                    console.log("its a number :" + employer1 + " but not less than arry size")
                    res.json({
                        "messages": [
                            {
                                "type": 0,
                                "speech": "Please choose the correct one"
                            }
                        ],
                        "data": {},
                        "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": pre_intent_name, "lifespan": 1 }],
                        "source": source_intent_name
                    })
                }

                break;


            //EMI calculator
            case 'vehicle_loan_work_experience_intent':
                console.log("vehicle_loan_work_experience_intent case")

                var annual_income1 = req.body.result.parameters['annual_income'];
                var work_experience1 = req.body.result.parameters['work_experience'];
                console.log("anuual_income1:" + annual_income1)
                console.log("work_experience1:" + work_experience1)
                product_code_final = "VL1";

                netIncome_final = annual_income1;
                work_experience_final = work_experience1;

                var eligibile_loan_amount1 = 0;
                var eligibile_loan_amount2 = 0;
                var eligibile_loan_amount3 = 0;
                var max_allowed_percent1 = 0;
                var max_permissible_amount1 = 0;

                OAODBHelper.getProductContent(product_code_final, function (result) {
                    max_allowed_percent1 = parseInt(result[0].max_allowed_percent);
                    max_permissible_amount1 = parseInt(result[0].max_permissible_amount);

                    eligibile_loan_amount3 = max_permissible_amount1;
                    eligibile_loan_amount1 = (parseInt(ex_showroom_price_final) * parseInt(max_allowed_percent1)) / 100;
                    eligibile_loan_amount2 = parseInt(annual_income1) * 3;

                    console.log("ex * amx_allow by 100:" + eligibile_loan_amount1)
                    console.log("annual * 3:" + eligibile_loan_amount2)
                    console.log("max_permissible_amount:" + eligibile_loan_amount3)

                    eligibile_loan_amount_final = Math.min(eligibile_loan_amount1, eligibile_loan_amount2, eligibile_loan_amount3)
                    console.log("eligibile_loan_amount_final:" + eligibile_loan_amount_final);
                    var emi = calculateEMI(eligibile_loan_amount_final, interest_final, loan_term_final)
                    emi_final = emi;
                    eligibile_emi_final = emi;
                    loan_amount_final = eligibile_loan_amount_final;
                    var speech1 = `Your EMI is calculated as below.`
                    var speech2 = `Maximum eligility : Rs.` + eligibile_loan_amount_final +
                        `\n\n Loan amount : Rs.` + loan_amount_final +
                        `\n\n Rate of Interest(%): ` + interest_final +
                        ` \n\n Tenor (in years): ` + loan_term_final +
                        `\n\n Monthly Installment : Rs.` + emi_final;

                    var speech3 = "------------OR -----------"


                    res.json({
                        "messages": [
                            {
                                "type": 0,
                                "speech": speech1
                            },
                            {
                                "type": 0,
                                "speech": speech2
                            },

                            {
                                "type": 1,
                                "title": "Re-calculate EMI ?",
                                "subtitle": "",
                                "imageUrl": "",
                                "buttons": [
                                    {
                                        "text": "Change Tenor",
                                        "postback": "Change Tenor"
                                    },
                                    {
                                        "text": "Change EMI",
                                        "postback": "Change EMI"
                                    },
                                    {
                                        "text": "Change Loan Amount",
                                        "postback": "Change Loan Amount"
                                    }
                                ]
                            },
                            {
                                "type": 0,
                                "speech": speech3
                            },


                            {
                                "type": 1,
                                "title": "",
                                "subtitle": "click below button to ",
                                "imageUrl": "",
                                "buttons": [
                                    {
                                        "text": "Proceed",
                                        "postback": ""
                                    }
                                ]
                            }


                        ],
                        "data": {},
                        "contextOut": [{ "name": "vehicle_loan_work_experience_intent", "lifespan": 1 }, { "name": "vehicle_loan_change_loan_amount_intent", "lifespan": 1 }, { "name": "vehicle_loan_change_EMI_intent", "lifespan": 1 }, { "name": "vehicle_loan_change_tenor_intent", "lifespan": 1 }],
                        "source": "vehicle_loan_EMI_routs_intent"
                    })

                })
                // vehicle_loan_change_EMI_intent
                // vehicle_loan_change_tenor_intent
                // vehicle_loan_change_loan_amount_intent
                break;
            case 'vehicle_loan_change_loan_amount_intent':
                var change_loan_amount = req.body.result.parameters['change_loan'];
                console.log("vehicle_loan_01_change_loan_amount_intent case:" + change_loan_amount)
                var pre_intent_name = "vehicle_loan_01_EMI_routs_intent";
                if (parseInt(change_loan_amount) > eligibile_loan_amount_final || isNaN(change_loan_amount)) {
                    var speech1 = "Sorry..!!! You are not eligible for this amount "
                    var speech2 = "Your loan amount should be less than or equal to your eligible loan amount i.e Rs." + eligibile_loan_amount_final

                    res.json({
                        "messages": [
                            {
                                "type": 0,
                                "speech": speech1
                            },
                            {
                                "type": 0,
                                "speech": speech2
                            }
                        ],
                        "data": {},
                        "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": pre_intent_name, "lifespan": 1 }],
                        "source": source_intent_name
                    })

                } else {
                    loan_amount_final = parseInt(change_loan_amount);
                    var emi = calculateEMI(loan_amount_final, interest_final, loan_term_final)
                    emi_final = emi;
                    var speech1 = `Your EMI is calculated as below.`
                    var speech2 = `Maximum eligility : Rs.` + eligibile_loan_amount_final +
                        `\n\n Loan amount : Rs.` + loan_amount_final +
                        `\n\n Rate of Interest(%): ` + interest_final +
                        ` \n\n Tenor (in years):` + loan_term_final +
                        `\n\n Monthly Installment : Rs.` + emi_final;

                    var speech3 = "------------OR -----------"
                    res.json({
                        "messages": [
                            {
                                "type": 0,
                                "speech": speech1
                            },
                            {
                                "type": 0,
                                "speech": speech2
                            },
                            {
                                "type": 1,
                                "title": "Re-calculate EMI ?",
                                "subtitle": "",
                                "imageUrl": "",
                                "buttons": [
                                    {
                                        "text": "Change Tenor",
                                        "postback": "Change Tenor"
                                    },
                                    {
                                        "text": "Change EMI",
                                        "postback": "Change EMI"
                                    },
                                    {
                                        "text": "Change Loan Amount",
                                        "postback": "Change Loan Amount"
                                    }
                                ]
                            },
                            {
                                "type": 0,
                                "speech": speech3
                            },
                            {
                                "type": 1,
                                "title": "",
                                "subtitle": "click below button to ",
                                "imageUrl": "",
                                "buttons": [
                                    {
                                        "text": "Proceed",
                                        "postback": "Proceed"
                                    }
                                ]
                            }


                        ],
                        "data": {},
                        "contextOut": [{ "name": "vehicle_loan_work_experience_intent", "lifespan": 1 }, { "name": "vehicle_loan_01_change_EMI_intent", "lifespan": 1 }, { "name": "vehicle_loan_01_change_tenor_intent", "lifespan": 1 }, { "name": "vehicle_loan_01_change_loan_amount_intent", "lifespan": 1 }, { "name": "vehicle_loan_change_EMI_intent", "lifespan": 1 }, { "name": "vehicle_loan_change_tenor_intent", "lifespan": 1 }, { "name": "vehicle_loan_change_loan_amount_intent", "lifespan": 1 }],
                        "source": source_intent_name
                    })

                }



                break;

            case 'vehicle_loan_change_EMI_intent':
                var pre_intent_name = "vehicle_loan_01_change_EMI_intent"
                var change_emi_amount = req.body.result.parameters['change_emi'];
                console.log("change_emi_amount:" + change_emi_amount)
                if (isNaN(change_emi_amount)) {
                    var speech1 = "Sorry..!!! You are not eligible for this EMI "
                    var speech2 = "Your EMI should be less than or equal to your eligible EMI i.e. Rs. " + emi_final

                    res.json({
                        "messages": [
                            {
                                "type": 0,
                                "speech": speech1
                            },
                            {
                                "type": 0,
                                "speech": speech2
                            }
                        ],
                        "data": {},
                        "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": pre_intent_name, "lifespan": 1 }],
                        "source": source_intent_name
                    })

                } else {

                    var monthlyEmiRange = parseInt(change_emi_amount);
                    var intreset_emi = (interest_final / (12 * 100));

                    var months = Math.log((monthlyEmiRange) / ((monthlyEmiRange) - (loan_amount_final * intreset_emi))) / Math.log(1 + intreset_emi);
                    var number_0f_months = Math.round(months);
                    var loanTermRange = Math.round(number_0f_months / 12);
                    console.log("no of months" + months);
                    emi_final = change_emi_amount;
                    loan_term_final = loanTermRange;

                    var speech1 = `Your EMI is calculated as below.`
                    var speech2 = `Maximum eligility : Rs.` + eligibile_loan_amount_final +
                        `\n\n Loan Amount : Rs.` + loan_amount_final +
                        `\n\n Rate of Interest(%): ` + interest_final +
                        ` \n\n Tenor (in years):` + loan_term_final +
                        `\n\n Monthly Installment : Rs.` + emi_final;

                    var speech3 = "------------OR -----------"

                    res.json({
                        "messages": [
                            {
                                "type": 0,
                                "speech": speech1
                            },
                            {
                                "type": 0,
                                "speech": speech2
                            },

                            {
                                "type": 1,
                                "title": "Re-calculate EMI ?",
                                "subtitle": "",
                                "imageUrl": "",
                                "buttons": [
                                    {
                                        "text": "Change Tenor",
                                        "postback": "Change Tenor"
                                    },
                                    {
                                        "text": "Change EMI",
                                        "postback": "Change EMI"
                                    },
                                    {
                                        "text": "Change Loan Amount",
                                        "postback": "Change Loan Amount"
                                    }
                                ]
                            },
                            {
                                "type": 0,
                                "speech": speech3
                            },
                            {
                                "type": 1,
                                "title": "",
                                "subtitle": "click below button to ",
                                "imageUrl": "",
                                "buttons": [
                                    {
                                        "text": "Proceed",
                                        "postback": "Proceed"
                                    }
                                ]
                            }


                        ],
                        "data": {},
                        "contextOut": [{ "name": "vehicle_loan_work_experience_intent", "lifespan": 1 }, { "name": "vehicle_loan_01_change_EMI_intent", "lifespan": 1 }, { "name": "vehicle_loan_01_change_tenor_intent", "lifespan": 1 }, { "name": "vehicle_loan_01_change_loan_amount_intent", "lifespan": 1 }, { "name": "vehicle_loan_change_EMI_intent", "lifespan": 1 }, { "name": "vehicle_loan_change_tenor_intent", "lifespan": 1 }, { "name": "vehicle_loan_change_loan_amount_intent", "lifespan": 1 }],
                        "source": source_intent_name
                    })

                }


                break;

            case 'vehicle_loan_change_tenor_intent':
                var pre_intent_name = "vehicle_loan_01_change_tenor_intent"

                var change_tenor = req.body.result.parameters['change_tenor'];

                if (parseInt(change_tenor) > eligibile_tenor_final || isNaN(change_tenor)) {
                    var speech1 = "Sorry..!!! You are not eligible for this tenor "
                    var speech2 = "Your loan tenor should be less than or equal to your eligible loan tenor i.e." + eligibile_tenor_final + " years"
                    res.json({
                        "messages": [
                            {
                                "type": 0,
                                "speech": speech1
                            },
                            {
                                "type": 0,
                                "speech": speech2
                            }
                        ],
                        "data": {},
                        "contextOut": [{ "name": source_intent_name, "lifespan": 0 }, { "name": pre_intent_name, "lifespan": 1 }],
                        "source": source_intent_name
                    })

                } else {
                    loan_term_final = parseInt(change_tenor);
                    var emi = calculateEMI(eligibile_loan_amount_final, interest_final, loan_term_final)
                    emi_final = emi;
                    loan_amount_final = eligibile_loan_amount_final;

                    var speech1 = `Your EMI is calculated as below.`
                    var speech2 = `Maximum eligility : Rs.` + eligibile_loan_amount_final +
                        `\n\n Loan amount : Rs.` + loan_amount_final +
                        `\n\n Rate of Interest(%): ` + interest_final +
                        ` \n\n Tenor (in years):` + loan_term_final +
                        `\n\n Monthly Installment : Rs.` + emi_final;

                    var speech3 = "------------OR -----------"


                    res.json({
                        "messages": [
                            {
                                "type": 0,
                                "speech": speech1
                            },
                            {
                                "type": 0,
                                "speech": speech2
                            },

                            {
                                "type": 1,
                                "title": "Re-calculate EMI ?",
                                "subtitle": "",
                                "imageUrl": "",
                                "buttons": [
                                    {
                                        "text": "Change Tenor",
                                        "postback": "Change Tenor"
                                    },
                                    {
                                        "text": "Change EMI",
                                        "postback": "Change EMI"
                                    },
                                    {
                                        "text": "Change Loan Amount",
                                        "postback": "Change Loan Amount"
                                    }
                                ]
                            },
                            {
                                "type": 0,
                                "speech": speech3
                            },
                            {
                                "type": 1,
                                "title": "",
                                "subtitle": "click below button to ",
                                "imageUrl": "",
                                "buttons": [
                                    {
                                        "text": "Proceed",
                                        "postback": "Proceed"
                                    }
                                ]
                            }


                        ],
                        "data": {},
                        "contextOut": [{ "name": "vehicle_loan_work_experience_intent", "lifespan": 1 }, { "name": "vehicle_loan_01_change_EMI_intent", "lifespan": 1 }, { "name": "vehicle_loan_01_change_tenor_intent", "lifespan": 1 }, { "name": "vehicle_loan_01_change_loan_amount_intent", "lifespan": 1 }, { "name": "vehicle_loan_change_EMI_intent", "lifespan": 1 }, { "name": "vehicle_loan_change_tenor_intent", "lifespan": 1 }, { "name": "vehicle_loan_change_loan_amount_intent", "lifespan": 1 }],
                        "source": source_intent_name
                    })

                }

                break;

            case 'vehicle_loan_father_name_intent':
                console.log("vehicle_loan_father_name_intent case")
                residence_month_final = req.body.result.parameters['residence_month'];
                residenceType_final = req.body.result.parameters['residence_type'];
                fatherName_final = req.body.result.parameters['father_name'];
                noOfDependents_final = req.body.result.parameters['no_dependent']
                maritalStatus_final = req.body.result.parameters['martial_status'];
                gender_final = req.body.result.parameters['gender'];

                submitVehicleLoanAddress_no_aadhaar(req, res, app_id_final);

                break;

            case 'vehicle_loan_office_address_intent':
            console.log("vehicle_loan_office_address_intent case")
                designation_final = req.body.result.parameters['designation'];
                workEmailId_final = req.body.result.parameters['work_email'];
                work_phone_number_final = req.body.result.parameters['work_phone_number'];
                workaddress_final = req.body.result.parameters['office_address'];

                submit_final_VehicleLoan_no_aadhaar(req,res,app_id_final);

                break

            //*****************************************inserting data into database******************************* */
            case 'basic_info':

                console.log("basic info  product_type_name_final:" + product_type_name_final)
                var dob = req.body.result.parameters['dob']
                var moment = require('moment');
                console.log("dob:" + dob)
                dob_final = moment(dob, "YYYY-MM-DD").format("MM/DD/YYYY");
                console.log("dob final:" + dob_final)
                switch (product_type_name_final) {
                    case 'Savings Account':
                        console.log(">> Savings Account case")
                        product_code_final = "BNA"
                        product_type_code_final = "SAV"
                        submitSavingsAccountDetails_no_aadhaar(req, res)
                        break;
                    case 'Salary Account':
                        console.log(">> Salary Account  case")
                        product_code_final = "SAL1"
                        product_type_code_final = "SAL"
                        submitSalaryAccountDetails_no_aadhaar(req, res);
                        break;
                    case 'Vehicle Loan':
                        console.log(" >>Vehicle Loan")
                        product_code_final = "VL1"
                        product_type_code_final = "LAA"
                        submitVehicleLoan_no_aadhaar(req, res);
                        break;
                    default:
                        console.log("Default Wrong product_type_name_final:" + product_type_name_final)
                        break
                }
                break;
            case 'addres':
                var address = req.body.result.parameters['address'] + " " + req.body.result.parameters['city'] + " " + req.body.result.parameters['state'] + " " + req.body.result.parameters['pincode'];
                var app_id = req.body.result.parameters['app_id'];
                app_id_final = app_id;

                address_final = address;
                house_number_final = req.body.result.parameters['house_number'];
                street_name_final = req.body.result.parameters['address'];
                city_final = req.body.result.parameters['city'];
                state_final = req.body.result.parameters['state'];
                post_code_final = req.body.result.parameters['pincode'];
                console.log("addres:app_id :" + app_id);

                console.log("before product_type_name_final:" + product_type_code_final)
                product_type_code_final = req.body.result.parameters['product_type_code'];
                console.log("after product_type_name_final:" + product_type_code_final)

                switch (product_type_code_final) {
                    case 'SAV':
                        console.log(">> Savings Account address")
                        submitSavingAccountAddress_no_aadhaar(req, res, app_id)
                        break;
                    case 'SAL':
                        console.log(">> Salary Account  address")
                        submitSalaryAccountAddress_no_aadhaar(req, res, app_id);
                        break;
                    case 'LAA':
                        console.log(" >>Vehicle Loan address")
                        var speech1 = "Can you please provide your residence type ? "
                        res.json({
                            "messages": [
                                {
                                    "type": 0,
                                    "speech": speech1
                                }
                            ],
                            "data": {},
                            "contextOut": [{ "name": source_intent_name, "lifespan": 1, "parameters": { "app_id": app_id } }, { "name": "aadhaar_basicInfo_postal_address_intent", "lifespan": 1 }, { "name": "aadhaar_basicInfo_intent", "lifespan": 1 }],
                            "source": source_intent_name
                        })
                        //submitVehicleLoanAddress_no_aadhaar(req, res, app_id);
                        break;
                    default:
                        console.log("Default Wrong product_type_name_final:" + product_type_code_final)
                        break;

                }
                break;


        }//switch
    });
//   end


function calculateEMI(amount, interest, term) {
    var noOfMonths = term * 12;
    var int = ((interest) / (12 * 100));
    console.log(noOfMonths);
    var emi = ((amount) * int * (Math.pow((1 + int), noOfMonths))) / (Math.pow((1 + int), noOfMonths) - 1);
    var newEMI = Math.ceil(emi);
    return newEMI;
}

combineAddressInfo = (addressInfo) => {

    let address = ((addressInfo.co) ? addressInfo.co : "") +
        ((addressInfo.house) ? (", " + addressInfo.house) : "") +
        ((addressInfo.street) ? (", " + addressInfo.street) : "") +
        ((addressInfo.lm) ? (", " + addressInfo.lm) : "") +
        ((addressInfo.loc) ? (", " + addressInfo.loc) : "") +
        ((addressInfo.vtc) ? (", " + addressInfo.vtc) : "") +
        ((addressInfo.subdist) ? (", " + addressInfo.subdist) : "") +
        ((addressInfo.dist) ? (", " + addressInfo.dist) : "") +
        ((addressInfo.state) ? (", " + addressInfo.state) : "") +

        ((addressInfo.pc) ? (" " + addressInfo.pc) : "") + ", India";
    return address;
}

formatIdentityInfo = (identityInfo) => {

    let dob = moment(identityInfo.dob, "DD-MM-YYYY").format("MM/DD/YYYY");
    let content = identityInfo.name.split(' ');
    let fname = "";
    let manme = "";
    let lname = "";
    let size = content.length;
    fname = content[0];
    if (size > 1) {
        lname = content[size - 1];
        mname = "";

        for (let i = 1; i < size - 1; i++) {
            mname += content[i] + " "
        }
        mname.trim();
    }
    let idInfo = {
        dob,
        fname,
        mname,
        lname
    }

    return idInfo;

}
function getAadhaarDetails() {
    console.log("getAadhaarDetails()");
    f_name_final = kycResponse.identityInfo.fname;
    m_name_final = kycResponse.identityInfo.mname
    l_name_final = kycResponse.identityInfo.lname
    dob_final = kycResponse.identityInfo.dob
    address_final = kycResponse.addressInfo.address
    street_name_final = kycResponse.addressInfo.street;
    suburb_final = kycResponse.addressInfo.dist;
    state_final = kycResponse.addressInfo.state;
    post_code_final = kycResponse.addressInfo.pc;
}

//******************************************ADHAAR START*************************************
function submitSavingsAccountDetails(req, res) {
    console.log("SubmitSavingsAccountDetails(" + source_intent_name + ")");

    // var date = moment(dob_final, 'MM/DD/YYYY');
    // var new_dob = date.format('MM/DD/YYYY');

    OAODBHelper.GenerateApplicationReferenceId(req, res, function (result) {
        console.log("sequence generator data", result, req.body);
        var app_id = OAOApplicationHelper.RefIdFormater(Number(result.app_ref_id) + 1, req);
        var Oao_product_customer_details = new OAOApplicantSchema({
            product_code: "BNA",
            product_type_code: "SAV",
            singleORjoint: single_joint_final,
            //campaign_id: req.body.campaign_id,
            deviceType: "skypebot",
            existing_cust_status: "N",
            title: title_final,
            application_id: app_id,
            fname: f_name_final,
            mname: m_name_final,
            lname: l_name_final,
            dob: new_dob,
            email: email_final,
            mobile: mobile_number_final,
            is_aadhaar: aadhaar_flag_final,
            aadhaar_number: aadhaar_number_final,
            address: address_final,
            paddress: postal_address_final,

            housenum: house_number_final,
            streetname: street_name_final,
            suburb: suburb_final,
            state: state_final,
            postcode: post_code_final,

            phousenum: postal_house_number_final,
            pstreetname: postal_street_name_final,
            psuburb: postal_suburb_final,
            pstate: postal_state_final,
            ppostcode: postal_post_code_final,

            brokerid: req.body.brokerid,
            username: req.body.username,
            refnum: req.body.refnum,
            no_address_found_flag: false,
            section_SAV: {},
            bot_fields: {},
            no_of_section: config_urls.number_of_sections["SAV"],
            Mandatory_fields_SAV: [{
                section_1_fields: [{
                    lname: true,
                    fname: true,
                    dob: true,
                    email: true,
                    mobile: true,
                    address: true,
                    paddress: true

                }],
                section_2_fields: [{
                    pan: false,
                }],
                section_3_fields: [{

                }]
            }]
        })
        console.log("Application id:" + app_id);
        OAODBHelper.checkExistingApplicant(req, res, function (result) {
            if (!result) {
                OAODBHelper.save(Oao_product_customer_details, function (result) {
                    //Send mail for Everyday
                    var data = {
                        'fname': result.fname,
                        'lname': result.lname
                    }
                    // sending success message to email 
                    OAOApplicationHelper.SendMail(result.email, result.application_id, data, 'SAVE_SUBMISSION', function (callbackResult) {
                        console.log('Save submission mail sent status ', JSON.stringify(callbackResult));
                    })
                    //sending success message to phone  
                    OAOApplicationHelper.sendApplicationDeatils_mobile(mobile_number_final, app_id, f_name_final, function (callbackResult) {
                        console.log('Save submission message sent status ', JSON.stringify(callbackResult));
                    })
                    var url_btn = "https://oaoindiastackdev.herokuapp.com/home/chatbot/" + app_id;
                    var speech1 = `Thanks, all your personal details are capture for ` + product_type_name_final + ` application-` + app_id
                    var speech2 = "We need you to now upload all  your supporting documents."

                    console.log("intent name:" + source_intent_name + " application id:" + app_id);
                    OAOApplicantSchema.findOne({ application_id: app_id }, function (err, result) {
                        result.section_SAV[0].section_1 = true;
                        OAODBHelper.save(result, function (result) {
                            res.json({
                                "messages": [
                                    {
                                        "type": 0,
                                        "speech": speech1
                                    },
                                    {
                                        "type": 0,
                                        "speech": speech2
                                    },
                                    {
                                        "type": 1,
                                        "title": "",
                                        "subtitle": "click bellow button to upload",
                                        "imageUrl": "",
                                        "buttons": [
                                            {
                                                "text": "Upload",
                                                "postback": url_btn,
                                            },
                                        ]
                                    }
                                ],
                                "data": {},
                                "contextOut": [{}],
                                "source": source_intent_name
                            })
                        })
                    })
                })
            }//if 
        })
    })
}//SubmitSavingsAccountDetails close


//SubmitSalaryAccountDetails
function submitSalaryAccountDetails(req, res) {
    console.log("submitSalaryAccountDetails(" + source_intent_name + ")");
    OAODBHelper.GenerateApplicationReferenceId(req, res, function (result) {
        console.log("sequence generator data", result, req.body);
        // var date = moment(dob_final, 'MM/DD/YYYY');
        // var new_dob = date.format('MM/DD/YYYY');

        var app_id = OAOApplicationHelper.RefIdFormater(Number(result.app_ref_id) + 1, req);
        var Oao_product_customer_details = new OAOApplicantSchema({
            product_code: "SAL1",
            product_type_code: "SAL",
            singleORjoint: single_joint_final,
            //campaign_id: req.body.campaign_id,
            deviceType: "skypebot",
            existing_cust_status: "N",
            title: title_final,
            application_id: app_id,
            fname: f_name_final,
            mname: m_name_final,
            lname: l_name_final,
            dob: new_dob,
            email: email_final,
            mobile: mobile_number_final,
            is_aadhaar: aadhaar_flag_final,
            aadhaar_number: aadhaar_number_final,
            employer: employer_final,
            address: address_final,
            paddress: postal_address_final,
            housenum: house_number_final,
            streetname: street_name_final,
            suburb: suburb_final,
            state: state_final,
            postcode: post_code_final,
            phousenum: postal_house_number_final,
            pstreetname: postal_street_name_final,
            psuburb: postal_suburb_final,
            pstate: postal_state_final,
            ppostcode: postal_post_code_final,
            brokerid: req.body.brokerid,
            username: req.body.username,
            refnum: req.body.refnum,
            no_address_found_flag: false,
            section_SAL: {},
            bot_fields: {},
            no_of_section: config_urls.number_of_sections["SAL"],
            Mandatory_fields_SAL: [{
                section_1_fields: [{
                    lname: true,
                    fname: true,
                    dob: true,
                    email: true,
                    employer: true,
                    mobile: true,
                    address: true,
                    paddress: true
                }],
                section_2_fields: [{
                    employment_letter: false
                }],
                section_3_fields: [{
                    pan: false
                }],
                section_4_fields: [{
                }]
            }]
        })
        console.log("Application id:" + app_id);
        OAODBHelper.checkExistingApplicant(req, res, function (result) {
            if (!result) {
                OAODBHelper.save(Oao_product_customer_details, function (result) {
                    var data = {
                        'fname': result.fname,
                        'lname': result.lname
                    }
                    //sending success message to email 
                    OAOApplicationHelper.SendMail(result.email, result.application_id, data, 'SAVE_SUBMISSION', function (callbackResult) {
                        console.log('Save submission mail sent status ', JSON.stringify(callbackResult));
                    })
                    //sending success message to phone 
                    OAOApplicationHelper.sendApplicationDeatils_mobile(mobile_number_final, app_id, f_name_final, function (callbackResult) {
                        console.log('Save submission message sent status ', JSON.stringify(callbackResult));
                    })
                    console.log("intent name:" + source_intent_name + " application id:" + app_id);
                    var speech1 = "Thanks, all your personal details are capture for " + product_type_name_final + " application-" + app_id
                    var speech2 = "We need you to now upload all  your supporting documents."
                    var url_btn = "https://oaoindiastackdev.herokuapp.com/home/chatbot/" + app_id;
                    OAOApplicantSchema.findOne({ application_id: app_id }, function (err, result) {
                        result.section_SAL[0].section_1 = true;
                        OAODBHelper.save(result, function (result) {
                            res.json({
                                "messages": [
                                    {
                                        "type": 0,
                                        "speech": speech1
                                    },
                                    {
                                        "type": 0,
                                        "speech": speech2
                                    },
                                    {
                                        "type": 1,
                                        "title": "",
                                        "subtitle": "click bellow button to upload",
                                        "imageUrl": "",
                                        "buttons": [
                                            {
                                                "text": "Upload",
                                                "postback": url_btn,
                                            },
                                        ]
                                    }
                                ],
                                "data": {},
                                "contextOut": [{}],
                                "source": source_intent_name
                            })
                        })
                    })
                })
            }//if 
        })
    })
}//SubmitSalaryAccountDetails close


//submitVehicleLoanDetails
function submitVehicleLoanDetails(req, res) {
    console.log("submitVehicleLoanDetails(" + source_intent_name + ")");
    // var date = moment(dob_final, 'MM/DD/YYYY');
    // var new_dob = date.format('MM/DD/YYYY');

    noMonths_final = loan_term_final * 12;

    OAODBHelper.GenerateApplicationReferenceId(req, res, function (result) {
        console.log("sequence generator data", result, req.body);
        var app_id = OAOApplicationHelper.RefIdFormater(Number(result.app_ref_id) + 1, req);
        var Oao_product_customer_details = new OAOApplicantSchema({
            product_code: product_code_final,
            //campaign_id: req.body.campaign_id,
            product_type_code: product_type_code_final,
            singleORjoint: single_joint_final,
            deviceType: "skypebot",
            existing_cust_status: "N",
            title: title_final,
            application_id: app_id,
            fname: f_name_final,
            // mname: req.body.mname,
            lname: l_name_final,
            dob: dob_final,
            email: email_final,
            mobile: mobile_number_final,
            is_aadhaar: false,
            aadhaar_number: "null",
            pan: req.body.pan,
            brokerid: req.body.brokerid,
            address: req.body.address,
            paddress: req.body.paddress,
            housenum: req.body.housenum,
            streetnum: req.body.streetnum,
            streetname: req.body.streetname,
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

            fatherName: fatherName_final,
            noOfDependents: noOfDependents_final,
            maritalStatus: maritalStatus_final,
            gender: gender_final,
            designation: designation_final,
            workEmailId: workEmailId_final,
            buildingNo: buildingNo_final,
            workaddress: workaddress_final,
            officeLandLine: officeLandLine_final,
            currentResidence: currentResidence_final,
            residence_month: residence_month_final,
            ResidenceType: residenceType_final,
            vehicle_onroad_price: ex_showroom_price_final,
            vehicleLoanType: vehicleLoanType_final,
            vehicle_make: vehicle_model_final,
            employertype: employertype_final,
            netIncome: netIncome_final,
            Work_experience: work_experience_final,
            monthlyEmiRange: emi_final,
            loanTermRange: loan_term_final,
            loanAmountRange: loan_amount_final,
            employer: employer_final,

            noMonths: noMonths_final,
            interestPayable: interestPayable_final,
            totalPayableAmount: totalPayableAmount_final,

            no_address_found_flag: false,
            section_LAA: {},
            bot_fields: {},
            no_of_section: config_urls.number_of_sections[product_type_code_final],
            Mandatory_fields_LAA: [{
                section_1_fields: [{
                    lname: true,
                    fname: true,
                    dob: true,
                    email: true,
                    mobile: true,
                    fatherName: true,
                    employer: true,
                    address: true,
                    paddress: true,
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
        console.log("Application id:" + app_id);
        OAODBHelper.checkExistingApplicant(req, res, function (result) {
            if (!result) {
                OAODBHelper.save(Oao_product_customer_details, function (result) {
                    var data = {
                        'fname': result.fname,
                        'lname': result.lname
                    }
                    //sending success message to email 
                    OAOApplicationHelper.SendMail(result.email, result.application_id, data, 'SAVE_SUBMISSION', function (callbackResult) {
                        console.log('Save submission mail sent status ', JSON.stringify(callbackResult));
                    })
                    //sending success message to phone 
                    OAOApplicationHelper.sendApplicationDeatils_mobile(mobile_number_final, app_id, f_name_final, function (callbackResult) {
                        console.log('Save submission message sent status ', JSON.stringify(callbackResult));
                    })
                    console.log("intent name:" + source_intent_name + " application id:" + app_id);
                    OAOApplicantSchema.findOne({ application_id: app_id }, function (err, result) {
                        result.section_LAA[0].section_1 = true;
                        OAODBHelper.save(result, function (result) {
                            var speech1 = "Can you please provid your residence type ?";
                            res.json({
                                "messages": [
                                    {
                                        "type": 0,
                                        "speech": speech1
                                    }
                                ],
                                "data": {},
                                "contextOut": [{ "name": source_intent_name, "lifespan": 1, "parameters": { "app_id": app_id } }, { "name": "aadhaar_basicInfo_postal_address_intent", "lifespan": 1 }, { "name": "aadhaar_basicInfo_intent", "lifespan": 1 }],
                                "source": source_intent_name
                            })//res
                        })//save2
                    })//findOne
                })//save1
            }//if 
        })//checkExistingApplicant
    })//GenerateApplicationReferenceId
}//submitVehicleLoanDetails close


//******************************************ADHAAR CLOSE*************************************

//******************************************NO ADHAAR START*************************************
function submitSavingsAccountDetails_no_aadhaar(req, res) {
    console.log("submitSavingsAccountDetails_no_aadhaar() get called")
    OAODBHelper.GenerateApplicationReferenceId(req, res, function (result) {
        console.log("sequence generator data", result, req.body);
        var app_id = OAOApplicationHelper.RefIdFormater(Number(result.app_ref_id) + 1, req);
        var Oao_product_customer_details = new OAOApplicantSchema({
            product_code: product_code_final,
            //campaign_id: req.body.campaign_id,
            product_type_code: product_type_code_final,
            singleORjoint: single_joint_final,
            deviceType: "skypebot",
            existing_cust_status: "N",
            title: title_final,
            application_id: app_id,
            fname: f_name_final,
            // mname: req.body.mname,
            lname: l_name_final,
            dob: dob_final,
            email: email_final,
            mobile: mobile_number_final,
            is_aadhaar: false,
            aadhaar_number: "",
            pan: req.body.pan,
            brokerid: req.body.brokerid,
            address: req.body.address,
            paddress: req.body.paddress,
            housenum: req.body.housenum,
            streetnum: req.body.streetnum,
            streetname: req.body.streetname,
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
            no_address_found_flag: false,
            section_SAV: {},
            bot_fields: {},
            no_of_section: config_urls.number_of_sections[product_type_code_final],
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
                    //Send mail for Everyday
                    var data = {
                        'fname': result.fname,
                        'lname': result.lname
                    }
                    //sending success message to email 
                    OAOApplicationHelper.SendMail(result.email, result.application_id, data, 'SAVE_SUBMISSION', function (callbackResult) {
                        console.log('Save submission mail sent status ', JSON.stringify(callbackResult));
                    })
                    //sending success message to phone 
                    OAOApplicationHelper.sendApplicationDeatils_mobile(mobile_number_final, app_id, f_name_final, function (callbackResult) {
                        console.log('Save submission message sent status ', JSON.stringify(callbackResult));
                    })
                    if (req.body.result.action == "basic_info") {

                        var speech1 = "Great, thanks for your inputs, we have saved your application-" + app_id
                        res.json({
                            "messages": [
                                {
                                    "type": 0,
                                    "speech": speech1
                                },
                                {
                                    "type": 1,
                                    "title": "",
                                    "subtitle": "Click below button to continue",
                                    "imageUrl": "",
                                    "buttons": [
                                        {
                                            "text": "Continue",
                                            "postback": "Continue"
                                        },
                                    ]
                                }
                            ],

                            "data": {},
                            "contextOut": [{ "name": "basic_info", "lifespan": 1, "parameters": { "app_id": app_id, "product_type_code": "SAV" } }],
                            "source": source_intent_name
                        })
                    }
                })
            }//if 
        })
    })
}//submitSavingsAccountDetails_no_aadhaar close

//submitSavingAccountAddress_no_aadhaar
function submitSavingAccountAddress_no_aadhaar(req, res, app_id) {
    OAOApplicantSchema.findOne({ application_id: app_id }, function (err, result) {
        console.log(result)
        result.housenum = house_number_final,
            result.streetname = street_name_final,
            result.suburb = city_final,
            result.state = state_final,
            result.postcode = post_code_final,
            result.address = address_final,
            result.section_SAV[0].section_1 = true,
            result.Mandatory_fields_SAV[0].section_1_fields[0].address = true,
            result.Mandatory_fields_SAV[0].section_1_fields[0].paddress = true
        OAODBHelper.save(result, function (result) {
            //res
            var speech1 = "Thanks, all your personal details are capture for savings account application."
            var speech2 = "We need you to now upload all  your supporting documents."
            var link_url = "https://oaoindiastackdev.herokuapp.com/home/chatbot/" + app_id
            res.json({
                "messages": [
                    {
                        "type": 0,
                        "speech": speech1
                    },
                    {
                        "type": 0,
                        "speech": speech2
                    },
                    {
                        "type": 1,
                        "title": "",
                        "subtitle": "Click below button to upload",
                        "imageUrl": "",
                        "buttons": [
                            {
                                "text": "Upload",
                                "postback": link_url
                            },
                        ]
                    }
                ],
                "data": {},
                "contextOut": [{}],
                "source": source_intent_name
            })
        })
    })
}//submitSavingAccountAddress_no_aadhaar close

//submitSalaryAccountDetails_no_aadhaar
function submitSalaryAccountDetails_no_aadhaar(req, res) {
    console.log("submitSalaryAccountDetails_no_aadhaar() get called")

    OAODBHelper.GenerateApplicationReferenceId(req, res, function (result) {
        console.log("sequence generator data", result, req.body);
        var app_id = OAOApplicationHelper.RefIdFormater(Number(result.app_ref_id) + 1, req);
        var Oao_product_customer_details = new OAOApplicantSchema({
            product_code: product_code_final,
            //campaign_id: req.body.campaign_id,
            product_type_code: product_type_code_final,
            singleORjoint: single_joint_final,
            deviceType: "skypebot",
            existing_cust_status: "N",
            title: title_final,
            application_id: app_id,
            fname: f_name_final,
            // mname: req.body.mname,
            lname: l_name_final,
            dob: dob_final,
            email: email_final,
            mobile: mobile_number_final,
            is_aadhaar: false,
            aadhaar_number: "",
            pan: req.body.pan,
            brokerid: req.body.brokerid,
            address: req.body.address,
            paddress: req.body.paddress,
            housenum: req.body.housenum,
            streetnum: req.body.streetnum,
            streetname: req.body.streetname,
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
            no_address_found_flag: false,
            section_SAL: {},
            bot_fields: {},
            no_of_section: config_urls.number_of_sections[product_type_code_final],
            Mandatory_fields_SAL: [{
                section_1_fields: [{
                    lname: true,
                    fname: true,
                    dob: true,
                    email: true,
                    mobile: true,
                    employer: true,
                    address: false,
                    paddress: false
                }],
                section_2_fields: [{
                    employment_letter: false
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
                    //sending success message to email 
                    OAOApplicationHelper.SendMail(result.email, result.application_id, data, 'SAVE_SUBMISSION', function (callbackResult) {
                        console.log('Save submission mail sent status ', JSON.stringify(callbackResult));
                    })
                    //sending success message to phone 
                    OAOApplicationHelper.sendApplicationDeatils_mobile(mobile_number_final, app_id, f_name_final, function (callbackResult) {
                        console.log('Save submission message sent status ', JSON.stringify(callbackResult));
                    })
                    var speech1 = "Great, thanks for your inputs, we have saved your application-" + app_id
                    res.json({
                        "messages": [
                            {
                                "type": 0,
                                "speech": speech1
                            },
                            {
                                "type": 1,
                                "title": "",
                                "subtitle": "Click below button to continue",
                                "imageUrl": "",
                                "buttons": [
                                    {
                                        "text": "Continue",
                                        "postback": "Continue"
                                    },
                                ]
                            }
                        ],
                        "data": {},
                        "contextOut": [{ "name": "basic_info", "lifespan": 1, "parameters": { "app_id": app_id, "product_type_code": "SAL" } }],
                        "source": source_intent_name
                    })
                })
            }
        })
    })
}//submitSalaryAccountDetails_no_aadhaar close

//submitSalaryAccountAddress_no_aadhaar
function submitSalaryAccountAddress_no_aadhaar(req, res, app_id) {
    OAOApplicantSchema.findOne({ application_id: app_id }, function (err, result) {
        console.log(result)
        result.housenum = house_number_final,
            result.streetname = street_name_final,
            result.suburb = city_final,
            result.state = state_final,
            result.postcode = post_code_final,
            result.address = address_final,
            result.section_SAL[0].section_1 = true,
            result.Mandatory_fields_SAL[0].section_1_fields[0].address = true,
            result.Mandatory_fields_SAL[0].section_1_fields[0].paddress = true

        OAODBHelper.save(result, function (result) {
            //res
            var speech1 = "Thanks, all your personal details are capture for salary account application."
            var speech2 = "We need you to now upload all  your supporting documents."
            var link_url = "https://oaoindiastackdev.herokuapp.com/home/chatbot/" + app_id
            res.json({
                "messages": [
                    {
                        "type": 0,
                        "speech": speech1
                    },
                    {
                        "type": 0,
                        "speech": speech2
                    },
                    {
                        "type": 1,
                        "title": "",
                        "subtitle": "Click below button to upload",
                        "imageUrl": "",
                        "buttons": [
                            {
                                "text": "Upload",
                                "postback": link_url
                            },
                        ]
                    }
                ],
                "data": {},
                "contextOut": [{}],
                "source": source_intent_name
            })
        })
    })
}//submitSalaryAccountAddress_no_aadhaar close

//submitVehicleLoan_no_aadhaar
function submitVehicleLoan_no_aadhaar(req, res) {
    console.log("submitVehicleLoan_no_aadhaar() get called")
    noMonths_final = loan_term_final * 12;
    OAODBHelper.GenerateApplicationReferenceId(req, res, function (result) {
        console.log("sequence generator data", result, req.body);
        var app_id = OAOApplicationHelper.RefIdFormater(Number(result.app_ref_id) + 1, req);
        var Oao_product_customer_details = new OAOApplicantSchema({
            product_code: product_code_final,
            //campaign_id: req.body.campaign_id,
            product_type_code: product_type_code_final,
            singleORjoint: single_joint_final,
            deviceType: "skypebot",
            existing_cust_status: "N",
            title: title_final,
            application_id: app_id,
            fname: f_name_final,
            // mname: req.body.mname,
            lname: l_name_final,
            dob: dob_final,
            email: email_final,
            mobile: mobile_number_final,
            is_aadhaar: false,
            aadhaar_number: "null",
            pan: req.body.pan,
            brokerid: req.body.brokerid,
            address: req.body.address,
            paddress: req.body.paddress,
            housenum: req.body.housenum,
            streetnum: req.body.streetnum,
            streetname: req.body.streetname,
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

            fatherName: fatherName_final,
            noOfDependents: noOfDependents_final,
            maritalStatus: maritalStatus_final,
            gender: gender_final,
            designation: designation_final,
            workEmailId: workEmailId_final,
            buildingNo: buildingNo_final,
            workaddress: workaddress_final,
            officeLandLine: officeLandLine_final,
            currentResidence: currentResidence_final,
            residence_month: residence_month_final,
            ResidenceType: residenceType_final,
            vehicle_onroad_price: ex_showroom_price_final,
            vehicleLoanType: vehicleLoanType_final,
            vehicle_make: vehicle_model_final,
            employertype: employertype_final,
            netIncome: netIncome_final,
            Work_experience: work_experience_final,
            monthlyEmiRange: emi_final,
            loanTermRange: loan_term_final,
            loanAmountRange: loan_amount_final,
            employer: employer_final,

            noMonths: noMonths_final,
            interestPayable: interestPayable_final,
            totalPayableAmount: totalPayableAmount_final,

            no_address_found_flag: false,
            section_LAA: {},
            bot_fields: {},
            no_of_section: config_urls.number_of_sections[product_type_code_final],
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
                    console.log("save result details:" + result);
                    //Send mail for Everyday
                    var data = {
                        'fname': result.fname,
                        'lname': result.lname
                    }
                    console.log("email2:" + result.email)
                    //sending success message to email 
                    OAOApplicationHelper.SendMail(result.email, result.application_id, data, 'SAVE_SUBMISSION', function (callbackResult) {
                        console.log('Save submission mail sent status ', JSON.stringify(callbackResult));
                    })
                    //sending success message to phone 
                    OAOApplicationHelper.sendApplicationDeatils_mobile(mobile_number_final, app_id, f_name_final, function (callbackResult) {
                        console.log('Save submission message sent status ', JSON.stringify(callbackResult));
                    })
                    var speech1 = "Great, thanks for your inputs, we have saved your application-" + app_id
                    res.json({
                        "messages": [
                            {
                                "type": 0,
                                "speech": speech1
                            },
                            {
                                "type": 1,
                                "title": "",
                                "subtitle": "Click below button to continue",
                                "imageUrl": "",
                                "buttons": [
                                    {
                                        "text": "Continue",
                                        "postback": "Continue"
                                    },
                                ]
                            }
                        ],
                        "data": {},
                        "contextOut": [{ "name": "basic_info", "lifespan": 1, "parameters": { "app_id": app_id, "product_type_code": "LAA" } }],
                        "source": source_intent_name
                    })
                })
            }//if 
        })
    })
}////submitVehicleLoan_no_aadhaar close

//submitVehicleLoanAddress_no_aadhaar
function submitVehicleLoanAddress_no_aadhaar(req, res, app_id) {
    OAOApplicantSchema.findOne({ application_id: app_id }, function (err, result) {
        console.log(result)
        if (result) {
            result.housenum = house_number_final,
                result.streetname = street_name_final,
                result.suburb = city_final,
                result.state = state_final,
                result.postcode = post_code_final,
                result.address = address_final,
                result.fatherName = fatherName_final,
                result.noOfDependents = noOfDependents_final,
                result.maritalStatus = maritalStatus_final,
                result.gender = gender_final,
                result.residence_month = residence_month_final,
                result.ResidenceType = residenceType_final,
                result.section_LAA[0].section_1 = true,
                result.Mandatory_fields_LAA[0].section_1_fields[0].address = true,
                result.Mandatory_fields_LAA[0].section_1_fields[0].paddress = true
            OAODBHelper.save(result, function (result) {
                //res
                var speech1 = "Please enter your Designation. "
                res.json({
                    "messages": [
                        {
                            "type": 0,
                            "speech": speech1
                        }
                    ],
                    "data": {},
                    "contextOut": [{}],
                    "source": source_intent_name
                })
            })

        }

    })
}//submitVehicleLoanAddress_no_aadhaar close


//submit_final_VehicleLoan_no_aadhaar
function submit_final_VehicleLoan_no_aadhaar(req, res, app_id) {
    OAOApplicantSchema.findOne({ application_id: app_id }, function (err, result) {
        console.log(result)
        result.designation = designation_final,
            result.workEmailId = workEmailId_final,
            result.work_phone_number = work_phone_number_final,
            result.workaddress_final = workaddress_final,

            result.Mandatory_fields_LAA[0].section_1_fields[0].workaddress = true,
            result.Mandatory_fields_LAA[0].section_1_fields[0].workEmailId = true,
            result.Mandatory_fields_LAA[0].section_1_fields[0].designation = true,
            result.section_LAA[0].section_2 = true,
            result.section_LAA[0].section_3 = true,
            result.section_LAA[0].section_4 = true,
            result.section_LAA[0].section_5 = true

            OAODBHelper.save(result, function (result) {
                //res
                var speech1 = "Thanks, all your personal details are capture for Vehicle Loan application."
                var speech2 = "We need you to now upload all  your supporting documents."
                var link_url = "https://oaoindiastackdev.herokuapp.com/home/chatbot/" + app_id
                res.json({
                    "messages": [
                        {
                            "type": 0,
                            "speech": speech1
                        },
                        {
                            "type": 0,
                            "speech": speech2
                        },
                        {
                            "type": 1,
                            "title": "",
                            "subtitle": "Click below button to upload",
                            "imageUrl": "",
                            "buttons": [
                                {
                                    "text": "Upload",
                                    "postback": link_url
                                },
                            ]
                        }
                    ],
                    "data": {},
                    "contextOut": [{}],
                    "source": source_intent_name
                })
            })
    })
}//submit_final_VehicleLoan_no_aadhaar close



module.exports = OAORouter;
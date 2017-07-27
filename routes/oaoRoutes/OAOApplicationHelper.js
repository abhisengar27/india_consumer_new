var nodemailer = require('nodemailer');
var random = require("random-js")();
var config_urls = require("../../configFiles/DBconfigfile");
var fs = require('fs');
var jade = require('jade');
var speakeasy = require('speakeasy');
var secret = speakeasy.generateSecret();
var crypto = require("crypto");
var secret32 = secret.base32;
var OAODBHelper = require("./OAODBHelper");
var Twilio = require('twilio')('AC648253d94bd2979b66054939bb5eb55e', '0de091cc1390b4499132a9d40d09079c');
//var Twilio = require('twilio')('AC2bd3242f0d6a9b00dd6b7b7ec99bffc5', '523961efa98c84a3edb95045e5fff141');
var appConfig = require('../../configFiles/appConfig');
var alfrescoConfig = appConfig.ALFRESCO;
var cmis = require('cmis');
var session = cmis.createSession(alfrescoConfig.cmis_alfresco_url);
session.setCredentials(alfrescoConfig.alfresco_username, alfrescoConfig.alfresco_password);
var request = require('request');
var mkdirp = require('mkdirp');
var Promise = require('bluebird');

module.exports = {

    SendMail: function (email, app_id, data, emailTemplateId, callback) {
        var template;
        var mailOptions;
        if (emailTemplateId == 'SAVE_SUBMISSION') {
            console.log('Save Submission');
            template = process.cwd() + '/public/mailtemplate/saveconfirmation.jade';
        } else if (emailTemplateId == 'SEND_OTP') {
            console.log('SEND OTP');
            template = process.cwd() + '/public/mailtemplate/sendOtp.jade';
        } else {
            console.log('Confirmation Submission');
            template = process.cwd() + '/public/mailtemplate/confirmation.jade';
        }
        fs.readFile(template, 'utf-8', function (err, file) {
            if (err) {
                console.log('Error while rendering jade template', template);
            } else {
                var compiledTmpl = jade.compile(file, { filename: template });
                var context = { applicationId: app_id, data: data };
                htmlToSend = compiledTmpl(context);

                /**
                 * node mailer transporter
                 */
                var transporter = nodemailer.createTransport({
                    host: config_urls.url.host,
                    port: config_urls.url.port,
                    secure: true, // use SSL 
                    auth: {
                        user: config_urls.url.gmailID,
                        pass: config_urls.url.gmailPassword
                    }
                });

                if (emailTemplateId == 'SAVE_SUBMISSION') {
                    mailOptions = {
                        from: config_urls.url.gmailID,
                        to: email,
                        subject: 'Application Saved Succesfully',
                        html: htmlToSend
                    };
                } else if (emailTemplateId == 'FINAL_SUBMISSION' && data.product_type == 'SAV') {
                    mailOptions = {
                        from: config_urls.url.gmailID,
                        to: email,
                        subject: 'Application Processed Succesfully',
                        html: htmlToSend
                    };
                } else if (emailTemplateId == 'SEND_OTP') {
                    mailOptions = {
                        from: config_urls.url.gmailID,
                        to: email,
                        subject: 'OTP to resume saved appplication',
                        html: htmlToSend
                    };
                } else {
                    mailOptions = {
                        from: config_urls.url.gmailID,
                        to: email,
                        subject: 'Application Submitted for processing succesfully',
                        html: htmlToSend
                    };
                }


                /**
                 *  send mail with defined transport object 
                 */
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log('Error while sending mail', error);
                        return callback(Result = "false");
                    }

                    console.log('Message sent: ' + info.response);
                    return callback(Result = "true");
                });
            }
        });
    },


    //OTP generation for email verification

    onSendMail: function (email, data, callback) {
        var template;
        var mailOptions;
        // if (emailTemplateId == 'SAVE_SUBMISSION') {
        //     console.log('Save Submission');
        //     template = process.cwd() + '/public/mailtemplate/saveconfirmation.jade';
        // } else if (emailTemplateId == 'SEND_OTP') {
        //     console.log('SEND OTP');
        //     template = process.cwd() + '/public/mailtemplate/sendOtp.jade';
        // } else {
        //     console.log('Confirmation Submission');
        template = process.cwd() + '/public/mailtemplate/otpVerificationForIndia.jade';
        // }
        fs.readFile(template, 'utf-8', function (err, file) {
            if (err) {
                console.log('Error while rendering jade template', template);
            } else {
                var compiledTmpl = jade.compile(file, { filename: template });
                var context = { data: data };
                htmlToSend = compiledTmpl(context);

                /**
                 * node mailer transporter
                 */
                var transporter = nodemailer.createTransport({
                    host: config_urls.url.host,
                    port: config_urls.url.port,
                    secure: true, // use SSL 
                    auth: {
                        user: config_urls.url.gmailID,
                        pass: config_urls.url.gmailPassword
                    }
                });


                mailOptions = {
                    from: config_urls.url.gmailID,
                    to: email,
                    subject: 'Your one time password for latitude bank',
                    html: htmlToSend
                };

                /**
                 *  send mail with defined transport object 
                 */
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log('Error while sending mail', error);
                        return callback(result = "false");
                    }

                    console.log('Message sent: ' + info.response);
                    return callback(result = "true");
                });
            }
        });
    },

    //Application Reference ID Generation
  RefIdFormater: function (ID,req,res) {
      console.log(" Application Helper RefIdFormater():"+ID)
        dbSequence = Number(ID);
        console.log("ref_id==>:"+dbSequence)
        var day = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        let AppRefID = ['DB', year,
            (month > 9 ? '' : '0') + month,
            (day > 9 ? '' : '0') + day,
            dbSequence
        ].join('');
        req.session.app_id = AppRefID;
        return AppRefID;

    },

    

    Gen_coreAcc_no: function (callback) {
        var CORE_ACCOUNT_NUMBNER = "00000" + random.integer(1, 999);
        return callback(CORE_ACCOUNT_NUMBNER);
    },
    Gen_custId: function (callback) {
        var CORE_CUSTOMER_ID = random.integer(100000, 999999);
        return callback(CORE_CUSTOMER_ID);
    },

    BSB_Number: function (callback) {
        return callback(123123);
    },

    //To generate OTP
    genOTP: function (callback) {
        // console.log("in gen otp:")
        // console.log(secret.base32)
        OAODBHelper.getDropboxContent('GENERIC_PROP', 'OTP_VALIDITY', function (result) {
            console.log(result[0].property_value)
            var token = speakeasy.totp({
                secret: secret32,
                encoding: 'base32',
                step: parseInt(result[0].property_value)
            });
            console.log("token = " + token);
            return callback(token);
        })

    },
    verifyOTP: function (userToken, callack) {
        //   console.log(userToken);
        //   console.log("in verifyOTP:")
        //   console.log(secret.base32)
        OAODBHelper.getDropboxContent('GENERIC_PROP', 'OTP_VALIDITY', function (result) {
            var verified = speakeasy.totp.verify({
                secret: secret32,
                encoding: 'base32',
                step: parseInt(result[0]),
                token: userToken
            });
            console.log(verified);
            return callack(verified)
        })
    },

    // otp verification - India

    verifyOtp: function (userToken, callack) {
        //   console.log(userToken);
        //   console.log("in verifyOTP:")
        //   console.log(secret.base32)
        OAODBHelper.getDropboxContent('GENERIC_PROP', 'OTP_VALIDITY', function (result) {
            var verified = speakeasy.totp.verify({
                secret: secret32,
                encoding: 'base32',
                step: parseInt(result[0].property_value),
                token: userToken
            });
            console.log(verified);
            return callack(verified)
        })
    },
    sendOTPMessage: function (result, otp) {
        console.log(result + "  " + otp)
    },

    sendOTPMail: function (result, otp) {
        var data = {
            'fname': result.fname,
            'lname': result.lname,
            'otp': otp
        }
        this.SendMail(result.email, result.application_id, data, 'SEND_OTP', function (result) {
            console.log(result);
        })

    },

    sendOtpToMail: function (email, otp, callback) {
        console.log("Inside sendOtpToMail")
        var data = {
            'otp': otp
        }
        this.onSendMail(email, data, function (result) {
            console.log(otp);
            return callback(result);
        })

    },
    sendOtpToMobile: function (mobile, otp, callback) {
        // Send the text message.
        Twilio.messages.create({
            to: mobile,
            from: '+12057379741',
            body: 'The OTP is: ' +otp+ 'for Application Id:'+'.'
        }, function (err, message) {
            if (err) {
                console.error('Text failed because: ' + err.message);
                return callback(false);
            } else {
                console.log('Text sent! Message SID: ' + message.sid);
                return callback(true);
            }
        });
    },
      sendApplicationDeatils_mobile: function (mobile, app_id,f_name, callback) {
        // Send the text message.
        Twilio.messages.create({
            to: mobile,
            from: '+12057379741',
            body: `hi `+f_name
                    +`\n Your Online Account Opening Application has been successfully saved.`
                    +`\n The Reference number for the application is :`+app_id
        }, function (err, message) {
            if (err) {
                console.error('Text failed because: ' + err.message);
                return callback(false);
            } else {
                console.log('Text sent! Message SID: ' + message.sid);
                return callback(true);
            }
        });
    },

    deleteCmisObject: function(obj_id, callback) {

        session.loadRepositories().ok(function(data) {
            session.deleteObject(obj_id).ok(function(data) {
                console.log("deleted from alfressco", data)
                callback(null, data)
            }).notOk(function(error) {
                callback(error, null);
            })
        });

    },

    downloadFileFromCMIS: function(reqData, dir, isCompleted, callback) {

        if (fs.existsSync(dir)) {
            callback(null, "File already exists", isCompleted);
            return;
        }

        request(reqData).pipe(fs.createWriteStream(dir))
            .on('error', function(err) {
                console.log("error in donwloading attachments", err);
                callback(err, null, isCompleted);
            })
            .on('finish', function(response) {
                callback(null, response, isCompleted)
            })


    }



}; //end of function
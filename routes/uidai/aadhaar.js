var express = require('express');
var UIDAIRouter = express.Router();
var request = require('request');
var appConfig = require('../../configFiles/appConfig');
var errorCodes = require('../../configFiles/errorCodes');
var moment = require('moment');


UIDAIRouter.post('/otp', function(req, res) {

    var otpData = req.body;
    console.log("otp data", otpData);
    otpData.aadhaar = otpData.aadhaar.replace(/\s/g, '');
    request({
            url: `${appConfig.UIDAI.endPointUrl}/otp/${otpData.aadhaar}`,
            timeout: '30000'
        },
        function(err, response, body) {
            // console.log(err, response, body);


            if (response.statusCode != '200') {
                console.log("Internal error occurred ", response.statusCode, response.statusMessage);
                res.json({ error: errorCodes['default'], data: null });
                return;
            }
            body = JSON.parse(body);
            if (!err) {
                if (!body) {
                    res.json({ error: errorCodes['default'], data: null });

                } else if (body.status) {

                    res.json({ error: null, data: "OTP sent successfully" });

                } else {
                    let message = errorCodes[body.errorCode];
                    //console.log("message is", message);
                    if (!message) {
                        message = errorCodes['default'];
                    }
                    res.json({ error: message, data: null });
                }

            } else {
                res.json({ error: errorCodes['default'], data: null });
            }
        })


})

UIDAIRouter.post('/ekyc', function(req, res) {

    var ekycData = req.body;

    ekycData.aadhaar = ekycData.aadhaar.replace(/\s/g, '');

    request({
            url: `${appConfig.UIDAI.endPointUrl}/ekyc/${ekycData.aadhaar}/${ekycData.otp}`,
            timeout: '30000'
        },
        function(err, response, body) {
            //console.log("status code is", response.statusCode);
            if (response.statusCode != '200') {
                console.log("Internal error occurred ", response.statusCode, response.statusMessage);
                res.json({ error: errorCodes['default'], data: null });
                return;
            }
            body = JSON.parse(body);

            if (!err) {
                if (!body) {
                    res.json({ error: errorCodes['default'], data: null });

                } else if (body.status) {
                    let kycResponse = {
                        "addressInfo": body.addressInfo
                    }
                    let address = combineAddressInfo(body.addressInfo);
                    kycResponse['identityInfo'] = formatIdentityInfo(body.identityInfo);
                    kycResponse.addressInfo.address = address

                    res.json({ error: null, data: kycResponse });

                } else {
                    let message = errorCodes[body.errorCode];
                    if (!message) {
                        message = errorCodes['default'];
                    }
                    res.json({ error: message, data: null });
                }

            } else {
                res.json({ error: errorCodes['default'], data: null });
            }

        })

})

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
    let gender = "";

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
        lname,
        gender
    }

    if (identityInfo.gender == 'M') {
        idInfo.gender = 'Male';

    } else if (identityInfo.gender == 'F') {
        idInfo.gender = 'Female';
    } else {
        idInfo.gender = 'Others';
    }

    return idInfo;

}

module.exports = UIDAIRouter;
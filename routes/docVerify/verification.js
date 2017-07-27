var express = require('express');
var router = express.Router();
var fs = require('fs');
var AlfrescoApi = require('alfresco-js-api');
var multer = require('multer');
var path = require('path');
var appConfig = require('../../configFiles/appConfig');
var alfrescoConfig = appConfig.ALFRESCO;
var crypto = require('crypto');
var request = require('request');
var moment = require('moment');
var xmlToJson = require("xml2js");
var mkdirp = require('mkdirp');
var fs = require('fs');
var relativePath = path.join(__dirname, '..', '..');
var cmis = require('cmis');
var session = cmis.createSession(alfrescoConfig.cmis_alfresco_url);
var OAODBHelper = require('../oaoRoutes/OAODBHelper');
var OAOApplicationHelper = require('../oaoRoutes/OAOApplicationHelper');

session.setCredentials(alfrescoConfig.alfresco_username, alfrescoConfig.alfresco_password);

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        let dir = 'uploads/' + req.headers.application_id + '/' + req.headers.doc_type;

        fs.exists(dir, function(exists) {
            if (exists) {
                cb(null, dir);
            } else {
                mkdirp(dir, function(err) {
                    if (!err) {
                        cb(null, dir);
                    } else {
                        console.log('error while creating upload directory', err);
                    }
                })
            }
        })


    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})

var docStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        let filename = "IMG_" + Date.now() + ".jpg";
        cb(null, filename)
    }
})

var upload = multer({ storage: storage });
var docUpload = multer({ storage: docStorage });
var request = require("request");
var open = require("open");
const delay = require('delay');
var fs = require('fs');
var alfrescoJsApi = new AlfrescoApi({ hostEcm: '106.51.65.119:8180' });
var exec = require('child_process').exec;
const Storage = require('@google-cloud/storage');

const Vision = require('@google-cloud/vision');
const projectId = 'oao-india';

const visionClient = Vision({
    projectId: projectId,
    keyFilename: relativePath + '/keys/application_default_credentials.json'
});

var file;
var fname, doc, doe, lname, dlicense;


router.post('/getdetails/aadhaar/:cmisUpload', upload.single('file'), function(req, res, next) {

    req.file.isManualUpload = true;
    if (req.params.cmisUpload == 'true') {
        alfrescoFileUpload(req, res);
    }

    scanAadhar(req, res);

});

router.get('/cmis/upload', function(req, res) {
    console.log("inside cmis aadhaar upload");
    req['file'] = {};
    req.file['filename'] = req.headers.filename;
    alfrescoFileUpload(req, res);
    res.json({ error: null, data: "file uploading to alfresco" });
})

router.post('/getdetails/pan', upload.single('file'), function(req, res, next) {

    req.file.isManualUpload = true;
    alfrescoFileUpload(req, res);
    scanPAN(req, res);

});

router.post('/getdetails/doc', upload.single('file'), function(req, res, next) {

    req.file.isManualUpload = true;
    alfrescoFileUpload(req, res);
    //scanDoc(req, res);
    res.json({
        error: null,
        filename: req.file.filename,
        isManualUpload: req.file.isManualUpload,
        isImage: true
    });

});

router.post('/getdetails/vehicledoc', upload.single('file'), function(req, res, next) {

    req.file.isManualUpload = true;
    alfrescoFileUpload(req, res);
    //scanDoc(req, res);
    res.json({
        error: null,
        filename: req.file.filename,
        isManualUpload: req.file.isManualUpload,
        isImage: true
    });

});




router.post('/getotp', function(req, res, next) {
    console.log("Inside get otp");
    var xmlbody = `<?xml version="1.0" encoding="UTF-8"?><Otp xmlns="http://www.uidai.gov.in/authentication/otp/1.0" ac="public" lk="MEaMX8fkRa6PqsqK6wGMrEXcXFl_oXHA-YuknI2uf0gKgZ80HaZgG3A" sa="public" tid="public" txn="AuthDemoClient:public:20170504045553410" uid="999927286532" ver="1.5"><Opts ch="01"/><Signature xmlns="http://www.w3.org/2000/09/xmldsig#"><SignedInfo><CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/><SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/><Reference URI=""><Transforms><Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/></Transforms><DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/><DigestValue>82h5wF1nvO8yv208dH/X1OswtgE=</DigestValue></Reference></SignedInfo><SignatureValue>UHn2A9gMaVBs8UszbJl1PvSWFvVQ8b6FSlZzAabXaL3eN4ul8mDZtuHNLQni6lCrU7DEJuXW6PlB
R+rFA/PLlE6mGYZXQbHsw+VwISnsgj6EwhmGYObudLQAyb6s5EY1DZ/pY66UbYJZJAP0mVnwJFkU
9puZODvHsdLcz4dmbY8lPBF1OtIoeVjNsFQOZGIYWOiObnEFdMgwsRGGv8TFFYzgxeph1gcCrr/J
FTbz2tz7t8vnlbtGlbRZz+WEEYQE85rzsdsOJYPOdkwnwRUy5rvdP7RzvsZgHcWvlI6BbmEzQ6Vk
Ja7AU8vxjkknFE9DLmuDjBgKNMoZmSXu0BcD8A==</SignatureValue><KeyInfo><X509Data><X509SubjectName>CN=Public AUA for Staging Services,OU=Staging Services,O=Public AUA,L=Bangalore,ST=KA,C=IN</X509SubjectName><X509Certificate>MIIDuDCCAqCgAwIBAgIGA7J+eqryMA0GCSqGSIb3DQEBBQUAMIGNMQswCQYDVQQGEwJJTjELMAkG
A1UECBMCS0ExEjAQBgNVBAcTCUJhbmdhbG9yZTETMBEGA1UEChMKUHVibGljIEFVQTEZMBcGA1UE
CxMQU3RhZ2luZyBTZXJ2aWNlczEtMCsGA1UEAxMkUm9vdCBQdWJsaWMgQVVBIGZvciBTdGFnaW5n
IFNlcnZpY2VzMB4XDTE2MDUyNDE0NDAzMVoXDTIwMDUyNDE0NDAzMVowgYgxCzAJBgNVBAYTAklO
MQswCQYDVQQIEwJLQTESMBAGA1UEBxMJQmFuZ2Fsb3JlMRMwEQYDVQQKEwpQdWJsaWMgQVVBMRkw
FwYDVQQLExBTdGFnaW5nIFNlcnZpY2VzMSgwJgYDVQQDEx9QdWJsaWMgQVVBIGZvciBTdGFnaW5n
IFNlcnZpY2VzMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAo4XxOsjK58Ud+tQd06Mk
8Rd0qoyjA/3u+y0YVYEF6RgT8Ge1uVdTkIcVYaHyXuuHUPLLqGW1hPfVtn81UVIMGyrw5+t1c30w
pGv3UJ6GCFu0sPGgG5NwkVbIUt2xgT/Or/kGzHjUJJy4Y6URSkZiDLDQQWRXvui5ZwwsYRJ8LhT0
pSUwan1raG5Vl01GmlWVqsrCmnObuoYkN85iwG4/ERGshkgFCPak8B/jH3GPZSi1+FJLmCqMI1xx
mTvf0kZb7ejm2IZFTo6ecYWJ1vylkzUI553RxVbnHCNZvFe3AyaKMyFlknFR0Fkl5+9Lpxz+VOaj
bCjicg7jIYCw76/xgQIDAQABoyEwHzAdBgNVHQ4EFgQUJHLir1/Tel8v/6OuIXpLS0JH8jIwDQYJ
KoZIhvcNAQEFBQADggEBAFE15qMGIlp8+M306FbhDEvo1vzxN2Pfvg/f92NXH59d2XZ/wuHxugL8
qfcM5xkqsDeIRVxRdISpwiIWlqTitn6lenF85bvPQ09T/b09dVz/LxwU2Cm6+6H5/HZSoLtCKBOu
RzAKQdxczpyfaqv9caFC+LegPQIm2HCwOM0A4KzhYcFhumGeyCbyVZsSQcJE7bYc/IHkR2erup7h
5BACOZ/a+hHLPQok/uGvtEsR3roydNcNlR8Ja6Wc4eUf7kisTuZTxwRJI9DPVimbs0VAqhnsnVWA
K3X4+6sFUq5WfHS4wTRhrR93JvEV5LlQ6UCXYOQMvTii8l07qxkDiysVsLQ=</X509Certificate></X509Data></KeyInfo></Signature></Otp>`
    console.log(" printing xml body ");
    console.log(xmlbody)
        // request.post({
        //         url: "http://developer.uidai.gov.in/otp/1.5/public/9/9/MG41KIrkk5moCkcO8w-2fc01-P7I5S-6X2-X7luVcDgZyOa2LXs3ELI",
        //         method: "POST",
        //         headers: {
        //             'Content-Type': 'text/xml',
        //         },
        //         body: xmlbody
        //     },
        //     function(error, response, body) {
        //         console.log(body);
        //         res.json({ pass: "pass" })
        //     });

    res.json({ pass: "pass" })
});


router.get('/remove/:app_id/:doc_type/:fileName', function(req, res) {

    fs.exists(`uploads/${req.params.app_id}/${req.params.doc_type}/${req.params.fileName}`, function(exists) {
        console.log("checking file existance ", exists);

        if (exists) {
            unlinkUploadedFile(req, res);

            var filter = {};

            filter['filesUpload.' + req.params.doc_type + '.$'] = 1;

            var query = {};

            query['filesUpload.' + req.params.doc_type] = {
                $elemMatch: { file_name: req.params.fileName }
            }
            query['application_id'] = req.params.app_id;

            OAODBHelper.getApplicantsFilteredRecord(query, filter, function(err, result) {
                if (!err) {
                    if (result) {
                        console.log("File details to be deleted", result);
                        var file_object_id = result.filesUpload[req.params.doc_type][0].file_object_id;

                        OAOApplicationHelper.deleteCmisObject(file_object_id, function(err, result) {
                            if (!err) {
                                console.log("File deleted from alfresco", result);
                                query = {};
                                query['filesUpload.' + req.params.doc_type] = {
                                    file_object_id
                                }
                                OAODBHelper.deleteUploadData(req.params.app_id, query, function(err, result) {
                                    if (err) {
                                        console.log(err);
                                    }
                                })
                            } else {
                                console.log("File deleted from alfresco failed ...", err);
                            }
                        })
                    } else {
                        console.log("No record found in db for file deletion");
                    }

                } else {
                    console.log(err);
                }


            })

        } else {
            res.json({ error: null, message: "File does not exists" });
        }
    })



})

function unlinkUploadedFile(req, res) {
    fs.unlink(`uploads/${req.params.app_id}/${req.params.doc_type}/${req.params.fileName}`, function(err, data) {
        if (err) {
            console.log(err);
            res.json({ error: "File deletion failed !!!" });
        } else {
            res.json({ error: null, message: "File deleted successfully" });
        }
    })
}



router.get('/digilocker/config', function(req, res) {

    var appId = appConfig.DIGILOCKER.APP_ID;
    var appKey = appConfig.DIGILOCKER.APP_KEY;
    var url = appConfig.DIGILOCKER.SHARE_URL;

    var timeStamp = (new Date(moment().utcOffset(-330).format())).getTime() / 1000;
    var appHash = crypto.createHash('sha256').update(appId + appKey + timeStamp).digest('hex');

    res.json({ appId, appHash, timeStamp, url });


})

router.post('/digilocker/fetch', function(req, res) {

    var documentInfo = req.body;
    var appId = appConfig.DIGILOCKER.APP_ID;
    var key = appConfig.DIGILOCKER.APP_KEY;
    var orgId = appConfig.DIGILOCKER.ISSUER_ID;
    var filename = documentInfo.filename;
    var type = documentInfo.type;
    var fileExt = filename.split('.')[1];
    var timeStamp = moment().utcOffset(-330).format();
    var application_id = documentInfo.application_id;
    req.headers['application_id'] = application_id;
    req.headers['doc_type'] = type;


    let dir = 'uploads/' + application_id + '/' + type;
    fs.exists(dir, function(exists) {
        if (!exists) {
            mkdirp(dir, function(err) {
                if (err) {
                    console.log('error while creating upload directory', err);
                }


            })
        }
    })

    var keyHash = crypto.createHash('sha256').update(key + timeStamp).digest('hex');


    var digiReqBody = `<?xml version="1.0" encoding="utf-8" standalone="yes"?> 
    <PullDocRequest xmlns:ns2="http://tempuri.org/" ver="1.0" ts="${timeStamp}" txn="${documentInfo.txn}" 
    orgId="${orgId}" appId="${appId}" keyhash="${keyHash}"> <DocDetails> <URI>${documentInfo.uri}</URI> </DocDetails> 
    </PullDocRequest>`

    request.post({
            url: appConfig.DIGILOCKER.FETCH_URL,
            method: "POST",
            headers: {
                'Content-Type': 'application/xml',
            },
            body: digiReqBody
        },
        function(error, response, body) {

            if (!error) {
                xmlToJson.parseString(body.toString(), function(err, result) {

                    if (!err) {
                        var data = result.PullDocResponse.DocDetails[0].docContent[0]._;
                        var buffer = Buffer.from(data, 'base64');
                        req.file = {
                            filename: filename,
                            isManualUpload: false
                        }


                        fs.writeFile(`${dir}/${filename}`, buffer, function(err, result) {
                            if (err) {
                                console.log("Error occurred while saving", err)
                                res.json({ error: "Internal error occurred" });
                            } else {
                                alfrescoFileUpload(req, res);
                                fileExt = fileExt.toUpperCase();
                                if (fileExt == 'JPG' || fileExt == 'JPEG' ||
                                    fileExt == 'PNG' || fileExt == 'BMP') {
                                    if (type == 'AADHAAR') {
                                        scanAadhar(req, res);
                                    } else if (type == 'PAN') {
                                        scanPAN(req, res);
                                    } else {
                                        res.json({
                                            error: null,
                                            filename: req.file.filename,
                                            isManualUpload: req.file.isManualUpload,
                                            isImage: true
                                        });
                                    }


                                } else {
                                    res.json({ isImage: false, filename: filename, isManualUpload: req.file.isManualUpload });
                                }

                            }
                        })
                    } else {
                        console.log(err);
                        res.json({ error: 'Internal error occurred' });
                    }



                })

            } else {
                console.log(error);
                res.json({ error: 'Internal error occurred' });

            }



        })
})


function alfrescoFileUpload(req, res) {

    session.loadRepositories().ok(function(data) {
        console.log(data)
        var parentId = alfrescoConfig.alfresco_folder_id;

        var content;
        try {
            content = fs.createReadStream(`uploads/${req.headers.application_id}/${req.headers.doc_type}/${req.file.filename}`);
        } catch (e) {
            console.log(e);
            return;
        }
        var input = {
            "cmis:name": req.file.filename,
            "cmis:objectTypeId": "D:onboarding:upload",
            "onboarding:doc_type": req.headers.doc_type
        }
        var mimeTypeExtension = req.file.filename.split('.')[1];
        var policies = [];
        var addACEs;
        var removeACEs;
        var options;
        session.createDocument(parentId, content, input, mimeTypeExtension, policies, addACEs, removeACEs, options).ok(function(response) {
            var arr = (response.succinctProperties['alfcmis:nodeRef']).split('/');
            var file_object_id = arr[3];
            var file_name = response.succinctProperties['cmis:name'];
            var query = {};
            query['filesUpload.' + req.headers.doc_type] = {
                file_name,
                file_object_id
            }
            OAODBHelper.saveUploadData(req.headers.application_id, query, function(err, result) {
                if (!err) {
                    console.log("uploaded file information inserted into db successfully...");

                } else {
                    console.log("Error occurred while saving uploaded file info", err);
                }
            })
            console.log(response)
        }).notOk(function(response) {
            console.log(response)
        })
    });

}



function uploadAlfresco(filename) {

    var curl_command = "curl -X POST --user admin:alfrescoadmin@123 -F filedata=@" + "\"" + relativePath + "/uploads/" + filename + "\"" + " -F \"name=" + filename + "\"" + " http://106.51.65.119:8180/alfresco/api/-default-/public/alfresco/versions/1/nodes/96638165-37ab-481e-9841-4161a70b32f5/children";
    console.log(curl_command);
    child = exec(curl_command, function(error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error) {
            console.log('exec error: ' + error);
        }

    });

}

function scanAadhar(req, res) {

    var fileLocation = `uploads/${req.headers.application_id}/${req.headers.doc_type}/${req.file.filename}`;
    console.log(fileLocation)
    visionClient.detectText(fileLocation)
        .then((results) => {
            const detections = (results[0] + '').split('\n');
            detections.forEach((text, i) => console.log(text + " index " + i));

            var name = detections[1].split(' ');
            //var dob = detections[2].split(' ')[1];
            var fname = name[0];
            var mname = name[1];
            var lname = name[2];
            var error = "Fail"
            var address = detections[7] + detections[8] + detections[9] + detections[10] + detections[11] + detections[12] + detections[13];
            console.log("aadhaar number" + aadhar);
            var aadhar = "";
            var i = 0;
            for (; i < detections.length;) {
                aadhar = detections[i];
                var aadhar_1 = aadhar.replace(/\s/g, '')
                console.log("aadhaar number" + aadhar_1);
                if (aadhar_1.length == 12) {
                    console.log("aadhaar number" + aadhar_1);
                    if (aadhar_1.match(/[0-9]{12}/g)) {
                        console.log("aadhaar number is valid " + aadhar);
                        res.json({
                            fname,
                            mname,
                            lname,
                            aadhar,
                            address,
                            filename: req.file.filename,
                            isManualUpload: req.file.isManualUpload,
                            isImage: true
                        });
                        return;
                    }
                }
                i++;
            }
            res.json({
                error,
                filename: req.file.filename,
                isManualUpload: req.file.isManualUpload,
                isImage: true
            });
            return;
        }).
    catch(function(err) {
        console.log(err);
        res.json({
            error: 'Internal error occurred',
            filename: req.file.filename,
            isManualUpload: req.file.isManualUpload,
            isImage: true
        });

    });
}

function scanPAN(req, res) {

    var fileLocation = `uploads/${req.headers.application_id}/${req.headers.doc_type}/${req.file.filename}`;
    visionClient.detectText(fileLocation)
        .then((results) => {
            const detections = (results[0] + '').split('\n');
            detections.forEach((text, i) => { console.log(text + " index " + i) });

            var name = detections[3];
            var dob = detections[5];
            var error = "Fail"
            var pan = "";
            var i = 0;
            for (; i < detections.length;) {
                pan = detections[i];
                var pan = pan.replace(/\s/g, '')
                var pan = pan.trim();
                console
                console.log("pan number" + pan);
                var pan_0_5 = pan.substring(0, 5);
                var pan_0_5 = pan.substring(0, 5);
                if (pan_0_5.match(/^[A-Z]{5}/)) {
                    console.log("pan number" + pan_0_5);
                    var pan_5_9 = pan.substring(5, 9);
                    console.log("pan number" + pan_5_9);
                    if (pan_5_9.match(/[0-9]{4}/g)) {
                        var pan_9_10 = pan.substring(9, 10);
                        if (pan_9_10.match(/^[A-Z]{1}/)) {
                            res.json({
                                name,
                                dob,
                                pan,
                                filename: req.file.filename,
                                isManualUpload: req.file.isManualUpload,
                                isImage: true
                            });
                            return;
                        }
                    }

                }
                i++;
            }
            res.json({
                error,
                filename: req.file.filename,
                isManualUpload: req.file.isManualUpload,
                isImage: true
            });
            return;
        }).
    catch(function(err) {
        console.log(err);
        res.json({
            error: 'Internal error occurred',
            filename: req.file.filename,
            isManualUpload: req.file.isManualUpload,
            isImage: true
        });

    });
}

function scanDoc(req, res) {

    var fileLocation = `uploads/${req.headers.application_id}/${req.headers.doc_type}/${req.file.filename}`;
    visionClient.detectText(fileLocation, function(err, results) {

        if (!err) {
            const detections = (results[0] + '').split('\n');
            detections.forEach((text, i) => { console.log(text + " index " + i) });
            var pan = detections[7];
            res.json({
                data: detections,
                filename: req.file.filename,
                isManualUpload: req.file.isManualUpload,
                isImage: true
            });
        } else {
            console.log("error while ocr ", err);
            res.json({
                error: 'Internal erro occurred',
                filename: req.file.filename,
                isManualUpload: req.file.isManualUpload,
                isImage: true
            });
        }



    })

}



module.exports = router;
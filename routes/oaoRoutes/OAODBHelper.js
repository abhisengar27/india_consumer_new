var OAOApplicantSchema = require('../../models/OAOApplicantSchema');
var OAOSequenceGenerator = require('../../models/OAOSequenceGenerator');
var OAOPropertyDetail = require('../../models/OAOPropertyDetail');
var OAOProductTypeDetail = require('../../models/OAOProductTypeSchema');
var OAOProductDetail = require('../../models/OAOProductSchema');
var OAOCityDetailsSchema = require('../../models/OAOCityDetailsSchema');
var OAOVehicleDetailsSchema = require('../../models/OAOVehicleDetailsSchema');
var OAOVehicleDetailsNewSchema = require('../../models/OAOVehicleDetailsNewSchema');
var OAOEmployersSchema = require('../../models/OAOEmployersSchema');
var OAOTypeOfEmploymentSchema = require('../../models/OAOTypeOfEmploymentSchema');
var OAOResidenceTypeSchema = require('../../models/OAOResidenceTypeSchema');

module.exports = {

    //INSERT OR UPDATE APPLICANTS RECORD 
    save: function (dataSave, callback) {
        dataSave.save(function (err, result) {
            if (err) {
                return callback(err);
            }
            return callback(result);
        });
    },


    // VALIDATION
    validation: function (req, res, callback) {
        var postal_home_address_flag = req.body.postal_home_address_flag;
        var no_address_found_flag = req.body.no_address_found_flag;

        // first name 
        if (req.body.fname == "") {
            req.check('fname', 'ddd').notEmpty();
        } else if ((req.body.fname).length < 3 || (req.body.fname) > 45) {
            req.check('fname', 'name must be with spacified range (3, 45)').len(3, 45);
        } else if (re.test(req.body.fname) == false) {
            req.check('fname', 'Must contain letter and apostrophe').matches(/^[a-zA-Z '.-]+$/, 'i');
        }


        // Middle name 
        req.check('mname', 'Must contain letter and apostrophe').matches(/^[a-zA-Z '.-]+$/, 'i');
        req.check('mname', 'name must be with spacified range (3, 45)').len(3, 45);
        req.check('mname', 'middle name can not be blank').notEmpty();

        // Last name
        req.check('mname', 'Must contain letter and apostrophe').matches(/^[a-zA-Z '.-]+$/, 'i');
        req.check('mname', 'last name must be with spacified range (3, 45)').len(3, 45);
        req.check('lname', 'last name can not be blank').notEmpty();

        // date of birth
        req.check('dob', 'date of birth must be in [ YYYY-MM-DD ]').isDate({ format: 'YYYY-MM-DD' })
        req.check('dob', 'date of birth can not be blank').notEmpty();

        // Email ID
        req.check('email', 'email id can not be blank').isEmail();

        //Mobile Number
        req.check('mobile', 'Mobile number must be in +61434653192').isMobilePhone('en-AU');
        req.check('mobile', 'Mobile number can not be blank').notEmpty()

        // address
        req.check('address', 'A valid address is required').notEmpty();
        if (postal_home_address_flag == 'N') {
            req.check('paddress', 'A valid address is required').notEmpty();
        }

        if (no_address_found_flag == 'N') {
            req.check('postcode', 'A valid address is required').notEmpty();
            req.check('ppostcode', 'A valid address is required').notEmpty();
        }


        var status = req.validationErrors();
        return callback(status);
    },

    //CHECK FOR EXISTING APPLICANT IN DATABASE

    checkExistingApplicant: function (req, res, callback) {
        OAOApplicantSchema.findOne({ application_id: req.body.app_id || req.body.application_id }, function (err, result) {
            return callback(result);
        })
    },

    //GENERATE APPLICATION REFERENCE ID
    GenerateApplicationReferenceId: function (req, res, callback) {
        console.log("DBHelper GenerateApplicationReferenceId():"+req.body.application_id);
        
        if (req.body.application_id == undefined) {
            //         OAOSequenceGenerator.find(function(err,result){
            //     if(err)
            //     {
            //         return err;
            //     }else{
            //          self.UpdateApplicationReferenceIdGeneration(req, res, function(result) {
            //     })
            //     return callback(result);
            //     }

            // })
            OAOSequenceGenerator.find(function (err, result) {
                console.log("GenerateApplicationReferenceId() ref_id:" + result.app_ref_id)
                OAOSequenceGenerator.findOneAndUpdate({ "_id": "58bcf123f36d2837b81098ff" }, { app_ref_id: Number(result[0].app_ref_id) + 1 }, function (err, result) {
                    if (err) {
                        return err;
                    }
                    return callback(result)
                })
            })
        } else {
            return callback("result");
        }

    },

    //UPDATING APPLICATION REFERENCE ID EVERY APPLICATION SUBMITTED

    UpdateApplicationReferenceIdGeneration: function (req, res, callback) {
        OAOSequenceGenerator.find(function (err, result) {
            OAOSequenceGenerator.findOneAndUpdate({ "_id": "58bcf123f36d2837b81098ff" }, { app_ref_id: Number(result[0].app_ref_id) + 1 }, function (err, result) {
                if (err) {
                    return err;
                }
                return callback(result)
            })
        })
    },

    //UPDATING SECTION ON BACK
    UpdateApplication: function (app_id, section, callback) {
        var section = "section_EVR[0]." + section;
        console.log(section)
        OAOApplicantSchema.findOneAndUpdate({ "application_id": app_id }, { $set: { section_EVR: { "section_2": false } } }, function (err, result) {
            if (err) {
                console.log(err)
                return err;
            }
            console.log(result)
            return callback(result)
        })

    },

    //RESETTING APPLICATION REFERENCE ID EVERY DAY

    ResetApplicationReferenceId: function (req, res, callback) {
        OAOSequenceGenerator.find(function (err, result) {
            OAOSequenceGenerator.findOneAndUpdate({ "_id": "58bcf123f36d2837b81098ff" }, { app_ref: 0 }, function (err, result) {
                if (err) {
                    return err;
                }
                return callback(result)
            })
        })
    },

    getDropboxContent: function (PropertyType, Property, callback) {
        OAOPropertyDetail.find({ property_type: PropertyType, property: Property }, function (err, result) {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(result);
        })
    },

    getMessages: function (PropertyType, callback) {
        OAOPropertyDetail.find({ property_type: PropertyType }, function (err, result) {
            if (err) {
                return callback(err);
            }
            return callback(result);
        })
    },

    saveDropboxContent: function (dropBoxRecord, callback) {
        dropBoxRecord.save(function (err, result) {
            if (err) {
                return callback(err);
            }
            return callback(result);
        });
    },

    getApplicantsRecord: function (ApplicaionID, callback) {
        OAOApplicantSchema.find({ application_id: ApplicaionID }, function (err, result) {
            if (err) {
                return callback(err);
            }
            return callback(result);

        })
    },
    getApplicantsFilteredRecord: function(query, filter, callback) {
        OAOApplicantSchema.findOne(query, filter, function(err, result) {
            if (!err) {
                callback(null, result);
            } else {
                callback(err, null);
            }


        })
    },
    //GET SAVED RECORD 
    getSavedRecord: function (mobile, dob, callback) {
        console.log("mobile", mobile, dob);
        var query = {}
        switch (dob) {
            case 'true': query["mobile"] = mobile;
                query["product_type_code"] = { $in: ['SAV', 'SAL', 'LAA'] }
                break;
            case 'no': query["mobile"] = mobile;
                query["application_status"] = { $in: ['SAV', 'INC'] }
                query["product_type_code"] = { $in: ['SAV', 'SAL', 'LAA'] }
                break;
            default: query["mobile"] = mobile;
                query["dob"] = dob;
                query["application_status"] = { $in: ['SAV', 'INC'] }
                query["product_type_code"] = { $in: ['SAV', 'SAL', 'LAA'] }
        }
        console.log("alljkh  ", query)
        OAOApplicantSchema.find(query, function (err, result) {
            if (err) {
                return callback(err, success = false);
            } else if ((result !== null && result != '')) {
                return callback(result, success = true);
            } else {
                console.log("res", result)
                return callback(result, success = false);
            }

        })
    },

    //get email record
    getEmailSavedRecord: function (email, callback) {
        OAOApplicantSchema.find({ application_id: ApplicaionID, application_status: 'SAV' }, function (err, result) {
            if (err) {
                return callback(err, success = false);
            }
            return callback(result, success = true);

        })
    },
    getProductContent: function (ProductCode, callback) {
        console.log(ProductCode)
        OAOProductDetail.find({ product_code: ProductCode }, function (err, result) {
            if (err) {
                return callback(err);
            }
            console.log(result)
            return callback(result);
        })
    },

    getEmployers: function (callback) {
        OAOEmployersSchema.find({ "delete_flag": "N" }, function (err, result) {
            if (err) {
                return callback(err);
            }
            console.log(result)
            return callback(result);
        })
    },
    UpdateResumeTime: function (app_id, update_value, callback) {
        console.log("is  id " + app_id + "updating value is" + update_value);
        OAOApplicantSchema.findOneAndUpdate({ "application_id": app_id }, update_value, function (err, result) {
            if (err) {
                console.log("error is " + err);
                return err;
            }
            console.log(result);
            return callback(result);

        });
    },

    saveUploadData: function(app_id, query, callback) {
        OAOApplicantSchema.update({ "application_id": app_id }, { $push: query }, function(err, result) {
            if (!err) {
                callback(null, result);
            } else {
                callback(err, null);
            }
        })
    },

    deleteUploadData: function(app_id, query, callback) {

        OAOApplicantSchema.update({ "application_id": app_id }, { $pull: query }, function(err, result) {
            if (!err) {
                callback(null, result);
            } else {
                callback(err, null);
            }
        })
    },
        getEmployerstype: function(callback) {
               console.log("getEmployerstype in helper")
        OAOTypeOfEmploymentSchema.find(function(err, result) {
            if (err) {
                return callback(err);
            }
            console.log(result)
            return callback(result);
        })
    },
        getCities: function (callback) {
        OAOCityDetailsSchema.find({ "delete_flag": "N" }, function (err, result) {
            if (err) {
                return callback(err);
            }
            console.log(result)
            return callback(result);
        })
    },

    getVehicles: function (query_v,callback) {
        console.log(query_v)
        console.log("getVehicles in helper")
        var regexp = new RegExp(query_v,'i');
        OAOVehicleDetailsNewSchema.find({"vehicle_make": regexp, "delete_flag": "N" }, function (err, result) {
            if (err) {
                return callback(err);
            }
            console.log(result)
            return callback(result);
        })
    },
    
        residenceType: function (callback) {
        OAOResidenceTypeSchema.find({ "delete_flag": "N" }, function (err, result) {
            if (err) {
                return callback(err);
            }
            console.log(result)
            return callback(result);
        })
    },

        getVehiclePrice: function (query_v,callback) {
        console.log("getVehiclePrice in helper:"+query_v)
        var vName = new RegExp(query_v);
        OAOVehicleDetailsNewSchema.find({"vehicle_make": vName, "delete_flag": "N" }, function (err, result) {
            if (err) {
                return callback(err);
            }
            console.log(result)
            return callback(result);
        })
    },
      getEmployers: function(callback) {
        OAOEmployersSchema.find({ "delete_flag":"N" }, function(err, result) {
            if (err) {
                return callback(err);
            }
            console.log(result)
            return callback(result);
        })
    },

       getEmployers_chatbot: function (query_v,callback) {
        var regexp = new RegExp(query_v,'i');
        OAOEmployersSchema.find({"employer_name": regexp, "delete_flag": "N" }, function (err, result) {
            if (err) {
                return callback(err);
            }
            console.log(result)
            return callback(result);
        })
    },
    

};
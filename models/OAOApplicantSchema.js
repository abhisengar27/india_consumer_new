var mongoose = require('mongoose');
var constants = require('../routes/oaoRoutes/appConstants');
var oaoApplicant = new mongoose.Schema({
    product_code: { type: String },
    product_type_code: { type: String },
    product_name: { type: String },
    title: { type: String },
    application_id: { type: String },
    core_customer_id: { type: Number },
    deviceType: { type: String },
    fname: { type: String },
    mname: { type: String },
    lname: { type: String },
    dob: { type: String },
    email: { type: String },
    mobile: { type: String },
    fatherName:{type:String},
    noOfDependents:{type:String},
    maritalStatus:{type:String},
    gender:{type:String},
    currentResidence:{type:String},
    residence_month:{type:String},
    ResidenceType:{type:String},
    is_aadhaar: { type: Boolean },
    aadhaar_number: { type: String },
    retrieved_aadhaar_number: { type: String },
    pan: { type: String },
    retrieved_pan_number: {type: String},

    brokerid: { type: String },
    campaign_id: { type: String },
    address: { type: String },
    paddress: { type: String },
    DLidState: { type: String },
    LNum: { type: String },
    color: { type: String },
    idnum: { type: String },
    idstate: { type: String },
    refnum: { type: String },
    tfn: { type: String },
    validTo: { type: String },
    exemption: { type: String },
    housenum: { type: String },
    streetnum: { type: String },
    streetname: { type: String },
    streettype: { type: String },
    suburb: { type: String },
    state: { type: String },
    postcode: { type: String },
    phousenum: { type: String },
    pstreetnum: { type: String },
    pstreetname: { type: String },
    pstreettype: { type: String },
    psuburb: { type: String },
    pstate: { type: String },
    ppostcode: { type: String },
    postal_home_address_flag: { type: Boolean },
    no_address_found_flag: { type: String },
    loantype: { type: String },
    property: { type: String },
    proptype: { type: String },
    payoutbal: { type: Number },
    propaddr: { type: String },
    purchaseprice: { type: Number },
    amtborrow: { type: Number },
    loanterm: { type: String },
    frequencyType: { type: String },
    repaymenttype: { type: String },
    interesttype: { type: String },
    fixedper: { type: Number },
    variableper: { type: Number },
    consolidateMortage: { type: Boolean },
    estvalue: { type: Number },
    propaddress_m: { type: String },
    finInstitution: { type: String },
    consolidateotherMortage: { type: Boolean },
    cc_estvalue: { type: Number },
    cc_finInstitution: { type: String },
    pl_estvalue: { type: Number },
    pl_finInstitution: { type: String },
    cl_estvalue: { type: Number },
    cl_finInstitution: { type: String },
    sl_estvalue: { type: Number },
    sl_finInstitution: { type: String },
    o_estvalue: { type: Number },
    o_finInstitution: { type: String },
    ownership: { type: String },
    rentalincome: { type: Number },



    prophousenum: { type: String },
    propstreetnum: { type: String },
    propstreetname: { type: String },
    propstreettype: { type: String },
    propsuburb: { type: String },
    propstate: { type: String },
    proppostcode: { type: String },


    prophousenum_m: { type: String },
    propstreetnum_m: { type: String },
    propstreetname_m: { type: String },
    propstreettype_m: { type: String },
    propsuburb_m: { type: String },
    propstate_m: { type: String },
    proppostcode_m: { type: String },
    employed: { type: String },
    employer: { type: String },
    employment_letter:{ type: Boolean },
    designation:{type:String},
    workEmailId:{type:String},
    buildingNo:{type:Number},
    workaddress:{type:String},
    officeLandLine:{type:String},
    service: { type: Number },
    companyName: { type: String },
    yearsEstablished: { type: Number },
    earnPerMonth: { type: Number },
    monthlyLivingExpenses: { type: Number },

    vehicleLoanType: { type: String },
    vehicle_make:{type:String},
    vehicle_onroad_price:{type:String},
    employertype:{type:String},
    netIncome:{type:Number},
    Work_experience:{type:String},
    noMonths:{type:Number},
    monthlyEmiRange:{type:Number},
    loanTermRange:{type:Number},
    loanAmountRange:{type:Number},
    employertype:{type:String},
    vehicle_onroad_price:{type:String},
    interestPayable:{type:Number},
    totalPayableAmount:{type:Number},
    loanreason: [],

    assets: [],
    Liabilities: [],
    cre_time: { type: Date, default: Date.now },
    mod_time: { type: Date, default: Date.now },
    cre_by: { type: String, default: 'Applicant' },
    mod_by: { type: String, default: 'Applicant' },
    del_flg: { type: String, default: 'N' },
    help_flg: { type: String, default: 'N' },
    no_of_section: { type: String, default: 3 },
    section_SAV: [{
        section_1: { type: Boolean, default: false },
        section_2: { type: Boolean, default: false },
        section_3: { type: Boolean, default: false }
    }],
    section_SAL: [{
        section_1: { type: Boolean, default: false },
        section_2: { type: Boolean, default: false },
        section_3: { type: Boolean, default: false },
        section_4: { type: Boolean, default: false }
    }],

    section_HML: [{
        section_1: { type: Boolean, default: false },
        section_2: { type: Boolean, default: false },
        section_3: { type: Boolean, default: false },
        section_4: { type: Boolean, default: false }
    }],
    section_PRL: [{
        section_1: { type: Boolean, default: false },
        section_2: { type: Boolean, default: false },
        section_3: { type: Boolean, default: false },
        section_4: { type: Boolean, default: false }
    }],
    section_LAA: [{
        section_1: { type: Boolean, default: false },
        section_2: { type: Boolean, default: false },
        section_3: { type: Boolean, default: false },
        section_4: { type: Boolean, default: false },
        section_5: { type: Boolean, default: false },
        section_6: { type: Boolean, default: false }
    }],
    Mandatory_fields_SAV: [{
        section_1_fields: [{
            fname: { type: Boolean, default: false },
            lname: { type: Boolean, default: false },
            dob: { type: Boolean, default: false },
            mobile: { type: Boolean, default: false },
            email: { type: Boolean, default: false },
            mobile: { type: Boolean, default: false },
            email: { type: Boolean, default: false },
            address: { type: Boolean, default: false },
            paddress: { type: Boolean, default: false }
        }],
        section_2_fields: [{
            pan: { type: Boolean, default: false },
	    retrieved_pan_number: {type: Boolean, default: false}
        }],
        section_3_fields: [{

        }]
    }],
    Mandatory_fields_LAA: [{
        section_1_fields: [{
            fname: { type: Boolean, default: false },
            lname: { type: Boolean, default: false },
            dob: { type: Boolean, default: false },
            mobile: { type: Boolean, default: false },
            email: { type: Boolean, default: false },
            mobile: { type: Boolean, default: false },
            email: { type: Boolean, default: false },
            address: { type: Boolean, default: false },
            paddress: { type: Boolean, default: false }
        }],
        section_2_fields: [{
            designation: { type: Boolean, default: false },
            workEmailId: { type: Boolean, default: false },
            buildingNo: { type: Boolean, default: false },
            workaddress: { type: Boolean, default: false },
        }],
        section_3_fields: [{

        }]
    }],
    Mandatory_fields_SAL: [{
        section_1_fields: [{
            fname: { type: Boolean, default: false },
            lname: { type: Boolean, default: false },
            dob: { type: Boolean, default: false },
            mobile: { type: Boolean, default: false },
            email: { type: Boolean, default: false },
            employer: { type: Boolean, default: false },
            address: { type: Boolean, default: false },
            paddress: { type: Boolean, default: false },
        }],
        section_2_fields: [{
            employment_letter: { type: Boolean, default: false }
        }],
        section_3_fields: [{
            pan: { type: Boolean, default: false },
        }],
        section_4_fields: [{}],
    }],
    Mandatory_fields_HML: [{
        section_1_fields: [{
            fname: { type: Boolean, default: false },
            lname: { type: Boolean, default: false },
            dob: { type: Boolean, default: false },
            mobile: { type: Boolean, default: false },
            email: { type: Boolean, default: false },
            address: { type: Boolean, default: false }
        }],
        section_2_fields: [{
            prophousenum_m: { type: Boolean, default: false },
            propstreetnum_m: { type: Boolean, default: false },
            propstreetname_m: { type: Boolean, default: false },
            propstreettype_m: { type: Boolean, default: false },
            propsuburb_m: { type: Boolean, default: false },
            propstate_m: { type: Boolean, default: false },
            proppostcode_m: { type: Boolean, default: false },
            loantype: { type: Boolean, default: false },
            property: { type: Boolean, default: false },
            proptype: { type: Boolean, default: false },
            payoutbal: { type: Boolean, default: false },
            propaddr: { type: Boolean, default: false },
            purchaseprice: { type: Boolean, default: false },
            ownership: { type: Boolean, default: false },
            amtborrow: { type: Boolean, default: false },
            loanterm: { type: Boolean, default: false },
            frequencyType: { type: Boolean, default: false },
            interesttype: { type: Boolean, default: false },
            fixedper: { type: Boolean, default: false },
            variableper: { type: Boolean, default: false },
            repaymenttype: { type: Boolean, default: false },
            estvalue: { type: Boolean, default: false },
            propaddress_m: { type: Boolean, default: false },
            finInstitution: { type: Boolean, default: false }
        }],
        section_3_fields: [{
            employed: { type: Boolean, default: false },
            employer: { type: Boolean, default: false },
            service: { type: Boolean, default: false },
            companyName: { type: Boolean, default: false },
            yearsEstablished: { type: Boolean, default: false },
            earnPerMonth: { type: Boolean, default: false },
            monthlyLivingExpenses: { type: Boolean, default: false }
        }],
        section_4_fields: [{}]
    }],
    Mandatory_fields_PRL: [{
        section_1_fields: [{
            fname: { type: Boolean, default: false },
            lname: { type: Boolean, default: false },
            dob: { type: Boolean, default: false },
            mobile: { type: Boolean, default: false },
            email: { type: Boolean, default: false },
            brokerid: { type: String, default: false },
            address: { type: Boolean, default: false }
        }],
        section_2_fields: [{
            amtborrow: { type: Boolean, default: false },
            loanterm: { type: Boolean, default: false },
            frequencyType: { type: Boolean, default: false },
            loanreason: { type: Boolean, default: false }
        }],
        section_3_fields: [{
            employed: { type: Boolean, default: false },
            employer: { type: Boolean, default: false },
            service: { type: Boolean, default: false },
            companyName: { type: Boolean, default: false },
            yearsEstablished: { type: Boolean, default: false },
            earnPerMonth: { type: Boolean, default: false },
            monthlyLivingExpenses: { type: Boolean, default: false }
        }],
        section_4_fields: [{

        }]
    }],
    bot_fields: [{
        notInterestedReason: { type: String },
        socialId: { type: String },
        botContacted: { type: String, default: 'N' },
        noOfRemaindersSent: { type: String, default: 0 }
    }],
    application_status: { type: String, default: constants.ACTIVE },
    assigned_to: { type: String, default: "Unassigned" },
    logs: [{
        who: { type: String },
        change_type: { type: String },
        from: { type: String },
        to: { type: String },
        comment: { type: String },
        updated_time: { type: Date, default: Date.now },
        Attachments: { type: String }
    }],
    comments: { type: String },
    singleORjoint: { type: String },
    core_account_number: { type: String },
    bank_bsb_number: { type: Number },
    existing_cust_status: { type: String },
    cross_sell: { type: Object },
    filesUpload: { type: Object }
});

module.exports = mongoose.model('oaoApplicant', oaoApplicant);
import { UploadLocation } from './uploadLocation.interface';
export class PersonalDetailsObject {
        constructor(
                public product_type_code: string,

                public singleORjoint: string,
                public title: string,
                public fname: string,
                public mname: string,
                public lname: string,
                public dob: string,
                public email?: string,
                public mobile?: string,
                public no_of_section?: any,
                public linked_crossselling_product?: string,
                public main_app_no?: String,
                public main_prod_type?: string,
                public main_prod?: string,

                public sec_1_v?: boolean,
                public product_code?: string,
                public product_name?: string,
                public section_EVR?: any,
                public section_HML?: any,
                public section_VL1?: any,
                public section_PRL?: any,
                public tfn?: string,
                public DLidState?: string,
                public LNum?: string,
                public color?: string,
                public idnum?: string,
                public idstate?: string,
                public refnum?: string,
                public validTo?: string,
                public exemption?: string,
                public housenum?: string,
                public streetnum?: string,
                public streetname?: string,
                public streettype?: string,
                public suburb?: string,
                public state?: string,
                public postcode?: string,
                public address?: string,
                public phousenum?: string,
                public pstreetnum?: string,
                public pstreetname?: string,
                public pstreettype?: string,
                public psuburb?: string,
                public pstate?: string,
                public ppostcode?: string,
                public paddress?: string,
                public app_id?: String,
                public application_id?: String,
                public meidicarenum?: String,
                public core_account_number?: String,
                public core_customer_id?: Number,
                public bank_bsb_number?: String,
                public postal_home_address_flag?: Boolean,
                public no_address_found_flag?: string,
                public skip?: boolean,

                //for home loan
                public loantype?: string,
                public property?: string,
                public proptype?: string,
                public payoutbal?: string,
                public propaddr?: string,
                public purchaseprice?: string,
                public amtborrow?: string,
                public loanterm?: string,
                public frequencyType?: string,
                // public loanterm_n?:string,
                public repaymenttype?: string,
                public interesttype?: string,
                public fixedper?: string,
                public variableper?: string,
                public consolidateMortage?: boolean,
                public estvalue?: string,
                public propaddress_m?: string,
                public finInstitution?: string,
                public consolidateotherMortage?: boolean,
                public cc_estvalue?: string,
                public cc_finInstitution?: string,
                public pl_estvalue?: string,
                public pl_finInstitution?: string,
                public cl_estvalue?: string,
                public cl_finInstitution?: string,
                public sl_estvalue?: string,
                public sl_finInstitution?: string,
                public o_estvalue?: string,
                public o_finInstitution?: string,
                public employed?: string,
                public employer?: string,
                public service?: string,
                public companyName?: string,
                public yearsEstablished?: string,
                public earnPerMonth?: string,
                public monthlyLivingExpenses?: string,
                public ownership?: string,
                public assettype?: string,
                public assetvalue?: string,
                public Liabilitiestype?: string,
                public Payable_Amount?: string,
                public Payment_Frequency?: string,
                public Balance_Pending?: string,
                public Financial_Institution?: string,
                public rentalincome?: string,
                public assets?: any,
                public Liabilities?: any,
                public asset_liability?: boolean,

                //for personal loan
                public loanreason?: any,
                public existing_cust_status?: string, //chandan

                public userName?: string, //chandan
                //for Bank loan
                public is_aadhaar?: boolean,
                public retrieved_aadhaar_number?: string,
                public aadhar?: string,
                public pan?: string,
                public retrieved_pan_number?: string,
                public uploadLocation?: UploadLocation,
                public sectionCount?: number,
                public max_permissible_amount?: number,
                public max_allowed_percent?: number,
                public loanAmountRange?: number,
                public loanTermRange?: number,
                public monthlyEmiRange?: number,
                public fatherName?: string,
                public noOfDependents?: string,
                public maritalStatus?: string,
                public progressBarConfig?: string[],
                public isAadhaarValidated?: boolean,
                public currentResidence?: string,
                public residence_month?:number,
                public ResidenceType?: string,
                public designation?: string,
                public workEmailId?: string,
                public officeLandLine?: string,
                public workaddress?: string,
                public buildingNo?: number,
                public gender?: string,
                public loanInterestRange?: number,
                public W_streetnum?: string,
                public W_streetname?: string,
                public W_streettype?: string,
                public W_suburb?: string,
                public W_state?: string,
                public W_postcode?: string,
                public W_address?: string,
                public application_status?: string,
                //for vehicle loan
                public vehicleLoanType?: string,
                public vehicle_make?: string,
                public vehicle_onroad_price?: string,
                public netIncome?: number,
                public employertype?: string,
                public Work_experience?: string,
                public noMonths?: number,
                public PAT?: string,
                public SelfEmploymentProfessionalProfession?: string,
                public threeYearsIncome?: number,
                public onroadprice_85?: number,
                public loan_eligible_amount?: number,
                public emi?: number,
                public max_emi?: number,
                public min_emi?: number,
                public interestPayable?: number,
                public totalPayableAmount?: number,
                public Offer_letter?:string,
                public form_16?:string,
                public relieving_letter?:string,
                public businessProof?:string,
                public addrDoc?:string,
                public idProof?:string,
                public employmentType?:string
                

        ) {
                this.product_code = product_code;//chandan
                this.userName = userName;//chandan
                this.application_status = application_status;
                this.main_app_no = main_app_no;
                this.main_prod_type = main_prod_type;
                this.main_prod = main_prod;
                this.section_VL1 = section_VL1;
                this.sec_1_v = sec_1_v;

                this.linked_crossselling_product = linked_crossselling_product;
                this.product_type_code = product_type_code;
                this.product_name = product_name;
                this.existing_cust_status = existing_cust_status;//chandan
                this.no_of_section = no_of_section;
                this.section_EVR = section_EVR;
                this.section_HML = section_HML;
                this.section_PRL = section_PRL;
                this.singleORjoint = singleORjoint;
                this.fname = fname;
                this.mname = mname;
                this.lname = lname;
                this.dob = dob;
                this.email = email;
                this.mobile = mobile;
                this.tfn = tfn;
                this.DLidState = DLidState;
                this.LNum = LNum;
                this.color = color;
                this.idnum = idnum;
                this.idstate = idstate;
                this.refnum = refnum;
                this.validTo = validTo;
                this.exemption = exemption;
                this.housenum = housenum
                this.streetnum = streetnum
                this.streetname = streetname
                this.streettype = streettype
                this.suburb = suburb
                this.state = state
                this.postcode = postcode
                this.address = address
                this.phousenum = phousenum
                this.pstreetnum = pstreetnum
                this.pstreetname = pstreetname
                this.pstreettype = pstreettype
                this.psuburb = psuburb
                this.pstate = pstate
                this.ppostcode = ppostcode
                this.paddress = paddress
                this.app_id = app_id
                this.application_id = application_id
                this.meidicarenum = meidicarenum
                this.core_customer_id = core_customer_id
                this.core_account_number = core_account_number
                this.bank_bsb_number = bank_bsb_number
                this.postal_home_address_flag = postal_home_address_flag
                this.no_address_found_flag = no_address_found_flag
                this.skip = skip
                this.title = title

                //for home loan
                this.loantype = loantype
                this.property = property
                this.proptype = proptype
                this.payoutbal = payoutbal
                this.propaddr = propaddr
                this.purchaseprice = purchaseprice
                this.amtborrow = amtborrow
                this.loanterm = loanterm
                this.frequencyType = frequencyType
                // this.loanterm_n=loanterm_n
                this.repaymenttype = repaymenttype
                this.interesttype = interesttype
                this.fixedper = fixedper
                this.variableper = variableper
                this.consolidateMortage = consolidateMortage
                this.estvalue = estvalue
                this.propaddress_m = propaddress_m
                this.finInstitution = finInstitution
                this.consolidateotherMortage = consolidateotherMortage
                this.cc_estvalue = cc_estvalue
                this.cc_finInstitution = cc_finInstitution
                this.pl_estvalue = pl_estvalue
                this.pl_finInstitution = pl_finInstitution
                this.cl_estvalue = cl_estvalue
                this.cl_finInstitution = cl_finInstitution
                this.sl_estvalue = sl_estvalue
                this.sl_finInstitution = sl_finInstitution
                this.o_estvalue = o_estvalue
                this.o_finInstitution = o_finInstitution
                this.employed = employed
                this.employer = employer
                this.service = service
                this.companyName = companyName
                this.yearsEstablished = yearsEstablished
                this.earnPerMonth = earnPerMonth
                this.monthlyLivingExpenses = monthlyLivingExpenses
                this.ownership = ownership
                this.assettype = assettype
                this.assetvalue = assetvalue
                this.Liabilitiestype = Liabilitiestype
                this.Payable_Amount
                this.Payment_Frequency
                this.Balance_Pending
                this.Financial_Institution
                this.rentalincome = rentalincome
                this.assets = assets
                this.Liabilities = Liabilities
                this.asset_liability = asset_liability
                this.loanreason = loanreason

                //for bank loan
                this.is_aadhaar = is_aadhaar
                this.retrieved_aadhaar_number = retrieved_aadhaar_number
                this.aadhar = aadhar
                this.pan = pan
                this.retrieved_pan_number = retrieved_pan_number
                this.uploadLocation = uploadLocation
                this.sectionCount = sectionCount
                this.progressBarConfig = progressBarConfig
                this.isAadhaarValidated = isAadhaarValidated
                // for vehicle loan
                this.vehicleLoanType = vehicleLoanType;
                this.vehicle_make = vehicle_make;
                this.loanAmountRange = loanAmountRange;
                this.loanTermRange = loanTermRange;
                this.monthlyEmiRange = monthlyEmiRange;
                this.max_permissible_amount = max_permissible_amount;
                this.max_allowed_percent = max_allowed_percent;
                this.fatherName = fatherName;
                this.noOfDependents = noOfDependents;
                this.maritalStatus = maritalStatus;
                this.currentResidence = currentResidence;
                this.residence_month=residence_month;
                this.ResidenceType = ResidenceType;
                this.workEmailId = workEmailId;
                this.designation = designation;
                this.officeLandLine = officeLandLine;
                this.workaddress = workaddress;
                this.buildingNo = buildingNo;
                this.gender = gender;
                this.loanInterestRange = loanInterestRange;
                this.W_streetnum = W_streetnum
                this.W_streetname = W_streetname
                this.W_streettype = streettype
                this.W_suburb = W_suburb
                this.W_state = W_state
                this.W_postcode = W_postcode
                this.W_address = W_address
                this.netIncome = netIncome;
                this.vehicle_onroad_price = vehicle_onroad_price;
                this.employertype = employertype;
                this.Work_experience = Work_experience;
                this.noMonths = noMonths;
                this.PAT = PAT;
                this.SelfEmploymentProfessionalProfession = SelfEmploymentProfessionalProfession;
                this.threeYearsIncome = threeYearsIncome;
                this.onroadprice_85 = onroadprice_85;
                this.loan_eligible_amount = loan_eligible_amount;
                this.interestPayable = interestPayable;
                this.totalPayableAmount = totalPayableAmount;
                this.Offer_letter=Offer_letter;
                this.form_16=form_16;
                this.relieving_letter=relieving_letter;
                this.businessProof=businessProof;
                this.addrDoc=addrDoc;
                this.idProof=idProof;
                this.employmentType=employmentType;
        }
}
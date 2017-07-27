import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'

import { google } from "../../interfaces/configinterface";
import { ConfigDetails } from "../../interfaces/configinterface";
import { OAOService } from "../../services/OAO.Service"
import { FirstNameValidator } from "../../validators/namevalidator";
import { VehicleLoanDetails } from "../../interfaces/vehicleLoanDetails.interface";
import { FormGroup, FormControl, Validators, NgForm } from "@angular/forms";
import { Common } from '../../validators/commonFunc';
import { DatePipe } from '@angular/common';
import { PersonalDetailsObject } from "../../interfaces/personalDetails.interface";
import { GoogleAnalyticsEventsService } from "../../services/GoogleAnalyticsEvents.Service";


declare var jQuery: any;
declare var Ladda
@Component({
    selector: 'employerExtraInfoForLoan',
    templateUrl: './employerExtraInfoForLoan.component.html'

})
export class EmployerExtraInfoForLoan implements AfterViewInit, OnInit {
    public application_id: any;
    private check: boolean = false;//to display modal
    private hold: boolean = false;
    public state_drop: String[] = [];
    public street: String[] = [];
    public showAddress: String = "true"
    public showCustomAddr: String = "true"
    public showCustomPAddr: String = "true"
    public inf_001: String
    public wrn_001: String
    configMsg: ConfigDetails
    isLoading: boolean = false;
    public paddrShow: boolean = false;
    public ResidenceType: any;
    public residence = [];
    public addrErr = false;
    public paddrErr = false;
    public no_address_found_flag: string
    private isCrossSell: boolean = false;
    private crossSellDisplaytext: string = '';
    model1 = new VehicleLoanDetails();
    model = new PersonalDetailsObject('', '', '', '', '', '', '');
    crossmodel = new PersonalDetailsObject('', '', '', '', '', '', '');
    userExistingFlag: boolean; //chandan  //No changes in html page
    checkDupStatus: boolean = false; //chandan

    private forwardProgressDataBNA = ['completed', 'active', '', '', 'Y', 'N'];
    private forwardProgressDataSAL1 = ['completed', 'active', '', '', '', 'Y', 'N'];
    constructor(private oaoService: OAOService, private router: Router, private route: ActivatedRoute, private gaEventsService: GoogleAnalyticsEventsService) {
        console.log("PersonalDetailsContactComponent  constructor()")

        console.log("cross selling prod code", this.model.linked_crossselling_product);
        this.crossmodel = Object.assign({}, this.oaoService.getPersonalDetailsObject());
        this.model = this.oaoService.getPersonalDetailsObject();
        this.model1 = this.oaoService.getVehicleLoanObject();
        console.log(this.model1);
        // this.oaoService.GetProductDetail(this.model.linked_crossselling_product)
        //     .subscribe(data => {
        //         console.log(data);
        //         this.crossmodel.product_type_code = data.result[0].child_of;
        //         this.crossmodel.product_code = data.result[0].product_code;
        //         this.crossmodel.product_name = data.result[0].product_name;
        //         this.crossSellDisplaytext = data.result[0].display_text;
        //         console.log('Cross Model', JSON.stringify(this.crossmodel));
        //     })


        if (this.model.postcode == undefined) {
            this.model.postcode = "1234";


        }
        if (this.model.ppostcode == undefined) {

            this.model.ppostcode = "1234";
        }
        console.log(this.oaoService.getPersonalDetailsObject())
        this.no_address_found_flag = "N";
        this.userExistingFlag = this.oaoService.getUserExistingFlag(); //chandan
        this.oaoService.getConfig()
            .subscribe((data) => { this.configMsg = JSON.parse(JSON.stringify(data.data)); });

        // this.model.postal_home_address_flag=false;
        if (!this.model.postal_home_address_flag) {
            this.model.postal_home_address_flag = false;
        }
        if (this.model.ResidenceType === null || this.model.ResidenceType === '' || this.model.ResidenceType === undefined) {
            this.model.ResidenceType = '0';
        }

    }

    onSubmit() {
        console.log("onsubmit()")
         this.model.employer=this.model1.employer
        if (this.userExistingFlag) {
            console.log("existing user directly creating appliction")
            this.submitSection();
        }
        else {
            console.log("New  user ")
            if (!this.oaoService.getCallMatchingCustomerFlag()) {
                console.log("checkMatchingCustomer() called");

                //Has to work on this when schema is ready
                // this.oaoService.checkMatchingCustomer(this.model)
                // .subscribe(data =>
                //     {
                //         if(data.status){
                //             jQuery('#matching-customer-modal').modal('show');
                //          }
                //          else{
                //             this.oaoService.setCallMatchingCustomerFlag(true);

                //         }
                //     });   

                this.submitSection();
            }
            else {
                console.log("checkMatchingCustomer() not called");
                this.submitSection();
            }
        }
    }
    changeCallMatchingCustomerFlag() {
        this.oaoService.setCallMatchingCustomerFlag(false);
        console.log("CallMatchingCustomerFlag changed to:false")
    }
    submitSection() {
        this.isLoading = !this.isLoading;
        this.model.no_address_found_flag = this.no_address_found_flag;

        if (this.model.postcode != null && this.model.postcode != '1234') {
            this.addrErr = false;
            if (this.no_address_found_flag == 'Y') {
                this.model.workaddress = this.model.W_streetnum + " " + this.model.W_streetname + " " + this.model.W_suburb + " " + this.model.W_state + " " + this.model.W_postcode;
            }
        } else if (this.model.is_aadhaar) {
            this.isLoading = false
            this.addrErr = false;
        }
        else {
            this.isLoading = false
            this.addrErr = true;
            return;
        }


        if ((this.model.ppostcode != null && this.model.ppostcode != '1234') || this.model.postal_home_address_flag == false) {
            this.paddrErr = false;
            if (this.paddrShow == true && this.model.postal_home_address_flag == true) {
                this.model.paddress = this.model.pstreetnum + " " + this.model.pstreetname + " " + this.model.psuburb + " " + this.model.pstate + " " + this.model.ppostcode;
            }
        }
        else {
            console.log("i am here", this.model.postal_home_address_flag);;
            this.isLoading = false
            this.paddrErr = true;
            return
        }

        if (this.model.postal_home_address_flag == false) {
            this.paddrErr = false;
            this.model.phousenum = this.model.housenum;
            this.model.pstreetnum = this.model.streetnum;
            this.model.paddress = this.model.address;
            this.model.pstreetname = this.model.streetname;
            this.model.ppostcode = this.model.postcode;
            this.model.pstate = this.model.state;
        }
        //this.model.app_id=this.model.application_id;
        this.model.sec_1_v = true;
        this.oaoService.setPersonalDetailsObject(this.model);
        console.log("product code model", this.model.product_code);
        switch (this.model.product_code) {
            case 'BNA': this.oaoService.OAOCreateOrUpdateApplicant(this.model)
                .subscribe(
                data => {
                    console.log("updated data", data);
                    this.model.application_id = data.Result.application_id;

                    this.oaoService.setPersonalDetailsObject(this.model);
                    this.check = true
                    if (this.hold == false) {
                        this.showSave();
                    }
                    if (this.hold == true) {
                        this.oaoService.setProgressBardata(this.forwardProgressDataBNA);
                        this.router.navigate(["../panInfo"], { relativeTo: this.route });
                    }
                });
                if (this.isCrossSell) {
                    this.gaEventsService.emitEvent('OAO_Crosssell', this.crossmodel.product_name, window.location.pathname, 10);
                    this.createCrossSellApplicants();
                }
                break;
            case 'SAL1': this.oaoService.OAOCreateOrUpdateSalaryApplicant(this.model)
                .subscribe(
                data => {
                    this.model.application_id = data.Result.application_id;
                    this.oaoService.setPersonalDetailsObject(this.model);
                    this.check = true
                    if (this.hold == false) {
                        this.showSave();
                    }
                    if (this.hold == true) {
                        this.oaoService.setProgressBardata(this.forwardProgressDataSAL1);
                        this.router.navigate(["../confirmLetter"], { relativeTo: this.route });
                        //this.router.navigate(["../panInfo"], {relativeTo:this.route});
                    }
                });
                if (this.isCrossSell) {
                    this.gaEventsService.emitEvent('OAO_Crosssell', this.crossmodel.product_name, window.location.pathname, 10);
                    this.createCrossSellApplicants();
                }
                break;
            case 'VL1': this.oaoService.OAOCreateOrUpdateVehicleApplicant(this.model)
                .subscribe(
                data => {
                    this.model.application_id = data.Result.application_id;
                    this.oaoService.setPersonalDetailsObject(this.model);
                    this.check = true
                    if (this.hold == false) {
                        this.showSave();
                    }
                    if (this.hold == true) {
                       // this.oaoService.setProgressBardata(this.forwardProgressDataSAL1);
                       Common.completedProgressBarStep(5);
                        this.router.navigate(["../documentsForVehicleLoan"], { relativeTo: this.route });
                        //this.router.navigate(["../panInfo"], {relativeTo:this.route});
                    }
                });
                if (this.isCrossSell) {
                    this.gaEventsService.emitEvent('OAO_Crosssell', this.crossmodel.product_name, window.location.pathname, 10);
                    this.createCrossSellApplicants();
                }
                break;

            default: console.log("Page not found");

        }
    }


    showCustomAddressFields() {
        this.addrErr = false;
        this.showCustomAddr = "";
        this.no_address_found_flag = "Y";
        this.model.address = '';
        this.model.streettype = '';
        this.model.suburb = '';
    }
    showCustomPostalAddressFields() {
        this.paddrErr = false;
        this.showCustomPAddr = "";
        this.no_address_found_flag = "Y";
        this.paddrShow = true;
        this.model.paddress = '';
        this.model.pstreettype = '';
        this.model.psuburb = '';
    }
    hideaddress() {
        this.showCustomAddr = "true";
        this.model.address = '';
        this.no_address_found_flag = "N";
    }
    hidePaddress() {
        this.showCustomPAddr = "true";
        this.paddrShow = false;
        this.model.paddress = '';
        this.no_address_found_flag = "N";
    }

    showSave() {
        if (this.check == true) {
            this.router.navigate(["../panInfo"], { relativeTo: this.route });
        }
    }


    ngAfterViewInit() {
        var saveFlag = false;
        jQuery(".saveClose").click(function () {
            saveFlag = true;
        });
    }


    ngOnInit() {
        Common.activeProgressBarStep(5);
        this.getResidenceType();
        this.isLoading = false;
        this.showAddress = ""
        this.hold = true;
        jQuery('input:visible:first').focus();
        this.oaoService.GetPropertyDetails('INFO_MESSAGE', 'INF_001')
            .subscribe(
            data => {
                this.inf_001 = data.result[0].property_value;
            }
            );

        this.oaoService.GetPropertyDetails('WARN_MESSAGE', 'WRN_001')
            .subscribe(
            data => {
                this.wrn_001 = data.result[0].property_value;
            }
            );
        this.oaoService.GetPropertyDetails('commonCodes', 'STATE')
            .subscribe(
            data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.state_drop.push(data.result[i].property_desc)
                }
            }
            );
        this.oaoService.GetPropertyDetails('commonCodes', 'STREET_TYPE')
            .subscribe(
            data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.street.push(data.result[i].property_desc)
                }
            }
            );


        if (this.oaoService.getFbData() == true) {
            this.model = this.oaoService.getData();
        }
        if (this.model.address != null || this.model.paddress != null) {
            this.showAddress = ""
            this.hold = true;
        }
    }


    getResidenceType() {
        console.log("getResidenceType()")
        this.oaoService.getResidenceType()
            .subscribe(data => {
                this.ResidenceType = data.result;
                for (var i = 0; i < this.ResidenceType.length; i++) {
                    console.log(this.ResidenceType[i].residence_type);
                    this.residence.push(this.ResidenceType[i].residence_type);
                }
                console.log(this.residence);
            });

    }

    moveBack() {


        switch (this.model.product_code) {
            case 'BNA': this.oaoService.updatesection("section_1", this.model.application_id).subscribe(
                data => {
                    this.router.navigate(["../personalBasicInfo"], { relativeTo: this.route });
                });
                break;
            case 'SAL1':
                this.oaoService.updatesection("section_1", this.model.application_id).subscribe(
                    data => {
                        this.router.navigate(["../personalBasicInfo"], { relativeTo: this.route });
                    });
                break;
            case 'VL1':
                    Common.activeProgressBarStep(4);
                    Common.completedProgressBarStep(3);
                // this.oaoService.updatesection("section_1", this.model.application_id).subscribe(
                //     data => {
                        this.router.navigate(["../personalContactInfoVehicleLoan"], { relativeTo: this.route });
                    // });
                break;
            default: console.log('no product match found', this.model);
        }




    }

    createCrossSellApplicants() {
        console.log('Inside Cross applicants...', this.model);

        this.crossmodel.main_app_no = this.model.application_id;
        this.crossmodel.main_prod_type = this.model.product_type_code;
        this.crossmodel.main_prod = this.model.product_code;
        console.log('CS Main Prod', this.crossmodel.main_prod_type);
        console.log("main Prod type", this.model.product_type_code);

        this.oaoService.OAOCrossSellCreate(this.crossmodel)
            .subscribe(
            data => {

                console.log('cross sell res', data); console.log("main model", this.model.application_id);
            }

            );



    }


    laddaclose() {
        this.isLoading = false;
    }

}

import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PersonalDetailsObject } from "../../../interfaces/personalDetails.interface";
import { ConfigDetails } from "../../../interfaces/configinterface";
import { OAOService } from "../../../services/OAO.Service"
import { FirstNameValidator } from "../../../validators/namevalidator"
import { FormGroup, FormControl, Validators, NgForm } from "@angular/forms";
import { Common } from '../../../validators/commonFunc';
import { DatePipe } from '@angular/common';
import { Observable, Subscription } from 'rxjs/Rx';
declare var jQuery: any;
declare var Ladda: any;
@Component({
    selector: 'personaldetailsbasic',
    templateUrl: './personalDetailsBasic.component.html',
    providers: [DatePipe]
})
export class PersonalDetailsBasicComponent implements AfterViewInit, OnInit {
    toggle: boolean;
    verifyEmailOtp;
    newverifyEmailOtp;
    emailTicks = 60;
    mobileTicks = 60;
    private timer;
    resend: boolean = false;
    wrongDetails_v: boolean = false;
    private esub: Subscription;
    private msub: Subscription;
    public details: any;
    public items: number[] = [];
    public application_id: any;
    date_v = new Date();
    min_year: Number;
    max_year: Number;
    min_age: number;
    public inf_001: String
    configMsg: ConfigDetails
    test: boolean
    prod_code: string
    singleORjoint: string
    myForm: FormGroup;
    isLoading: boolean = false;
    private hold: boolean = false;
    private check: boolean = false;//to display modal
    checkDupStatus: boolean = false; //chandan
    userExistingFlag: boolean; //chandan
    public wrn_001: String;
    model = new PersonalDetailsObject('', '', '', '', '', '', '');
    maxDate: string;



    /**Initialization for md2 date component */
    isRequired = false;
    isDisabled = false;
    //isOpenOnFocus = false;
    isOpen = false;
    today: Date = new Date();
    type: string = 'date';
    types: Array<any> = [
        { text: 'Date', value: 'date' },
        { text: 'Time', value: 'time' },
        { text: 'Date Time', value: 'datetime' }];

    private mode: string = 'auto';
    private modes: Array<any> = [
        { text: 'Auto', value: 'auto' },
        { text: 'Portrait', value: 'portrait' },
        { text: 'Landscape', value: 'landscape' }];

    container: string = 'inline';
    containers: Array<any> = [
        { text: 'Inline', value: 'inline' },
        { text: 'Dialog', value: 'dialog' }];
    date: Date = null;
    minDate: Date = null;
    //maxDate: Date = new Date(this.today.getFullYear() - 18, this.today.getMonth(), this.today.getDate());
    private forwardProgressDataEVR = ['active', '', '', '', 'N', 'N'];
    private backwardProgressDataEVR = ['', '', '', '', 'N', 'Y'];
    private forwardProgressDataHML = ['active', '', '', 'N', 'N'];
    private backwardProgressDataHML = ['', '', '', 'N', 'Y'];
    private forwardProgressDataPRL = ['active', '', '', 'N', 'N'];
    private backwardProgressDataPRL = ['', '', '', 'N', 'Y'];
    private backwardProgressDataBNA = ['', '', '', '', 'N', 'Y'];
    private backwardProgressDataSAL1 = ['', '', '', '', '', 'N', 'Y'];

    constructor(private oaoService: OAOService, private router: Router, private route: ActivatedRoute, private datePipe: DatePipe) {
        jQuery('#content1').css('overflow', 'hidden');
        this.oaoService.setEmailVerificationFlag(true);
        console.log("PersonalDetailsBasic Component constructor()");
        this.model = this.oaoService.getPersonalDetailsObject();
        console.log(this.model);

        this.maxDate = this.datePipe.transform(this.today.getFullYear() - 18 + '-' + this.today.getMonth() + '-' + this.today.getDate(), 'yyyy-MM-dd');
        this.oaoService.GetPropertyDetails('commonCodes', 'SAL')
            .subscribe(
            data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.items.push(data.result[i].property_desc)
                }
            }
            );
       
       if (this.model.dob) {
            try
            {
                this.model.dob = this.datePipe.transform(this.model.dob, 'yyyy-MM-dd');
            }
            catch(e){
                console.log('datePipe.transform has failed');
                var parts =this.model.dob.split('/');
                this.model.dob =  parts[2] + '-' + parts[1] + '-'  + parts[0];
            }
        }
        this.model.sec_1_v = false;
        if (this.model.postcode == undefined) {
            this.model.postcode = "1234";
            this.model.ppostcode = "1234";
        }
        if (this.model.application_id) {
            this.hold = true;
        }
        if (this.model.mobile == "" || this.model.mobile == undefined || this.model.mobile == null) {
            this.model.mobile = "+91";
        }
        this.min_age = 0;
        this.test = false;
        this.date_v = new Date();
        this.oaoService.GetPropertyDetails('GENERIC_PROP', 'MIN_YEAR')
            .subscribe(
            data => {
                this.min_year = data.result[0].property_value;
            }
            );
        this.oaoService.GetPropertyDetails('GENERIC_PROP', 'DOB')
            .subscribe(data => {
                this.min_age = data.result[0].property_value;
                var mon = this.date_v.getMonth() + 1;
                var year = this.date_v.getFullYear() - this.min_age;
                this.max_year = year;
            });

        if (this.model.title === null || this.model.title === '') {
            this.model.title = '0';
        }

        this.oaoService.getConfig()
            .subscribe((data) => { this.configMsg = JSON.parse(JSON.stringify(data.data)); });
    }//constructor



    openDatepicker() {
        this.isOpen = true;
        setTimeout(() => {
            this.isOpen = false;
        }, 1000);
    }

    onResendOtpForEmail(email: string) {
        console.log("inside onResendOtpForEmail");
        if (email != null && email != '' && email != undefined) {
            this.oaoService.sendOtpToEmail(email).subscribe(
                data => {
                    //  console.log(data)
                    //  if(data.success==true)
                    //  this.model=data.result;
                    //  this.oaoService.setPersonalDetailsObject(this.model);
                    this.timer = Observable.timer(1000, 1000);
                    this.esub = this.timer.subscribe(t => this.emailTickerFunc(t)
                    );
                    // else{
                    // }
                });
        } else {
        }
    }

    onResendOtpForMobile(mobile: string) {
        console.log("inside onResendOtpForMobile");
        if (mobile != null && mobile != undefined) {
            this.oaoService.sendOtpToMobile(mobile).subscribe(
                data => {
                    //  console.log(data)
                    //  if(data.success==true)
                    //  this.model=data.result;
                    //  this.oaoService.setPersonalDetailsObject(this.model);
                    this.timer = Observable.timer(1000, 1000);
                    this.msub = this.timer.subscribe(t => this.mobileTickerFunc(t)
                    );
                    // else{
                    // }
                });
        } else {
        }
    }

    emailTickerFunc(etick) {
        this.emailTicks -= 1
        // console.log(this.emailTicks);
        if (this.emailTicks <= 0) {
            this.esub.unsubscribe();
            this.resend = true;
            this.emailTicks = 60;
        }

    }

    mobileTickerFunc(mtick) {
        this.mobileTicks -= 1
        // console.log(mtick);
        if (this.mobileTicks <= 0) {
            this.msub.unsubscribe();
            this.resend = true;
            this.mobileTicks = 60;
        }

    }

    onSaveContinue(mobile: number, email: string) {
        console.log("onSaveContinue");
        // console.log(email);
        this.isLoading = !this.isLoading;
        console.log(this.oaoService.getEmailVerificationFlag());
        if(this.model.application_id){
            this.onSubmit();
            return;
        }
        if (!this.oaoService.getEmailVerificationFlag()) {
            console.log("opened email otp model")
            this.oaoService.sendOtpToEmail(email).subscribe(
                (data) => {
                    this.timer = Observable.timer(1000, 1000);
                    this.esub = this.timer.subscribe(t => this.emailTickerFunc(t));
                    console.log("here");
                    jQuery('#emailOtp').modal('show');
                });
        } else {
            console.log("already verified the email otp");
            if (!this.oaoService.getMobileVerificationFlag()) {
                console.log("open mobile otp model")
                if (!this.oaoService.getMobileVerificationFlag()) {
                    console.log("after verified email otp successfully open the moble OTP model");
                    this.sendMobileOTP();
                }
            } else {
                console.log("already verified both the email & mobile  otp");
                this.onSubmit();
            }
        }
    }


    sendMobileOTP() {
        this.oaoService.sendOtpToMobile(this.model.mobile).subscribe(
            data => {
                console.log("message sent to mobile number:")
                console.log(data);
                // if (data.sent == true) {
                    this.timer = Observable.timer(1000, 1000);
                    this.msub = this.timer.subscribe(t => this.mobileTickerFunc(t));
                    jQuery('#mobileOtp').modal('show');
                // } else {
                //     console.log("Wrong mobile number .we are not able to send the otp to this mobile number.")
                // }
            });
    }

    onVerifyEmailOtp(email_otp: number) {
        console.log("onVerifyEmailOtp()");
        this.oaoService.checkOTP(email_otp, null).subscribe(
            data => {
                if (data.success == true) {
                    this.oaoService.setEmailVerificationFlag(true);
                    this.toggle = true;
                    this.mobileTickerFunc(this.mobileTicks);
                    jQuery('#emailOtp').modal('hide');
                    if (!this.oaoService.getMobileVerificationFlag()) {
                        console.log("after verified email otp successfully open the moble OTP model");
                        this.sendMobileOTP();
                    }
                    else {
                        this.onSubmit();
                    }
                }

                else {
                    this.toggle = false;
                    console.log("error - otp mismatch");
                    jQuery('#emailOtp').modal('show');
                }
            });

    }
    onVerifyMoibleOtp(mobile_otp: number) {
        console.log("onVerifyMoibleOtp()");
        this.oaoService.checkOTP(mobile_otp, null).subscribe(
            data => {
                 this.oaoService.setMobileVerificationFlag(true);
                    jQuery('#mobileOtp').modal('hide');
                    this.onSubmit(); 
                console.log(data)
                //  if (data.success) {
                //     this.oaoService.setMobileVerificationFlag(true);
                //     jQuery('#mobileOtp').modal('hide');
                //     this.onSubmit();   
                // }else{
                //     this.toggle = false;
                //     console.log(this.toggle);
                //     console.log("error - Mobile otp mismatch");
                //      jQuery('#mobileOtp').modal('show');
                //      console.log(this.toggle);
                // }
            });
    }

    private onSubmit() {
        console.log("inside onSubmit");
        var formatedDate = this.datePipe.transform(this.model.dob, 'MM/dd/yyyy');
        this.model.dob = formatedDate;
        console.log("onsubmit()")
        if (this.userExistingFlag) {
            console.log("existing user directly creating appliction")
            this.model.existing_cust_status = "Y";
            this.submitSection();
        }
        else {
            this.model.existing_cust_status = "N";
            console.log("New  user ")
            if (!this.oaoService.getCallMatchingCustomerFlag()) {

                // It has to be uncommented //vivek
                // console.log("checkMatchingCustomer() called");
                // this.oaoService.checkMatchingCustomer(this.model)
                // .subscribe(data =>
                //     {
                //         if(data.status){
                //             jQuery('#matching-customer-modal').modal('show');
                //          }
                //          else{
                //             this.oaoService.setCallMatchingCustomerFlag(true);
                //             this. submitSection();
                //         }
                //     });    


                this.submitSection();
            }
            else {
                console.log("checkMatchingCustomer() not called");
                this.submitSection();
            }
        }

        this.oaoService.setPersonalDetailsObject(this.model);
    }
    changeCallMatchingCustomerFlagMobile(e) {

        this.oaoService.setMobileVerificationFlag(false);
        this.oaoService.setCallMatchingCustomerFlag(false);

        if (e.target.value == undefined || e.target.value == null || e.target.value.length <= 3) {
            jQuery('#mobile').val("+91");
        }
        this.model.mobile = e.target.value;
    }
    changeCallMatchingCustomerFlag() {
        console.log("email key up")
        this.oaoService.setEmailVerificationFlag(false);
        this.oaoService.setCallMatchingCustomerFlag(false);
    }

    submitSection() {
        console.log("inside submit section()");
        this.isLoading = !this.isLoading;
        //this.model.app_id = this.model.application_id;
        this.oaoService.setPersonalDetailsObject(this.model);
        console.log(this.model.product_code)
        switch (this.model.product_code) {
            case 'BNA': this.oaoService.OAOCreateOrUpdateApplicant(this.model)
                .subscribe(
                data => {
                    console.log("Application saved OR not")

                    if(!this.model.application_id && this.model.uploadLocation && this.model.uploadLocation.aadhaar){
                        this.oaoService.cmisFileUpload(data.Result.application_id,"AADHAAR", this.model.uploadLocation.aadhaar).
                        subscribe(response => {
                            console.log(response);
                        })
                    }
                    this.model.application_id = data.Result.application_id;
                    this.model.app_id = null;
                    this.oaoService.setPersonalDetailsObject(this.model);
                    this.check = true;

                    if (this.hold == false) {
                        console.log("hold==false")
                        this.showSave();
                    }
                    if (this.hold == true) {
                        console.log("hold==true");
                        console.log("Routing to personalContactInfo component");
                        this.oaoService.setProgressBardata(this.forwardProgressDataEVR);
                        this.router.navigate(['../personalContactInfo'], { relativeTo: this.route });
                    }
                });
                break;
            case 'SAL1': this.oaoService.OAOCreateOrUpdateSalaryApplicant(this.model)
                .subscribe(
                data => {
                    this.model.application_id = data.Result.application_id;
                    this.oaoService.setPersonalDetailsObject(this.model);
                    // this.oaoService.setData(data.Result);
                    this.check = true

                    if (this.hold == false) {
                        this.showSave();
                    }
                    if (this.hold == true) {
                        this.router.navigate(['../personalContactInfo'], { relativeTo: this.route });
                    }
                });
                break;
            case 'PRL': this.oaoService.OAOCreateOrUpdatePersonalloanApplicant(this.model)
                .subscribe(
                data => {
                    this.model.application_id = data.Result.application_id;
                    this.oaoService.setPersonalDetailsObject(this.model);
                    this.check = true

                    if (this.hold == false) {
                        this.showSave();
                    }
                    if (this.hold == true) {
                        //this.router.navigate(['../personalContactInfo']);
                    }
                });
                break;
            default: console.log("Page not found");

        }
        //this.application_id=this.model.application_id;
        //localStorage.setItem('application_id',this.application_id); //for fb
    }//submitSection1


    showSave() {
        if (this.check == true) {
            jQuery('#success').modal('show');
        }
    }

    laddaclose() {
        this.isLoading = false;
    }


    ngOnInit() {
        //for fb data
        if (this.oaoService.getResumeFlag()) {
            this.oaoService.setProgressBardata(this.oaoService.getPro_bar());
            this.oaoService.setResumeFlag(false);
        }

        console.log("Max date is ", this.maxDate);
        if (this.oaoService.getFbData() == true) {
            console.log("fb")
            this.model = this.oaoService.getData();
            if (this.model.title == null || this.model.title == '') {
                this.model.title = '0';
            }
        }
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


        //chandan
        console.log("PersonaldetailsBasicComponent ngOnInit()")
        this.userExistingFlag = this.oaoService.getUserExistingFlag();
        if (this.userExistingFlag) //pre-populating userDetails
        {
            console.log("Existing User ");
            jQuery('#title').attr("style", "pointer-events: none;");
            this.isDisabled = true;
            jQuery('#fname,#mname,#lname,#email,#mobile').attr('readonly', 'true');
        }
        else {
            console.log("New User")
        }
        //chandan

        this.test = true;


    }


    moveBack() {
        console.log("clear");
        switch (this.model.product_code) {
            case "BNA":
                this.oaoService.setProgressBardata(this.backwardProgressDataBNA);
                if (this.model.is_aadhaar) {
                    this.router.navigate(['../aadharInfo'], { relativeTo: this.route });
                }
                else {
                    this.router.navigate(['../aadharCheck'], { relativeTo: this.route });
                }
                break;
            case "SAL1":
                this.oaoService.setProgressBardata(this.backwardProgressDataSAL1);
                this.router.navigate(['../employer'], { relativeTo: this.route });
                break;
            default: console.log("wrong routing")
                break;
        }



        //this.oaoService.setUserExistingFlag(false);
        // window.location.reload();
    }
    dob_valid: number;
    dob_err: string;
    dispDate(dob: any) {
        console.log("date of birth is", dob);
        this.model.dob = dob;
        // this.dob_valid=dob-this.min_age;
        // console.log(this.dob_valid)
        // if(this.dob_valid>=18){
        //     this.model.dob=dob;
        // }
    }
    ngAfterViewInit() {

        // jQuery('input:visible:first').focus();
        // jQuery('select:first').focus();
        var options = {
            format: "dd/mm/yyyy",
        }
        if (jQuery('.datepicker') && jQuery('.datepicker').length) {
            jQuery('.datepicker').dateDropper(options);
        }
        jQuery('body').on('change', '#dob', function () {
            jQuery('#dob').trigger('click');
        });

        //  jQuery("#fname").val(this.model.fname);

    }

    setForwardProgressData() {
        if (this.model.product_code == 'EVR')
            this.oaoService.setProgressBardata(this.forwardProgressDataEVR);
        if (this.model.product_code == 'HML')
            this.oaoService.setProgressBardata(this.forwardProgressDataHML);
        if (this.model.product_code == 'PRL')
            this.oaoService.setProgressBardata(this.forwardProgressDataPRL);
    }

}

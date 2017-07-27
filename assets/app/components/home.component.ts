import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OAOService } from "../services/OAO.Service";
import { ConfigDetails } from "../interfaces/configinterface";
import { PersonalDetailsObject } from "../interfaces/personalDetails.interface";
import { checkbox } from '../interfaces/checkboxinterface';
import { UserDetailsObject } from "../interfaces/userDetails.interface"; //chandan
import { FacebookService, LoginResponse, LoginOptions, UIResponse, UIParams } from 'ng2-facebook-sdk';
import { DatePipe } from '@angular/common';
import { Observable, Subscription } from 'rxjs/Rx';
import { GoogleAnalyticsEventsService } from "../services/GoogleAnalyticsEvents.Service";
import { TranslateService } from '@ngx-translate/core';

declare var google: any;
declare var googleLoaded: any;

declare var jQuery: any;
declare var moment: any;
@Component({
    selector: 'home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements AfterViewInit {

    jointAppn: boolean = false
    productCodeNamePair: Map<String, String> = new Map<String, String>();
    ticks = 60;
    private timer;
    configMsg: ConfigDetails
    resend: boolean = false
    date_v: string;
    wrongDetails_v: boolean = false;
    myForm: boolean = false;
    // Subscription object
    private sub: Subscription;
    public modal = new checkbox(false, false);
    public prod: string;
    public dis_v: boolean = false;
    public img: string;
    public FbData: boolean = false;
    public userExistingFlag: boolean; //chandan
    public fName: any; //chandan
    public age: any;//chandan
    progress_bar: any[];
    private userDetailsObject = new UserDetailsObject('', '');  //chandan
    private model = new PersonalDetailsObject('', '', '', '', '', '', ''); //chandan
    public modelArray: any;



    /**Initialization for md2 date component */
    isRequired = false;
    isDisabled = false;
    isOpenOnFocus = false;
    isOpen = false;
    today: Date = new Date();
    type: string = 'date';
    isLoading: boolean = false;
    types: Array<any> = [
        { text: 'Date', value: 'date' },
        { text: 'Time', value: 'time' },
        { text: 'Date Time', value: 'datetime' }];

    mode: string = 'auto';
    modes: Array<any> = [
        { text: 'Auto', value: 'auto' },
        { text: 'Portrait', value: 'portrait' },
        { text: 'Landscape', value: 'landscape' }];

    container: string = 'inline';
    containers: Array<any> = [
        { text: 'Inline', value: 'inline' },
        { text: 'Dialog', value: 'dialog' }];

    date: Date = null;
    minDate: Date = null;
    maxDate: Date = null;


    openDatepicker() {
        this.isOpen = true;
        setTimeout(() => {
            this.isOpen = false;
        }, 1000);
    }
    /**end of md2 component */
    constructor(private oaoService: OAOService, private router: Router, private fb: FacebookService,
        private datePipe: DatePipe, public route: ActivatedRoute, private gaEventsService: GoogleAnalyticsEventsService, private translate: TranslateService) {
        console.log("HomeComponent constructor()");
        this.model = this.oaoService.getPersonalDetailsObject();

        this.oaoService.getConfig()
            .subscribe((data) => {
            this.configMsg = JSON.parse(JSON.stringify(data.data));
                console.log("configMsg:"+this.configMsg)
            });
        //window.location.replace(window.location.origin);
       
        fb.init({
            appId: '658955644261049',
            version: 'v2.8'
        });
    }//constructor

    //facebook login
    private handleError(error) {
       // console.error('Error processing action', error);
    }
    resolved(captchaResponse: string) {
        this.myForm = true;
        console.log(`Resolved captcha with response ${captchaResponse}:`);
    }
    private login() {
        //console.log('Initializing Facebook');
        this.fb.login()
            .then((res: LoginResponse) => {
                //console.log('Logged in', res);
                //to get profile data
                this.fb.api('/me', 'get', { fields: ['first_name', 'last_name', 'birthday', 'id', 'email', 'location'] })
                    .then((res: any) => {
                       // console.log('Got the users profile', res);
                        this.oaoService.setFbData(true);
                        this.processFBdata(res);
                    })
                    .catch(this.handleError);
            })
            .catch(this.handleError);
    }

    private processFBdata(data) {
        if (data.first_name == null) { } else { this.model.fname = data.first_name; }
        if (data.last_name == null) { } else { this.model.lname = data.last_name; }
        if (data.email == null) { } else { this.model.email = data.email; }
        if (data.birthday == null) { } else { this.model.dob = data.birthday; }
        if (data.location == null) { } else { this.model.address = data.location; }
        this.oaoService.setData(this.model);
        this.FbData = this.oaoService.getFbData();
        this.modal.aus_citizen = true;
        this.modal.age_test = true;
        jQuery('#savingsaccount-modal').modal('show');

    }


    //resume Applictions
		onSearch(mobile: string) {
        console.log(mobile);
        // HomeComponent.id_app = mobile;
        var formatedDate = this.datePipe.transform(this.date_v, 'MM/dd/yyyy');
        console.log('Formated date id Check', formatedDate);
        this.date_v = formatedDate;
        if (mobile != null && mobile != '' && mobile != undefined && this.date_v != null && this.date_v != '' && this.date_v != undefined) {
            this.oaoService.sendOTP(mobile, formatedDate).subscribe(
                data => {
                    console.log("send otp service");
                    console.log(data)
                    if (data.success == true && data.savedApp == false) {
                        this.resend = false;
                        this.modelArray = data.result;
                        console.log(this.modelArray);
                        console.log("==");
                        for (var i = 0; i < this.modelArray.length; i++) {
                            this.modelArray[i].product_name = this.productCodeNamePair.get(this.modelArray[i].product_code);
                        }
                        console.log(this.modelArray);
                        console.log("==");
                        this.oaoService.setPersonalDetailsObject(this.model);
                        this.timer = Observable.timer(1000, 1000);
                        this.sub = this.timer.subscribe(t => this.tickerFunc(t));
                    } else if (data.savedApp == true) {
                        //this.savedApp_v = true;
                    } else {
                        this.wrongDetails_v = true;
                    }
                });
        } else {
            this.wrongDetails_v = true;
        }
    }



    tickerFunc(tick) {
        this.ticks -= 1
        if (this.ticks <= 0) {
            this.sub.unsubscribe();
            this.resend = true
            this.ticks = 60;
        }
    }



    proceed(i) {
        // jQuery('#resume-modal2').modal('hide');
        console.log(i);
        console.log(this.modelArray[i]);
        this.model = this.modelArray[i];
        console.log("model", this.model)
        this.oaoService.setPersonalDetailsObject(this.model);
        console.log(this.model.application_status)
        if (this.model.application_status == 'SAV' || this.model.application_status == 'INC') {
            //this.getRouteLink(true);
               this.isLoading = true;
               var sec_v = "";
                    var prod_t = this.model.product_type_code;
                    for (var j = 1; j <= this.model.no_of_section; j++) {
                        var sec = "section_" + j;
                        var prod_code = "section_" + prod_t;
                        if (this.model[prod_code][0][sec] == false) {
                            sec_v = sec;
                            break;
                        }
                    }
                    if (sec_v != "") {
                        var link = this.configMsg[this.model.product_code][this.translate.currentLang][sec_v].route_v;
                        this.oaoService.setProgressBardata(this.configMsg[this.model.product_code][this.translate.currentLang][sec_v].data);
                        this.oaoService.getConfigByKey(this.model.product_code, this.translate.currentLang)
                            .subscribe((response) => {
                                this.model.progressBarConfig = JSON.parse(JSON.stringify(response.data));

                                this.model.sectionCount = Object.keys(this.model.progressBarConfig).length;

                                this.oaoService.setPersonalDetailsObject(this.model);
                                this.oaoService.setResumeStatus(true);
                                let routeTo = "/completeInformation/" + link;
                                //console.log(routeTo);
                                this.oaoService.fetchDigilockerConfig().subscribe(config => {
                                    this.oaoService.setDigilockerConfig(config);


                                    Observable.forkJoin(
                                        this.oaoService.GetProductDetail(this.model.product_code),
                                        this.oaoService.downloadAttachments(this.model.application_id)).
                                        subscribe(data=>{
                                            console.log("fork join response", data);
                                            this.model.product_name = data[0].result[0].product_name;
                                            this.model.product_type_code = data[0].result[0].child_of;
                                            this.model.linked_crossselling_product = data[0].result[0].linked_crossselling_product;
                                            this.oaoService.setPersonalDetailsObject(this.model);
                                            //console.log("routing started", routeTo);
                                            this.isLoading = false;
                                            if(!data[1].error){
                                                jQuery('#resume-modal').modal('hide');
                                                this.router.navigate([routeTo]);
                                            }
                                            else{
                                                console.log('Error while downloading attachments',data[1]);
                                            }

                                    })
                                    this.oaoService.GetProductDetail(this.model.product_code).subscribe(
                                        data => {

                                            this.model.product_name = data.result[0].product_name;
                                            this.model.product_type_code = data.result[0].child_of;
                                            this.model.linked_crossselling_product = data.result[0].linked_crossselling_product;
                                            this.oaoService.setPersonalDetailsObject(this.model);
                                            //console.log("routing started", routeTo);
                                            this.isLoading = false;
                                            jQuery('#resume-modal').modal('hide');
                                            this.router.navigate([routeTo]);
                                        }
                                    )


                                })

                            });

                    }



        }
    }

    resetResumeApplication() {
        this.sub.unsubscribe();
        this.ticks = 60;
        this.resend = false;
        this.date_v = null;
    }



    onVerify(verify: number) {
        console.log(verify);
        this.oaoService.checkOTP(verify, this.modelArray[0].application_id).subscribe(
            data => {
                console.log(data)
                // this.getRouteLink(data.success);
                console.log("length");
                console.log(this.modelArray.length);
                if (this.modelArray.length > 1) {
                    jQuery('#resume-modal2').modal('show');
                } else {
                    this.proceed(0);
                }

            });
    }

    public getRouteLink(data) {
       // this.setProduct_Name(this.model.product_code);
        console.log(data)
        if (data == true) {
            var sec_v = "";
            var prod_t = this.model.product_type_code;
            console.log(prod_t)
            for (var i = 1; i <= this.model.no_of_section; i++) {
                console.log(this.model);
                var sec = "section_" + i;
                var prod_code = "section_" + prod_t;
                console.log(prod_code)
                console.log("value: " + this.model[prod_code][0][sec]);
                if (this.model[prod_code][0][sec] == false) {
                    console.log(sec);
                    sec_v = sec;
                    console.log(sec_v)
                    break;
                }
            }
            console.log("model", this.model)
            console.log("product name", this.model.product_name);
            console.log("product code", this.model.product_code);

            if (sec_v != "") {
                var link = this.configMsg[prod_t][sec_v].route_v;
                console.log("linking >>>>>" + link);

            }
        }
    }
    setProduct_Name(prod_code: string) {

        this.oaoService.GetProductDetail(prod_code).subscribe(
            data => {
                if (data.result[0].product_code == prod_code) {
                    this.model.product_name = data.result[0].product_name;
                    this.model.product_type_code = data.result[0].child_of;

                    this.model.product_code = prod_code;
                    console.log("productname", this.model.product_name)
                    this.oaoService.setPersonalDetailsObject(this.model);


                }
            }
        )
    }

    // resume Applictions

   
    private ngOnInit() //to active model and hide the buttons  while coming from login page
    {
        console.log("HomeComponent ngOnInit()");
        console.log("Checking the user type:");
        this.userExistingFlag = this.oaoService.getUserExistingFlag();
        if (this.userExistingFlag) {
            console.log("Existing user");
            this.GetUserDetails(); //get the all details of user by sending user name
        }
        else {
            //window.location.reload();
            console.log("New user");
        }
    }

    ngAfterViewInit() {
        this.route.params.subscribe(params => {
            let chat_bot_ = params['chat_bot'];
            let app_id = params['appid'];
            //console.log(app_id);
           // console.log(chat_bot_);
            if (app_id != null && app_id != '' && app_id != undefined && chat_bot_ != null && chat_bot_ != undefined && chat_bot_ != '') {
                console.log(app_id);
                 this.oaoService.chatBotUserDetails(app_id).subscribe(
                data => {
                    this.model=data.result[0];
                    var sec_v = "";
                    var prod_t = this.model.product_type_code;
                    console.log(prod_t)
                    for (var i = 1; i <= this.model.no_of_section; i++) {
                        console.log(this.model);
                        var sec = "section_" + i;
                        var prod_code = "section_" + prod_t;
                        console.log(prod_code)
                        if (this.model[prod_code][0][sec] == false) {
                            console.log(sec);
                            sec_v = sec;
                            console.log(sec_v)
                            break;
                        }
                    }
                    if (sec_v != "") {
                        var link = this.configMsg[this.model.product_code][this.translate.currentLang][sec_v].route_v;
                        this.oaoService.setProgressBardata(this.configMsg[this.model.product_code][this.translate.currentLang][sec_v].data);


                        this.oaoService.getConfigByKey(this.model.product_code, this.translate.currentLang)
                            .subscribe((response) => {
                                console.log("Response for config ", response);
                                this.model.progressBarConfig = JSON.parse(JSON.stringify(response.data));

                                this.model.sectionCount = Object.keys(this.model.progressBarConfig).length;

                                this.oaoService.setPersonalDetailsObject(this.model);
                                this.oaoService.setResumeStatus(true);

                                console.log("1");
                                let routeTo = "/completeInformation/" + link;
                                console.log(routeTo);
                                this.oaoService.fetchDigilockerConfig().subscribe(config => {
                                    this.oaoService.setDigilockerConfig(config);

                                    this.oaoService.GetProductDetail(this.model.product_code).subscribe(
                                        data => {
                                            console.log(data);
                                            this.model.product_name = data.result[0].product_name;
                                            this.model.product_type_code = data.result[0].child_of;
                                            this.model.linked_crossselling_product = data.result[0].linked_crossselling_product;
                                            this.oaoService.setPersonalDetailsObject(this.model);
                                            console.log("routing started", routeTo);
                                            this.router.navigate([routeTo]);
                                        }
                                    )


                                })

                            });

                    }
                    this.oaoService.setPersonalDetailsObject(this.model);

                });

            }
            else if (app_id != null && app_id != '' && app_id != undefined) {

                jQuery('#resume-modal').modal('show');
                jQuery('#appRef').val(app_id);


            }


        }
        );
    }

    moveForward(){
        if(this.model.product_code=="VL1"){

        }else{

        }
    }

    private loginFlag() {
        this.oaoService.setLoginFlag(true);
    }

    private GetUserDetails() {
        console.log("GetUserDetails()");
        this.oaoService.GetLoginUserDetails(this.oaoService.getUserDetailsObject()).subscribe(
            data => {
                var name = data.result.fName;
                name = name.toLowerCase().replace(/\b[a-z]/g, function (letter) {
                    return letter.toUpperCase();
                });
                this.fName = name;
                if (parseInt(data.result.age) < 18) {
                    jQuery('#not_eligible-modal').modal('show');
                }
                else {
                    this.model.title = data.result.title;
                    this.model.fname = name;
                    this.model.mname = data.result.mName;
                    this.model.lname = data.result.lName;
                    this.model.dob = data.result.dob;
                    this.model.mobile = data.result.mobile;
                    this.model.email = data.result.email;
                    this.model.address = data.result.homeAddress;
                    this.model.paddress = data.result.postalAddress;
                    this.model.tfn = data.result.TFN;
                    this.model.exemption = data.result.exemptionReason;
                    this.model.core_customer_id = data.result.userId;
                    this.oaoService.setPersonalDetailsObject(this.model);
                    this.router.navigate(['/completeInformation']);
                }
            });
    }
    //once user selected the product type(type of account)
    private setModalType(prod_code: string) {
        console.log("setModalType():" + prod_code);
        this.model.product_code = prod_code;
        this.img = prod_code;

        this.oaoService.GetProductDetail(prod_code).subscribe(
            data => {
                if (data.result[0].product_code == prod_code) {
                    this.model.product_name = data.result[0].product_name;
                    this.model.product_type_code = data.result[0].child_of;
                    this.model.linked_crossselling_product = data.result[0].linked_crossselling_product;
                    this.model.max_allowed_percent=data.result[0].max_allowed_percent;
                    this.model.max_permissible_amount=data.result[0].max_permissible_amount;
                    //this.img = this.model.product_type_code;

                    this.model.product_code = prod_code;
                    this.gaEventsService.emitEvent('OAO_Products', this.model.product_name, prod_code, 100);
                    this.oaoService.setPersonalDetailsObject(this.model);
                    jQuery('#savingsaccount-modal').modal('show');
                }
            }
        )
    }

    private setFalse() {
        this.modal.age_test = false;
        this.modal.aus_citizen = false;
        this.dis_v = true;
        this.logout(); //chandan
    }

    private logout() {
        if (this.userExistingFlag) {
            this.oaoService.setUserExistingFlag(false);
            this.userExistingFlag = false;
            this.oaoService.logout().subscribe(
                data => { console.log(data); });
            console.log("loged out");
        }

    }

}

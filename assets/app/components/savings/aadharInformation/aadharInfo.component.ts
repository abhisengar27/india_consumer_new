import { Component, OnInit, AfterViewInit, ElementRef, AfterViewChecked, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { Http, HttpModule, RequestOptions, Response, Headers } from '@angular/http';
import { FormGroup, FormBuilder, AbstractControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PersonalDetailsObject } from "../../../interfaces/personalDetails.interface";
import { UploadLocation } from "../../../interfaces/uploadLocation.interface";
import { UserDetailsObject } from "../../../interfaces/userDetails.interface";
import { OAOService } from "../../../services/OAO.Service";
import { Observable, Subscription } from 'rxjs/Rx';
import { TranslateService } from '@ngx-translate/core';

declare var jQuery: any;
declare var Ladda: any;
@Component({
  selector: 'aadhar-info',
  templateUrl: './aadharInfo.component.html'
})
export class AadharInfo implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {

  toggleCheckbox: boolean = false;
  file: any;
  fileName: any;
  data: any;
  filec: any;
  fileNamec: any;
  verifyOtp: string;
  ticks = 60;
  private timer;
  resend: boolean = false
  isLoading: boolean = false;
  private sub: Subscription;
  otpFlag: boolean = false;
  uploadmsg: boolean = false;
  generateOTP: string = 'Generate OTP';
  translateFlag: boolean = true;

  private backwardProgressDataBNA = ['', '', '', '', 'N', 'Y'];
  private model: PersonalDetailsObject = new PersonalDetailsObject('', '', '', '', '', '', '');
  private UploadLocation = new UploadLocation('');
  private aadhaarName;
  private uploadAadhaarMsg = '';
  private digilockerConfig;
  private uploadingFileName = "File_" + Date.now() + (Math.floor((Math.random() * 100))) + '.jpg';
  private uploadedFileName: string;
  private baseUrl: String = '';
  private isManualUpload: boolean = true;
  private isDigilockerFetching: boolean = false;
  private langSubscription;
  private doc_erroe: boolean = false;
  private aadhar_togle_msg: boolean = false;
  private isRouteChange: boolean = false;
  private isDigiRemove: boolean = false;
  private application_id: string;
  private config: any;
  private docType: string = "AADHAAR";
  private appId: String;
  private cmisUpload: boolean = true;
  private generatingOTP: boolean = false;







  constructor(private oaoService: OAOService, private http: Http, private router: Router, private route: ActivatedRoute, private translate: TranslateService, private elementRef: ElementRef, private chRef: ChangeDetectorRef) {
    this.model = this.oaoService.getPersonalDetailsObject();



    this.appId = this.model.app_id || this.model.application_id;

    //translate.use(this.oaoService.getLang());
    console.log("Current lang", translate.currentLang);

    this.digilockerConfig = this.oaoService.getDigiLockerConfig();

    this.oaoService.getAttachmentsByDocType(this.docType).subscribe(res => {
      if (!res.error && res.data.length > 0) {
        this.uploadedFileName = res.data[0];
        this.isManualUpload = false;
      }
    })

    translate.get('AADHAAR_INFO.GENERATE_OTP').subscribe((res) => {
      this.generateOTP = res;
    });
    translate.get('AADHAAR_INFO.UPLOAD_AADHAAR_MSG').subscribe(res => {
      this.uploadAadhaarMsg = res;
    })

    this.baseUrl = this.oaoService.getBaseUrl();
    this.model.uploadLocation = {};
    this.model.uploadLocation.aadhaar = this.uploadedFileName;
    if (!this.model.application_id) {
      this.cmisUpload = false;
    }
    this.config = {
      thumbnailHeight: 70,
      url: `/getdetails/aadhaar/${this.cmisUpload}`,
      headers: { "application_id": this.appId, "doc_type": this.docType },


      renameFilename: () => this.uploadingFileName,
      previewTemplate: `<div class="dz-preview dz-file-preview" style="padding:0px !important">
                          <a  href="javascript:void(0);" title="Change uploaded file" style="z-index:50;position:absolute;right:0%;background-color:white;" data-dz-remove ><span class="glyphicon glyphicon-edit"></span></a>
                        <div class="dz-image"><img data-dz-thumbnail /></div>
                        <div class="dz-details">
                          <div class="dz-size"><span data-dz-size></span></div>
                          <div class="dz-filename"><span data-dz-name></span></div>
                        </div>
                        <div class="dz-progress"><img style="margin-left:25%;height:60%;position:relative;width:40%;margin-top:10%" src="/assets/images/Details_fetching_aadhaar.gif"></div>
                        <div class="dz-error-message"><span data-dz-errormessage></span></div>
                        <div class="dz-success-mark">
                          <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
                            <title>Check</title>
                            <defs></defs>
                            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
                              <path d="M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z" id="Oval-2" stroke-opacity="0.198794158" stroke="#747474" fill-opacity="0.816519475" fill="#FFFFFF" sketch:type="MSShapeGroup"></path>
                            </g>
                          </svg>
                        </div>
                        <div class="dz-error-mark">
                          <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
                            <title>Error</title>
                            <defs></defs>
                            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
                              <g id="Check-+-Oval-2" sketch:type="MSLayerGroup" stroke="#747474" stroke-opacity="0.198794158" fill="#FFFFFF" fill-opacity="0.816519475">
                                <path d="M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z" id="Oval-2" sketch:type="MSShapeGroup"></path>
                              </g>
                            </g>
                          </svg>
                        </div>

                      </div>`
    }



  }
  aadhaar_msg() {
    console.log("inside aadhar msg")
    this.aadhar_togle_msg = false;
    this.model.isAadhaarValidated = false;
  }

  ngOnInit() {


    this.langSubscription = this.oaoService.changelangEvent.subscribe(lang => {

      this.translate.get('AADHAAR_INFO.GENERATE_OTP').subscribe((res) => {
        this.generateOTP = res;
      });

      this.translate.get('AADHAAR_INFO.UPLOAD_AADHAAR_MSG').subscribe(res => {
        this.uploadAadhaarMsg = res;
      })

    });



  }

  digilockerListener = function (event) {

    if (event.origin != 'https://devservices.digitallocker.gov.in') {
      return;
    }


    console.log('aadhaar info', event);
    this.isDigilockerFetching = true;
    this.isManualUpload = false;
    jQuery("#uploaingMsg").removeAttr('hidden');
    var data = JSON.parse(event.data);
    let fileExt = data.filename.split('.')[1];
    data.filename = "File_" + Date.now() + (Math.floor((Math.random() * 100))) + '.' + fileExt;
    this.uploadingFileName = data.filename;
    data.type = this.docType;
    data['application_id'] = this.model.application_id || this.model.app_id;
    this.oaoService.fetchDigilockerDocument(data).subscribe(res => {
      if (this.isDigiRemove) {
        this.isDigiRemove = false;
        return;
      }

      console.log("inside digi", res);
      console.log(res.error);
      if (res.error) {
        console.log(res.error);
        this.uploadmsg = false;
        this.doc_erroe = true;
        this.isDigilockerFetching = false;
        console.log(this.model.aadhar);
        console.log(this.doc_erroe);
        this.uploadedFileName = res.filename;
        this.aadhaarName = undefined;
        jQuery('#uploaingMsg').attr('hidden', 'true');
        this.chRef.detectChanges();
        return;
      }

      if (res.isImage) {
        console.log("Aadhaar details ", res);
        this.isLoading = false;
        this.model.fname = res.fname;
        this.model.mname = res.mname;
        this.model.lname = res.lname;
        this.model.retrieved_aadhaar_number = res.aadhar;
        this.model.aadhar = res.aadhar;
        this.model.address = res.address;
        this.model.uploadLocation.aadhaar = res.filename;
        this.aadhaarName = res.filename;
        console.log("==", this.model.retrieved_aadhaar_number);
        this.oaoService.setPersonalDetailsObject(this.model);

        jQuery(".dz-progress").css('display', 'none');
        jQuery(".alert").css('display', 'none');
        jQuery("#aadhaarInput").val(this.model.aadhar);
        jQuery('#giveAadhaar').attr('hidden', 'true');
        jQuery('#changedText').removeAttr('hidden');
        jQuery('#showCheckbox').removeAttr('hidden');
        jQuery("#generateAadhaarOtp").removeAttr('hidden');
        jQuery('#uploaingMsg').attr('hidden', 'true');
        jQuery('#doc_erroe').attr('hidden', 'true');
        this.uploadmsg = false;
        this.isDigilockerFetching = false;

        this.uploadedFileName = res.filename;
        this.isManualUpload = res.isManualUpload;
      }
      else {
        console.log(res);
      }


    }
    )

  }.bind(this);

  removeFile(event) {
    jQuery('#aadhaarInput').removeClass('loadinggif');
    if (this.isRouteChange) {
      return;
    }
    console.log("removing file", event);
    this.doc_erroe = false;
    this.chRef.detectChanges();
    //let filename = event.previewElement.children[2].children[1].children[0].innerText;
    jQuery("div.share_fm_dl_sm span").remove();
    this.oaoService.removeUploadedFile(this.uploadedFileName, this.docType).subscribe(res => {
      console.log("file remove res", res);
      this.uploadedFileName = '';

    });

    if (!this.isManualUpload) {
      this.isManualUpload = true;
    }
    this.uploadingFileName = "File_" + Date.now() + (Math.floor((Math.random() * 100))) + '.jpg';
  }

  onUploadError(fileInput: any) {
    console.log('onUploadError:', fileInput);
  }

  onUploadSuccess(fileInput: any) {
    console.log(fileInput);
    this.file = fileInput.target.files[0];
    console.log(this.file);
    this.fileName = this.file.name;
    console.log(this.fileName);
  }
  onSearch() {
    // this.otpFlag = true;
    // this.toggleCheckbox = true;
    // this.uploadmsg = false;
    this.generatingOTP = true;
    this.oaoService.generateAadhaarOTP(this.model.aadhar).
      subscribe(res => {
        if (!res.error) {
          this.generatingOTP = false;
          console.log("Response from backend", res);
          this.timer = Observable.timer(1000, 1000);
          this.sub = this.timer.subscribe(t => this.tickerFunc(t));

          this.otpFlag = true;
          this.toggleCheckbox = true;
          this.uploadmsg = false;


        }
        else {
          this.generatingOTP = false;
          window.alert(res.error);
        }


      });

  };

  tickerFunc(tick) {
    this.ticks -= 1
    if (this.ticks <= 0) {

      if (this.translateFlag) {
        this.translate.get('AADHAAR_INFO.RESEND_OTP').subscribe((res) => {
          this.generateOTP = res;
          this.translateFlag = false;
        });
      }

      console.log("gen otp" + this.generateOTP)
      this.sub.unsubscribe();
      this.resend = true
      this.ticks = 60;
    }
  }

  losSubmit() {
    console.log("inside losSubmit");
    this.isLoading = true;
    // this.isRouteChange = true;
    this.UploadLocation.aadhaar = this.aadhaarName;
    this.model.uploadLocation = this.UploadLocation;
    console.log(this.model.uploadLocation);
    if (this.model.aadhar == this.model.retrieved_aadhaar_number) {
      console.log("inside if, before null" + this.model.retrieved_aadhaar_number);
      this.model.retrieved_aadhaar_number = null;
      console.log("inside if, after null" + this.model.retrieved_aadhaar_number);
    }
    if (!this.model.isAadhaarValidated) {
      this.oaoService.sendAadhaarEkycRequest(this.model.aadhar, this.verifyOtp).
        subscribe((response) => {
          if (!response.error) {

            this.isLoading = false;
            this.isRouteChange = true;
            let data = response.data;
            this.model.postcode = data.addressInfo.pc;
            this.model.housenum = data.addressInfo.house;
            this.model.streetname = data.addressInfo.street;
            this.model.state = data.addressInfo.state;
            this.model.address = data.addressInfo.address;
            this.model.fname = data.identityInfo.fname;
            this.model.mname = data.identityInfo.mname;
            this.model.lname = data.identityInfo.lname;
            this.model.dob = data.identityInfo.dob;
            this.model.gender = data.identityInfo.gender;
            this.model.isAadhaarValidated = true;
            this.oaoService.setPersonalDetailsObject(this.model);
            if (this.model.product_type_code == "LAA") {
              this.router.navigate(['../personalBasicInfoVehicleLoan'], { relativeTo: this.route });
            } else {
              this.router.navigate(['../personalBasicInfo'], { relativeTo: this.route });
            }
          }
          else {
            this.isLoading = false;
            window.alert(response.error);
          }
        })
    }
    else {
      this.isLoading = false;
      this.isRouteChange = true;
      this.oaoService.setPersonalDetailsObject(this.model);
       if (this.model.product_type_code == "LAA") {
              this.router.navigate(['../personalBasicInfoVehicleLoan'], { relativeTo: this.route });
            } else {
              this.router.navigate(['../personalBasicInfo'], { relativeTo: this.route });
            }
    }


  }

  aadhaarDetails(data) {
    console.log("Aadhaar details ", data);
    var res = data[1];
    this.isLoading = false;

    console.log("Response data", res);
    console.log("errrooorrr" + res.error)
    if (!res.error) {
      jQuery('#aadhaarInput').removeClass('loadinggif');
      this.aadhar_togle_msg = true;
      console.log("inside if loop")
      this.model.fname = res.fname;
      this.model.mname = res.mname;
      this.model.lname = res.lname;
      // var date = res.dob

      // this.model.dob = (new Date(date[1] + '/' + date[0] + '/' + date[2])).toString();
      // console.log("this model dob ", this.model.dob);
      this.model.aadhar = res.aadhar;
      this.model.retrieved_aadhaar_number = res.aadhar;
      this.model.address = res.address;
      this.model.uploadLocation.aadhaar = res.filename;
      this.aadhaarName = res.filename;
      this.uploadedFileName = res.filename
      console.log("before if" + this.model.aadhar);
      console.log("before if" + this.model.retrieved_aadhaar_number);

      this.oaoService.setPersonalDetailsObject(this.model);
      jQuery(".dz-progress").css('display', 'none');
      jQuery(".alert").css('display', 'none');
      jQuery("#aadhaarInput").val(this.model.aadhar);
      jQuery('#giveAadhaar').attr('hidden', 'true');
      jQuery('#changedText').removeAttr('hidden');
      jQuery('#showCheckbox').removeAttr('hidden');
      jQuery("#generateAadhaarOtp").removeAttr('hidden');
      jQuery('#uploaingMsg').attr('hidden', 'true');
      jQuery('#doc_erroe').attr('hidden', 'true');

      this.uploadmsg = false;
    } else {
      jQuery('#aadhaarInput').removeClass('loadinggif');
      this.uploadmsg = false;
      this.doc_erroe = true;
      this.uploadedFileName = res.filename;
      this.aadhaarName = undefined;
      console.log(this.model.aadhar);
      console.log(this.doc_erroe);
      jQuery('#uploaingMsg').attr('hidden', 'true');
      this.chRef.detectChanges();
    }

  }

  clicked() {
    this.uploadmsg = true;
    jQuery('#aadhaarInput').addClass('loadinggif');
    jQuery("#uploaingMsg").removeAttr('hidden');
  }

  moveBack() {
    this.isRouteChange = true;
   // this.oaoService.setProgressBardata(this.backwardProgressDataBNA);

  }

  // getImageName() {
  //   let name = "IMG_" + Date.now() + ".jpg";
  //   console.log("FIle name is ", name);
  //   this.model.uploadLocation = {}
  //   this.model.uploadLocation.aadhaar = name;
  //   return name;
  // }
  ngAfterViewInit() {
    jQuery('.page-content-info').css('opacity', '0.7');

    var s = document.createElement("script");
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('id', 'dlshare');
    s.setAttribute('src', this.digilockerConfig.url);
    s.setAttribute('data-app-id', this.digilockerConfig.appId);
    s.setAttribute('data-app-hash', this.digilockerConfig.appHash);
    s.setAttribute('time-stamp', this.digilockerConfig.timeStamp);
    s.setAttribute('data-callback', 'DigilockerResponse');
    this.elementRef.nativeElement.appendChild(s);


    window.addEventListener("message", this.digilockerListener, false);

    jQuery('a#attachment_poi').click(function (event) {
      event.preventDefault();
    })

  }

  ngAfterViewChecked() {
    setTimeout(() => {
      jQuery('a#attachment_poi').removeAttr('href');
      jQuery('.page-content-info').css('opacity', '1');
      jQuery('#pageLoadingPanel').hide();
    }, 350)

  }


  viewTermsAndConditions() {
    jQuery('#TandC').modal('show');
  }

  ngOnDestroy() {

    window.removeEventListener("message", this.digilockerListener, false);

    this.langSubscription.unsubscribe();

  }

  cancelUploding() {
    console.log("removing file", event);
    jQuery('#aadhaarInput').removeClass('loadinggif');
    this.isDigiRemove = true;
    this.doc_erroe = false;
    this.chRef.detectChanges();
    //let filename = event.previewElement.children[2].children[1].children[0].innerText;
    jQuery("div.share_fm_dl_sm span").remove();

    this.oaoService.removeUploadedFile(this.uploadingFileName, this.docType).subscribe(res => {
      console.log(res);

    });

    if (!this.isManualUpload) {
      this.isManualUpload = true;
    }

    this.uploadingFileName = "File_" + Date.now() + (Math.floor((Math.random() * 100))) + '.jpg';
  }

}

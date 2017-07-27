import { Component, OnInit, AfterViewInit, AfterViewChecked, ElementRef, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";

import { PersonalDetailsObject } from "../../../interfaces/personalDetails.interface";
import { UserDetailsObject } from "../../../interfaces/userDetails.interface";
import { OAOService } from "../../../services/OAO.Service";
import { TranslateService } from '@ngx-translate/core';
import { GoogleAnalyticsEventsService } from "../../../services/GoogleAnalyticsEvents.Service";


declare var jQuery: any;
@Component({
  selector: 'pan-info',
  templateUrl: './panInformation.component.html'
})
export class PANInformation implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {

  private forwardProgressDataBNA = ['completed', 'completed', 'active', '', 'Y', 'N'];
  private progressDataEBankBNA = ['completed', 'completed', 'completed', 'active', 'Y', 'N'];
  private backwardProgressDataBNA = ['active', '', '', '', 'N', 'Y'];


  private forwardProgressDataSAL1 = ['completed', 'completed', 'completed', 'active', '', 'Y', 'N'];
  private progressDataEBankSAL1 = ['completed', 'completed', 'completed', 'active', '', 'Y', 'N'];
  private backwardProgressDataSAL1 = ['completed', 'completed', 'active', '', '', 'N', 'Y'];


  private uploadPANMsg = '';
  private isDigilockerFetching: boolean = false;
  private digilockerConfig;
  private isManualUpload: boolean = true;
  private langSubscription;
  private panFlag: boolean = true;
  private doc_erroe: boolean = false;
  private pan_togle_msg: boolean = false;
  private isCrossSell: boolean = false;
  private crossSellDisplaytext: string = '';
  private isDigiRemove: boolean = false;
  private isRouteChange: boolean = false;
  private uploadingFileName = "File_" + Date.now() + (Math.floor((Math.random() * 100))) + '.jpg';
  private uploadedFileName: string;
  private config: any;
  private docType: string = 'PAN';

  inf_003: string;
  uploadmsg: boolean = false;



  private model: PersonalDetailsObject = new PersonalDetailsObject('', '', '', '', '', '', '');
  private crossmodel = new PersonalDetailsObject('', '', '', '', '', '', '');

  constructor(private oaoService: OAOService, private router: Router, private route: ActivatedRoute,
    private translate: TranslateService, private elementRef: ElementRef, private chRef: ChangeDetectorRef, private gaEventsService: GoogleAnalyticsEventsService) {


    this.model = this.oaoService.getPersonalDetailsObject();
    if (this.model.pan && this.model.pan.length == 10) {
      this.panFlag = false;
    }
    this.oaoService.getAttachmentsByDocType(this.docType).subscribe(res => {
      if (!res.error && res.data.length > 0) {
        this.uploadedFileName = res.data[0];
        this.isManualUpload = false;
      }
    })
    this.config = {
      thumbnailHeight: 70,
      headers: { "application_id": this.model.application_id, doc_type: this.docType },
      renameFilename: () => this.uploadingFileName,
      url: "/getdetails/pan",
      previewTemplate: `<div class="dz-preview dz-file-preview" style="padding:0px !important">
                          <a  href="javascript:void(0);" title="Change uploaded file" style="z-index:50;position:absolute;right:0%;background-color:white;" data-dz-remove ><span class="glyphicon glyphicon-edit"></span></a>
                        <div class="dz-image"><img data-dz-thumbnail /></div>
                        <div class="dz-details">
                          <div class="dz-size"><span data-dz-size></span></div>
                          <div class="dz-filename"><span data-dz-name></span></div>
                        </div>
                        <div class="dz-progress"><img style="margin-left:25%;height:60%;position:relative;width:40%;margin-top:10%" src="/assets/images/uploading_doc.gif"></div>
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
    this.crossmodel = Object.assign({}, this.oaoService.getPersonalDetailsObject());
    this.oaoService.GetProductDetail(this.model.linked_crossselling_product)
      .subscribe(data => {
        console.log(data);
        this.crossmodel.product_type_code = data.result[0].child_of;
        this.crossmodel.product_code = data.result[0].product_code;
        this.crossSellDisplaytext = data.result[0].display_text;
        console.log('Cross Model', JSON.stringify(this.crossmodel));
      })
    this.digilockerConfig = this.oaoService.getDigiLockerConfig();
    translate.get('PAN_INFO.UPLOAD_PAN_MSG').subscribe(res => {
      this.uploadPANMsg = res;
    })
    this.oaoService.GetPropertyDetails('INFO_MESSAGE', 'INF_003')
      .subscribe(
      data => {
        this.inf_003 = data.result[0].property_value;
      }
      );

  }

  ngOnInit() {
    if (this.oaoService.getResumeFlag()) {
      this.oaoService.setProgressBardata(this.oaoService.getPro_bar());
      this.oaoService.setProgressBardata(this.oaoService.getPro_bar());
      this.oaoService.setResumeFlag(false);
    }
    this.langSubscription = this.oaoService.changelangEvent.subscribe(lang => {

      this.translate.get('PAN_INFO.UPLOAD_PAN_MSG').subscribe(res => {
        this.uploadPANMsg = res;
      });

    });

  }

  ngAfterViewInit() {
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

  }
  ngAfterViewChecked() {
    jQuery('a#attachment_poi').removeAttr('href');

  }

  private digilockerListener = function (event) {
    if (event.origin != 'https://devservices.digitallocker.gov.in') {
      return;
    }
    console.log(event);
    this.isDigilockerFetching = true;
    this.isManualUpload = false;
    jQuery("#uploaingMsg").removeAttr('hidden');
    var data = JSON.parse(event.data);
    let fileExt = data.filename.split('.')[1];
    data.filename = "File_" + Date.now() + (Math.floor((Math.random() * 100))) + '.' + fileExt;
    this.uploadingFileName = data.filename;
    data.type = this.docType;
    data['application_id'] = this.model.application_id;
    this.oaoService.fetchDigilockerDocument(data).subscribe(res => {

      console.log("digi fetch response ", res);
      console.log("is digi remove", this.isDigiRemove);
      if (this.isDigiRemove) {
        this.isDigiRemove = false;
        return;
      }

      if (res.error) {
        this.uploadmsg = false;
        this.doc_erroe = true;
        console.log(this.doc_erroe);
        this.isDigilockerFetching = false;
        this.uploadedFileName = res.filename;
        jQuery('#uploaingMsg').attr('hidden', 'true');
        this.chRef.detectChanges();
        return;
      }
      if (res.isImage) {
        console.log("digilocker pan image response", res);
        jQuery(".dz-progress").css('display', 'none');
        jQuery('#uploaingMsg').attr('hidden', 'true');
        this.model.pan = res.pan;
        this.model.retrieved_pan_number = res.pan;
        this.uploadmsg = false;
        this.isDigilockerFetching = false;
        this.panFlag = false;
        this.uploadedFileName = res.filename;
        this.isManualUpload = res.isManualUpload;
        console.log("p==", this.model.retrieved_pan_number);
        this.chRef.detectChanges();
      }
      else {
        console.log(res);
      }


    }
    )

  }.bind(this);

  onSubmit() {

    console.log("move to docs upload");
    if (this.model.pan == this.model.retrieved_pan_number) {
      console.log("inside if, before null" + this.model.retrieved_pan_number);
      this.model.retrieved_pan_number = null;
      console.log("inside if, after null" + this.model.retrieved_pan_number);
    }
    this.isRouteChange = true;
    if (this.isCrossSell) {
      this.gaEventsService.emitEvent('OAO_Crosssell', this.crossmodel.product_name, window.location.pathname, 10);
      this.createCrossSellApplicants();
    }
    if (this.model.is_aadhaar && !this.model.postal_home_address_flag) {
      this.model.skip = true;
    }

    switch (this.model.product_code) {
      case 'BNA': this.oaoService.OAOCreateOrUpdateApplicant(this.model).subscribe(data => {
        if (this.model.skip) {
          jQuery('#success').modal('show');
        }
        else {
          this.oaoService.setProgressBardata(this.forwardProgressDataBNA);
          this.router.navigate(['../docsUpload'], { relativeTo: this.route });
        }

      });
        break;
      case 'SAL1':
        this.oaoService.OAOCreateOrUpdateSalaryApplicant(this.model).subscribe(data => {
          this.oaoService.setProgressBardata(this.forwardProgressDataSAL1);
          this.router.navigate(['../docsUpload'], { relativeTo: this.route });
        });
        break;
      default: console.log('No product code match present', this.model);
    }

  }

  moveBack() {
    this.isRouteChange = true;
    switch (this.model.product_code) {
      case 'BNA':
        this.oaoService.updatesection("section_1", this.model.application_id).subscribe(
          data => {
            console.log("updated:" + this.model.product_code);
            this.oaoService.setProgressBardata(this.backwardProgressDataBNA);
            this.router.navigate(['../personalContactInfo'], { relativeTo: this.route });
          }
        );
        break;
      case 'SAL1':
        this.oaoService.updatesection("section_2", this.model.application_id).subscribe(
          data => {
            console.log("updated:" + this.model.product_code);
            this.oaoService.setProgressBardata(this.backwardProgressDataSAL1);
            this.router.navigate(['../confirmLetter'], { relativeTo: this.route });
          }
        );
        break;
      default: console.log('product code did not match', this.model);
    }


  }

  panDetails(data) {
    var res = data[1];
    console.log("errrooorrr" + res.error)
    if (!res.error) {
      jQuery('#panInput').removeClass('loadinggif');
      this.pan_togle_msg = true;
      console.log(data);
      this.model.pan = data[1].pan;
      this.model.retrieved_pan_number = res.pan;
      console.log("pan before if" + this.model.pan);
      console.log("pan before if" + this.model.retrieved_pan_number);
      jQuery(".dz-progress").css('display', 'none');
      jQuery('#uploaingMsg').attr('hidden', 'true');
      jQuery("#panInput").val(this.model.pan);
      this.uploadmsg = false;
      this.panFlag = false;
      this.uploadedFileName = res.filename;
      this.chRef.detectChanges();
    } else {
      jQuery('#panInput').removeClass('loadinggif');
      this.uploadmsg = false;
      this.doc_erroe = true;
      console.log(this.model.pan);
      console.log(this.doc_erroe);
      this.uploadedFileName = res.filename;
      jQuery('#uploaingMsg').attr('hidden', 'true');
      this.chRef.detectChanges();
    }
  }

  clicked() {
    // jQuery(".alert").delay(0).addClass("in");
    jQuery('#panInput').addClass('loadinggif');
    this.uploadmsg = true;
    jQuery("#uploaingMsg").removeAttr('hidden');
  }

  moveForward() {
    this.oaoService.setProgressBardata(this.progressDataEBankBNA);
    this.oaoService.setProgressBardata(this.progressDataEBankBNA);
    this.oaoService.setProgressBardata(this.progressDataEBankSAL1);
    this.oaoService.setProgressBardata(this.progressDataEBankSAL1);
  }

  removeFile(event) {
    jQuery('#panInput').removeClass('loadinggif');
    if (this.isRouteChange) {
      return;
    }
    console.log("removing file", event);
    this.doc_erroe = false;
    jQuery("div.share_fm_dl_sm span").remove();
    this.oaoService.removeUploadedFile(this.uploadedFileName, this.docType).subscribe(res => {
      console.log(res);
      this.uploadedFileName = '';


    });
    this.panFlag = true;
    if (!this.isManualUpload) {
      this.isManualUpload = true;
    }
    this.uploadingFileName = "File_" + Date.now() + (Math.floor((Math.random() * 100))) + '.jpg';
  }

  validatePAN(event) {
    this.pan_togle_msg = false;
    if (this.model.pan != undefined && this.model.pan != null && this.model.pan.length == 10) {
      this.panFlag = false;
    }
    else {
      this.panFlag = true;
    }
  }
  ngOnDestroy() {
    window.removeEventListener("message", this.digilockerListener, false);
    jQuery('#dlshare').remove();
    this.langSubscription.unsubscribe();
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

  cancelUploding() {
    jQuery('#panInput').removeClass('loadinggif');
    this.isDigiRemove = true;
    console.log("removing file", event);
    this.doc_erroe = false;
    jQuery("div.share_fm_dl_sm span").remove();
    this.oaoService.removeUploadedFile(this.uploadingFileName, this.docType).subscribe(res => {
      console.log(res);
    });
    this.panFlag = true;
    if (!this.isManualUpload) {
      this.isManualUpload = true;
    }
    this.uploadingFileName = "File_" + Date.now() + (Math.floor((Math.random() * 100))) + '.jpg';
  }

    clear(){
      this.isRouteChange = true;
      window.location.href=this.oaoService.getBaseUrl();
    }



}

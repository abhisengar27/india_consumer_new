import { Component, OnInit, AfterViewInit, AfterViewChecked, OnDestroy,ElementRef, Output, EventEmitter, ChangeDetectorRef, Input} from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { PersonalDetailsObject } from "../../interfaces/personalDetails.interface";
import { UserDetailsObject } from "../../interfaces/userDetails.interface";
import { OAOService } from "../../services/OAO.Service";
import { checkbox } from './../../interfaces/checkboxinterface';
import { TranslateService } from '@ngx-translate/core';
import { GoogleAnalyticsEventsService } from "./../../services/GoogleAnalyticsEvents.Service";
declare var jQuery: any;
declare var jsPDF;
@Component({
  selector: 'employer-confirmation',
  templateUrl: './employerConfirmationLetter.component.html'
})
export class EmployerConfirmationLetterComponent implements OnInit
{
  private backwardProgressDataSAL1 = ['active', '', '', '', '', 'N', 'Y'];
  private forwardProgressDataSAL1 = ['completed', 'completed', 'active', '', '', 'Y', 'N'];
  private uploadedFileExt: string;
  private uploadedFileExt1: string;
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
  private isRouteChange: boolean = false;
  private uploadingFileName = "File_" + Date.now() + (Math.floor((Math.random() * 100)));
  private uploadedFileName: string;
  private zone_show_flag: boolean = false;
  private doc_type: string = 'Emploment Letter';
  private pdf_flag: boolean = false;
  private jpg_flag: boolean = false;
  private inf_003: string;
  private upload_success_flag: boolean = false;
  private uploadmsg: boolean = false;
  private config: any;
  private model: PersonalDetailsObject = new PersonalDetailsObject('', '', '', '', '', '', '');
  private crossmodel = new PersonalDetailsObject('', '', '', '', '', '', '');

  constructor(private oaoService: OAOService, private router: Router, private route: ActivatedRoute,
    private translate: TranslateService, private elementRef: ElementRef, private chRef: ChangeDetectorRef, private gaEventsService: GoogleAnalyticsEventsService) {
    console.log("EmployerConfirmationLetterComponent constructor()")
    this.model = this.oaoService.getPersonalDetailsObject();
    this.crossmodel = Object.assign({}, this.oaoService.getPersonalDetailsObject());
    this.oaoService.GetProductDetail(this.model.linked_crossselling_product)
      .subscribe(data => {
        this.crossmodel.product_type_code = data.result[0].child_of;
        this.crossmodel.product_code = data.result[0].product_code;
        this.crossSellDisplaytext = data.result[0].display_text;
        console.log('Cross Model', JSON.stringify(this.crossmodel));
      });

    this.digilockerConfig = this.oaoService.getDigiLockerConfig();
    translate.get('employerDetails.upload_contract_letter_message').subscribe(res => {
      this.uploadPANMsg = res;
    });

    this.oaoService.getAttachmentsByDocType(this.doc_type).subscribe(res => {
      if (!res.error && res.data.length > 0) {
        this.zone_show_flag = true;
         this.panFlag = false;
        this.upload_success_flag = true;
        this.uploadedFileName = res.data[0];
        let data1 = this.uploadedFileName.split('.');
        this.uploadedFileExt1 = data1[data1.length - 1];
         console.log("file type==>:"+this.uploadedFileExt1)
        if (this.uploadedFileExt1.trim() === "pdf") {
          console.log("pdf file is already present.")
          this.pdf_flag = true;
        }else{
           console.log("pdf file is not present but jpeg file is present.")
           this.jpg_flag=true;
        }
        this.isManualUpload = false;
      }
      else{
        console.log("there is no file present for this application id")
      }
    });

    
    

    this.config = {
      thumbnailHeight: 70,
      acceptedFiles: "image/*,application/pdf,.psd",
      headers: { "application_id": this.model.application_id, doc_type: this.doc_type },
      renameFilename: (filename) => {
        let data = filename.split('.');
        this.uploadedFileExt = data[data.length - 1];

        console.log(this.uploadedFileExt);

        if (this.uploadedFileExt.trim() == "pdf") {
          console.log("this.pdf_flag:" + this.pdf_flag);
          this.pdf_flag = true;
        }
        if (this.uploadingFileName && !this.uploadingFileName.endsWith(`.${this.uploadedFileExt}`)) {
          this.uploadingFileName = this.uploadingFileName + '.' + data[data.length - 1];
        }
        return this.uploadingFileName;
      },
      url: "/getdetails/doc",
      previewTemplate: `<div class="dz-preview dz-file-preview" style="padding:0px !important">
                          <a  id="remove_file" href="javascript:void(0);" title="Change uploaded file" style="z-index:50;position:absolute;right:0%;background-color:white;" data-dz-remove ><span class="glyphicon glyphicon-edit"></span></a>
                        <div style="margin-bottom:15px;" class="dz-image"><img data-dz-thumbnail /></div>
                        <div class="dz-details">
                          <div class="dz-size"><span data-dz-size></span></div>
                          <div class="dz-filename"><span data-dz-name></span></div>
                        </div>
                        <div class="dz-progress"><img style="margin-left:25%;height:60%;position:relative;width:60%;margin-top:10%" src="/assets/images/uploading_doc.gif"></div>
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

    this.oaoService.GetPropertyDetails('INFO_MESSAGE', 'INF_003')
      .subscribe(
      data => {
        this.inf_003 = data.result[0].property_value;
      }
      );

  }

  ngOnInit() {
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
  }
  ngAfterViewChecked() {
    jQuery('a#attachment_poi').removeAttr('href');

  }
  onSubmit() {
    this.isRouteChange = true;
    this.oaoService.setProgressBardata(this.forwardProgressDataSAL1);
    this.oaoService.OAOCreateOrUpdateSalaryApplicant(this.model)
      .subscribe(data => {
        this.oaoService.setPersonalDetailsObject(this.model);
        this.router.navigate(['../panInfo'], { relativeTo: this.route });
      });
  }
  moveBack() {
    this.oaoService.setProgressBardata(this.backwardProgressDataSAL1);
    this.oaoService.updatesection("section_1", this.model.application_id).subscribe(
      data => {
        this.router.navigate(['../personalContactInfo'], { relativeTo: this.route });
      });

  }

  employmentDetails(data) {
    console.log("employmentDetails():" + "upload_success_flag:" + this.upload_success_flag + "this.pdf_flag:" + this.pdf_flag)
    var res = data[1];
    if (!res.error) {
      if (this.pdf_flag) {
        this.zone_show_flag = true;
        jQuery("#remove_file").hide();
      }
      this.upload_success_flag = true;
      this.pan_togle_msg = true;
      this.isManualUpload = false;
      this.model.pan = data[1].pan;
      jQuery("#panInput").val(this.model.pan);
      this.uploadmsg = false;
      this.panFlag = false;
      this.uploadedFileName = res.filename;
      console.log("if old file Name:" + res.filename)
      this.chRef.detectChanges();
    } else {
      this.upload_success_flag = false;
      this.uploadmsg = false;
      this.doc_erroe = true;
      this.uploadedFileName = res.filename;
      console.log("else old file Name:" + res.filename)
      this.chRef.detectChanges();

    }
  }

  addedfile() {
    console.log("addedfile()");
    jQuery("#uploaingMsg").removeAttr('hidden');
  }

  removeFile(event) {
    this.upload_success_flag = false;
    this.pdf_flag = false;
    this.zone_show_flag = false;
    this.jpg_flag=false;
    console.log("removeFile():" + "upload_success_flag:" + this.upload_success_flag + "this.pdf_flag:" + this.pdf_flag)
    if (this.isRouteChange) {
      return;
    }
    console.log("removing file", event);
    this.doc_erroe = false;
    jQuery("div.share_fm_dl_sm span").remove();
    this.oaoService.removeUploadedFile(this.uploadedFileName, this.doc_type).subscribe(res => {
      console.log(res);
      this.uploadedFileName = '';
      this.zone_show_flag = false;
      this.chRef.detectChanges();
    });
    this.panFlag = true;
    if (!this.isManualUpload) {
      this.isManualUpload = true;
    }
    this.zone_show_flag = false;
    this.uploadingFileName = "File_" + Date.now() + (Math.floor((Math.random() * 100)));

     this.config = {
      thumbnailHeight: 70,
      acceptedFiles: "image/*,application/pdf,.psd",
      headers: { "application_id": this.model.application_id, doc_type: this.doc_type },
      renameFilename: (filename) => {
        let data = filename.split('.');
        this.uploadedFileExt = data[data.length - 1];
        console.log(this.uploadedFileExt);
        if (this.uploadedFileExt.trim() == "pdf") {
          console.log("this.pdf_flag:" + this.pdf_flag);
          this.pdf_flag = true;
        }
        if (this.uploadingFileName && !this.uploadingFileName.endsWith(`.${this.uploadedFileExt}`)) {
          this.uploadingFileName = this.uploadingFileName + '.' + data[data.length - 1];
        }
        return this.uploadingFileName;
      },
      url: "/getdetails/doc",
      previewTemplate: `<div class="dz-preview dz-file-preview" style="padding:0px !important">
                          <a  id="remove_file" href="javascript:void(0);" title="Change uploaded file" style="z-index:50;position:absolute;right:0%;background-color:white;" data-dz-remove ><span class="glyphicon glyphicon-edit"></span></a>
                        <div style="margin-bottom:15px;" class="dz-image"><img data-dz-thumbnail /></div>
                        <div class="dz-details">
                          <div class="dz-size"><span data-dz-size></span></div>
                          <div class="dz-filename"><span data-dz-name></span></div>
                        </div>
                        <div class="dz-progress"><img style="margin-left:25%;height:60%;position:relative;width:60%;margin-top:10%" src="/assets/images/uploading_doc.gif"></div>
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
  ngOnDestroy() {
    jQuery('#dlshare').remove();
    this.langSubscription.unsubscribe();
  }

  clear() {
    window.location.reload();
  }

  configDropZone(){

  }

  cancelUploding() {
    this.upload_success_flag = false;
    console.log("removing file", event);
    this.doc_erroe = false;
    jQuery("div.share_fm_dl_sm span").remove();
    this.oaoService.removeUploadedFile(this.uploadingFileName, this.doc_type).subscribe(res => {
      console.log(res);
    });
    this.panFlag = true;
    if (!this.isManualUpload) {
      this.isManualUpload = true;
    }
    this.uploadingFileName = "File_" + Date.now() + (Math.floor((Math.random() * 100)));
  }

  public download() {
    console.log("downloading....pdf");
    var img = new Image();
    img.src = '/assets/images/logo.png';
    var doc = new jsPDF();
    doc.fromHTML(jQuery('#download').html(), 15, 15, {
      'width': 170
    });
    doc.save(this.model.application_id + '.pdf');
    this.isRouteChange = true;
    jQuery('#success').modal('show');
  }

}

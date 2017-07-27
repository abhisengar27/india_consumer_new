import { Component, OnInit, AfterViewInit, ElementRef, ChangeDetectorRef, EventEmitter, Output, Input } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { OAOService } from "../../services/OAO.Service";
import { TranslateService } from '@ngx-translate/core';
import { VehicleLoanDetails } from "../../interfaces/vehicleLoanDetails.interface";
import { PersonalDetailsObject } from "../../interfaces/personalDetails.interface";
import { Common } from "../../validators/commonFunc";
import { EmitterService } from '../../services/OAOEventEmitter.Service'

declare var jQuery: any;
@Component({
    selector: 'document-proof',
    templateUrl: './genericDocumentProof.component.html'
})

export class GenericDocumentProofComponent {
    emitter = EmitterService.get("channel_1");
    private model: PersonalDetailsObject = new PersonalDetailsObject('', '', '', '', '', '', '');
    public config: any;
    private hideDropBox: boolean = false;
    private hideDropBoxPan: boolean = false;
    private hideDigilocker: boolean = false;
    private isDigilockerFetching: boolean = false;
    private isDigiRemove: boolean = false;
    private uploadedFiles: string[] = [];
    public docType: string = '';
    public baseUrl: String = '';
    private uploadingFileName = "File_" + Date.now() + (Math.floor((Math.random() * 100))) + '.jpg';
    model1 = new VehicleLoanDetails();
    public elementRef;
    private digilockerConfig;
    public filteredList = [];
    public upsel_flag: boolean;
    private uploadedFileName: string;
    uploadmsg: boolean = false;
    public sub: any;

    // for vehicle loan doc upload
    private isRouteChange: boolean = false;
    private doc_erroe: boolean = false;
    private upload_success_flag1: boolean = false;
    private upload_success_flag2: boolean = false;
    private upload_success_flag3: boolean = false;
    private upload_success_flag4: boolean = false;
    private upload_success_flag5: boolean = false;
    private upload_success_flag6: boolean = false;
    private upload_success_flag7: boolean = false;

    addrFlagChange = new EventEmitter<boolean>();
    public show_flag_pan: boolean = false;
    public show_flag_aadhar: boolean = false;
    public show_flag_voterId: boolean = false;
    public show_flag_NREGA: boolean = false;
    public show_flag_Passport: boolean = false;
    public show_flag_DL: boolean = false;
    public offerLetterClicked: boolean = false;
    public form16Clicked: boolean = false;
    public relievingLetterClicked: boolean = false;
    private show_Offer_letter: boolean = false;
    private show_form_16: boolean = false;
    private show_relieving_letter: boolean = false;
    public documentType: string = '';
    public newID: string = '';
    private langSubscription;
    private uploadDocMsg = '';
    private panFlag: boolean = true;
    public documentName: any;
    public document:any;
    @Input()
    @Output()
    public uploadSuccessFlag = new EventEmitter<string>();


    constructor(myElement: ElementRef, private oaoService: OAOService, private router: Router, private chRef: ChangeDetectorRef, private route: ActivatedRoute,
        private translate: TranslateService) {

        this.uploadSuccessFlag.emit("");

        console.log("inisde constructor");
        this.sub = this.route.data.subscribe(data1 => {
                console.log("data value..", data1);
                this.document = data1;
                this.docType = "";

                if ( this.document.doctype == "ADDRESS_PROOF") {
                    this.docType =  this.document.doctype;
                }
                if ( this.document.doctype == "JOB_PROOF") {
                    this.docType =  this.document.doctype;
                }
                if ( this.document.doctype == "ID_PROOF") {
                    this.docType =  this.document.doctype;
                }
                if ( this.document.doctype == "BANK_STATEMENT") {
                    this.docType =  this.document.doctype;
                }
                if ( this.document.doctype == "INCOME_PROOF") {
                    this.docType =  this.document.doctype;
                }
                if ( this.document.doctype == "PAN") {
                    this.docType =  this.document.doctype;
                }
                if ( this.document.doctype == "BUSINESS_PROOF") {
                    this.docType =  this.document.doctype;
                }
            });
        translate.get('CARLOAN.DOC_UPLOAD_MSG').subscribe(res => {
            this.uploadDocMsg = res;
        });

        this.oaoService.getAttachmentsByDocType(this.docType).subscribe(res => {
            if (!res.error && res.data.length > 0) {
                this.uploadedFiles = res.data;
                this.hideDropBox = true;
                jQuery("#addAnotherDoc2").css('display', '');

            }
        })
        if (this.model.addrDoc == '' || this.model.addrDoc == undefined || this.model.addrDoc == null) {
            this.model.addrDoc = '0'
        }
        if (this.model.idProof == '' || this.model.idProof == undefined || this.model.idProof == null) {
            this.model.idProof = '0'
        }
        this.oaoService.setVehicleLoanObject(this.model1);

        this.model = this.oaoService.getPersonalDetailsObject();
        console.log(this.model);
        this.elementRef = myElement;
        this.model1 = this.oaoService.getVehicleLoanObject();
        console.log(this.model1);
        this.digilockerConfig = this.oaoService.getDigiLockerConfig();

        this.config = {
            thumbnailHeight: 70,
            acceptedFiles: "image/*,application/pdf,.psd",
            headers: { "application_id": this.model.application_id, doc_type: this.docType },
            autoReset: '0',
            renameFilename: () => this.uploadingFileName,
            url: "/getdetails/vehicledoc",
            previewTemplate: `<div class="dz-preview dz-file-preview" style="padding:0px !important">
                          <a  href="javascript:void(0);" title="Change uploaded file" style="z-index:50;position:absolute;right:0%;background-color:white;" data-dz-remove ><span class="glyphicon glyphicon-edit"></span></a>
                        <div class="dz-image"><img data-dz-thumbnail /></div>
                        <div class="dz-details">
                          <div class="dz-size"><span data-dz-size></span></div>
                          <div class="dz-filename"><span data-dz-name></span></div>
                        </div>
                        <div class="dz-progress"><img style="margin-left:25%;height:20%;position:relative;width:60%;margin-top:10%" src="/assets/images/uploading_doc.gif"></div>
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

        this.baseUrl = oaoService.getBaseUrl();
    }
    clear() {
        Common.activeProgressBarStep(5);
        Common.completedProgressBarStep(4);
        //this.oaoService.setProgressBardata(this.backwardProgressDataSAL);
        this.router.navigate(['../employerExtraInfoForLoan'], { relativeTo: this.route });

        //this.oaoService.setUserExistingFlag(false);
    }
    ngOnInit() {

        Common.activeProgressBarStep(6);
        if (this.oaoService.getResumeFlag()) {
            this.oaoService.setProgressBardata(this.oaoService.getPro_bar());
            this.oaoService.setProgressBardata(this.oaoService.getPro_bar());
            this.oaoService.setResumeFlag(false);
        }

    }


    ngAfterViewInit() {
        if (!this.hideDropBox) {
            jQuery("#addAnotherDoc2").css('display', 'none');
        }
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
    setEmploymentType(event) {
        console.log(event.target.value);
        if (event.target.value == "Offer_letter") {
            if (this.show_Offer_letter == false) {
                this.show_Offer_letter = true;
                this.model.Offer_letter = "Offer_letter";
            } else {

                this.show_Offer_letter = false;
            }
        }
        if (event.target.value == "form_16") {
            if (this.show_form_16 == false) {
                this.show_form_16 = true;
                this.model.form_16 = "form_16";
            } else {

                this.show_form_16 = false;
            }
        }
        if (event.target.value == "relieving_letter") {
            if (this.show_relieving_letter == false) {
                this.show_relieving_letter = true
                this.model.relieving_letter = "relieving_letter"
            } else {

                this.show_relieving_letter = false
            }
        }
    }
    ngOnDestroy() {
        window.removeEventListener("message", this.digilockerListener, false);
        jQuery('#dlshare').remove();
        // this.langSubscription.unsubscribe();
    }

    private digilockerListener = function (event) {

        window.removeEventListener("message", this.digilockerListener, false);
        if (event.origin != 'https://devservices.digitallocker.gov.in') {
            return;
        }
        console.log(event);
        this.isDigilockerFetching = true;
        this.hideDigilocker = true;
        this.isManualUpload = false;
        jQuery("div.share_fm_dl_sm span").remove();
        this.chRef.detectChanges();

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

                this.uploadmsg = false;
                this.isDigilockerFetching = false;
                this.hideDigilocker = false;
                this.hideDropBox = true;


                this.addrFlagChange.emit(false);

                this.uploadedFiles.push(res.filename);
                this.isManualUpload = res.isManualUpload;
                this.chRef.detectChanges();
                // container1.animate({
                //     scrollTop1: scrollTo1.offset().top - 300
                // }, 300);​
                jQuery("#addAnotherDoc2").css('display', '');
            }
            else {
                console.log(res);
            }


        }
        )

    }.bind(this);
    removeFile(event) {
        var routeName = window.location.pathname;
        var splitRoute = routeName.split("/");
        var documentsName = splitRoute[splitRoute.length - 1];

        if (documentsName == "addressProof") {
            console.log("inside remove if addressProof");
            this.oaoService.removeUploadedFile(this.uploadingFileName, this.docType).subscribe(res => {
                console.log(res);
                this.uploadedFileName = '';
            });
            jQuery("#closeAddrDropBox").css('display', '');
        }

        if (documentsName == "jcOfferLetter") {

            console.log("inside remove if jobOL");
            this.oaoService.removeUploadedFile(this.uploadingFileName, this.docType).subscribe(res => {
                console.log(res);
                this.uploadedFileName = '';
            });
            jQuery("#closeAddrDropBox").css('display', '');
        }

        if (documentsName == "jcForm16") {

            console.log("inside remove if jobF16");
            this.oaoService.removeUploadedFile(this.uploadingFileName, this.docType).subscribe(res => {
                console.log(res);
                this.uploadedFileName = '';
            });
            jQuery("#closeAddrDropBox").css('display', '');
        }

        if (documentsName == "jcRelievingLetter") {
            console.log("inside remove if jobRL");
            this.oaoService.removeUploadedFile(this.uploadingFileName, this.docType).subscribe(res => {
                console.log(res);
                this.uploadedFileName = '';
            });
            this.upload_success_flag2 = false;
        }
        if (documentsName == "businessProof") {
            console.log("inside remove if businessProof");
            this.oaoService.removeUploadedFile(this.uploadingFileName, this.docType).subscribe(res => {
                console.log(res);
                this.uploadedFileName = '';
            });
        }
        if (documentsName == "idProof") {
            console.log("inside remove if idProof");
            this.oaoService.removeUploadedFile(this.uploadingFileName, this.docType).subscribe(res => {
                console.log(res);
                this.uploadedFileName = '';
            });

        }
        if (documentsName == "bankStatement") {
            console.log("inside remove if bankStmt");
            this.oaoService.removeUploadedFile(this.uploadingFileName, this.docType).subscribe(res => {
                console.log(res);
                this.uploadedFileName = '';
            });

        }
        if (documentsName == "incomeProof") {
            console.log("inside remove if incomeDoc");
            this.oaoService.removeUploadedFile(this.uploadingFileName, this.docType).subscribe(res => {
                console.log(res);
                this.uploadedFileName = '';
            });

        }
        if (documentsName == "pan") {
            console.log("inside remove if vhlPan");
            this.oaoService.removeUploadedFile(this.uploadingFileName, this.docType).subscribe(res => {
                console.log(res);
                this.uploadedFileName = '';
            });

        }

        jQuery('#panInput').removeClass('loadinggif');
        if (this.isRouteChange) {
            return;
        }
        console.log("removing file", event);
        this.doc_erroe = false;
        jQuery("div.share_fm_dl_sm span").remove();
        this.panFlag = true;
        this.uploadingFileName = "File_" + Date.now() + (Math.floor((Math.random() * 100))) + '.jpg';
    }
    clicked() {
        jQuery("#closeAddrDropBox").css('display', 'none');
        this.hideDigilocker = true;
    }
    removeUploadedAddr(file) {
        console.log("inside uploadSuccess()");
        var routeName = window.location.pathname;
        var splitRoute = routeName.split("/");
        var documentsName = splitRoute[splitRoute.length - 1];
        jQuery("div.share_fm_dl_sm span").remove();
        if (documentsName == "addressProof") {
            this.oaoService.removeUploadedFile(file, this.docType).subscribe(res => {
                this.chRef.detectChanges();
                console.log("eno gotilla" + this.upload_success_flag1);
                console.log("eno gotilla length" + this.uploadedFiles.length);
                if (res.message == "File deleted successfully") {
                    console.log("res1", res.error);
                    let index = this.uploadedFiles.indexOf(file);
                    this.uploadedFiles.splice(index, 1);
                    console.log("upload doc length value after remove..." + this.uploadedFiles.length);
                    if (this.uploadedFiles.length == 0) {
                        console.log("inside the if condition...lenght value is..", this.uploadedFiles.length);
                        this.emitter.emit('REMOVE_ADDRESS');
                        this.chRef.detectChanges();
                        jQuery("#addAnotherDoc2").css('display', '');
                    }
                }
                console.log(res);
            });
        }
        if (documentsName == "jobProof") {
            this.oaoService.removeUploadedFile(file, this.docType).subscribe(res => {
                this.chRef.detectChanges();
                console.log("eno gotilla" + this.upload_success_flag1);
                console.log("eno gotilla length" + this.uploadedFiles.length);
                if (res.message == "File deleted successfully") {
                    console.log("res1", res.error);
                    let index = this.uploadedFiles.indexOf(file);
                    this.uploadedFiles.splice(index, 1);
                    console.log("upload doc length value after remove..." + this.uploadedFiles.length);
                    if (this.uploadedFiles.length == 0) {
                        console.log("inside the if condition...lenght value is..", this.uploadedFiles.length);
                        this.emitter.emit('REMOVE_JOB');
                        this.chRef.detectChanges();
                        jQuery("#addAnotherDoc2").css('display', '');
                    }
                }
                console.log(res);
            });
        }
        if (documentsName == "businessProof") {
            this.oaoService.removeUploadedFile(file, this.docType).subscribe(res => {
                this.chRef.detectChanges();
                console.log("eno gotilla" + this.upload_success_flag1);
                console.log("eno gotilla length" + this.uploadedFiles.length);
                if (res.message == "File deleted successfully") {
                    console.log("res1", res.error);
                    let index = this.uploadedFiles.indexOf(file);
                    this.uploadedFiles.splice(index, 1);
                    console.log("upload doc length value after remove..." + this.uploadedFiles.length);
                    if (this.uploadedFiles.length == 0) {
                        console.log("inside the if condition...lenght value is..", this.uploadedFiles.length);
                        this.emitter.emit('REMOVE_BUSINESS');
                        this.chRef.detectChanges();
                        jQuery("#addAnotherDoc2").css('display', '');
                    }
                }
                console.log(res);
            });
        }
        if (documentsName == "idProof") {
            this.oaoService.removeUploadedFile(file, this.docType).subscribe(res => {

                this.chRef.detectChanges();
                console.log("eno gotilla" + this.upload_success_flag1);
                console.log("eno gotilla length" + this.uploadedFiles.length);
                if (res.message == "File deleted successfully") {
                    console.log("res1", res.error);
                    let index = this.uploadedFiles.indexOf(file);
                    this.uploadedFiles.splice(index, 1);
                    console.log("upload doc length value after remove..." + this.uploadedFiles.length);
                    if (this.uploadedFiles.length == 0) {
                        console.log("inside the if condition...lenght value is..", this.uploadedFiles.length);
                        this.emitter.emit('REMOVE_ID');
                        this.chRef.detectChanges();
                        jQuery("#addAnotherDoc2").css('display', '');
                    }
                }
                console.log(res);
            });
        }
        if (documentsName == "bankStatement") {
            this.oaoService.removeUploadedFile(file, this.docType).subscribe(res => {

                this.chRef.detectChanges();
                console.log("eno gotilla" + this.upload_success_flag1);
                console.log("eno gotilla length" + this.uploadedFiles.length);
                if (res.message == "File deleted successfully") {
                    console.log("res1", res.error);
                    let index = this.uploadedFiles.indexOf(file);
                    this.uploadedFiles.splice(index, 1);
                    console.log("upload doc length value after remove..." + this.uploadedFiles.length);
                    if (this.uploadedFiles.length == 0) {
                        console.log("inside the if condition...lenght value is..", this.uploadedFiles.length);
                        this.emitter.emit('REMOVE_BANK');
                        this.chRef.detectChanges();
                        jQuery("#addAnotherDoc2").css('display', '');
                    }
                }
                console.log(res);
            });
        }
        if (documentsName == "incomeProof") {
            this.oaoService.removeUploadedFile(file, this.docType).subscribe(res => {

                this.chRef.detectChanges();
                console.log("eno gotilla" + this.upload_success_flag1);
                console.log("eno gotilla length" + this.uploadedFiles.length);
                if (res.message == "File deleted successfully") {
                    console.log("res1", res.error);
                    let index = this.uploadedFiles.indexOf(file);
                    this.uploadedFiles.splice(index, 1);
                    console.log("upload doc length value after remove..." + this.uploadedFiles.length);
                    if (this.uploadedFiles.length == 0) {
                        console.log("inside the if condition...lenght value is..", this.uploadedFiles.length);
                        this.emitter.emit('REMOVE_INCOME');
                        this.chRef.detectChanges();
                        jQuery("#addAnotherDoc2").css('display', '');
                    }
                }
                console.log(res);
            });
        }
        if (documentsName == "pan") {
            this.oaoService.removeUploadedFile(file, this.docType).subscribe(res => {

                this.chRef.detectChanges();
                console.log("eno gotilla" + this.upload_success_flag1);
                console.log("eno gotilla length" + this.uploadedFiles.length);
                if (res.message == "File deleted successfully") {
                    console.log("res1", res.error);
                    let index = this.uploadedFiles.indexOf(file);
                    this.uploadedFiles.splice(index, 1);
                    console.log("upload doc length value after remove..." + this.uploadedFiles.length);
                    if (this.uploadedFiles.length == 0) {
                        console.log("inside the if condition...lenght value is..", this.uploadedFiles.length);
                        this.emitter.emit('REMOVE_PAN');
                        this.chRef.detectChanges();
                        jQuery("#addAnotherDoc2").css('display', '');
                    }
                }
                console.log(res);
            });
        }
    }

    addAddrProof() {
        console.log("inside addAddrProof()");
        this.hideDropBox = false;
        jQuery("#addAnotherDoc2").css('display', 'none');
    }
    removeAddrDropBox() {
        var routeName = window.location.pathname;
        var splitRoute = routeName.split("/");
        var documentsName = splitRoute[splitRoute.length - 1];
        console.log("removing empty drop box");
        if (documentsName == "addressProof") {
            this.chRef.detectChanges();
            this.hideDropBox = true;
            this.chRef.detectChanges();
            console.log("status", this.hideDropBox)
            jQuery("#addAnotherAddrDoc").css('display', '');
        }

        if (documentsName == "offerLetter") {
            console.log("offerletter allide");
            this.hideDropBox = true;
            jQuery("#addAnotherJCOfferLetterDoc").css('display', '');
        }

        if (documentsName == "form16") {
            this.hideDropBox = true;
            jQuery("#addAnotherJCForm16Doc").css('display', '');
        }

        if (documentsName == "relievingLetter") {
            this.hideDropBox = true;
            jQuery("#addAnotherJCRelievingLetterDoc").css('display', '');
        }

        if (documentsName == "businessProof") {
            this.hideDropBox = true;
            this.chRef.detectChanges();
            jQuery("#addAnotherBusinessProofDoc").css('display', '');
        }

        if (documentsName == "idProof") {
            this.hideDropBox = true;
            this.chRef.detectChanges();
            jQuery("#addAnotherIDProofDoc").css('display', '');
        }

        if (documentsName == "bankStatement") {
            this.hideDropBox = true;
            this.chRef.detectChanges();
            jQuery("#addAnotherBankStmtDoc").css('display', '');
        }
        if (documentsName == "incomeProof") {
            this.hideDropBox = true;
            this.chRef.detectChanges();
            jQuery("#addAnotherIncomeDoc").css('display', '');
        }
        if (documentsName == "pan") {
            this.hideDropBox = true;
            this.chRef.detectChanges();
            jQuery("#addAnotherIncomeDoc").css('display', '');
        }
    }
    uploadSuccess(data) {
        console.log("inside uploadSuccess()");
        var routeName = window.location.pathname;
        var splitRoute = routeName.split("/");
        var documentsName = splitRoute[splitRoute.length - 1];
        console.log("checking", documentsName);
        console.log("data..." + data);
        console.log("document name = " + documentsName);
        if (documentsName == "addressProof") {
            this.chRef.detectChanges();
            this.uploadingFileName = "File_" + Date.now() + (Math.floor((Math.random() * 100))) + '.jpg';
            let filename = data[1].filename;
            this.uploadedFiles.push(filename);
            jQuery("#addAnotherDoc2").css('display', '');
            this.hideDigilocker = false;
            this.hideDropBox = true;
            console.log("Inside addressProof...");
            this.emitter.emit('ADDRESS');
            // this.uploadSuccessFlag.emit(documentsName);
            // console.log("success flag", documentsName);
        }
        if (documentsName == "jobProof") {
            this.chRef.detectChanges();
            this.uploadingFileName = "File_" + Date.now() + (Math.floor((Math.random() * 100))) + '.jpg';
            let filename = data[1].filename;
            this.uploadedFiles.push(filename);
            jQuery("#addAnotherDoc2").css('display', '');
            this.hideDigilocker = false;
            this.hideDropBox = true;
            console.log("Inside addressProof...");
            this.emitter.emit('JOB');
            // this.uploadSuccessFlag.emit(documentsName);
            // console.log("success flag", documentsName);
        }
        if (documentsName == "job_offerLetter") {
            this.chRef.detectChanges();
            this.upload_success_flag2 = true;
            this.uploadingFileName = "File_" + Date.now() + (Math.floor((Math.random() * 100))) + '.jpg';
            let filename = data[1].filename;
            this.uploadedFiles.push(filename);
            jQuery("#addAnotherDoc2").css('display', '');
            this.hideDigilocker = false;
            this.hideDropBox = true;
            console.log("Inside job...");
            this.chRef.detectChanges();
            // this.emitter.emit('JOB_ID');
            // this.uploadSuccessFlag.emit(documentsName);
            // console.log("success flag", documentsName);
        }
        if (documentsName == "job_form16") {
            this.upload_success_flag2 = true;
            this.uploadingFileName = "File_" + Date.now() + (Math.floor((Math.random() * 100))) + '.jpg';
            let filename = data[1].filename;
            this.uploadedFiles.push(filename);
            jQuery("#addAnotherDoc2").css('display', '');
            this.hideDigilocker = false;
            this.hideDropBox = true;
            console.log("Inside job...");
            this.chRef.detectChanges();
            this.uploadSuccessFlag.emit(documentsName);
        }
        if (documentsName == "job_relievingLetter") {
            this.upload_success_flag2 = true;
            this.uploadingFileName = "File_" + Date.now() + (Math.floor((Math.random() * 100))) + '.jpg';
            let filename = data[1].filename;
            this.uploadedFiles.push(filename);
            jQuery("#addAnotherDoc2").css('display', '');
            this.hideDigilocker = false;
            this.hideDropBox = true;
            console.log("Inside job...");
            this.chRef.detectChanges();
            this.uploadSuccessFlag.emit(documentsName);
        }
        if (documentsName == "businessProof") {
            this.chRef.detectChanges();
            this.upload_success_flag3 = true;
            this.uploadingFileName = "File_" + Date.now() + (Math.floor((Math.random() * 100))) + '.jpg';
            let filename = data[1].filename;
            this.uploadedFiles.push(filename);
            jQuery("#addAnotherDoc2").css('display', '');
            this.hideDigilocker = false;
            this.hideDropBox = true;
            console.log("Inside businessProof...");
            this.emitter.emit('BUSINESS');
            this.uploadSuccessFlag.emit(documentsName);
        }
        if (documentsName == "idProof") {
            this.chRef.detectChanges();
            this.upload_success_flag4 = true;
            this.uploadingFileName = "File_" + Date.now() + (Math.floor((Math.random() * 100))) + '.jpg';
            let filename = data[1].filename;
            this.uploadedFiles.push(filename);
            jQuery("#addAnotherDoc2").css('display', '');
            this.hideDigilocker = false;
            this.hideDropBox = true;
            console.log("Inside idProof...");
            this.chRef.detectChanges();
            this.emitter.emit('ID');
            this.uploadSuccessFlag.emit(documentsName);
        }
        if (documentsName == "bankStatement") {
            this.chRef.detectChanges();
            this.upload_success_flag5 = true;
            this.chRef.detectChanges();
            this.uploadingFileName = "File_" + Date.now() + (Math.floor((Math.random() * 100))) + '.jpg';
            let filename = data[1].filename;
            this.uploadedFiles.push(filename);
            jQuery("#addAnotherDoc2").css('display', '');
            this.hideDigilocker = false;
            this.hideDropBox = true;
            console.log("Inside bankStmt...");
            this.emitter.emit('BANK');
            this.uploadSuccessFlag.emit(documentsName);

        }
        if (documentsName == "incomeProof") {
            this.chRef.detectChanges();
            this.upload_success_flag6 = true;
            this.uploadingFileName = "File_" + Date.now() + (Math.floor((Math.random() * 100))) + '.jpg';
            let filename = data[1].filename;
            this.uploadedFiles.push(filename);
            jQuery("#addAnotherDoc2").css('display', '');
            this.hideDigilocker = false;
            this.hideDropBox = true;
            console.log("Inside incomeDoc...");
            this.chRef.detectChanges();
            this.emitter.emit('INCOME');
            this.uploadSuccessFlag.emit(documentsName);
        }
        if (documentsName == "pan") {
            this.chRef.detectChanges();
            this.upload_success_flag7 = true;
            this.uploadingFileName = "File_" + Date.now() + (Math.floor((Math.random() * 100))) + '.jpg';
            let filename = data[1].filename;
            this.uploadedFiles.push(filename);
            jQuery("#addAnotherDoc2").css('display', '');
            this.hideDigilocker = false;
            this.hideDropBox = true;
            console.log("Inside vhlPan...");
            this.chRef.detectChanges();
            this.emitter.emit('PAN');
            this.uploadSuccessFlag.emit(documentsName);
        }
        var res = data[1];
        console.log("Date" + data);
        console.log("errrooorrr" + res.error)
        if (!res.error) {
            console.log(data);
            jQuery(".dz-progress").css('display', 'none');
            jQuery('#uploaingMsg').attr('hidden', 'true');
            this.uploadmsg = false;
            this.panFlag = false;
            // this.uploadedFileName = res.filename;
            this.chRef.detectChanges();
        } else {
            // this.upload_success_flag1 = false;
            jQuery('#panInput').removeClass('loadinggif');
            this.uploadmsg = false;
            this.doc_erroe = true;
            console.log(this.model.pan);
            console.log(this.doc_erroe);
            // this.uploadedFileName = res.filename;
            jQuery('#uploaingMsg').attr('hidden', 'true');
            this.chRef.detectChanges();
        }
    }

    ngAfterViewChecked() {
        setTimeout(() => {
            jQuery('a#attachment_poi').removeAttr('href');
            jQuery('.page-content-info').css('opacity', '1');
            jQuery('#pageLoadingPanel').hide();
        }, 350)

    }
    backToHome() {
        this.isRouteChange = true;
        window.location.href = this.oaoService.getBaseUrl();
    }

    moveForward() {

        switch (this.model.product_code) {
            case "BNA":
                // this.oaoService.setProgressBardata(this.forwardProgressDataBNA);
                this.router.navigate(['../passwordSetup',], { relativeTo: this.route });
                break;
            case "SAL1":
                // this.oaoService.setProgressBardata(this.forwardProgressDataSAL1);
                this.router.navigate(['../passwordSetup',], { relativeTo: this.route });
                break;
            case "VL1":
                // this.oaoService.setProgressBardata(this.forwardProgressDataSAL1);
                this.router.navigate(['../passwordSetup',], { relativeTo: this.route });
                break;
            default: console.log('product code did not match', this.model);
        }

        this.isRouteChange = true;

    }

    getClickedID(clickedID) {
        console.log("inside getClicked()");
        this.newID = clickedID;
        console.log(this.newID);
    }
}
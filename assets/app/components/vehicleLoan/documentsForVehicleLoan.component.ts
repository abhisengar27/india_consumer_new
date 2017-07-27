import {
  Component, ElementRef, OnInit, AfterViewInit, AfterViewChecked, OnDestroy, ChangeDetectorRef,
  EventEmitter, Output
} from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { VehicleLoanDetails } from "../../interfaces/vehicleLoanDetails.interface";
import { PersonalDetailsObject } from "../../interfaces/personalDetails.interface";
import { UserDetailsObject } from "../../interfaces/userDetails.interface";
import { OAOService } from "../../services/OAO.Service";
import { Common } from "../../validators/commonFunc";
import { checkbox } from './../../interfaces/checkboxinterface';
import { TranslateService } from '@ngx-translate/core';
import { GenericDocumentProofComponent } from './genericDocumentProof.component'
import { EmitterService } from '../../services/OAOEventEmitter.Service'

declare var jQuery: any;
@Component({
  selector: 'docs-vehicle-loan',
  templateUrl: './documentsForVehicleLoan.component.html',
})
export class DocumentsForVehicleLoan implements OnInit, AfterViewInit, OnDestroy {
  model1 = new VehicleLoanDetails();
  emitter = EmitterService.get("channel_1");
  private model: PersonalDetailsObject = new PersonalDetailsObject('', '', '', '', '', '', '');
  // // private forwardProgressDataSAL = ['active', '', '', '', 'Y', 'N'];
  // disable_btn_flag: boolean;
  // public query = '';
  // public emplyers = [];
  // public modal1 = new checkbox(false, false);
  isLoading: boolean = false;
  public newID: string = '';

  // public employerstype: any;
  // // private backwardProgressDataSAL = ['', '', '', '', 'N', 'Y'];
  // public filteredList = [];
  // public elementRef;
  // public upsel_flag: boolean;

  // // for vehicle loan doc upload
  private isRouteChange: boolean = false;
  // private doc_erroe: boolean = false;
  // private uploadedFileName1: string;
  // private uploadedFileName2: string;
  // private uploadedFileName3: string;
  // private uploadedFileName4: string;
  // private uploadedFileName5: string;
  // private uploadedFileName6: string;
  // private uploadedFileName7: string;
  // private config1: any;
  // private config2: any;
  // private config3: any;
  // private config4: any;
  // private config5: any;
  // private config6: any;
  // private config7: any;
  // private config8: any;
  // private config9: any;
  // private docType1: string = 'AddressProof';
  // private docType2: string = 'JobContinuity_OfferLetter';
  // private docType3: string = 'JobContinuity_Form16';
  // private docType4: string = 'JobContinuity_RelievingLetter';
  // private docType5: string = 'BusinessStability';
  // private docType6: string = 'IDProof';
  // private docType7: string = 'BankStmt';
  // private docType8: string = 'IncomeDoc';
  // private docType9: string = 'VHLPan';
  // private panFlag: boolean = true;
  // private isManualUpload: boolean = true;
  // private uploadingFileName1 = "File_" + Date.now() + (Math.floor((Math.random() * 100))) + '.jpg';
  // private uploadingFileName2 = "File_" + Date.now() + (Math.floor((Math.random() * 100))) + '.jpg';
  // private uploadingFileName3 = "File_" + Date.now() + (Math.floor((Math.random() * 100))) + '.jpg';
  // private uploadingFileName4 = "File_" + Date.now() + (Math.floor((Math.random() * 100))) + '.jpg';
  // private uploadingFileName5 = "File_" + Date.now() + (Math.floor((Math.random() * 100))) + '.jpg';
  // private uploadingFileName6 = "File_" + Date.now() + (Math.floor((Math.random() * 100))) + '.jpg';
  // private uploadingFileName7 = "File_" + Date.now() + (Math.floor((Math.random() * 100))) + '.jpg';
  // private uploadingFileName8 = "File_" + Date.now() + (Math.floor((Math.random() * 100))) + '.jpg';
  // private uploadingFileName9 = "File_" + Date.now() + (Math.floor((Math.random() * 100))) + '.jpg';
  // uploadmsg: boolean = false;
  // private pan_togle_msg: boolean = false;
  private langSubscription;
  private uploadPANMsg1 = '';
  // private uploadPANMsg2a = '';
  // private uploadPANMsg2b = '';
  // private uploadPANMsg2c = '';
  // private uploadPANMsg3 = '';
  // private uploadPANMsg4 = '';
  // private uploadPANMsg5 = '';
  // private uploadPANMsg6 = '';
  // private uploadPANMsg7 = '';
  // private digilockerConfig;
  // public employer: string;
  public jobFlag: boolean = false;
  public businessFlag: boolean = false;
  // private isDigilockerFetching: boolean = false;
  // private isDigiRemove: boolean = false;
  private upload_success_flag1: boolean = false;
  private upload_success_flag2: boolean = false;
  private upload_success_flag3: boolean = false;
  private upload_success_flag4: boolean = false;
  private upload_success_flag5: boolean = false;
  private upload_success_flag6: boolean = false;
  private upload_success_flag7: boolean = false;
  // private uploadedFiles1: string[] = [];
  // private uploadedFiles2: string[] = [];
  // private uploadedFiles3: string[] = [];
  // private uploadedFiles4: string[] = [];
  // private uploadedFiles5: string[] = [];
  // private uploadedFiles6: string[] = [];
  // private uploadedFiles7: string[] = [];
  // private uploadedFiles8: string[] = [];
  // private uploadedFiles9: string[] = [];
  // private hideDropBox: boolean = false;
  // private hideDropBoxPan: boolean = false;
  // private hideDigilocker: boolean = false;
  // private baseUrl: String = '';
  // private baseUrl2: String = '';
  // private baseUrl3: String = '';
  // private baseUrl4: String = '';
  // private baseUrl5: String = '';
  // private baseUrl6: String = '';
  // private baseUrl7: String = '';
  // addrFlagChange = new EventEmitter<boolean>();
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
  // public documentType: string = '';


  constructor(myElement: ElementRef, private oaoService: OAOService, private router: Router, private chRef: ChangeDetectorRef, private route: ActivatedRoute,
    private translate: TranslateService) {

    this.emitter.subscribe(msg => {
      console.log("msg", msg);
      if (msg == "ADDRESS") {
        console.log("flag value", msg);
        this.chRef.detectChanges();
        console.log("new flag value", msg);
        this.upload_success_flag1 = true;
        this.chRef.detectChanges();
        console.log("flag status", this.upload_success_flag1);
      }
      if (msg == "JOB") {
        console.log("flag value", msg);
        this.chRef.detectChanges();
        console.log("new flag value", msg);
        this.upload_success_flag2 = true;
        this.chRef.detectChanges();
        console.log("flag status", this.upload_success_flag2);
      }
      if (msg == "ID") {
        console.log("flag value", msg);
        this.chRef.detectChanges();
        this.upload_success_flag3 = true;
        this.chRef.detectChanges();
        console.log("flag status", this.upload_success_flag3);
      }
      if (msg == "BANK") {
        this.chRef.detectChanges();
        this.upload_success_flag4 = true;
        this.chRef.detectChanges();
        console.log("flag status", this.upload_success_flag4);
      }
      if (msg == "INCOME") {
        this.chRef.detectChanges();
        this.upload_success_flag5 = true;
        this.chRef.detectChanges();
        console.log("flag status", this.upload_success_flag5);
      }
      if (msg == "PAN") {
        this.chRef.detectChanges();
        this.upload_success_flag6 = true;
        this.chRef.detectChanges();
        console.log("flag status", this.upload_success_flag6);
      }
      if (msg == "BUSINESS") {
        this.chRef.detectChanges();
        this.upload_success_flag7 = true;
        this.chRef.detectChanges();
        console.log("flag status", this.upload_success_flag7);
      }

      //to remove
      if (msg == "REMOVE_ADDRESS") {
        console.log("flag value", msg);
        this.chRef.detectChanges();
        console.log("new flag value", msg);
        this.upload_success_flag1 = false;
        this.chRef.detectChanges();
        console.log("flag status", this.upload_success_flag1);
      }
      if (msg == "REMOVE_JOB") {
        console.log("flag value", msg);
        this.chRef.detectChanges();
        console.log("new flag value", msg);
        this.upload_success_flag2 = false;
        this.chRef.detectChanges();
        console.log("flag status", this.upload_success_flag2);
      }
      if (msg == "REMOVE_ID") {
        console.log("flag value", msg);
        this.chRef.detectChanges();
        this.upload_success_flag3 = false;
        this.chRef.detectChanges();
        console.log("flag status", this.upload_success_flag3);
      }
      if (msg == "REMOVE_BANK") {
        this.chRef.detectChanges();
        this.upload_success_flag4 = false;
        this.chRef.detectChanges();
        console.log("flag status", this.upload_success_flag4);
      }
      if (msg == "REMOVE_INCOME") {
        this.chRef.detectChanges();
        this.upload_success_flag5 = false;
        this.chRef.detectChanges();
        console.log("flag status", this.upload_success_flag5);
      }
      if (msg == "REMOVE_PAN") {
        this.chRef.detectChanges();
        this.upload_success_flag6 = false;
        this.chRef.detectChanges();
        console.log("flag status", this.upload_success_flag6);
      }
      if (msg == "REMOVE_BUSINESS") {
        this.chRef.detectChanges();
        this.upload_success_flag7 = false;
        this.chRef.detectChanges();
        console.log("flag status", this.upload_success_flag7);
      }
    });

      this.model = this.oaoService.getPersonalDetailsObject();
    //   console.log(this.model);
    //   this.elementRef = myElement;
    this.model1 = this.oaoService.getVehicleLoanObject();
    //   console.log(this.model1);
    //   this.digilockerConfig = this.oaoService.getDigiLockerConfig();

    if (this.model.addrDoc == '' || this.model.addrDoc == undefined || this.model.addrDoc == null) {
      this.model.addrDoc = '0'
    }
    if (this.model.idProof == '' || this.model.idProof == undefined || this.model.idProof == null) {
      this.model.idProof = '0'
    }

    this.oaoService.setVehicleLoanObject(this.model1);
    //   this.employer = this.model1.employertype;

    if (this.model1.employertype == "Salaried") {
      console.log("inside if...")
      this.jobFlag = true;
      this.businessFlag = false;
      jQuery('#business').hide();
    }
    else {
      this.jobFlag = false;
      this.businessFlag = true;
    }

    //   this.oaoService.getAttachmentsByDocType(this.docType9).subscribe(res => {
    //     if (!res.error && res.data.length > 0) {
    //       this.uploadedFiles7 = res.data;
    //       this.hideDropBox = true;
    //       jQuery("#addAnotherDoc2").css('display', '');
    //       this.addrFlagChange.emit(false);

    //     }
    //   })

    //   // this.oaoService.getAttachmentsByDocType(this.doc_type).subscribe(res => {
    //   //     if (!res.error && res.data.length > 0) {
    //   //         this.zone_show_flag = true;
    //   //         this.panFlag = false;
    //   //         this.upload_success_flag = true;
    //   //         this.uploadedFileName = res.data[0];
    //   //         let data1 = this.uploadedFileName.split('.');
    //   //         this.uploadedFileExt1 = data1[data1.length - 1];
    //   //         console.log("file type==>:" + this.uploadedFileExt1)
    //   //         if (this.uploadedFileExt1.trim() === "pdf") {
    //   //             console.log("pdf file is already present.")
    //   //             this.pdf_flag = true;
    //   //         } else {
    //   //             console.log("pdf file is not present but jpeg file is present.")
    //   //             this.jpg_flag = true;
    //   //         }
    //   //         this.isManualUpload = false;
    //   //     }
    //   //     else {
    //   //         console.log("there is no file present for this application id")
    //   //     }
    //   // });
  }


  // clear() {
  //   Common.activeProgressBarStep(5);
  //   Common.completedProgressBarStep(4);
  //   //this.oaoService.setProgressBardata(this.backwardProgressDataSAL);
  //   this.router.navigate(['../employerExtraInfoForLoan'], { relativeTo: this.route });

  //   //this.oaoService.setUserExistingFlag(false);
  // }

  onSubmit() {
    console.log("onsubmit()...")
    this.isLoading = !this.isLoading;
    console.log("product_code", this.model.product_code);
    switch (this.model.product_code) {
      case 'VL1': this.model.skip = true;
        this.oaoService.OAOCreateOrUpdateVehicleApplicant(this.model).subscribe(res => {
          console.log(res);
          console.log("popup");
          jQuery('#success').modal('show');
        })
        break;
      default: console.log('no product code match found ', this.model);
    }
    // console.log(this.query)
    // this.model.employer=this.query;
    // this.oaoService.setPersonalDetailsObject(this.model);
    // this.router.navigate(['../personalBasicInfo'], { relativeTo: this.route });
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
    // if (!this.hideDropBox) {
    //   jQuery("#addAnotherDoc2").css('display', 'none');
    // }
    // var s = document.createElement("script");
    // s.setAttribute('type', 'text/javascript');
    // s.setAttribute('id', 'dlshare');
    // s.setAttribute('src', this.digilockerConfig.url);
    // s.setAttribute('data-app-id', this.digilockerConfig.appId);
    // s.setAttribute('data-app-hash', this.digilockerConfig.appHash);
    // s.setAttribute('time-stamp', this.digilockerConfig.timeStamp);
    // s.setAttribute('data-callback', 'DigilockerResponse');
    // this.elementRef.nativeElement.appendChild(s);

    // window.addEventListener("message", this.digilockerListener, false);

  }

  // setEmploymentType(event) {
  //   console.log(event.target.value);
  //   if (event.target.value == "Offer_letter") {
  //     if (this.show_Offer_letter == false) {
  //       this.show_Offer_letter = true;
  //       this.model.Offer_letter = "Offer_letter";
  //     } else {

  //       this.show_Offer_letter = false;
  //     }
  //   }
  //   if (event.target.value == "form_16") {
  //     if (this.show_form_16 == false) {
  //       this.show_form_16 = true;
  //       this.model.form_16 = "form_16";
  //     } else {

  //       this.show_form_16 = false;
  //     }
  //   }
  //   if (event.target.value == "relieving_letter") {
  //     if (this.show_relieving_letter == false) {
  //       this.show_relieving_letter = true
  //       this.model.relieving_letter = "relieving_letter"
  //     } else {

  //       this.show_relieving_letter = false
  //     }
  //   }
  // }

  // cancelUploding(documentsName) {
  //   // jQuery('#panInput').removeClass('loadinggif');
  //   // this.isDigiRemove = true;
  //   // console.log("removing file", event);
  //   // this.doc_erroe = false;
  //   // jQuery("div.share_fm_dl_sm span").remove();
  //   // if (documentsName == "addressProof") {
  //   //   this.oaoService.removeUploadedFile(this.uploadingFileName1, this.docType1).subscribe(res => {
  //   //     console.log(res);
  //   //   });
  //   //   this.uploadingFileName1 = "File_" + Date.now() + (Math.floor((Math.random() * 100))) + '.jpg';
  //   // }

  //   jQuery("div.share_fm_dl_sm span").remove();
  //   this.isDigiRemove = true;
  //   this.oaoService.removeUploadedFile(this.uploadingFileName1, this.docType1).subscribe(res => {
  //     if (!res.error) {
  //       this.hideDropBox = false;
  //       jQuery("#addAnotherDoc2").css('display', 'none');
  //       this.isDigilockerFetching = false;
  //       this.hideDropBox = false;
  //       this.hideDigilocker = false;
  //       this.chRef.detectChanges();
  //     }
  //     console.log(res);
  //   });
  //   this.uploadingFileName1 = "File_" + Date.now() + (Math.floor((Math.random() * 100))) + '.jpg';
  // }

  // // removeFile($event) {
  // //     if (this.isRouteChange) {
  // //         return;
  // //     }
  // //     this.oaoService.removeUploadedFile(this.uploadingFileName, this.docType).subscribe(res => {
  // //         console.log(res);
  // //     })
  // //     jQuery("#closeAddrDropBox").css('display', '');
  // // }

  ngOnDestroy() {
    this.emitter.unsubscribe();
    //   window.removeEventListener("message", this.digilockerListener, false);
    //   jQuery('#dlshare').remove();
    //   this.langSubscription.unsubscribe();
  }

  // private digilockerListener = function (event) {

  //   window.removeEventListener("message", this.digilockerListener, false);
  //   if (event.origin != 'https://devservices.digitallocker.gov.in') {
  //     return;
  //   }
  //   console.log(event);
  //   this.isDigilockerFetching = true;
  //   this.hideDigilocker = true;
  //   this.isManualUpload = false;
  //   jQuery("div.share_fm_dl_sm span").remove();
  //   this.chRef.detectChanges();

  //   var data = JSON.parse(event.data);
  //   let fileExt = data.filename.split('.')[1];
  //   data.filename = "File_" + Date.now() + (Math.floor((Math.random() * 100))) + '.' + fileExt;
  //   this.uploadingFileName = data.filename;
  //   data.type = this.docType;
  //   data['application_id'] = this.model.application_id;
  //   this.oaoService.fetchDigilockerDocument(data).subscribe(res => {

  //     console.log("digi fetch response ", res);
  //     console.log("is digi remove", this.isDigiRemove);
  //     if (this.isDigiRemove) {
  //       this.isDigiRemove = false;
  //       return;
  //     }

  //     if (res.error) {
  //       this.uploadmsg = false;
  //       this.doc_erroe = true;
  //       console.log(this.doc_erroe);
  //       this.isDigilockerFetching = false;
  //       this.uploadedFileName = res.filename;
  //       jQuery('#uploaingMsg').attr('hidden', 'true');
  //       this.chRef.detectChanges();
  //       return;
  //     }
  //     if (res.isImage) {
  //       console.log("digilocker pan image response", res);
  //       jQuery(".dz-progress").css('display', 'none');
  //       jQuery('#uploaingMsg').attr('hidden', 'true');
  //       this.model.pan = res.pan;

  //       this.uploadmsg = false;
  //       this.isDigilockerFetching = false;
  //       this.hideDigilocker = false;
  //       this.hideDropBox = true;


  //       this.addrFlagChange.emit(false);

  //       this.uploadedFiles.push(res.filename);
  //       this.isManualUpload = res.isManualUpload;
  //       this.chRef.detectChanges();
  //       // container1.animate({
  //       //     scrollTop1: scrollTo1.offset().top - 300
  //       // }, 300);​
  //       jQuery("#addAnotherDoc2").css('display', '');
  //     }
  //     else {
  //       console.log(res);
  //     }


  //   }
  //   )

  // }.bind(this);

  

  // removeUploadedAddr(file) {
  //   jQuery("div.share_fm_dl_sm span").remove();
  //   this.oaoService.removeUploadedFile(file, this.docType1).subscribe(res => {
  //     this.chRef.detectChanges();
  //     console.log("eno gotilla" + this.upload_success_flag1);
  //     //this.upload_success_flag1 = false;
  //     console.log("eno gotilla length" + this.uploadedFiles1.length);
  //     if (res.message == "File deleted successfully") {
  //       console.log("res1", res.error);
  //       let index = this.uploadedFiles1.indexOf(file);
  //       this.uploadedFiles1.splice(index, 1);

  //       if (this.uploadedFiles1.length == 0) {
  //         this.chRef.detectChanges();
  //         this.upload_success_flag1 = false;
  //         this.chRef.detectChanges();
  //         // this.addrFlag = true;
  //         // this.addrFlagChange.emit(true);
  //         jQuery("#addAnotherDoc2").css('display', '');
  //       }
  //       // this.chRef.detectChanges();
  //     }
  //     console.log(res);
  //   });
  //   this.oaoService.removeUploadedFile(file, this.docType2).subscribe(res => {

  //     if (res.message == "File deleted successfully") {
  //       console.log("res2", res.error);
  //       let index = this.uploadedFiles2.indexOf(file);
  //       this.uploadedFiles2.splice(index, 1);

  //       if (this.uploadedFiles2.length == 0) {
  //         this.chRef.detectChanges();
  //         this.upload_success_flag2 = false;
  //         this.chRef.detectChanges();
  //         // this.addrFlag = true;
  //         // this.addrFlagChange.emit(true);
  //         jQuery("#addAnotherDoc2").css('display', '');
  //       }

  //       this.chRef.detectChanges();

  //     }
  //     console.log(res);
  //   });
  //   this.oaoService.removeUploadedFile(file, this.docType3).subscribe(res => {

  //     if (res.message == "File deleted successfully") {
  //       let index = this.uploadedFiles3.indexOf(file);
  //       this.uploadedFiles3.splice(index, 1);

  //       if (this.uploadedFiles3.length == 0) {
  //         this.upload_success_flag2 = false;
  //         // this.addrFlag = true;
  //         // this.addrFlagChange.emit(true);
  //         jQuery("#addAnotherDoc2").css('display', '');
  //       }

  //       this.chRef.detectChanges();

  //     }
  //     console.log(res);
  //   });
  //   this.oaoService.removeUploadedFile(file, this.docType4).subscribe(res => {

  //     if (res.message == "File deleted successfully") {
  //       let index = this.uploadedFiles4.indexOf(file);
  //       this.uploadedFiles4.splice(index, 1);

  //       if (this.uploadedFiles4.length == 0) {
  //         this.upload_success_flag2 = false;
  //         // this.addrFlag = true;
  //         // this.addrFlagChange.emit(true);
  //         jQuery("#addAnotherDoc2").css('display', '');
  //       }

  //       this.chRef.detectChanges();

  //     }
  //     console.log(res);
  //   });

  //   this.oaoService.removeUploadedFile(file, this.docType5).subscribe(res => {
  //     this.chRef.detectChanges();
  //     // console.log("eno gotilla" + this.upload_success_flag5);
  //     // this.upload_success_flag5 = false;
  //     // console.log("eno gotilla" + this.upload_success_flag5);
  //     if (res.message == "File deleted successfully") {
  //       let index = this.uploadedFiles5.indexOf(file);
  //       this.uploadedFiles5.splice(index, 1);

  //       if (this.uploadedFiles5.length == 0) {
  //         this.upload_success_flag3 = false;
  //         jQuery("#addAnotherDoc2").css('display', '');
  //       }
  //       // this.chRef.detectChanges();
  //     }
  //     console.log(res);
  //   });

  //   this.oaoService.removeUploadedFile(file, this.docType6).subscribe(res => {
  //     this.chRef.detectChanges();
  //     // console.log("eno gotilla" + this.upload_success_flag5);
  //     // this.upload_success_flag5 = false;
  //     // console.log("eno gotilla" + this.upload_success_flag5);
  //     if (res.message == "File deleted successfully") {
  //       let index = this.uploadedFiles6.indexOf(file);
  //       this.uploadedFiles6.splice(index, 1);

  //       if (this.uploadedFiles6.length == 0) {
  //         this.upload_success_flag4 = false;
  //         this.chRef.detectChanges();
  //         jQuery("#addAnotherDoc2").css('display', '');
  //       }
  //       // this.chRef.detectChanges();
  //     }
  //     console.log(res);
  //   });

  //   this.oaoService.removeUploadedFile(file, this.docType7).subscribe(res => {
  //     this.chRef.detectChanges();
  //     // console.log("eno gotilla" + this.upload_success_flag5);
  //     // this.upload_success_flag5 = false;
  //     // console.log("eno gotilla" + this.upload_success_flag5);
  //     if (res.message == "File deleted successfully") {
  //       let index = this.uploadedFiles7.indexOf(file);
  //       this.uploadedFiles7.splice(index, 1);

  //       if (this.uploadedFiles7.length == 0) {
  //         this.upload_success_flag5 = false;
  //         jQuery("#addAnotherDoc2").css('display', '');
  //       }
  //       // this.chRef.detectChanges();
  //     }
  //     console.log(res);
  //   });

  //   this.oaoService.removeUploadedFile(file, this.docType8).subscribe(res => {
  //     this.chRef.detectChanges();
  //     // console.log("eno gotilla" + this.upload_success_flag5);
  //     // this.upload_success_flag5 = false;
  //     // console.log("eno gotilla" + this.upload_success_flag5);
  //     if (res.message == "File deleted successfully") {
  //       let index = this.uploadedFiles8.indexOf(file);
  //       this.uploadedFiles8.splice(index, 1);

  //       if (this.uploadedFiles8.length == 0) {
  //         this.upload_success_flag6 = false;
  //         jQuery("#addAnotherDoc2").css('display', '');
  //       }
  //       // this.chRef.detectChanges();
  //     }
  //     console.log(res);
  //   });

  //   this.oaoService.removeUploadedFile(file, this.docType9).subscribe(res => {
  //     this.chRef.detectChanges();
  //     // console.log("eno gotilla" + this.upload_success_flag5);
  //     // this.upload_success_flag5 = false;
  //     // console.log("eno gotilla" + this.upload_success_flag5);
  //     if (res.message == "File deleted successfully") {
  //       let index = this.uploadedFiles9.indexOf(file);
  //       this.uploadedFiles9.splice(index, 1);

  //       if (this.uploadedFiles9.length == 0) {
  //         this.upload_success_flag7 = false;
  //         jQuery("#addAnotherDoc2").css('display', '');
  //       }
  //       // this.chRef.detectChanges();
  //     }
  //     console.log(res);
  //   });
  // }

  // addAddrProof() {
  //   console.log("inside addAddrProof()");
  //   this.hideDropBox = false;
  //   jQuery("#addAnotherDoc2").css('display', 'none');
  // }

  // removeAddrDropBox(documentType) {
  //   console.log("removing empty drop box");
  //   if (documentType == "addrDoc") {
  //     this.chRef.detectChanges();
  //     this.hideDropBox = true;
  //     this.chRef.detectChanges();
  //     console.log("status", this.hideDropBox)
  //     jQuery("#addAnotherAddrDoc").css('display', '');
  //   }

  //   if (documentType == "offerLetter") {
  //     console.log("offerletter allide");
  //     this.hideDropBox = true;
  //     jQuery("#addAnotherJCOfferLetterDoc").css('display', '');
  //   }

  //   if (documentType == "form16") {
  //     this.hideDropBox = true;
  //     jQuery("#addAnotherJCForm16Doc").css('display', '');
  //   }

  //   if (documentType == "relievingLetter") {
  //     this.hideDropBox = true;
  //     jQuery("#addAnotherJCRelievingLetterDoc").css('display', '');
  //   }

  //   if (documentType == "businessProof") {
  //     this.hideDropBox = true;
  //     jQuery("#addAnotherBusinessProofDoc").css('display', '');
  //   }

  //   if (documentType == "idProof") {
  //     this.hideDropBox = true;
  //     jQuery("#addAnotherIDProofDoc").css('display', '');
  //   }

  //   if (documentType == "bankStmt") {
  //     this.hideDropBox = true;
  //     jQuery("#addAnotherBankStmtDoc").css('display', '');
  //   }
  //   if (documentType == "incomeDoc") {
  //     this.hideDropBox = true;
  //     jQuery("#addAnotherIncomeDoc").css('display', '');
  //   }
  // }


  // panDetails(data, documentsName) {
  //   console.log("data..." + data);
  //   console.log("document name = " + documentsName);
  //   if (documentsName == "addressProof") {
  //     this.chRef.detectChanges();
  //     this.upload_success_flag1 = true;
  //     this.uploadingFileName1 = "File_" + Date.now() + (Math.floor((Math.random() * 100))) + '.jpg';
  //     let filename = data[1].filename;
  //     this.uploadedFiles1.push(filename);
  //     jQuery("#addAnotherDoc2").css('display', '');
  //     this.hideDigilocker = false;
  //     this.hideDropBox = true;
  //     console.log("Inside addressProof...");
  //     // this.chRef.detectChanges();
  //   }
  //   if (documentsName == "job_offerLetter") {
  //     this.chRef.detectChanges();
  //     this.upload_success_flag2 = true;
  //     this.uploadingFileName2 = "File_" + Date.now() + (Math.floor((Math.random() * 100))) + '.jpg';
  //     let filename = data[1].filename;
  //     this.uploadedFiles2.push(filename);
  //     jQuery("#addAnotherDoc2").css('display', '');
  //     this.hideDigilocker = false;
  //     this.hideDropBox = true;
  //     console.log("Inside job...");
  //     this.chRef.detectChanges();
  //   }
  //   if (documentsName == "job_form16") {
  //     this.upload_success_flag2 = true;
  //     this.uploadingFileName2 = "File_" + Date.now() + (Math.floor((Math.random() * 100))) + '.jpg';
  //     let filename = data[1].filename;
  //     this.uploadedFiles3.push(filename);
  //     jQuery("#addAnotherDoc2").css('display', '');
  //     this.hideDigilocker = false;
  //     this.hideDropBox = true;
  //     console.log("Inside job...");
  //     this.chRef.detectChanges();
  //   }
  //   if (documentsName == "job_relievingLetter") {
  //     this.upload_success_flag2 = true;
  //     this.uploadingFileName2 = "File_" + Date.now() + (Math.floor((Math.random() * 100))) + '.jpg';
  //     let filename = data[1].filename;
  //     this.uploadedFiles4.push(filename);
  //     jQuery("#addAnotherDoc2").css('display', '');
  //     this.hideDigilocker = false;
  //     this.hideDropBox = true;
  //     console.log("Inside job...");
  //     this.chRef.detectChanges();
  //   }
  //   if (documentsName == "businessProof") {
  //     this.chRef.detectChanges();
  //     this.upload_success_flag3 = true;
  //     this.uploadingFileName5 = "File_" + Date.now() + (Math.floor((Math.random() * 100))) + '.jpg';
  //     let filename = data[1].filename;
  //     this.uploadedFiles5.push(filename);
  //     jQuery("#addAnotherDoc2").css('display', '');
  //     this.hideDigilocker = false;
  //     this.hideDropBox = true;
  //     console.log("Inside businessProof...");

  //   }
  //   if (documentsName == "idProof") {
  //     this.chRef.detectChanges();
  //     this.upload_success_flag4 = true;
  //     this.uploadingFileName4 = "File_" + Date.now() + (Math.floor((Math.random() * 100))) + '.jpg';
  //     let filename = data[1].filename;
  //     this.uploadedFiles6.push(filename);
  //     jQuery("#addAnotherDoc2").css('display', '');
  //     this.hideDigilocker = false;
  //     this.hideDropBox = true;
  //     console.log("Inside idProof...");

  //     this.chRef.detectChanges();
  //   }
  //   if (documentsName == "bankStmt") {
  //     this.chRef.detectChanges();
  //     this.upload_success_flag5 = true;
  //     this.chRef.detectChanges();
  //     this.uploadingFileName5 = "File_" + Date.now() + (Math.floor((Math.random() * 100))) + '.jpg';
  //     let filename = data[1].filename;
  //     this.uploadedFiles7.push(filename);
  //     jQuery("#addAnotherDoc2").css('display', '');
  //     this.hideDigilocker = false;
  //     this.hideDropBox = true;
  //     console.log("Inside bankStmt...");

  //   }
  //   if (documentsName == "incomeDoc") {
  //     this.chRef.detectChanges();
  //     this.upload_success_flag6 = true;
  //     this.uploadingFileName6 = "File_" + Date.now() + (Math.floor((Math.random() * 100))) + '.jpg';
  //     let filename = data[1].filename;
  //     this.uploadedFiles8.push(filename);
  //     jQuery("#addAnotherDoc2").css('display', '');
  //     this.hideDigilocker = false;
  //     this.hideDropBox = true;
  //     console.log("Inside incomeDoc...");
  //     this.upload_success_flag6 = true;
  //     this.chRef.detectChanges();
  //   }
  //   if (documentsName == "vhlPan") {
  //     this.chRef.detectChanges();
  //     this.upload_success_flag7 = true;
  //     this.uploadingFileName7 = "File_" + Date.now() + (Math.floor((Math.random() * 100))) + '.jpg';
  //     let filename = data[1].filename;
  //     this.uploadedFiles9.push(filename);
  //     jQuery("#addAnotherDoc2").css('display', '');
  //     this.hideDigilocker = false;
  //     this.hideDropBoxPan = true;
  //     console.log("Inside vhlPan...");
  //     this.upload_success_flag7 = true;
  //     this.chRef.detectChanges();
  //   }
  //   var res = data[1];
  //   console.log("Date" + data);
  //   console.log("errrooorrr" + res.error)
  //   if (!res.error) {
  //     console.log(data);
  //     jQuery(".dz-progress").css('display', 'none');
  //     jQuery('#uploaingMsg').attr('hidden', 'true');
  //     this.uploadmsg = false;
  //     this.panFlag = false;
  //     // this.uploadedFileName = res.filename;
  //     this.chRef.detectChanges();
  //   } else {
  //     // this.upload_success_flag1 = false;
  //     jQuery('#panInput').removeClass('loadinggif');
  //     this.uploadmsg = false;
  //     this.doc_erroe = true;
  //     console.log(this.model.pan);
  //     console.log(this.doc_erroe);
  //     // this.uploadedFileName = res.filename;
  //     jQuery('#uploaingMsg').attr('hidden', 'true');
  //     this.chRef.detectChanges();
  //   }
  // }

  // ngAfterViewChecked() {
  //   setTimeout(() => {
  //     jQuery('a#attachment_poi').removeAttr('href');
  //     jQuery('.page-content-info').css('opacity', '1');
  //     jQuery('#pageLoadingPanel').hide();
  //   }, 350)

  // }

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

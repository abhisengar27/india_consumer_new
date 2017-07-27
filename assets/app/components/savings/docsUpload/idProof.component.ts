import { Component, OnInit, AfterViewInit, AfterViewChecked, OnDestroy, 
        ElementRef, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";

import { PersonalDetailsObject } from "../../../interfaces/personalDetails.interface";
import { UserDetailsObject } from "../../../interfaces/userDetails.interface";
import { OAOService } from "../../../services/OAO.Service";
import {TranslateService} from '@ngx-translate/core';

declare var jQuery: any;
@Component({
  selector: 'id-proof',
  templateUrl: './idProof.component.html'
})
export class IDProof implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy{

  private baseUrl:String = '';
  private idFlag:boolean = true;
  private uploadIdMsg = 'Click or drag image here to upload ID proof';
  private digilockerConfig;
  private isManualUpload: boolean = true;
  private isDigilockerFetching: boolean = false;
  private uploadedFiles: string[] = [];
  private hideDropBox: boolean = false;
  private hideDigilocker: boolean = false;
  private isDigiRemove: boolean = false;
  private uploadingFileName = "File_"+Date.now()+(Math.floor((Math.random()*100)))+'.jpg';
  private uploadedFileName:string;
  private langSubscription;
  private docType: string = 'ID_PROOF';
  @Input('isRouteChange')
  isRouteChange:boolean= false;
  @Output()
  idFlagChange = new  EventEmitter<boolean>();
  private config:any;
 
        

   

  private model:PersonalDetailsObject  = new PersonalDetailsObject('', '', '', '', '', '', '');

    constructor(private oaoService: OAOService, private router: Router, private route: ActivatedRoute, 
    private translate: TranslateService, private elementRef: ElementRef, private chRef: ChangeDetectorRef){

        this.digilockerConfig = this.oaoService.getDigiLockerConfig();
        this.model = this.oaoService.getPersonalDetailsObject();
        this.oaoService.getAttachmentsByDocType(this.docType).subscribe(res => {
            if(!res.error && res.data.length >0){
              this.uploadedFiles = res.data;
              this.hideDropBox = true;
              jQuery("#addAnotherDoc1").css('display','');
              this.idFlagChange.emit(false);
              
            }
        })
        this.oaoService.getAttachmentsByDocType('AADHAAR').subscribe(res => {
          console.log('inside getting aadhaar doc', res);
            if(!res.error){
              this.model.uploadLocation = {};
              this.model.uploadLocation['aadhaar'] = res.data[0];
              this.hideDropBox = true;
              jQuery("#addAnotherDoc1").css('display','');
              this.idFlagChange.emit(false);
              console.log('aadhar model',this.model)
              
            }
        })
        this.config = {
        thumbnailHeight:70,
        url:"/getdetails/doc",
        headers: {"application_id" : this.model.application_id, doc_type: this.docType},
        autoReset:'0',
        renameFilename: () => this.uploadingFileName,
        previewTemplate:`<div class="dz-preview dz-file-preview" style="padding:0px !important;">
                      <a href="javascript:void(0);" title="Change uploaded file" style="z-index:50;position:absolute;right:1%;top:5%;" data-dz-remove ><span class="glyphicon glyphicon-edit"></span></a>
                        <div class="dz-image" style="width:110% !important;"><img data-dz-thumbnail /></div>
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

  
       
        this.baseUrl = oaoService.getBaseUrl();

        translate.get('UPLOAD_DOCS.UPLOAD_ID_MSG').subscribe(res=>{
          this.uploadIdMsg = res;
        })

        if(this.model.is_aadhaar && this.model.uploadLocation && this.model.uploadLocation.aadhaar != undefined ){
           console.log('inside model aadhaar',this.model.uploadLocation);
          this.hideDropBox = true;
          this.idFlag = false;
        
          
        }

        
        
    }

    ngOnInit() {
      this.langSubscription = this.oaoService.changelangEvent.subscribe(lang => {
          
           this.translate.get('UPLOAD_DOCS.UPLOAD_ID_MSG').subscribe(res=>{
          this.uploadIdMsg = res;
        })

      });
      
    }


    addDoc1(){
      this.hideDropBox = false;
      jQuery("#addAnotherDoc1").css('display','none');
    }
    

    successUpload = function(data){
      this.uploadingFileName= "File_"+Date.now()+(Math.floor((Math.random()*100)))+'.jpg';
      console.log("success upload");
      console.log(data[1].filename);
      let filename = data[1].filename;
      this.uploadedFiles.push(filename);
      //jQuery("#closeDropBox").css('display','');
      jQuery("#addAnotherDoc1").css('display','');
      this.hideDigilocker = false;
      this.idFlag = false;
      this.hideDropBox = true;
      //let src = this.baseUrl+'/'+filename;
      // jQuery('html, body').animate({ scrollTop:  150 }, 50);
      // jQuery('html, body').animate({ scrollTop:  140 }, 1);
      jQuery("#closeIdDropBox").css('display','');
      this.idFlagChange.emit(false);
      // var container = jQuery('body'),
      //     scrollTo = jQuery('#addAnotherDoc2');
      //     container.animate({
      //         scrollTop: scrollTo.offset().top - 300
      //     }, 300);​

      this.chRef.detectChanges();

    }.bind(this);


    removeIDDropBox(){
      this.hideDropBox = true;
      jQuery("#addAnotherDoc1").css('display','');
    }


    fileAdded(){

      jQuery("#closeIdDropBox").css('display','none');
      this.hideDigilocker = true;


    }

    removeFile($event){
      if(this.isRouteChange){
        return ;
      }
      this.oaoService.removeUploadedFile(this.uploadingFileName, this.docType).subscribe(res => {
        console.log(res);
      })
      jQuery("#closeIdDropBox").css('display','');
    }


    removeUploadedId(file){


        jQuery("div.share_fm_dl_sm span").remove();
        this.oaoService.removeUploadedFile(file, this.docType).subscribe(res => {

                if(!res.error){
                    let index = this.uploadedFiles.indexOf(file);
                    this.uploadedFiles.splice(index, 1);

                     if(this.uploadedFiles.length ==0 && (this.model.uploadLocation == undefined || this.model.uploadLocation.aadhaar == undefined)){
                         this.idFlag = true;
                         this.idFlagChange.emit(true);
                        }

                         this.chRef.detectChanges();
                        

                }
              console.log(res);
        });
     
      
    }

    
    digilockerListener = function(event){

           window.removeEventListener("message",this.digilockerListener , false);

          if(event.origin != 'https://devservices.digitallocker.gov.in'){
            return;
          }
          console.log('aadhaar info', event);
          jQuery("div.share_fm_dl_sm span").remove();
       
          this.isDigilockerFetching = true;
          this.hideDigilocker = true;
          this.isManualUpload = false;
          this.chRef.detectChanges();
         
          var data = JSON.parse(event.data);
          let fileExt = data.filename.split('.')[1];
          data.filename = "File_"+Date.now()+(Math.floor((Math.random()*100)))+'.'+fileExt;
          this.uploadingFileName = data.filename;
          data.type = this.docType;
          data['application_id'] = this.model.application_id;
           this.oaoService.fetchDigilockerDocument(data).subscribe(res=>{

             if(this.isDigiRemove){
                    this.isDigiRemove = false;
                    return;
                  }
                  if(res.isImage){
                      console.log("Document details ", res);
                      this.isDigilockerFetching = false;
                      this.hideDigilocker = false;
                      this.hideDropBox = true;
                      
                      this.idFlagChange.emit(false);

                          this.uploadedFiles.push(res.filename);
                          this.isManualUpload = res.isManualUpload;
                           
                           this.chRef.detectChanges(); 
                          
                            jQuery("#addAnotherDoc1").css('display','');
                  }
                  else{
                    console.log(res);
                  }
                

          }
          )
    
         
        }.bind(this);

    ngAfterViewInit() {
       if(!this.hideDropBox || this.model.uploadLocation==undefined || this.model.uploadLocation.aadhaar == undefined || !this.model.is_aadhaar){
         
         jQuery("#addAnotherDoc1").css('display','none');
       }

        var s = document.createElement("script");
          s.setAttribute('type','text/javascript');
          s.setAttribute('id','dlshare');
          s.setAttribute('src',this.digilockerConfig.url);
          s.setAttribute('data-app-id',this.digilockerConfig.appId);
          s.setAttribute('data-app-hash',this.digilockerConfig.appHash);
          s.setAttribute('time-stamp',this.digilockerConfig.timeStamp);
          s.setAttribute('data-callback','DigiResUploadDocs');
          this.elementRef.nativeElement.appendChild(s);

        
     
    }

    ngAfterViewChecked() {
     
     jQuery('#idProofDigilocker a#attachment_poi').removeAttr('href');
     
     jQuery('#idProofDigilocker a#attachment_poi').click( () => {

     window.addEventListener("message",this.digilockerListener , false);

     })

    }

    cancelUploding(){
      this.isDigiRemove = true;
       jQuery("div.share_fm_dl_sm span").remove();
        this.oaoService.removeUploadedFile(this.uploadingFileName, this.docType).subscribe(res => {


                if(!res.error){
                        this.hideDropBox = false;
                         jQuery("#addAnotherDoc1").css('display','none');
                         this.isDigilockerFetching = false;
                         this.hideDropBox = false;
                         this.hideDigilocker = false;

                         this.chRef.detectChanges();
                        

                }
              console.log(res);
        });
        this.uploadingFileName ="File_"+Date.now()+(Math.floor((Math.random()*100)))+'.jpg';
    }

    ngOnDestroy() {
      
       window.removeEventListener("message",this.digilockerListener , false);
       this.langSubscription.unsubscribe();
    }
  
}

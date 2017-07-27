import { Component, OnInit, AfterViewInit, OnDestroy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";

import { PersonalDetailsObject } from "../../../interfaces/personalDetails.interface";
import { UserDetailsObject } from "../../../interfaces/userDetails.interface";
import { OAOService } from "../../../services/OAO.Service";
import {TranslateService} from '@ngx-translate/core';

declare var jQuery: any;
@Component({
  selector: 'docs-upload',
  templateUrl: './docsUpload.component.html'
})
export class DocumentsUpload implements AfterViewInit, OnDestroy{

  private forwardProgressDataBNA = ['completed','completed','completed','active','Y','N'];
  private backwardProgressDataBNA = ['completed','active','','','N','Y'];
  
  private forwardProgressDataSAL1 = ['completed','completed','completed','completed','active','Y','N'];
  private backwardProgressDataSAL1 = ['completed','completed','active','','','N','Y'];

  inf_003:string;
  private baseUrl:String = '';
  private addrFlag:boolean =true;
  private idFlag:boolean = true;
  private uploadIdMsg = 'Click or drag image here to upload ID proof';
  private uploadAddrMsg = 'Click or drag image here to upload address proof';
  private langSubscription;
  private isRouteChange: boolean = false;
  


  private model:PersonalDetailsObject  = new PersonalDetailsObject('', '', '', '', '', '', '');

    constructor(private oaoService: OAOService, private router: Router, private route: ActivatedRoute, 
    private translate: TranslateService, private chRef: ChangeDetectorRef){
        this.model = this.oaoService.getPersonalDetailsObject();
        

        this.oaoService.GetPropertyDetails('INFO_MESSAGE', 'INF_003')
            .subscribe(
            data => {
                this.inf_003 = data.result[0].property_value;
            }
            );

            if(this.model.is_aadhaar && this.model.uploadLocation && this.model.uploadLocation.aadhaar != undefined ){
         
               this.idFlag = false;
          
           }
      
        
    }

    ngOnInit() {

        if(this.oaoService.getResumeFlag()){
            this.oaoService.setProgressBardata(this.oaoService.getPro_bar());
            this.oaoService.setProgressBardata(this.oaoService.getPro_bar());
            this.oaoService.setProgressBardata(this.oaoService.getPro_bar());
            this.oaoService.setResumeFlag(false);
        }
     this.langSubscription = this.oaoService.changelangEvent.subscribe(lang => {
          
         this.translate.get('UPLOAD_DOCS.UPLOAD_ID_MSG').subscribe(res=>{
          this.uploadIdMsg = res;
        })
        this.translate.get('UPLOAD_DOCS.UPLOAD_ADDRESS_MSG').subscribe(res=>{
          this.uploadAddrMsg = res;
        })

      });

     

      
    }

    
    onProceed(){
      //this.oaoService.setProgressBardata(this.forwardProgressDataBNA);
      //this.router.navigate(['../passwordSetup'], {relativeTo:this.route});
      switch(this.model.product_code){
          case 'BNA': this.model.skip = true;
                      this.oaoService.OAOCreateOrUpdateApplicant(this.model).subscribe(res =>{
                      console.log(res);
                      console.log("popup");
                      jQuery('#success').modal('show');
                      })
                      break;
             case 'SAL1': this.model.skip = true;
                      this.oaoService.OAOCreateOrUpdateSalaryApplicant(this.model).subscribe(res =>{
                      jQuery('#success').modal('show');
                      })
                      break;
          default: console.log('no product code match found ', this.model);
          }

      

    }

    moveForward(){

      switch(this.model.product_code){
        case "BNA": 
                    this.oaoService.setProgressBardata(this.forwardProgressDataBNA);
                    this.router.navigate(['../passwordSetup', ], { relativeTo: this.route });                    
                    break;
       case "SAL1": 
                    this.oaoService.setProgressBardata(this.forwardProgressDataSAL1);
                    this.router.navigate(['../passwordSetup', ], { relativeTo: this.route });
                      break;
       default :    console.log('product code did not match', this.model);
      }
      
      this.isRouteChange = true;
     
    }

    moveBack(){

      switch(this.model.product_code){
        case "BNA": 
                    this.oaoService.updatesection("section_2", this.model.application_id).subscribe(
                          data => {
                              console.log("updated");
                              this.oaoService.setProgressBardata(this.backwardProgressDataBNA);
                              this.router.navigate(['../panInfo'], {relativeTo : this.route});
                          }
                      );
                      break;
                        case "SAL1": 
                     this.oaoService.updatesection("section_2", this.model.application_id).subscribe(
                        data => {
                              console.log("updated");
                              this.oaoService.setProgressBardata(this.backwardProgressDataSAL1);
                              this.router.navigate(['../panInfo'], {relativeTo : this.route});
                           }
                       );
              break;
       default :    console.log('product code did not match', this.model);
      }
      
    }

    

    

    ngAfterViewInit() {
      
      
    }


    changeIdFlag(event){
      console.log("id flag change", event);
      this.idFlag = event;
      this.chRef.detectChanges();

    }

    changeAddrFlag(event){
      console.log("address flag change", event);
      this.addrFlag = event;
      this.chRef.detectChanges();
    }

    clear(){
      this.isRouteChange = true;
     // this.router.navigate(['/home'])
      window.location.href=this.oaoService.getBaseUrl();
    }

    ngOnDestroy() {

      this.langSubscription.unsubscribe();
      
    }
  
}

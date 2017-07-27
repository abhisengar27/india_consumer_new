import { Component ,AfterViewInit,OnInit} from '@angular/core';
import {Router} from '@angular/router'

import { PersonalDetailsObject } from "../../interfaces/personalDetails.interface";
import { UserDetailsObject } from "../../interfaces/userDetails.interface";
import { OAOService } from "../../services/OAO.Service"

declare var jQuery:any;
declare var Ladda
@Component({
    selector: 'passwordSet',
    templateUrl: './passwordSetup.component.html'
    
})
export class PasswordSetupComponent{
       
        private check:boolean=false;

        userDetailsObject = new UserDetailsObject('','');

        model = new PersonalDetailsObject('', '', '', '', '', '', '');

        pwd;
        rpwd;
        status;
    constructor(private oaoService: OAOService,private router:Router){
        console.log("PasswordSetupComponent  constructor()")
                this.model=this.oaoService.getPersonalDetailsObject();
                console.log(this.oaoService.getPersonalDetailsObject())
    }
    onSubmit(){

        if(this.pwd==this.rpwd)
        {
             this.userDetailsObject.password =this.pwd;
             this.oaoService.registerInternetBanking(this.userDetailsObject).subscribe(
                data => {

                    this.status=data;


                });
           // jQuery('#success-modal').modal('show'); //chandan
        }
    }

    onKeyUp()
    {
        console.log("onKeyUp");

          if(this.pwd==this.rpwd)
        {
            console.log("pwd==rpwd");
             jQuery('#continue').prop('disabled', false);
             jQuery('#rpwd').css('border-color', 'green');
        }else{
            jQuery('#rpwd').css('border-color', 'red');
            jQuery('#continue').prop('disabled', true);
        }

    }

   changeLoginFlag()
  {
      this.oaoService.setLoginFlag(false);

  }

  ngOnInit()
  {
        if(this.oaoService.getResumeFlag()){
            this.oaoService.setProgressBardata(this.oaoService.getPro_bar());
            this.oaoService.setProgressBardata(this.oaoService.getPro_bar());
            this.oaoService.setProgressBardata(this.oaoService.getPro_bar());
            this.oaoService.setProgressBardata(this.oaoService.getPro_bar());
            this.oaoService.setResumeFlag(false);
        }
       this.oaoService.setLoginFlag(false);
       jQuery('#continue').prop('disabled', true);
       this.oaoService.GetApplicantsDetail(this.model.application_id).subscribe(
            data => {
                console.log(data);
                this.userDetailsObject.userId = data.result[0].core_customer_id;
                this.userDetailsObject.userName = data.result[0].core_customer_id;
                this.userDetailsObject.title = data.result[0].title;
                this.userDetailsObject.fName = data.result[0].fname;
                this.userDetailsObject.mName = data.result[0].mname;
                this.userDetailsObject.lName = data.result[0].lname;
                this.userDetailsObject.dob = data.result[0].dob;
                this.userDetailsObject.age=this.getAge((data.result[0].dob)).toString();
                this.userDetailsObject.email = data.result[0].email;
                this.userDetailsObject.mobile = data.result[0].mobile;
                this.userDetailsObject.TFN = data.result[0].tfn
                this.userDetailsObject.exemptionReason = data.result[0].exemption;
                this.userDetailsObject.homeAddress= data.result[0].address;
                this.userDetailsObject.postalAddress= data.result[0].paddress;
            });  
  }
    

    reload(){
         window.location.href=this.oaoService.getBaseUrl();
    }

    getAge(dateString) {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
}
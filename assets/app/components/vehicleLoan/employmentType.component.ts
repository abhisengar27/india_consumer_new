import { Component, ElementRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { VehicleLoanDetails } from "../../interfaces/vehicleLoanDetails.interface";
import { PersonalDetailsObject } from "../../interfaces/personalDetails.interface";
import { UserDetailsObject } from "../../interfaces/userDetails.interface";
import { OAOService } from "../../services/OAO.Service";
import{Common} from "../../validators/commonFunc";
import {checkbox} from './../../interfaces/checkboxinterface';

declare var jQuery: any;
@Component({
    selector: 'employer-details',
    templateUrl: './employmentType.component.html'
})
export class EmploymentType  implements OnInit{
    model1 = new VehicleLoanDetails();
    private model: PersonalDetailsObject = new PersonalDetailsObject('', '', '', '', '', '', '');
    disable_btn_flag:boolean;
    public query = '';
    public emplyers = [];
    public modal1 = new checkbox(false,false);

    public employerstype:any;
    private backwardProgressDataSAL = ['','','','','N','Y'];
    public filteredList = [];
    public elementRef;
    public upsel_flag:boolean;

    constructor(myElement: ElementRef, private oaoService: OAOService, private router: Router, private route: ActivatedRoute) {
        console.log("EmployerDetailsComponent constructor()")
        this.model = this.oaoService.getPersonalDetailsObject();
        this.elementRef = myElement;
        this.model1= this.oaoService.getVehicleLoanObject();
        console.log(this.model1);
        console.log(this.model1.employertype)
        if(this.model1.employertype=='' || this.model1.employertype===undefined){
            this.model1.employertype='0'
                  }
    }

    




 
    clear()
    {
         Common.completedProgressBarStep(0);
         Common.activeProgressBarStep(1);
       //  this.oaoService.setProgressBardata(this.backwardProgressDataSAL);
            this.router.navigate(['../selectVehicle'], {relativeTo: this.route});
       
        //this.oaoService.setUserExistingFlag(false);
    }

    onSubmit(){
        console.log("onsubmit()")
        this.oaoService.setVehicleLoanObject(this.model1);
        console.log("employertype"+this.model1.employertype);
        if(this.model1.employertype=="Salaried"){
        // console.log(this.query)
        // this.model.employer=this.query;
        // this.oaoService.setPersonalDetailsObject(this.model);
        this.router.navigate(['../employerDetailsForLoan'], {relativeTo: this.route});
        }else if(this.model1.employertype=="Self Employment Business"){
            this.router.navigate(['../selfemploymentbusiness'], {relativeTo: this.route});
        }
        else if(this.model1.employertype=="Self Employment Professional"){
             console.log(this.model1.employertype);
             this.router.navigate(['../selfemploymentprofessional'], {relativeTo: this.route});
        }
        else{
             console.log(this.model1.employertype);
        }

    }

    ngOnInit(){
         this.getEmploymentType();
         Common.activeProgressBarStep(2);
    }

    getEmploymentType(){ 
        console.log("getEmploymentType()")
        this.oaoService.getEmploymentType()
            .subscribe(data =>{
                this.employerstype=data.result;
                for(var i=0;i<this.employerstype.length;i++){
                    console.log(this.employerstype[i].employment_type);
                     this.emplyers.push(this.employerstype[i].employment_type);
                    
                }
                 console.log("employer list:"+this.emplyers);
             });
    }

}

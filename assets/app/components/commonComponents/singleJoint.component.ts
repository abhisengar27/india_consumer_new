import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { PersonalDetailsObject } from "../../interfaces/personalDetails.interface";
import { VehicleLoanDetails } from "../../interfaces/vehicleLoanDetails.interface";
import { OAOService } from "../../services/OAO.Service";
import{Common} from "../../validators/commonFunc";
import {TranslateService} from '@ngx-translate/core';


declare var jQuery: any;
@Component({
  selector: 'single-joint',
  templateUrl: './singleJoint.component.html'
})
export class SingleJointComponent {
public model1 = new VehicleLoanDetails();
    model = new PersonalDetailsObject('', '', '', '', '', '', '');
    private forwardProgressDataVL1 = ['active', '','', '','','', 'Y', 'N'];
   name:string;
  public VechaleLoan: boolean = true;
  public savingsORsalary: boolean = true;
  public query = '';
  public city = [];
  public selectCity: any;
  public filteredList = [];
  public upsel_flag:boolean;
  public disable_btn_flag:boolean;
   constructor(private oaoService: OAOService,private router: Router, private route : ActivatedRoute,
    private translate: TranslateService)
    {
        console.log("SingleJointComponent constructor()");
        this.model=this.oaoService.getPersonalDetailsObject();
this.model1 = this.oaoService.getVehicleLoanObject();
    console.log(this.model1);
        translate.use(this.oaoService.getLang());
        console.log(this.model);
   if (this.model.product_code == "VL1") {
      this.VechaleLoan = false;
    } else {
      this.savingsORsalary = false;
    }
        
        if( this.model.fname!=""){
           this.name="Hi.."+this.model.fname;
        }

    }
    

  setSingleOrJoint(single_joint: string) 
  {
    
    this.model.singleORjoint=single_joint;
    this.oaoService.setPersonalDetailsObject(this.model);
    console.log(this.oaoService.getPersonalDetailsObject());
 
    if (this.model.product_code == 'SAL1') {
      this.router.navigate(["../employer"], { relativeTo: this.route });
    } 
    else{
      this.router.navigate(["../aadharCheck"], { relativeTo: this.route });
    } 
  }

    loanType(vehicleLoan:string){
      console.log("loanType()")
      this.model1.vehicleLoanType=vehicleLoan;
      this.oaoService.setVehicleLoanObject(this.model1);
      console.log(this.model1.vehicleLoanType);
       this.router.navigate(["../selectCity"], { relativeTo: this.route });
  }

    ngOnInit(){
        if(this.model.product_code=="VL1"){
        Common.activeProgressBarStep(1);
        }
    }

}

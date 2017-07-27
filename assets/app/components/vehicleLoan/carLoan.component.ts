import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { VehicleLoanDetails } from "../../interfaces/vehicleLoanDetails.interface";
import { PersonalDetailsObject } from "../../interfaces/personalDetails.interface";
import { UserDetailsObject } from "../../interfaces/userDetails.interface";
import { OAOService } from "../../services/OAO.Service";


declare var jQuery: any;
@Component({
  selector: 'car-loan',
  templateUrl: './carLoan.component.html'
})
export class CarLoanComponent implements OnInit {
 model1 = new VehicleLoanDetails();
 private forwardProgressDataVL1 = ['active', '','', '','','', 'Y', 'N'];
  private model:PersonalDetailsObject  = new PersonalDetailsObject('', '', '', '', '', '', '');
    constructor( private oaoService: OAOService, private router: Router, private route: ActivatedRoute){
       this.model1= this.oaoService.getVehicleLoanObject();
        console.log(this.model1);
    }
  loanType(vehicleLoan:string){

      console.log("loanType()")
      this.model1.vehicleLoanType=vehicleLoan;
      this.oaoService.setVehicleLoanObject(this.model1);
      console.log(this.model1.vehicleLoanType);
      this.oaoService.setProgressBardata(this.forwardProgressDataVL1);
      this.router.navigate(['/completeInformation']);
  }

    ngOnInit() {
    }
}

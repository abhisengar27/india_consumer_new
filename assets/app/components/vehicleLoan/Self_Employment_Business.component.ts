import { Component, ElementRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { VehicleLoanDetails } from "../../interfaces/vehicleLoanDetails.interface";
import { PersonalDetailsObject } from "../../interfaces/personalDetails.interface";
import { UserDetailsObject } from "../../interfaces/userDetails.interface";
import { OAOService } from "../../services/OAO.Service";
import { checkbox } from './../../interfaces/checkboxinterface';

declare var jQuery: any;
@Component({
    selector: 'Self_Employment_Business-details',
    templateUrl: './Self_Employment_Business.component.html'
})
export class SelfEmploymentBusinessComponent implements OnInit {
    model1 = new VehicleLoanDetails();
    private model: PersonalDetailsObject = new PersonalDetailsObject('', '', '', '', '', '', '');
    private forwardProgressDataSAL = ['active', '', '', '', 'Y', 'N'];
    disable_btn_flag: boolean;
    public query = '';
    public emplyers = [];
    public modal1 = new checkbox(false, false);

    public employersDetails: any;
    private backwardProgressDataSAL = ['', '', '', '', 'N', 'Y'];
    public filteredList = [];
    public elementRef;
    public upsel_flag: boolean;
    public work_experience: number;
    public noMonths: boolean = false;

    constructor(myElement: ElementRef, private oaoService: OAOService, private router: Router, private route: ActivatedRoute) {
        console.log("EmployerDetailsComponent constructor()")
        this.model = this.oaoService.getPersonalDetailsObject();
        this.elementRef = myElement;
        this.model1 = this.oaoService.getVehicleLoanObject();
        console.log(this.model1);
    }



    select(item) {
        console.log("netincome")
        this.query = item;
        console.log(this.query);
        this.model1.employer = this.query;
        console.log(this.model1.employer);
        console.log(this.model1.netIncome);
        this.disable_btn_flag = true;
        this.filteredList = [];
    }


    clear() {
        this.oaoService.setProgressBardata(this.backwardProgressDataSAL);
        this.router.navigate(['../employmentType'], { relativeTo: this.route });

        //this.oaoService.setUserExistingFlag(false);
    }

    change() {
        console.log("on change of Work_experience" + this.model1.Work_experience);
        var work_experience = parseInt(this.model1.Work_experience.substr(1, 2));
        console.log(work_experience);
        if (work_experience < 5) {
            console.log("less then 5")
            this.noMonths = true;

        }
        else {
            this.noMonths = false;
            console.log("> 5")
        }
    }

    onSubmit() {
        console.log("onsubmit()")
        this.model1.threeYearsIncome = (3 * (parseInt(this.model1.netIncome)));
        this.model1.onroadprice_85 = ((this.model.max_allowed_percent / 100) * (parseInt(this.model1.vehicle_onroad_price)))
        console.log("three years income" + this.model1.threeYearsIncome);
        console.log("85% of x_price:" + this.model1.onroadprice_85);
        this.model1.loan_eligible_amount = Math.min(this.model1.threeYearsIncome, this.model1.onroadprice_85, this.model.max_permissible_amount);
        console.log(this.model1.loan_eligible_amount);
        this.oaoService.setVehicleLoanObject(this.model1);
        // console.log(this.query)
        // this.model.employer=this.query;
        // this.oaoService.setPersonalDetailsObject(this.model);
        this.router.navigate(['../emicalculater'], { relativeTo: this.route });
    }

    ngOnInit() {
        this.getEmployersDetails();

    }

    getEmployersDetails() {
        console.log("getEmployersDetails()")
        this.oaoService.getEmployersDetails()
            .subscribe(data => {
                this.employersDetails = data.result;
                for (var i = 0; i < this.employersDetails.length; i++) {
                    console.log(this.employersDetails[i].employer_name);
                    this.emplyers.push(this.employersDetails[i].employer_name);
                }
            });
    }

}

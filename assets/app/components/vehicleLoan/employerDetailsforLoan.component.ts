import { Component, ElementRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { VehicleLoanDetails } from "../../interfaces/vehicleLoanDetails.interface";
import { PersonalDetailsObject } from "../../interfaces/personalDetails.interface";
import { UserDetailsObject } from "../../interfaces/userDetails.interface";
import { OAOService } from "../../services/OAO.Service";
import { NetIncomevalidator } from "../../validators/netIncomevalidator";
import { checkbox } from './../../interfaces/checkboxinterface';

declare var jQuery: any;
@Component({
    selector: 'employer-details',
    templateUrl: './employerDetailsForLoan.component.html'
})
export class EmployerDetailsForLoanComponent implements OnInit {
    model1 = new VehicleLoanDetails();
    private model: PersonalDetailsObject = new PersonalDetailsObject('', '', '', '', '', '', '');
    private forwardProgressDataSAL = ['active', '', '', '', 'Y', 'N'];
    disable_btn_flag: boolean;
    public query = '';
    public emplyers = [];
    public modal1 = new checkbox(false, false);
    public income: string;
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
        this.query=this.model1.employer;
          if(this.model1.employer=='' || this.model1.employer==null || this.model1.employer==undefined){
                  this.disable_btn_flag = false;
          }else{
               this.disable_btn_flag = true;
          }
    }



    filter() {
        this.disable_btn_flag = false;
        if (this.query !== "") {
            this.filteredList = this.emplyers.filter(function (el) {
                return el.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
            }.bind(this));
            if (this.filteredList.length < 1) {
                console.log(this.query);
               this.model1.employer = this.query;
                console.log("your employer not yet tie up with us but still u can open a saving account ");
                this.upsel_flag = true;
            }
            else {
                this.upsel_flag = false;
            }

        } else {
            this.filteredList = [];
            this.disable_btn_flag = false;
            this.upsel_flag = false;
        }
    }

    select(item) {
        this.query = item;
        console.log(this.query);
        this.model1.employer = this.query;
        console.log(this.model1.employer);
        this.disable_btn_flag = true;
        this.filteredList = [];
    }

    AmountFormatter(amountvalue: any, var_v: any) {
        if (amountvalue != undefined && amountvalue != null && amountvalue != '') {
            this.income = amountvalue;
            console.log("asd " + amountvalue + " " + var_v)
            var formatter = new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                minimumFractionDigits: 2,
            });
            // this.testmodel[var_v]="";
            // this.testmodel[var_v]=amountvalue;
            var finalString = formatter.format(amountvalue);
            finalString = finalString.replace('₹', '');
            this.model1[var_v] = finalString.replace('₹', '');
            console.log("AmountFormatter fun" + this.model1.netIncome);
        } else {
            this.model1[var_v] = "0.0";
        }
    }

    revert(oldvalue: any, var_v: any) {
        var tmpOldvalue;
        console.log("amount" + tmpOldvalue);
        if (oldvalue != null && String(oldvalue).match(/\,/g)) {
            tmpOldvalue = oldvalue.replace(/\,/g, '');
            console.log(tmpOldvalue);
            this.model1[var_v] = tmpOldvalue.substr(0, tmpOldvalue.length - 3);
            console.log("revert fun" + this.model1[var_v]);
        }
    }


    clear() {
        // this.oaoService.setProgressBardata(this.backwardProgressDataSAL);
        this.router.navigate(['../employmentType'], { relativeTo: this.route });

        //this.oaoService.setUserExistingFlag(false);
    }

    change() {
        console.log("on change of Work_experience" + this.model1.Work_experience);
        var work_experience = parseInt(this.model1.Work_experience);
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
        console.log("onsubmit()");
        if (String(this.model1.netIncome).match(/\,/g)) {
            console.log("inside if" + this.model1.netIncome);
            var removeformat = this.model1.netIncome.replace(/\,/g, "");
            console.log(removeformat + "removeformat")
            var removedot = removeformat.substring(0, removeformat.length - 3);
            console.log(removedot + "removedot")
            this.income = removedot;
            console.log("end of if" + this.income);
          
        }
        this.model1.netIncome = this.income;
        console.log("out side if" + this.model1.netIncome);
        this.model1.threeYearsIncome = (3 * (parseInt(this.model1.netIncome)));
        console.log(this.model.max_allowed_percent);
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

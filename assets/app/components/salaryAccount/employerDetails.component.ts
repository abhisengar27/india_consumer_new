import { Component, ElementRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";

import { PersonalDetailsObject } from "../../interfaces/personalDetails.interface";
import { UserDetailsObject } from "../../interfaces/userDetails.interface";
import { OAOService } from "../../services/OAO.Service";
import {checkbox} from './../../interfaces/checkboxinterface';

declare var jQuery: any;
@Component({
    selector: 'employer-details',
    templateUrl: './employerDetails.component.html'
})
export class EmployerDetailsComponent  implements OnInit{

    private model: PersonalDetailsObject = new PersonalDetailsObject('', '', '', '', '', '', '');
    private forwardProgressDataSAL= ['active', '', '', '', 'Y', 'N'];
    disable_btn_flag:boolean;
    public query = '';
    public emplyers = [];
    public modal1 = new checkbox(false,false);

    public employersDetails:any;
    private backwardProgressDataSAL = ['','','','','N','Y'];
    public filteredList = [];
    public elementRef;
    public upsell_flag:boolean;

    constructor(myElement: ElementRef, private oaoService: OAOService, private router: Router, private route: ActivatedRoute) {
        console.log("EmployerDetailsComponent constructor()")
        this.model = this.oaoService.getPersonalDetailsObject();
        this.elementRef = myElement;
    }

    onUpsell(prod_code:string){
        this.oaoService.setUpsellFlag(true);
        this.model.product_code=prod_code;
         this.model.employer="";
        this.oaoService.GetProductDetail(prod_code).subscribe(
            data => {
                console.log(data);
                if (data.result[0].product_code == prod_code) {
                   // this.model.product_name = data.result[0].product_name;
                  // this.model.product_name = "Savings Account";
                    this.model.product_type_code = data.result[0].child_of;
                    this.model.linked_crossselling_product = data.result[0].linked_crossselling_product;
                    this.oaoService.setPersonalDetailsObject(this.model);
                    this.router.navigate(['/upsell']);
                }
            });
    }

    filter() {
         this.disable_btn_flag=false;
        if (this.query !== "") {
            this.filteredList = this.emplyers.filter(function (el) {
                return el.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
            }.bind(this));
            if(this.filteredList.length<1){
                console.log("your employer not yet tie up with us but still u can open a saving account ");
                 this.upsell_flag=true;
            }
            else{
                this.upsell_flag=false;
            }
            
        } else {
            this.filteredList = [];
            this.disable_btn_flag=false;
            this.upsell_flag=false;
        }
    }

    select(item) {
        this.query = item;
         this.disable_btn_flag=true;
        this.filteredList = [];
    }

    handleClick(event) {
        var clickedComponent = event.target;
        var inside = false;
        do {
            if (clickedComponent === this.elementRef.nativeElement) {
                inside = true;
            }
            clickedComponent = clickedComponent.parentNode;
        } while (clickedComponent);
        if (!inside) {
            this.filteredList = [];
        }
    }


    clear()
    {
        this.oaoService.setProgressBardata(this.backwardProgressDataSAL);
        if(this.model.is_aadhaar){
            this.router.navigate(['../singleJoint'], {relativeTo: this.route});
        }
        else{
            this.router.navigate(['../singleJoint'], {relativeTo: this.route});
        }
        //this.oaoService.setUserExistingFlag(false);
    }

    onSubmit(){
        console.log("onsubmit()")
        console.log(this.query)
        this.model.employer=this.query;
        this.oaoService.setPersonalDetailsObject(this.model);
        this.router.navigate(['../aadharCheck'], {relativeTo: this.route});
    }

    ngOnInit(){
         this.getEmployersDetails();
    }

    getEmployersDetails(){ 
        console.log("getEmployersDetails()")
        this.oaoService.getEmployersDetails()
            .subscribe(data =>{
                this.employersDetails=data.result;
                for(var i=0;i<this.employersDetails.length;i++){
                    // console.log(this.employersDetails[i].employer_name);
                     this.emplyers.push(this.employersDetails[i].employer_name);
                }
             });
    }
}

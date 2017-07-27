import { Component, ElementRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { VehicleLoanDetails } from "../../interfaces/vehicleLoanDetails.interface";
import { PersonalDetailsObject } from "../../interfaces/personalDetails.interface";
import { UserDetailsObject } from "../../interfaces/userDetails.interface";
import { OAOService } from "../../services/OAO.Service";
import {checkbox} from './../../interfaces/checkboxinterface';

declare var jQuery: any;
@Component({
    selector: 'city-details',
    templateUrl: './selectcity.component.html'
})
export class SelectCityComponent  {
      model1 = new VehicleLoanDetails();
     private model: PersonalDetailsObject = new PersonalDetailsObject('', '', '', '', '', '', '');
    private forwardProgressDataVL1= ['active', '', '', '', 'Y', 'N'];
    disable_btn_flag:boolean;
    public query = '';
    public city = [];
    public modal1 = new checkbox(false,false);
    public selectCity:any;
    public filteredList = [];
    public elementRef;
    public upsel_flag:boolean;

    constructor(myElement: ElementRef, private oaoService: OAOService, private router: Router, private route: ActivatedRoute) {
        console.log("EmployerDetailsComponent constructor()")
        this.model = this.oaoService.getPersonalDetailsObject();
        this.elementRef = myElement;
        this.model1= this.oaoService.getVehicleLoanObject();
        this.query=this.model1.city;
          if(this.model1.city=='' || this.model1.city==null || this.model1.city==undefined){
                  this.disable_btn_flag = false;
          }else{
               this.disable_btn_flag = true;
          }
        console.log(this.model1);
    }

    filter() {
         this.disable_btn_flag=false;
        if (this.query !== "") {
            this.filteredList = this.city.filter(function (el) {
                return el.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
            }.bind(this));
            if(this.filteredList.length<1){
                console.log("your employer not yet tie up with us but still u can open a saving account ");
                 this.upsel_flag=true;
            }
            else{
                this.upsel_flag=false;
            }
            
        } else {
            this.filteredList = [];
            this.disable_btn_flag=false;
            this.upsel_flag=false;
        }
    }

    select(item) {
        this.query = item;
        this.model1.city = this.query;
        console.log(this.model1.city);
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
          console.log("clear()")
        this.router.navigate(['../singleJoint'], { relativeTo: this.route });
    }

    onSubmit(){
        console.log("onsubmit()")
        this.oaoService.setVehicleLoanObject(this.model1);
        this.router.navigate(['../selectVehicle'], {relativeTo: this.route});
    }

    ngOnInit(){
         this.getCityNames();
    }

    getCityNames(){ 
        console.log("getCityNames()")
        this.oaoService.getCityNames()
            .subscribe(data =>{
                this.selectCity=data.result;
                for(var i=0;i<this.selectCity.length;i++){
                    console.log(this.selectCity[i].city);
                     this.city.push(this.selectCity[i].city);
                }
             });
    }

}

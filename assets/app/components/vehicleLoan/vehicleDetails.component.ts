import { Component, ElementRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { VehicleLoanDetails } from "../../interfaces/vehicleLoanDetails.interface";
import { VehicleDetails } from "../../interfaces/vehicleDetails.interface";
import { PersonalDetailsObject } from "../../interfaces/personalDetails.interface";
import { UserDetailsObject } from "../../interfaces/userDetails.interface";
import { OAOService } from "../../services/OAO.Service";
import { Common } from "../../validators/commonFunc";
import { checkbox } from './../../interfaces/checkboxinterface';

declare var jQuery: any;
@Component({
    selector: 'vehicle-details',
    templateUrl: './vehicleDetails.component.html'
})
export class VehicleDetailsComponent {
    model1 = new VehicleLoanDetails();
    private model: PersonalDetailsObject = new PersonalDetailsObject('', '', '', '', '', '', '');
    private forwardProgressDataVL1 = ['complet', 'active', '', '', 'Y', 'N'];
    disable_btn_flag: boolean;
    public query = '';
    public vehicle_make = [];
    public modal1 = new checkbox(false, false);
    //public vehicle_onroad_price:string;
    public selectVehicle: any;
    public filteredList = [];
    public onroadprice: number;
    public elementRef;
    public upsel_flag: boolean;
    public Ex_Showroom_price: boolean = true;
    public ErrorMsg :boolean =true;
    public vehicleDetails = new VehicleDetails();
    private vehicleSearchSubscriber;

    constructor(myElement: ElementRef, private oaoService: OAOService, private router: Router, private route: ActivatedRoute, private chRef: ChangeDetectorRef) {
        console.log("EmployerDetailsComponent constructor()")
        this.model = this.oaoService.getPersonalDetailsObject();
        this.elementRef = myElement;
        this.model1 = this.oaoService.getVehicleLoanObject();
        this.query = this.model1.vehicle_make;
        this.onroadprice = parseInt(this.model1.vehicle_onroad_price);
        if (this.model1.vehicle_make == '' || this.model1.vehicle_make == null || this.model1.vehicle_make == undefined) {
            this.disable_btn_flag = false;
        } else {
            this.disable_btn_flag = true;
        }
        console.log(this.model1);

    }

    // onUpsel(){
    //     this.oaoService.setUpselFlag(true);
    //     this.model.product_code="VEH!";
    //     this.model.product_name="Saving Account"
    //     this.oaoService.setPersonalDetailsObject(this.model);
    //     this.router.navigate(['/completeInformation/aadharCheck']);
    // }

    filter() {
        console.log("filter")
        jQuery('#query').removeClass('loadinggifCar');
        if (this.vehicleSearchSubscriber) {
            this.vehicleSearchSubscriber.unsubscribe();
        }
        this.vehicle_make = [];
        this.disable_btn_flag = false;
        this.Ex_Showroom_price=true;
        this.ErrorMsg=true;
        if (this.query != "" && this.query.length >= 3) {
            console.log("this.query !== '' && this.query.length > 3");
             jQuery('#query').addClass('loadinggifCar');
            this.vehicleSearchSubscriber = this.oaoService.getVehicleNames(this.query)
                .subscribe(data => {
                    this.selectVehicle = data.result;
                    for (var i = 0; i < this.selectVehicle.length; i++) {
                        //console.log(this.selectVehicle[i].vehicle_make + " " + this.selectVehicle[i].vehicle_model + " " + this.selectVehicle[i].vehicle_variant + " " + this.selectVehicle[i].vehicle_sub_variant + " "+this.selectVehicle[i].on_road_price);
                        this.vehicle_make.push(this.selectVehicle[i].vehicle_make);
                        jQuery('#query').removeClass('loadinggifCar');
                        console.log(this.selectVehicle[i].vehicle_make);
                        //     this.vehicleDetails.vehicleMake=this.selectVehicle[i].vehicle_make;
                        // this.vehicleDetails.vehicleModel=this.selectVehicle[i].vehicle_model;
                        // this.vehicleDetails.vehicleVariant=this.selectVehicle[i].vehicle_variant;
                        // this.vehicleDetails.vehicleSubVariant=this.selectVehicle[i].vehicle_sub_variant;
                        //  this.vehicleDetails.vehicle_X_Price=this.selectVehicle[i].on_road_price;
                    }
                    console.log("vehicledetails" + this.vehicleDetails.vehicleMake);
                    console.log("vehicledetails" + this.vehicleDetails.vehicleModel);
                    console.log("vehicledetails" + this.vehicleDetails.vehicleVariant);
                    console.log("vehicledetails" + this.vehicleDetails.vehicle_X_Price);
                    this.model1.vehicle_onroad_price = this.vehicleDetails.vehicle_X_Price;
                    console.log("x_price" + this.model1.vehicle_onroad_price);




                    this.filteredList = this.vehicle_make.filter(function (el) {
                        return el.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
                    }.bind(this));

                    if (this.filteredList.length < 1) {
                        this.ErrorMsg =false;
                        jQuery('#query').removeClass('loadinggifCar');
                        console.log("your employer not yet tie up with us but still u can open a saving account ");
                        // this.upsel_flag = true;
                    }
                    else {
                        this.upsel_flag = false;
                    }


                });

            console.log(this.vehicle_make);


        } else {
            console.log("filter")
            this.filteredList = [];
            this.disable_btn_flag = false;
            this.upsel_flag = false;
        }
    }

    select(item) {
        this.query = item;
        console.log("this is query" + this.query);
        this.model1.vehicle_make = this.query;
        console.log(this.model1.vehicle_make);
        this.disable_btn_flag = true;
        this.filteredList = [];
        this.oaoService.getVehicleExShowRoomPrice(this.query)
            .subscribe(data => {
                this.selectVehicle = data.result;
                for (var i = 0; i < this.selectVehicle.length; i++) {
                    console.log("ExShowRoomPrice" + this.selectVehicle[i].ex_showroom_price);
                    this.onroadprice = this.selectVehicle[i].ex_showroom_price;
                    this.model1.vehicle_onroad_price = this.selectVehicle[i].ex_showroom_price;
                    var formatter = new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        minimumFractionDigits: 2,
                    });
                    var finalString = formatter.format(this.onroadprice);
                    this.model1.vehicle_onroad_price = finalString
                    console.log(this.model1.netIncome);
                    console.log(this.model1.vehicle_onroad_price);
                }
            });
        this.Ex_Showroom_price = false
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


    clear() {
        this.router.navigate(['../selectCity'], { relativeTo: this.route });
        //this.oaoService.setUserExistingFlag(false);
    }

    onSubmit() {
        console.log("onsubmit()")
        // console.log(this.query)
        // this.model.employer=this.query;
        // this.oaoService.setPersonalDetailsObject(this.model);
        Common.completedProgressBarStep(1);
        this.model1.vehicle_onroad_price = this.onroadprice.toString();
        console.log(this.model1.vehicle_onroad_price);
        this.oaoService.setProgressBardata(this.forwardProgressDataVL1);
        this.oaoService.setVehicleLoanObject(this.model1);
        this.router.navigate(['../employmentType'], { relativeTo: this.route });
    }

}

import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { VehicleLoanDetails } from "../../interfaces/vehicleLoanDetails.interface";
import { PersonalDetailsObject } from "../../interfaces/personalDetails.interface";
import { UserDetailsObject } from "../../interfaces/userDetails.interface";
import { OAOService } from "../../services/OAO.Service";
import { Common } from "../../validators/commonFunc";
import { VehicleDetails } from "../../interfaces/vehicleDetails.interface";
export enum RangeHandle { Start, End, Both }


declare var jQuery: any;
@Component({
  selector: 'emi-calaculater',
  templateUrl: './emicalculater.component.html'
})
export class Emicalculater implements OnInit, AfterViewInit {
  model1 = new VehicleLoanDetails();
  private model: PersonalDetailsObject = new PersonalDetailsObject('', '', '', '', '', '', '');
  public query = '';
  public vehicle_make = [];
  disable_btn_flag: boolean;
  public filteredList = [];
  public selectVehicle: any;
  public vehicleDetails = new VehicleDetails();
  public pieChartLabels: string[] = ['Loan amount', 'Total interest'];
  public showChart: Boolean = false;
  public makeAndModel: boolean = true;
  public vehicle_make_text: boolean = false;
  public show_EX_showRoom_price: string;
  public ShowloanAmountRange: string
  public Showloaneligibleamount: string;
  public ShowmonthlyEmiRange: string;
  public ShowMaxEmi: string;
  public ShowMinEmi: string;
  public ShowinterestPayable: string;
  public ShowtotalPayableAmount: string;
  private exShowromPrice: string;
  private sanctionableamount: string;
  private threeYrNetIncome: string;
  private vehicleSearchSubscriber;
  public lineChartColors: Array<any> = [
    {
      backgroundColor: ['#044b8a', '#FC7157']
    }];
  public pieChartData: number[];
  public pieChartType: string = 'pie';


  constructor(private oaoService: OAOService, private router: Router, private route: ActivatedRoute, private elementRef: ElementRef) {
    this.model1 = this.oaoService.getVehicleLoanObject();
    this.model = this.oaoService.getPersonalDetailsObject();
    console.log(this.model1);
    this.query = this.model1.vehicle_make



  }

  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  calaculate() {
    console.log("on change")
  }

  ngOnInit() {

    Common.completedProgressBarStep(2);
    Common.activeProgressBarStep(3);
    this.exShowromPrice = Common.AmountFormatterINR(this.model1.onroadprice_85);
    this.sanctionableamount = Common.AmountFormatterINR(this.model.max_permissible_amount);
    this.threeYrNetIncome = Common.AmountFormatterINR(this.model1.threeYearsIncome);
    this.show_EX_showRoom_price = Common.AmountFormatterINR(this.model1.vehicle_onroad_price);
    console.log(this.show_EX_showRoom_price);
    this.Showloaneligibleamount = Common.AmountFormatterINR(this.model1.loan_eligible_amount);
    var noOfMonths_max_emi = 12;
    var intreset_emi = (9 / (12 * 100));
    console.log(noOfMonths_max_emi);
    var max_emi = ((this.model1.loan_eligible_amount) * intreset_emi * (Math.pow((1 + intreset_emi), noOfMonths_max_emi))) / (Math.pow((1 + intreset_emi), noOfMonths_max_emi) - 1);
    var new_max_EMI = Math.ceil(max_emi);
    this.model1.max_emi = Math.ceil(new_max_EMI);
    this.ShowMaxEmi = Common.AmountFormatterINR(this.model1.max_emi);
    console.log("new emi : " + new_max_EMI);
    console.log("emi" + max_emi);

    var noOfMonths_min_emi = (7 * 12);
    var intreset_emi = (9 / (12 * 100));
    console.log(noOfMonths_min_emi);
    var min_emi = ((this.model1.loan_eligible_amount) * intreset_emi * (Math.pow((1 + intreset_emi), noOfMonths_min_emi))) / (Math.pow((1 + intreset_emi), noOfMonths_min_emi) - 1);
    var new_min_EMI = Math.ceil(min_emi);
    this.model1.min_emi = Math.ceil(new_min_EMI);
    this.ShowMinEmi = Common.AmountFormatterINR(this.model1.min_emi);
    console.log("new emi : " + new_min_EMI);
    console.log("emi" + min_emi)

    this.model.loanAmountRange = this.model1.loan_eligible_amount;
    this.model.loanTermRange = 4;
    var noOfMonths_emi_ = this.model.loanTermRange * 12;
    var intreset_emi = (9 / (12 * 100));
    var max_emi_ = ((this.model.loanAmountRange) * intreset_emi * (Math.pow((1 + intreset_emi), noOfMonths_emi_))) / (Math.pow((1 + intreset_emi), noOfMonths_emi_) - 1);
    var new_EMI_ = Math.ceil(max_emi_);
    this.model.monthlyEmiRange = Math.ceil(new_EMI_);
    this.ShowmonthlyEmiRange = Common.AmountFormatterINR(this.model.monthlyEmiRange);
    console.log("new emi : " + new_EMI_);

    var interestToBEPaid_ = (new_EMI_ * noOfMonths_emi_) - this.model.loanAmountRange;
    console.log("interest to be paid" + interestToBEPaid_)
    this.model1.interestPayable = interestToBEPaid_;
    this.ShowinterestPayable = Common.AmountFormatterINR(this.model1.interestPayable);
    var totalPayment_ = this.model.loanAmountRange + interestToBEPaid_;
    this.model1.totalPayableAmount = totalPayment_;
    this.ShowtotalPayableAmount = Common.AmountFormatterINR(this.model1.totalPayableAmount);
    console.log("total payment " + totalPayment_);
    this.pieChartData = [this.model.loanAmountRange, interestToBEPaid_];
    this.showChart = true;
    this.show_EX_showRoom_price = Common.AmountFormatterINR(this.model1.vehicle_onroad_price);
    console.log(this.show_EX_showRoom_price);
    this.ShowloanAmountRange = Common.AmountFormatterINR(this.model.loanAmountRange);
  }

  onChangeLoanAmount(amount: any) {
    console.log("onChange:" + amount);
    this.model.loanAmountRange = parseInt(amount);
    this.ShowloanAmountRange = Common.AmountFormatterINR(this.model.loanAmountRange);
    var noOfMonths_max_emi = 12;
    var intreset_emi = (9 / (12 * 100));
    console.log(noOfMonths_max_emi);
    var max_emi = ((this.model.loanAmountRange) * intreset_emi * (Math.pow((1 + intreset_emi), noOfMonths_max_emi))) / (Math.pow((1 + intreset_emi), noOfMonths_max_emi) - 1);
    var new_max_EMI = Math.ceil(max_emi);
    this.model1.max_emi = Math.ceil(new_max_EMI);
    this.ShowMaxEmi = Common.AmountFormatterINR(this.model1.max_emi);
    console.log("new emi : " + new_max_EMI);
    console.log("emi" + max_emi);

    var noOfMonths_min_emi = (7 * 12);
    var intreset_emi = (9 / (12 * 100));
    console.log(noOfMonths_min_emi);
    var min_emi = ((this.model.loanAmountRange) * intreset_emi * (Math.pow((1 + intreset_emi), noOfMonths_min_emi))) / (Math.pow((1 + intreset_emi), noOfMonths_min_emi) - 1);
    var new_min_EMI = Math.ceil(min_emi);
    this.model1.min_emi = Math.ceil(new_min_EMI);
    this.ShowMinEmi = Common.AmountFormatterINR(this.model1.min_emi);
    console.log("new emi : " + new_min_EMI);
    console.log("emi" + min_emi)

    this.emiCalculate();
  }

  onChangeLoanTerm(LoanTerm: any) {
    console.log("onChange:" + LoanTerm);
    this.model.loanTermRange = parseInt(LoanTerm);
    this.emiCalculate();
  }

  onChangeMonthlyEmi(amount: any) {
    console.log("onChange:" + amount);
    this.model.monthlyEmiRange = parseInt(amount);
    var intreset_emi = (9 / (12 * 100));
    var months = Math.log((this.model.monthlyEmiRange) / ((this.model.monthlyEmiRange) - (this.model.loanAmountRange * intreset_emi))) / Math.log(1 + intreset_emi);
    var number_0f_months = Math.round(months);
    console.log(number_0f_months);
    this.model.loanTermRange = Math.round(number_0f_months / 12);
    console.log(this.model.loanTermRange);
    console.log("no of months" + months);
    this.ShowmonthlyEmiRange = Common.AmountFormatterINR(this.model.monthlyEmiRange);
    var interestToBEPaid_ = (this.model.monthlyEmiRange * number_0f_months) - this.model.loanAmountRange;
    console.log("interest to be paid" + interestToBEPaid_)
    this.model1.interestPayable = interestToBEPaid_;
    this.ShowinterestPayable = Common.AmountFormatterINR(this.model1.interestPayable);
    var totalPayment_ = this.model.loanAmountRange + interestToBEPaid_;
    this.model1.totalPayableAmount = totalPayment_;
    this.ShowtotalPayableAmount = Common.AmountFormatterINR(this.model1.totalPayableAmount);
    console.log("total payment " + totalPayment_);
    this.pieChartData = [this.model.loanAmountRange, interestToBEPaid_];
    this.showChart = true;
  }

  ngAfterViewInit() {

    // var s = document.createElement("script");
    // s.setAttribute('type', 'text/javascript');
    // s.setAttribute('src', "http://emicalculator.net/widget/2.0/js/emicalc-loader.min.js");
    // this.elementRef.nativeElement.appendChild(s);
  }

  emiCalculate() {
    var noOfMonths = this.model.loanTermRange * 12;
    var int = (9 / (12 * 100));
    console.log(noOfMonths);
    var emi = ((this.model.loanAmountRange) * int * (Math.pow((1 + int), noOfMonths))) / (Math.pow((1 + int), noOfMonths) - 1);
    var newEMI_ = Math.ceil(emi);
    var newEMI = Math.ceil(emi)
    this.model.monthlyEmiRange = newEMI_;
    this.ShowmonthlyEmiRange = Common.AmountFormatterINR(this.model.monthlyEmiRange);
    console.log("new emi : " + newEMI);
    console.log("emi" + emi)
    console.log(this.model.loanAmountRange);
    console.log(this.model.loanTermRange);
    console.log(this.model.monthlyEmiRange);


    var interestToBEPaid = (newEMI * noOfMonths) - this.model.loanAmountRange;
    console.log("interest to be paid" + interestToBEPaid);
    this.model1.interestPayable = interestToBEPaid;
    this.ShowinterestPayable = Common.AmountFormatterINR(this.model1.interestPayable);
    var totalPayment = this.model.loanAmountRange + interestToBEPaid;
    this.model1.totalPayableAmount = totalPayment;
    this.ShowtotalPayableAmount = Common.AmountFormatterINR(this.model1.totalPayableAmount);
    console.log("total payment " + totalPayment);
    this.pieChartData = [this.model.loanAmountRange, interestToBEPaid];
  }


  filter() {
    console.log("filter")
    if (this.vehicleSearchSubscriber) {
      this.vehicleSearchSubscriber.unsubscribe();
    }
    this.vehicle_make = [];
    this.disable_btn_flag = false;
    if (this.query !== "" && this.query.length >= 3) {
      console.log("this.query !== '' && this.query.length > 3");
      this.vehicleSearchSubscriber = this.oaoService.getVehicleNames(this.query)
        .subscribe(data => {
          this.selectVehicle = data.result;
          for (var i = 0; i < this.selectVehicle.length; i++) {
            console.log(this.selectVehicle[i].vehicle_make);
            this.vehicle_make.push(this.selectVehicle[i].vehicle_make);
            //     this.vehicleDetails.vehicleMake=this.selectVehicle[i].vehicle_make;
            // this.vehicleDetails.vehicleModel=this.selectVehicle[i].vehicle_model;
            // this.vehicleDetails.vehicleVariant=this.selectVehicle[i].vehicle_variant;
            // this.vehicleDetails.vehicleSubVariant=this.selectVehicle[i].vehicle_sub_variant;
            //  this.vehicleDetails.vehicle_X_Price=this.selectVehicle[i].on_road_price;
          }
          //  console.log("vehicledetails"+this.vehicleDetails.vehicleMake);
          //   console.log("vehicledetails"+this.vehicleDetails.vehicleModel);
          //    console.log("vehicledetails"+this.vehicleDetails.vehicleVariant);
          //     console.log("vehicledetails"+this.vehicleDetails.vehicleSubVariant);
          //    console.log("vehicledetails"+this.vehicleDetails.vehicle_X_Price);
          //    this.model1.vehicle_onroad_price=this.vehicleDetails.vehicle_X_Price;
          //    console.log("x_price"+this.model1.vehicle_onroad_price);

          this.filteredList = this.vehicle_make.filter(function (el) {
            return el.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
          }.bind(this));
        });

      // for (var i = 0; i < this.vehicle_make.length; i++) {
      console.log(this.vehicle_make);
      // }





    } else {
      console.log("filter")
      this.filteredList = [];
      this.disable_btn_flag = false;
    }
  }

  select(item) {

    this.query = item;
    console.log("this is query" + this.query);
    this.model1.vehicle_make = this.query;
    console.log(this.model1.vehicle_make);
    this.disable_btn_flag = true;
    this.filteredList = [];
    this.makeAndModel = true;
    this.vehicle_make_text = false;
    this.oaoService.getVehicleExShowRoomPrice(this.query)
      .subscribe(data => {
        this.selectVehicle = data.result;
        for (var i = 0; i < this.selectVehicle.length; i++) {
          this.model1.vehicle_onroad_price = this.selectVehicle[i].ex_showroom_price;
          this.show_EX_showRoom_price = Common.AmountFormatterINR(this.model1.vehicle_onroad_price);
          console.log("newExShowRoomPrice" + this.model1.vehicle_onroad_price);
        }
        console.log("new EX_price" + this.model1.vehicle_onroad_price);
        this.model1.onroadprice_85 = ((this.model.max_allowed_percent / 100) * (parseInt(this.model1.vehicle_onroad_price)))
        console.log("three years income" + this.model1.threeYearsIncome);
        console.log("85% of x_price:" + this.model1.onroadprice_85);
        console.log("85% of x_price:" + this.model1.onroadprice_85);
        this.exShowromPrice = Common.AmountFormatterINR(this.model1.onroadprice_85);
        this.model1.loan_eligible_amount = Math.min(this.model1.threeYearsIncome, this.model1.onroadprice_85, this.model.max_permissible_amount);
        this.Showloaneligibleamount = Common.AmountFormatterINR(this.model1.loan_eligible_amount);
        this.ShowloanAmountRange=this.Showloaneligibleamount ;
        //console.log("loan eligible amt" + this.model1.loan_eligible_amount)
        this.max_emi()
        this.emiCalculate()
        this.oaoService.setVehicleLoanObject(this.model1);


      });

  }
  max_emi() {
    this.model.loanAmountRange = this.model1.loan_eligible_amount;
    this.model.loanTermRange = 4;
    var noOfMonths_emi_ = this.model.loanTermRange * 12;
    var intreset_emi = (9 / (12 * 100));
    var max_emi_ = ((this.model.loanAmountRange) * intreset_emi * (Math.pow((1 + intreset_emi), noOfMonths_emi_))) / (Math.pow((1 + intreset_emi), noOfMonths_emi_) - 1);
    var new_EMI_ = Math.ceil(max_emi_);
    this.model.monthlyEmiRange = Math.ceil(new_EMI_);
    this.ShowmonthlyEmiRange = Common.AmountFormatterINR(this.model.monthlyEmiRange);
    console.log("new emi : " + new_EMI_);
  }

  clear() {
    Common.completedProgressBarStep(1);
    Common.activeProgressBarStep(2);
    this.oaoService.setVehicleLoanObject(this.model1);
    console.log("in back"+this.model1.netIncome);
    this.model1.netIncome=Common.AmountFormatterINR(this.model1.netIncome);
    this.router.navigate(["../employmentType"], { relativeTo: this.route });
  }
  changemakeANDmodel() {
    console.log("on click")
    this.makeAndModel = false;
    this.vehicle_make_text = true;
  }

  onSubmit() {
    Common.completedProgressBarStep(3);
    this.model1.emi = (parseInt(this.ShowmonthlyEmiRange));
    this.model1.loanAmount = (parseInt(this.ShowloanAmountRange));
    this.oaoService.setVehicleLoanObject(this.model1);
    this.router.navigate(["../aadharCheck"], { relativeTo: this.route });

  }


}

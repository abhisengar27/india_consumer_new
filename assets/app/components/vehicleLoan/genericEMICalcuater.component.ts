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
  selector: 'genericemi-calaculater',
  templateUrl: './genericEMICalcuater.component.html'
})
export class GenericEMICalcuater implements OnInit, AfterViewInit {
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
  public lineChartColors: Array<any> = [
    {
      backgroundColor: ['#044b8a', '#FC7157']
    }];
  public pieChartData: number[];
  public pieChartType: string = 'pie';
  public ShowloanAmountRange: string;
  public Showloan_eligible_amount: string;
  public ShowMaxEmi: string;
  public ShowMinEmi: string;
  public ShowmonthlyEmiRange:string;
  public ShowinterestPayable:string;
  public ShowtotalPayableAmount:string;

  constructor(private oaoService: OAOService, private router: Router, private route: ActivatedRoute, private elementRef: ElementRef) {
    this.model1 = this.oaoService.getVehicleLoanObject();
    this.model = this.oaoService.getPersonalDetailsObject();
    console.log(this.model1);
    this.model1.loan_eligible_amount = 1000000;
    this.Showloan_eligible_amount = Common.AmountFormatterINR(this.model1.loan_eligible_amount)
    this.model.loanInterestRange = 20;
    this.model.loanTermRange = 7;

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

    var noOfMonths_max_emi = 12;
    var intreset_emi = ((this.model.loanInterestRange) / (12 * 100));
    console.log(noOfMonths_max_emi);
    var max_emi = ((this.model1.loan_eligible_amount) * intreset_emi * (Math.pow((1 + intreset_emi), noOfMonths_max_emi))) / (Math.pow((1 + intreset_emi), noOfMonths_max_emi) - 1);
    var new_max_EMI = Math.ceil(max_emi);
    this.model1.max_emi = Math.ceil(new_max_EMI);
    this.ShowMaxEmi = Common.AmountFormatterINR(this.model1.max_emi);
    console.log("new emi : " + new_max_EMI);
    console.log("emi" + max_emi);

    var noOfMonths_min_emi = ((this.model.loanTermRange) * 12);
    var intreset_emi = (6 / (12 * 100));
    var min_emi = ((100000) * intreset_emi * (Math.pow((1 + intreset_emi), noOfMonths_min_emi))) / (Math.pow((1 + intreset_emi), noOfMonths_min_emi) - 1);
    var new_min_EMI = Math.ceil(min_emi);
    this.model1.min_emi = Math.ceil(new_min_EMI);
    this.ShowMinEmi = Common.AmountFormatterINR(this.model1.min_emi);
    console.log("new min emi : " + new_min_EMI);
    console.log("emi" + min_emi);

    this.model.loanAmountRange = this.model1.loan_eligible_amount;
    this.ShowloanAmountRange = Common.AmountFormatterINR(this.model.loanAmountRange);
    this.model.loanTermRange = 4;
    var noOfMonths_emi_ = this.model.loanTermRange * 12;
    var intreset_emi = ((this.model.loanInterestRange) / (12 * 100));
    var max_emi_ = ((this.model.loanAmountRange) * intreset_emi * (Math.pow((1 + intreset_emi), noOfMonths_emi_))) / (Math.pow((1 + intreset_emi), noOfMonths_emi_) - 1);
    var new_EMI_ = Math.ceil(max_emi_);
    this.model.monthlyEmiRange = Math.ceil(new_EMI_);
    this.ShowmonthlyEmiRange=Common.AmountFormatterINR(this.model.monthlyEmiRange);
    this.model1.emi = this.model.monthlyEmiRange;
    console.log("new emi : " + new_EMI_);

    var interestToBEPaid_ = (new_EMI_ * noOfMonths_emi_) - this.model.loanAmountRange;
    console.log("interest to be paid" + interestToBEPaid_)
    this.model1.interestPayable = interestToBEPaid_;
    this.ShowinterestPayable=Common.AmountFormatterINR(this.model1.interestPayable);
    var totalPayment_ = this.model.loanAmountRange + interestToBEPaid_;
    this.model1.totalPayableAmount = totalPayment_;
    this.ShowtotalPayableAmount=Common.AmountFormatterINR(this.model1.totalPayableAmount);
    console.log("total payment " + totalPayment_);
    this.pieChartData = [this.model.loanAmountRange, interestToBEPaid_];
    this.showChart = true;
  }

  onChangeLoanAmount(amount: any) {
    console.log("onChange:" + amount);
    this.model.loanAmountRange = parseInt(amount);
    this.ShowloanAmountRange = Common.AmountFormatterINR(this.model.loanAmountRange);

    var noOfMonths_min_emi = ((this.model.loanTermRange) * 12);
    var intreset_emi = (6 / (12 * 100));
    var min_emi = ((this.model.loanAmountRange) * intreset_emi * (Math.pow((1 + intreset_emi), noOfMonths_min_emi))) / (Math.pow((1 + intreset_emi), noOfMonths_min_emi) - 1);
    var new_min_EMI = Math.ceil(min_emi);
    this.model1.min_emi = Math.ceil(new_min_EMI);
    this.ShowMinEmi = Common.AmountFormatterINR(this.model1.min_emi);
    console.log("new min emi : " + new_min_EMI);
    console.log("before emi cal" + min_emi);

    var noOfMonths_max_emi = 12;
    var intreset_emi = ((this.model.loanInterestRange) / (12 * 100));
    console.log(noOfMonths_max_emi);
    var max_emi = ((this.model.loanAmountRange) * intreset_emi * (Math.pow((1 + intreset_emi), noOfMonths_max_emi))) / (Math.pow((1 + intreset_emi), noOfMonths_max_emi) - 1);
    var new_max_EMI = Math.ceil(max_emi);
    this.model1.max_emi = Math.ceil(new_max_EMI);
    this.ShowMaxEmi = Common.AmountFormatterINR(this.model1.max_emi);
    console.log("new emi : " + new_max_EMI);
    console.log("emi" + max_emi);

    this.emiCalculate();
  }

  onChangeLoanTerm(LoanTerm: any) {
    console.log("onChange:" + LoanTerm);
    this.model.loanTermRange = parseInt(LoanTerm);
    var noOfMonths_min_emi = ((this.model.loanTermRange) * 12);
    var intreset_emi = (this.model.loanInterestRange / (12 * 100));
    var min_emi = ((this.model.loanAmountRange) * intreset_emi * (Math.pow((1 + intreset_emi), noOfMonths_min_emi))) / (Math.pow((1 + intreset_emi), noOfMonths_min_emi) - 1);
    var new_min_EMI = Math.ceil(min_emi);
    this.model1.min_emi = Math.ceil(new_min_EMI);
    this.ShowMinEmi=Common.AmountFormatterINR(this.model1.min_emi);
    console.log("new min emi : " + new_min_EMI);
    console.log("before emi cal" + min_emi);
    this.emiCalculate();
  }

  onChangeIntrest(LoanIntrest: any) {
    console.log("onChange:" + LoanIntrest);
    this.model.loanInterestRange = parseInt(LoanIntrest);
    var noOfMonths_min_emi = ((this.model.loanTermRange) * 12);
    var intreset_emi = (this.model.loanInterestRange / (12 * 100));
    var min_emi = ((this.model.loanAmountRange) * intreset_emi * (Math.pow((1 + intreset_emi), noOfMonths_min_emi))) / (Math.pow((1 + intreset_emi), noOfMonths_min_emi) - 1);
    var new_min_EMI = Math.ceil(min_emi);
    this.model1.min_emi = Math.ceil(new_min_EMI);
    this.ShowMinEmi=Common.AmountFormatterINR(this.model1.min_emi);
    console.log("new min emi : " + new_min_EMI);
    console.log("before emi cal" + min_emi);
    this.emiCalculate();
  }



  onChangeMonthlyEmi(amount: any) {
    console.log("onChange:" + amount);
    this.model.monthlyEmiRange = parseInt(amount);
      this.ShowmonthlyEmiRange=Common.AmountFormatterINR(this.model.monthlyEmiRange);
    var intreset_emi = ((this.model.loanInterestRange) / (12 * 100));
    var months = Math.log((this.model.monthlyEmiRange) / ((this.model.monthlyEmiRange) - (this.model.loanAmountRange * intreset_emi))) / Math.log(1 + intreset_emi);
    var number_0f_months = Math.round(months);
    console.log(number_0f_months);
    this.model.loanTermRange = Math.round(number_0f_months / 12);
    console.log(this.model.loanTermRange);
    console.log("no of months" + months);
    this.model1.emi = this.model.monthlyEmiRange;
    var interestToBEPaid_ = (this.model.monthlyEmiRange * number_0f_months) - this.model.loanAmountRange;
    console.log("interest to be paid" + interestToBEPaid_)
    this.model1.interestPayable = interestToBEPaid_;
    this.ShowinterestPayable=Common.AmountFormatterINR(this.model1.interestPayable);
    var totalPayment_ = this.model.loanAmountRange + interestToBEPaid_;
    this.model1.totalPayableAmount = totalPayment_;
    this.ShowtotalPayableAmount=Common.AmountFormatterINR(this.model1.totalPayableAmount);
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
    var int = ((this.model.loanInterestRange) / (12 * 100));
    console.log(noOfMonths);
    var emi = ((this.model.loanAmountRange) * int * (Math.pow((1 + int), noOfMonths))) / (Math.pow((1 + int), noOfMonths) - 1);
    var newEMI_ = Math.ceil(emi);
    var newEMI = Math.ceil(emi)
    this.model.monthlyEmiRange = newEMI_;
    this.ShowmonthlyEmiRange=Common.AmountFormatterINR(this.model.monthlyEmiRange);
    this.model1.emi = this.model.monthlyEmiRange;
    console.log("new emi : " + newEMI);
    console.log("emi" + emi)
    console.log(this.model.loanAmountRange);
    console.log(this.model.loanTermRange);
    console.log(this.model.monthlyEmiRange);


    var interestToBEPaid = (newEMI * noOfMonths) - this.model.loanAmountRange;
    console.log("interest to be paid" + interestToBEPaid);
    this.model1.interestPayable = interestToBEPaid;
    this.ShowinterestPayable=Common.AmountFormatterINR(this.model1.interestPayable);
    var totalPayment = this.model.loanAmountRange + interestToBEPaid;
    this.model1.totalPayableAmount = totalPayment;
    this.ShowtotalPayableAmount=Common.AmountFormatterINR(this.model1.totalPayableAmount);
    console.log("total payment " + totalPayment);
    this.pieChartData = [this.model.loanAmountRange, interestToBEPaid];
  }

  max_emi() {
    this.model.loanAmountRange = this.model1.loan_eligible_amount;
    this.ShowloanAmountRange = Common.AmountFormatterINR(this.model.loanAmountRange);
    this.model.loanTermRange = 4;
    var noOfMonths_emi_ = this.model.loanTermRange * 12;
    var intreset_emi = ((this.model.loanInterestRange) / (12 * 100));
    var max_emi_ = ((this.model.loanAmountRange) * intreset_emi * (Math.pow((1 + intreset_emi), noOfMonths_emi_))) / (Math.pow((1 + intreset_emi), noOfMonths_emi_) - 1);
    var new_EMI_ = Math.ceil(max_emi_);
    this.model.monthlyEmiRange = Math.ceil(new_EMI_);
    this.ShowmonthlyEmiRange=Common.AmountFormatterINR(this.model.monthlyEmiRange);
    this.model1.emi = this.model.monthlyEmiRange;
    console.log("new emi : " + new_EMI_);
  }

  clear() {

    this.router.navigate(["../home"], { relativeTo: this.route });
  }
  changemakeANDmodel() {
    this.makeAndModel = false;
  }

  onSubmit() {
    Common.completedProgressBarStep(3);
    this.oaoService.setVehicleLoanObject(this.model1);
    this.router.navigate(["../aadharCheck"], { relativeTo: this.route });

  }


}

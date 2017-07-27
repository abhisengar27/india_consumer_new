import { Component } from '@angular/core';
import {Router} from '@angular/router'
import { PersonalDetailsObject } from "../interfaces/personalDetails.interface";
import {checkbox} from '../interfaces/checkboxinterface';
import { ConfigDetails } from "../interfaces/configinterface";
import {OAOService} from "../services/OAO.Service";
import { VehicleLoanDetails } from "../interfaces/vehicleLoanDetails.interface";
declare var google:any;
declare var googleLoaded:any;

declare var jQuery:any;
declare var moment: any;

@Component({
    selector: 'common',
    template:''
})
export class Common {
    model = new PersonalDetailsObject('','','','','','','');
    model1 = new VehicleLoanDetails();
  AmountFormatter(amountvalue: any, var_v: any) {
        var formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'AUD',
            minimumFractionDigits: 2,
        });
    //     this.testmodel[var_v]="";
    //  this.testmodel[var_v]=amountvalue;
        var finalString = formatter.format(amountvalue);
		finalString = finalString.replace('A$','');
        this.model[var_v] = finalString.replace('$','');
    }

   revert(oldvalue:any,var_v: any){
       
        var tmpOldvalue;
       if(oldvalue!=null && String(oldvalue).match(/\,/g)){
        tmpOldvalue=oldvalue.replace(/\,/g,'');
        console.log(tmpOldvalue);
        this.model[var_v]=tmpOldvalue.substr(0,tmpOldvalue.length-3);
        console.log(this.model[var_v]);
        }
    }

static AmountFormatterINR(amountvalue: any) {
if (amountvalue != undefined && amountvalue != null && amountvalue != '') {
console.log("asd " + amountvalue)
var formatter = new Intl.NumberFormat('en-IN', {
style: 'currency',
currency: 'INR',
minimumFractionDigits: 2,
});
// this.testmodel[var_v]="";
// this.testmodel[var_v]=amountvalue;
var finalString = formatter.format(amountvalue);
finalString = finalString.replace('₹', '');

return finalString;
} else {
finalString = "0.0";
return finalString;
}
}

    /**
* Completed progress bar by step number
*/
static completedProgressBarStep(current){
var total = 6;
var average = (current/total)*100;
var activePercent = average + '%';
var progress = jQuery('.progress-bar2');
jQuery('.progress-bar2').attr('data-progress2',average);
// progress.css('width',activePercent);
progress.animate({ width: activePercent }, { duration: 1500, easing: 'linear' })
}
 
/**
* Active progress bar by step number
*/
static activeProgressBarStep(current){
var total = 6;
// var current = parseInt(jQuery('.page-heading-mobile').attr('data-step'));
var average = (current/total)*100;
var activePercent = average + '%';
var progress = jQuery('.progress-bar');
jQuery('.progress-bar').attr('data-progress1',average);
//jQuery('.number-progress-bar ul').children().eq(current).addClass('completed');
progress.css('width',activePercent);

//progress.animate({ width: activePercent }, { duration: 1500, easing: 'linear' })
}
 
}
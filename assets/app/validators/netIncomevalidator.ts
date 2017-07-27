import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
    selector: '[netIncome][formControlName],[netIncome][formControl],[netIncome][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => NetIncomevalidator), multi: true }
    ]
})
export class NetIncomevalidator implements Validator {
    constructor( @Attribute('netIncome') public netIncome: string,
        @Attribute('reverse') public reverse: string) {

    }


    validate(c: AbstractControl): { [key: string]: any } {
        // self value
    let v = c.value;
    let char_at_val=String(v).charAt(0)

    // if(v!="" && !isNaN(Number(char_at_val))){
        if(!String(v).match(/^[0-9]\d{0}$/g)){
        return {"startwithnumber":true}
    }
        return null;
             
    }
}
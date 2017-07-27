import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
    selector: '[mobValidator][formControlName],[mobValidator][formControl],[mobValidator][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => MobileNumberValidator), multi: true }
    ]
})
export class MobileNumberValidator implements Validator {
    constructor( @Attribute('mobValidator') public mobValidator: string,
        @Attribute('reverse') public reverse: string) {

    }

    validate(c: AbstractControl): { [key: string]: any } {

      let mobileNum = c.value;

      if( mobileNum == null || !mobileNum.match(/^(\+91)([1-9]{1})([0-9]{9})$/)){
         return {"startwithnumber":true};
      }
      return null;
             
    }
}
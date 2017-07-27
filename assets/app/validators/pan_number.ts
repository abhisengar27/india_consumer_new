import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
    selector: '[apnValidator][formControlName],[panValidator][formControl],[panValidator][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => PANValidator), multi: true }
    ]
})
export class PANValidator implements Validator {
    constructor( @Attribute('panValidator') public mobValidator: string,
        @Attribute('reverse') public reverse: string) {

    }

    validate(c: AbstractControl): { [key: string]: any } {

      let pan = c.value;

      if( pan == null || !pan.match(/^([A-Z]{5})([0-9]{4})([0-9]{1})$/)){
         return {"startwithnumber":true};
      }
      return null;
             
    }
}
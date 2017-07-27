import { Component, ElementRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";

import { PersonalDetailsObject } from "../../interfaces/personalDetails.interface";
import { UserDetailsObject } from "../../interfaces/userDetails.interface";
import { OAOService } from "../../services/OAO.Service";
import {checkbox} from './../../interfaces/checkboxinterface';
import { GoogleAnalyticsEventsService } from "../../services/GoogleAnalyticsEvents.Service";
import { TranslateService } from '@ngx-translate/core';

declare var jQuery: any;
@Component({
    selector: 'upsell-details',
    template: ``
})
export class UpsellComponent{

    private model: PersonalDetailsObject = new PersonalDetailsObject('', '', '', '', '', '', '');

      constructor(private oaoService: OAOService, private router: Router,public route: ActivatedRoute, private gaEventsService: GoogleAnalyticsEventsService, private translate: TranslateService) {
         console.log("UpsellComponent constructor()")
        this.model = this.oaoService.getPersonalDetailsObject();
        var prod_code="BNA";
           this.oaoService.GetProductDetail(prod_code).subscribe(
            data => {
                if (data.result[0].product_code == prod_code) {
                    this.model.product_name = data.result[0].product_name;
                    this.model.product_type_code = data.result[0].child_of;
                    this.model.linked_crossselling_product = data.result[0].linked_crossselling_product;
                    this.model.product_code = prod_code;
                    this.gaEventsService.emitEvent('OAO_Products', this.model.product_name, prod_code, 100);
                    this.oaoService.setPersonalDetailsObject(this.model);
                    this.router.navigate(['/completeInformation/aadharCheck']);
                }
            }
        )

    }//constructor
}
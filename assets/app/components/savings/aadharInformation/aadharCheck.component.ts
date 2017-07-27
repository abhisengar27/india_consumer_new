import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import{Common} from "../../../validators/commonFunc";
import { PersonalDetailsObject } from "../../../interfaces/personalDetails.interface";
import { UserDetailsObject } from "../../../interfaces/userDetails.interface";
import { OAOService } from "../../../services/OAO.Service";


declare var jQuery: any;
@Component({
    selector: 'aadhaar-check',
    templateUrl: './aadharCheck.component.html'
})
export class AadharCheck implements OnInit {

    private model: PersonalDetailsObject = new PersonalDetailsObject('', '', '', '', '', '', '');

    private forwardProgressDataBNA = ['active', '', '', '', 'Y', 'N'];
    private forwardProgressDataSAL1 = ['active', '', '', '', '', 'Y', 'N'];
    private isLoading: boolean = false;

    constructor(private oaoService: OAOService, private router: Router, private route: ActivatedRoute) {
        this.model = this.oaoService.getPersonalDetailsObject();
        if (this.oaoService.getUpsellFlag()) {
            this.oaoService.changelangEvent.emit(this.oaoService.getLang());
        }



    }

    setAadharCheck(is_aadhaar: boolean) {
        this.model.is_aadhaar = is_aadhaar;
        console.log("setAadharCheck():"+this.model.product_code);

        switch (this.model.product_code) {
            case 'BNA':
                  console.log("setAadharCheck() switch(BNA):"+this.model.product_code);
                if (is_aadhaar) {
                    
                    if (this.model.app_id || this.model.application_id) {
                        this.oaoService.setProgressBardata(this.forwardProgressDataBNA);
                        this.router.navigate(['../aadharInfo'], { relativeTo: this.route });
                        return;
                    }
                    this.isLoading = true;
                    this.oaoService.generateApplicationID().subscribe(res => {

                        if (!res.error) {
                            console.log('generated app id ', res.data);
                             this.model.app_id = res.data;
                             //this.model.application_id= this.model.app_id;
                            this.oaoService.setPersonalDetailsObject(this.model);
                        }
                        else {
                            console.log('Error ocurred while generating app id', res.error);
                        }
                        this.isLoading = false;
                        this.oaoService.setProgressBardata(this.forwardProgressDataBNA);
                        this.router.navigate(['../aadharInfo'], { relativeTo: this.route });
                    });

                }
                else {
                    this.oaoService.setProgressBardata(this.forwardProgressDataBNA);
                    this.router.navigate(['../personalBasicInfo'], { relativeTo: this.route });
                }
                break;
            case 'SAL1':
                console.log("setAadharCheck() switch(SAL1):"+this.model.product_code);
                if (is_aadhaar) 
                {
                    if (this.model.app_id || this.model.application_id) {
                        this.oaoService.setProgressBardata(this.forwardProgressDataSAL1);
                        this.router.navigate(['../aadharInfo'], { relativeTo: this.route });
                        return;
                    }
                    this.isLoading = true;
                    this.oaoService.generateApplicationID().subscribe(res => {

                        if (!res.error) {
                            console.log('generated app id ', res.data);
                            this.model.app_id = res.data;
                            this.model.application_id= this.model.app_id;
                            this.oaoService.setPersonalDetailsObject(this.model);
                        }
                        else {
                            console.log('Error ocurred while generating app id', res.error);
                        }
                        this.isLoading = false;
                        this.oaoService.setProgressBardata(this.forwardProgressDataSAL1);
                        this.router.navigate(['../aadharInfo'], { relativeTo: this.route });
                    });

                }
                else {
                    this.oaoService.setProgressBardata(this.forwardProgressDataSAL1);
                    this.router.navigate(['../personalBasicInfo'], { relativeTo: this.route });
                }
                break;
                    case 'VL1':
                console.log("setAadharCheck() switch(SAL1):"+this.model.product_code);
                if (is_aadhaar) 
                {
                    if (this.model.app_id || this.model.application_id) {
                        this.oaoService.setProgressBardata(this.forwardProgressDataSAL1);
                        this.router.navigate(['../aadharInfo'], { relativeTo: this.route });
                        return;
                    }
                    this.isLoading = true;
                    this.oaoService.generateApplicationID().subscribe(res => {

                        if (!res.error) {
                            console.log('generated app id ', res.data);
                            this.model.app_id = res.data;
                            this.model.application_id= this.model.app_id;
                            this.oaoService.setPersonalDetailsObject(this.model);
                        }
                        else {
                            console.log('Error ocurred while generating app id', res.error);
                        }
                        this.isLoading = false;
                        this.oaoService.setProgressBardata(this.forwardProgressDataSAL1);
                        this.router.navigate(['../aadharInfo'], { relativeTo: this.route });
                    });

                }
                else {
                    this.oaoService.setProgressBardata(this.forwardProgressDataSAL1);
                    this.router.navigate(['../personalBasicInfoVehicleLoan'], { relativeTo: this.route });
                }
                break;
            default: console.log('No product code match found', this.model);
        }

    }


    ngOnInit() {
        if(this.model.product_code=="VL1"){
         Common.activeProgressBarStep(4);
        }
        if (this.oaoService.getUpsellFlag()) {
            this.oaoService.changelangEvent.emit(this.oaoService.getLang());
        }

    }
}

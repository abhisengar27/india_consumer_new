import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { routing } from "./app.routing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from '@angular/http';
import { LaddaModule } from 'angular2-ladda';
import { Md2Module } from 'md2';
import { DatePipe } from '@angular/common';
import { GooglePlaceModule } from 'ng2-google-place-autocomplete';
import { FacebookModule } from 'ng2-facebook-sdk';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { FirstNameValidator } from './validators/namevalidator';
import { MobileNumberValidator } from './validators/mob_number';
import { PANValidator } from './validators/pan_number';
import { EmailValidator } from './validators/email_validator';
import { dobvalidator } from './validators/dob_validator';
import { Common } from './validators/commonFunc';

import { AppComponent } from "./app.component";
import { OAOService } from "./services/OAO.Service";
import { oaoHeaderComponent } from "./components/commonComponents/headerFooter/oaoHeader.component";
import { oaoFooterComponent } from "./components/commonComponents/headerFooter/oaoFooter.component";

import { LoginComponent } from "./components/commonComponents/loginDetails/login.component";
import { LogoutComponent } from "./components/commonComponents/loginDetails/logout.component";
import { DashboardComponent } from "./components/commonComponents/loginDetails/dashboard.component";
import { HomeComponent } from "./components/home.component";
import { SingleJointComponent } from "./components/commonComponents/SingleJoint.component";
import { PersonalDetailsBasicComponent } from "./components/commonComponents/personalDetails/personalDetailsBasic.component";
import { PersonalDetailsContactComponent } from "./components/commonComponents/personalDetails/personalDetailsContact.component";
import { PasswordSetupComponent } from "./components/commonComponents/passwordSetup.component";
import { CompleteInformation } from "./components/completeInformation.component";

import { RecaptchaModule } from 'ng-recaptcha';

import { AadharInfo } from './components/savings/aadharInformation/aadharInfo.component';
import { AadharCheck } from './components/savings/aadharInformation/aadharCheck.component';
import { DocumentsUpload } from './components/savings/docsUpload/docsUpload.component';
import { IDProof } from './components/savings/docsUpload/idProof.component';
import { AddressProof } from './components/savings/docsUpload/addressProof.component';

import { PANInformation } from './components/savings/panInformation/panInformation.component';
import { GoogleAnalyticsEventsService } from "./services/GoogleAnalyticsEvents.Service"

import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

import { Http } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateService } from '@ngx-translate/core';
import { EmployerDetailsComponent } from "./components/salaryAccount/employerDetails.component";
import { EmployerConfirmationLetterComponent } from "./components/salaryAccount/employerConfirmationLetter.component";

import { UpsellComponent } from "./components/salaryAccount/upsell.component";

//loan
import { CarLoanComponent } from "./components/vehicleLoan/carLoan.component";
import { SelectCityComponent } from "./components/vehicleLoan/selectcity.component";
import { VehicleDetailsComponent } from "./components/vehicleLoan/vehicleDetails.component";
import { EmployerDetailsForLoanComponent } from "./components/vehicleLoan/employerDetailsforLoan.component";
import { Emicalculater } from "./components/vehicleLoan/emicalculater.component";
import { GenericEMICalcuater } from "./components/vehicleLoan/genericEMICalcuater.component";
import { EmploymentType } from "./components/vehicleLoan/employmentType.component";
import { SelfEmploymentBusinessComponent } from "./components/vehicleLoan/Self_Employment_Business.component";
import { SelfEmploymentProfessionalComponent } from "./components/vehicleLoan/SelfEmploymentProfessional.component";
import { EmployerExtraInfoForLoan } from "./components/vehicleLoan/employerExtraInfoforLoan.component";
import { PersonalBasicInfoVehicleLoan } from "./components/vehicleLoan/personalBasicInfoVehicleLoan.component";
import { PersonalContactInfoVehicleLoan } from "./components/vehicleLoan/personalContactInfoVehicleLoan.component";
import { ChartsModule } from 'ng2-charts';
import { NoOfDependentsValidator } from "./validators/noOfDependentsValidator";
import { NetIncomevalidator } from "./validators/netIncomevalidator";
import { DocumentsForVehicleLoan } from "./components/vehicleLoan/documentsForVehicleLoan.component";
import { GenericDocumentProofComponent} from './components/vehicleLoan/genericDocumentProof.component';
import {EmitterService} from './services/OAOEventEmitter.Service'

export function HttpLoaderFactory(http: Http) {
    return new TranslateHttpLoader(http);
}


const DROPZONE_CONFIG: DropzoneConfigInterface = {
    maxFilesize: 50,
    acceptedFiles: 'image/*'
};

//Pipes
import { ObjectToArray } from "./pipes/objectToArray.pipe";

@NgModule({
    declarations:
    [
        AppComponent,
        oaoHeaderComponent,
        oaoFooterComponent,

        LoginComponent,
        LogoutComponent,
        DashboardComponent,
        HomeComponent,
        SingleJointComponent,
        PersonalDetailsBasicComponent,
        PersonalDetailsContactComponent,
        PasswordSetupComponent,

        FirstNameValidator,
        MobileNumberValidator,
        EmailValidator,
        dobvalidator,
        PANValidator,
        CompleteInformation,

        ObjectToArray,

        AadharInfo,
        AadharCheck,
        DocumentsUpload,
        IDProof,
        AddressProof,
        PANInformation,
        EmployerDetailsComponent,
        EmployerConfirmationLetterComponent,
        UpsellComponent,
        CarLoanComponent,
        SelectCityComponent,
        VehicleDetailsComponent,
        EmployerDetailsForLoanComponent,
        EmploymentType,
        SelfEmploymentBusinessComponent,
        SelfEmploymentProfessionalComponent,
        Emicalculater,
        GenericEMICalcuater,
        EmployerExtraInfoForLoan,
        PersonalBasicInfoVehicleLoan,
        NoOfDependentsValidator,
        NetIncomevalidator,
        PersonalContactInfoVehicleLoan,
        DocumentsForVehicleLoan,
        GenericDocumentProofComponent
    ],
    imports: [
        RecaptchaModule.forRoot(),
        BrowserModule,
        BrowserAnimationsModule,
        routing,
        FormsModule,
        ChartsModule,
        ReactiveFormsModule,
        HttpModule,
        FacebookModule,
        GooglePlaceModule,
        Md2Module.forRoot(),
        LaddaModule.forRoot({
            style: "contract",
            spinnerSize: 40,
            spinnerColor: "grey",
            spinnerLines: 12
        }),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [Http]
            }
        }),
        DropzoneModule.forRoot(DROPZONE_CONFIG)
    ],
    providers: [OAOService, EmitterService, Common, DatePipe, TranslateService, GoogleAnalyticsEventsService],
    bootstrap: [AppComponent]
})
export class AppModule { }

import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./components/commonComponents/loginDetails/login.component";
import { LogoutComponent } from "./components/commonComponents/loginDetails/logout.component";
import { DashboardComponent } from "./components/commonComponents/loginDetails/dashboard.component";

import { HomeComponent } from "./components/home.component";
import { SingleJointComponent } from "./components/commonComponents/SingleJoint.component";
import { PersonalDetailsBasicComponent } from "./components/commonComponents/personalDetails/personalDetailsBasic.component";
import { PersonalDetailsContactComponent } from "./components/commonComponents/personalDetails/personalDetailsContact.component";
import { PasswordSetupComponent } from "./components/commonComponents/passwordSetup.component";
import { CompleteInformation } from "./components/completeInformation.component";

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
import { DocumentsForVehicleLoan } from "./components/vehicleLoan/documentsForVehicleLoan.component";




//Bank Loan Components

import { AadharCheck } from './components/savings/aadharInformation/aadharCheck.component';
import { AadharInfo } from './components/savings/aadharInformation/aadharInfo.component';
import { DocumentsUpload } from './components/savings/docsUpload/docsUpload.component';
import { PANInformation } from './components/savings/panInformation/panInformation.component';
import {DOC_UPLOAD_ROUTES} from './components/vehicleLoan/docUploadRouting'


const APP_ROUTES: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    {
        path: 'completeInformation', component: CompleteInformation, children: [
            { path: '', redirectTo: 'singleJoint' },
            { path: 'singleJoint', component: SingleJointComponent },
            { path: 'personalBasicInfo', component: PersonalDetailsBasicComponent },
            { path: 'personalContactInfo', component: PersonalDetailsContactComponent },
            { path: 'passwordSetup', component: PasswordSetupComponent },
            { path: 'aadharCheck', component: AadharCheck },
            { path: 'aadharInfo', component: AadharInfo },
            { path: 'docsUpload', component: DocumentsUpload },
            { path: 'panInfo', component: PANInformation },
            { path: 'employer', component: EmployerDetailsComponent },
            { path: 'confirmLetter', component: EmployerConfirmationLetterComponent },
            { path: 'selectCity', component: SelectCityComponent },
            { path: 'selectVehicle', component: VehicleDetailsComponent },
            { path: 'employerDetailsForLoan', component: EmployerDetailsForLoanComponent },
            { path: 'employmentType', component: EmploymentType },
            { path: 'selfemploymentbusiness', component: SelfEmploymentBusinessComponent },
            { path: 'selfemploymentprofessional', component: SelfEmploymentProfessionalComponent },
            { path: 'emicalculater', component: Emicalculater },
            { path: 'employerExtraInfoForLoan', component: EmployerExtraInfoForLoan },
            { path: 'personalBasicInfoVehicleLoan', component: PersonalBasicInfoVehicleLoan },
            { path: 'personalContactInfoVehicleLoan', component: PersonalContactInfoVehicleLoan },
            { path: 'documentsForVehicleLoan', component: DocumentsForVehicleLoan, children: DOC_UPLOAD_ROUTES },


        ]
    },
    { path: 'home', component: HomeComponent },
    { path: 'home/:appid', component: HomeComponent },
    { path: 'home/:chat_bot/:appid', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'logout', component: LogoutComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'upsell', component: UpsellComponent },
    { path: 'genericEMICalcuater', component: GenericEMICalcuater }
    // { path: 'vehicleLoan', component: CarLoanComponent } 

];
export const routing = RouterModule.forRoot(APP_ROUTES);

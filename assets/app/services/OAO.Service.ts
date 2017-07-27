import { Injectable, EventEmitter } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import { PersonalDetailsObject } from "../interfaces/personalDetails.interface";
import { UserDetailsObject } from "../interfaces/userDetails.interface"; //chandan
import { VehicleLoanDetails } from "../interfaces/vehicleLoanDetails.interface";
@Injectable()
export class OAOService
{
  //private baseURL:string = "http://localhost:5000";
   private baseURL:string = "https://oaoindiastackdev.herokuapp.com";
    //private baseURL:String = "https://empoweronboardindia.herokuapp.com";
    //private baseURL:string = "http://192.168.2.66:5000";
    data:PersonalDetailsObject;

    emailVerificationFlag:boolean=false;
    mobileVerificationFlag:boolean=false;
    userExistingFlag:boolean; //chandan
    loginFlag:boolean=false;//chandan
    userDetailsObject = new UserDetailsObject('', '');  //chandan
    personalDetailsObject= new PersonalDetailsObject('', '', '', '', '', '', ''); //chandan
    callMatchingCustomerFlag:boolean=false;

    vehicleLoanObject=new VehicleLoanDetails();

    progressBardata: string[] = ['','','','',''];
    progressBarChangeEvent = new EventEmitter<string[]>();
    private isResume: boolean = false;
    private language: string ='English';
    changelangEvent = new EventEmitter<string>();
    private digilockerConfig;
   private upsellFlag:boolean=false;
   //
    constructor(private http: Http) {}


     setEmailVerificationFlag(emailVerificationFlag:boolean){
        this.emailVerificationFlag=emailVerificationFlag;
     }
      getEmailVerificationFlag(){
        return this.emailVerificationFlag;
      }

       setMobileVerificationFlag(mobileVerificationFlag:boolean){
        this.mobileVerificationFlag=mobileVerificationFlag;
     }
      getMobileVerificationFlag(){
        return this.mobileVerificationFlag;
      }
      setUpsellFlag(upsellFlag:boolean){
        this.upsellFlag=upsellFlag;
      }
       getUpsellFlag(){
        return this.upsellFlag;
      }
      getEmployersDetails(){
        return this.http.get(`${this.baseURL}/api/employers`)
            .map((response: Response) => response.json());
      }


      
	//-------------onlineIdcheck----------------
      onlineIdcheck(user: PersonalDetailsObject) {
        const body = JSON.stringify(user);
        //console.log("onlineIdcheck"+body);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(`${this.baseURL}/idcheck/onlineidcheck`, body, {headers: headers})
            .map((response: Response) => response.json())
    }
    //------------------By Rajath-------------

//chandan
    setVehicleLoanObject(vehicleLoanObject:VehicleLoanDetails){
        this.vehicleLoanObject=vehicleLoanObject;
    }
    
    getVehicleLoanObject(){
        return this.vehicleLoanObject;
    }

     setPersonalDetailsObject(personalDetailsObject:PersonalDetailsObject){
        this.personalDetailsObject=personalDetailsObject;
    }
    getPersonalDetailsObject(){
        return this.personalDetailsObject;
    }
    setUserDetailsObject(userDetailsObject:UserDetailsObject){
       // console.log("service setUserDeatils()")
        this.userDetailsObject=userDetailsObject;
    }
    getUserDetailsObject(){
        //console.log("service getUserDetailsObject()");
        return this.userDetailsObject;
    }

    setUserExistingFlag(userExistingFlag:boolean){
        this.userExistingFlag=userExistingFlag;
    }
    getUserExistingFlag(){
        return this.userExistingFlag;
    }

    Login(user:UserDetailsObject)
    {
        const body = JSON.stringify(user);
       // console.log("service Login()"+body);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(`${this.baseURL}/loginAPI/login`, body, {headers: headers})
            .map((response: Response) => response.json())
    }

    GetLoginUserDetails(user:UserDetailsObject)
    {
        const body = JSON.stringify(user);
       // console.log("service GetUserDetails()"+body);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(`${this.baseURL}/loginAPI/getLoginUserDetails`, body, {headers: headers})
            .map((response: Response) => response.json())
    }

    setLoginFlag(loginFlag:boolean){
        this.loginFlag=loginFlag;
    }
    getLoginFlag(){
        return this.loginFlag;
    }

    registerInternetBanking(user:UserDetailsObject)
    {
        const body = JSON.stringify(user);
       // console.log("service registerInternetBanking()"+body);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(`${this.baseURL}/loginAPI/regIntBanking`, body, {headers: headers})
            .map((response: Response) => response.json());
    }

    logout(){
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.get(`${this.baseURL}/loginAPI/logout`, {headers: headers})
            .map((response: Response) => response.json());
    }
    setCallMatchingCustomerFlag(callMatchingCustomerFlag:boolean){
        this.callMatchingCustomerFlag=callMatchingCustomerFlag;
    }
    getCallMatchingCustomerFlag(){
        return this.callMatchingCustomerFlag;
    }
    checkMatchingCustomer(user:PersonalDetailsObject){
        const body = JSON.stringify(user);
        //console.log("service registerInternetBanking()"+body);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(`${this.baseURL}/loginAPI/checkDup`, body, {headers: headers})
            .map((response: Response) => response.json());
    }
//chandan

     OAOCreateOrUpdateApplicant(user: PersonalDetailsObject) {
        const body = JSON.stringify(user);
        console.log("OAOCreateOrUpdateApplicant() service"+body);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(`${this.baseURL}/api/Applicants`, body, {headers: headers})
            .map((response: Response) => response.json())
    }

   OAOCreateOrUpdateSalaryApplicant(user: PersonalDetailsObject) {
        const body = JSON.stringify(user);
        //console.log("service"+body);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(`${this.baseURL}/api/salaryApplication`, body, {headers: headers})
            .map((response: Response) => response.json())
    }

       OAOCreateOrUpdateVehicleApplicant(user: PersonalDetailsObject) {
           console.log("OAOCreateOrUpdateVehicleApplicant");
        const body = JSON.stringify(user);
        //console.log("service"+body);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(`${this.baseURL}/api/vehicleLoanApplication`, body, {headers: headers})
            .map((response: Response) => response.json())
    }

    

    OAOCreateOrUpdatePersonalloanApplicant(user: PersonalDetailsObject) {
        const body = JSON.stringify(user);
        //console.log("service"+body);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(`${this.baseURL}/api/PersonalLoanApplicants`, body, {headers: headers})
            .map((response: Response) => response.json())
    }

    GetPropertyDetails(PropertyType:String,Property:String){
         return this.http.get(`${this.baseURL}/api/PropertyDetails/`+PropertyType+'/'+Property)
            .map((response: Response) => response.json(), (err)=>{console.log(err)})
    }

     GetProductDetail(ProductCode:String){
        return this.http.get(`${this.baseURL}/api/ProductDetails/`+ProductCode)
            .map((response: Response) => response.json())
    }

      GetApplicantsDetail(Applicants_id:String){
        // console.log("apppp"+Applicants_id);
         return this.http.get(`${this.baseURL}/api/ApplicantsRecord/`+Applicants_id)
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    setData(data:PersonalDetailsObject){
        this.data=data;
    }
    getData(){
        return this.data;
    }
    getConfig(){
     return this.http.get(`${this.baseURL}/api/getConfig`)
            .map((response: Response) => response.json())
    
    }

    getConfigByKey(key: string, lang){
        return this.http.get(`${this.baseURL}/api/getConfig/${key}/${lang}`)
            .map((response: Response) => response.json())
    }

    prod_code:string;
    updatesection(section:String,app_id:String){
       
        this.prod_code= this.personalDetailsObject.product_type_code;
        return this.http.get(`${this.baseURL}/api/UpdateSection/`+app_id+'/'+section+'/'+this.prod_code)
            .map((response: Response) => response.json())
    }

    setFb:boolean=false;
    setFbData(set:boolean){
        this.setFb=set;
    }
    getFbData(){
        return this.setFb;
    }

    setProgressBardata(data: string[]){
        this.progressBardata = data;
        this.progressBarChangeEvent.emit(this.progressBardata);
    }

     getProgressBardata(){
        return this.progressBardata;
    }
//OTP
  
   sendOTP(mobile:string,dob:string){
        const body = JSON.stringify({mobile:mobile,dob:dob});
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(`${this.baseURL}/api/sendOTP`, body, {headers: headers})
            .map((response: Response) => response.json())
    }


    checkOTP(otp:number, app_id:string){
        const body = JSON.stringify({varify_otp:otp, app_id});
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(`${this.baseURL}/api/verifyOTP`, body, {headers: headers})
            .map((response: Response) => response.json());
    }

    // OTP verification for mobile and email - India
    sendOtpToEmail(email: string){
       // console.log("inside email service");
        const body = JSON.stringify({email_m:email});
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(`${this.baseURL}/api/sendOtpForVerification`, body, {headers: headers})
            .map((response: Response) => response.json())
    }

    sendOtpToMobile(mobile: string){
        console.log("service sendOtpToMobile():" +mobile);
        const body = JSON.stringify({mobile_number:mobile});
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(`${this.baseURL}/api/sendMobileOTP`, body, {headers: headers})
            .map((response: Response) => response.json())
    }

    getBaseUrl(){
        return this.baseURL;
    }

    public getLang(){
        return this.language;
    }
    public setLang(language: string){
        this.language = language;
    }

    fetchDigilockerConfig()
    {
        return this.http.get(`/digilocker/config`)
            .map((response: Response) => response.json(), (err)=>{console.log(err)})
    }

    fetchDigilockerDocument(docInfo){
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(`/digilocker/fetch`, docInfo, {headers: headers})
            .map((response: Response) => response.json());
    }

    removeUploadedFile(fileName:string, docType:string)
    {
        let app_id = this.personalDetailsObject.application_id || this.personalDetailsObject.app_id;
        return this.http.get(`/remove/${app_id}/${docType}/${fileName}`)
            .map((response: Response) => response.json(), (err)=>{console.log(err)})
    }

    setDigilockerConfig(config){
        this.digilockerConfig = config;

    }
    
    getDigiLockerConfig(){
        return this.digilockerConfig;
    }

    OAOCrossSellCreate(user: PersonalDetailsObject) {
        const body = JSON.stringify(user);
        //console.log("service"+body);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(`${this.baseURL}/api/CrossSellApplicants`, body, {headers: headers})
            .map((response: Response) => response.json())
    }
    
    generateApplicationID()
    {
        return this.http.get('/api/generateApplicationId')
            .map((response: Response) => response.json(), (err)=>{console.log(err)})
    }

    getAttachmentsByDocType(docType:string){
        let app_id = this.personalDetailsObject.application_id || this.personalDetailsObject.app_id;
        return this.http.get(`/api/attachments/${app_id}/${docType}`)
            .map((response: Response) => response.json(), (err)=>{console.log(err)})
    }

    downloadAttachments(app_id: String){
        return this.http.get(`/api/files/download/${app_id}`)
            .map((response: Response) => response.json(), (err)=>{console.log(err)})
    }

    cmisFileUpload(app_id:string, doc_type:string, fileName:string){
        let headers = new Headers();
        headers.append('application_id',`${app_id}`);
        headers.append('doc_type',`${doc_type}`);
        headers.append('filename',`${fileName}`);
        return this.http.get(`/cmis/upload`, {headers: headers})
            .map((response: Response) => response.json(), (err)=>{console.log(err)})
    }

    resume:boolean;
    pro_bar:string[];
    setResumeFlag(resume:boolean){
        this.resume=resume;
    }
    getResumeFlag(){
        return this.resume;
    }
    setPro_bar(pro_bar:string[]){
        this.pro_bar=pro_bar;
    }
    getPro_bar(){
        return this.pro_bar;
    }
    setResumeStatus(status: boolean){
        this.isResume = status;
    }
    getResumeStatus(){
        return this.isResume;
    }
	
	   chatBotUserDetails(app_id:string)
    {
        const body = JSON.stringify({application_id:app_id});
        console.log(body);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(`${this.baseURL}/api/chatBotUserDetails`, body, {headers: headers})
            .map((response: Response) => response.json())
    }


    generateAadhaarOTP(aadhaar:string){
        return this.http.post(`${this.baseURL}/uidai/otp`, {aadhaar})
                .map((response: Response)=> response.json(), (error)=> console.log(error));
    }

    sendAadhaarEkycRequest(aadhaar:string, otp:string){
        return this.http.post(`${this.baseURL}/uidai/ekyc`, {aadhaar, otp})
                .map((response: Response)=> response.json(), (error)=> console.log(error));
    }

        getCityNames(){
        return this.http.get(`${this.baseURL}/api/getCityNames`)
            .map((response: Response) => response.json());
    }
      getVehicleNames(query:string){
        return this.http.get(`${this.baseURL}/api/getVehicleNames/${query}`)
            .map((response: Response) => response.json());
    }

    getVehicleExShowRoomPrice(query:string){
        return this.http.get(`${this.baseURL}/api/getVehicleExShowRoomPrice/${query}`)
            .map((response: Response) => response.json());
    }

      getEmploymentType(){
          return this.http.get(`${this.baseURL}/api/employerstype`)
            .map((response: Response) => response.json());
      }

      getResidenceType(){
          return this.http.get(`${this.baseURL}/api/residenceType`)
            .map((response: Response) => response.json());
      }

}

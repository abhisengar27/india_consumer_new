export class VehicleLoanDetails {
    constructor(
        public vehicleLoanType?: string,
        public city?: string,
        public vehicle_make?: string,
        public vehicle_onroad_price?: string,
        public netIncome?: string,
        public employer?: string,
        public employertype?: string,
        public Work_experience?: string,
        public noMonths?: number,
        public PAT?: string,
        public SelfEmploymentProfessionalProfession?: string,
        public threeYearsIncome?: number,
        public onroadprice_85?: number,
        public loan_eligible_amount?: number,
        public loanTerm?:number,
        public emi?: number,
        public loanAmount?:number,
        public max_emi?: number,
        public min_emi?:number,
        public interestPayable?: number,
        public totalPayableAmount?: number,
        public designation?:string,
        public workEmailId?:string,
        public officeLandLine?:string,
        public workaddress?:string,
        public buildingNo?:number

    ) {
        this.vehicleLoanType = vehicleLoanType;
        this.city = city;
        this.vehicle_make = vehicle_make;
        this.netIncome = netIncome;
        this.vehicle_onroad_price = vehicle_onroad_price;
        this.employer = employer;
        this.employertype = employertype;
        this.Work_experience = Work_experience;
        this.noMonths = noMonths;
        this.PAT = PAT;
        this.SelfEmploymentProfessionalProfession = SelfEmploymentProfessionalProfession;
        this.threeYearsIncome = threeYearsIncome;
        this.onroadprice_85 = onroadprice_85;
        this.loan_eligible_amount = loan_eligible_amount;
        this.emi = emi;
        this.loanAmount=loanAmount;
        this.loanTerm=loanTerm;
        this.min_emi=min_emi;
        this.max_emi = max_emi;
        this.interestPayable = interestPayable;
        this.totalPayableAmount = totalPayableAmount;
        this.workEmailId=workEmailId;
        this.designation=designation;
        this.officeLandLine=officeLandLine;
        this.workaddress=workaddress;
        this.buildingNo=buildingNo;
    }
}
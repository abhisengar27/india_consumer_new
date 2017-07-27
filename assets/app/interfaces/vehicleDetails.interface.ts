export class VehicleDetails {
    constructor(
        public vehicleMake?: string,
        public vehicleModel?: string,
        public vehicleVariant?: string,
         public vehicleSubVariant?: string,
         public vehicle_X_Price?: string
    ){
        this.vehicleMake = vehicleMake;
        this.vehicleModel = vehicleModel;
        this.vehicleVariant = vehicleVariant;
        this.vehicleSubVariant =vehicleSubVariant;
         this.vehicle_X_Price =vehicle_X_Price;
    }

}
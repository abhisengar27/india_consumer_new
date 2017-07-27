var mongoose = require('mongoose');
var OAOVehicleDetailsSchema = new mongoose.Schema({
vehicle_make: { type: String },
vehicle_model: { type: String },
vehicle_variant: { type: String },
vehicle_sub_variant: { type: String },
model_year: { type: Number },
on_road_price: { type: Number },
delete_flag: { type: String }
})
module.exports = mongoose.model('OAOVehicleDetailsSchema', OAOVehicleDetailsSchema);
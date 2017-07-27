var mongoose = require('mongoose');
 
var OAOVehicleDetailsNewSchema = new mongoose.Schema({
vehicle_make: { type: String },
model_year: { type: Number },
ex_showroom_price: { type: Number },
delete_flag: { type: String }
})
module.exports = mongoose.model('OAOVehicleDetailsNewSchema', OAOVehicleDetailsNewSchema);
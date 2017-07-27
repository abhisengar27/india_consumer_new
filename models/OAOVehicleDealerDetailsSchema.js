var mongoose = require('mongoose');
var OAOVehicleDealerDetailsSchema = new mongoose.Schema({
dealer_name : {type: String},
dealer_Email_id : {type: String},
dealer_Contact_number : {type: String}
})
 
module.exports = mongoose.model('OAOVehicleDealerDetailsSchema',OAOVehicleDealerDetailsSchema);
var mongoose = require('mongoose');
var OAOCityDetailsSchema = new mongoose.Schema({
city: {type: String},
state: {type: String},
priority_flag: {type: String},
delete_flag: {type: String}
})
 
module.exports = mongoose.model('OAOCityDetailsSchema', OAOCityDetailsSchema);
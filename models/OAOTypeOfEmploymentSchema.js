var mongoose = require('mongoose');
 
var OAOTypeOfEmploymentSchema = new mongoose.Schema({
employment_type: {type: String},
delete_flag : {type: String}
})
 
module.exports = mongoose.model('OAOTypeOfEmploymentSchema', OAOTypeOfEmploymentSchema);
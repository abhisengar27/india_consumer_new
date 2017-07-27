var mongoose = require('mongoose');
 
var OAOResidenceTypeSchema = new mongoose.Schema({
residence_type: { type: String },
delete_flag: { type: String }
})
module.exports = mongoose.model('OAOResidenceTypeSchema', OAOResidenceTypeSchema);
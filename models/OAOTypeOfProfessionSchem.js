var mongoose = require('mongoose');
 
var OAOTypeOfProfessionSchema = new mongoose.Schema({
profession: {type: String},
delete_flag : {type: String}
})
 
module.exports = mongoose.model('OAOTypeOfProfessionSchema', OAOTypeOfProfessionSchema);
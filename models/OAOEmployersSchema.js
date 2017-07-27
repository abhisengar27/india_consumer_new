var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OAOEmployersSchema = new Schema({
                employer_name:{type: String},
                employer_address: {type: String},
                employer_email: {type: String},
                preferentials :[{
                                    loanInt :{type: String}
                                }] ,
                delete_flag:{type:String}
    });

module.exports = mongoose.model('OAOEmployersSchema', OAOEmployersSchema);

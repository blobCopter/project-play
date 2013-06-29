var mongoose = require('mongoose');

var requestSchema = mongoose.Schema({
	
	request_type : {type: String, default: "friend"},
	from : {type:String, required : true},
	to : {type: String, required: true},
	msg : {type: String, default: ""},
	creationDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Request', requestSchema);
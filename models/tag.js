var mongoose = require('mongoose');

/**
* SCHEMA
*
*/
var tagSchema = mongoose.Schema({
	name: {type: String, unique: true, required: true},
	tag_count: {type: Number, default:0}
});

module.exports = mongoose.model('Tag', tagSchema);
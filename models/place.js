var mongoose = require('mongoose');

var placeSchema = mongoose.Schema({
	username : { type : String, required : true },
	creationDate: { type: Date, default: Date.now },
	geo: { type : [Number], index : '2d'}
});

placeSchema.methods.findNear = function(cb) {

	var km = function(distance) { return (distance/111.12); } 

	return this.model('Place').find({geo: { $near: this.geo, $maxDistance: km(2)} }, cb);
}

module.exports = mongoose.model('Place', placeSchema);
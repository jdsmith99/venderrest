var mongoose = require("mongoose"),
	Schema = mongoose.Schema;

var ItemRatingSchema = new Schema({
	rating: Number,
	description: String,
	date : {type : Date, default : Date.now}
});

var ItemSchema = new Schema ({
	name : String,
	description : String,
	code : String,
	cost : {type: Number, default : 1},
	active : {type : Boolean, default : false},
	ratings : [ItemRatingSchema]
});

module.exports = mongoose.model("ItemRating", ItemRatingSchema);
module.exports = mongoose.model("Item", ItemSchema);
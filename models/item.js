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
	cost : Number,
	active : {type : Boolean, default : false},
	weight : Number,
	calories : Number,
	glutenFree : Boolean,
	lowSugar : Boolean,
	nutFree : Boolean,
	highFiber : Boolean,
	organic : Boolean,
	kosher : Boolean,
	vegan : Boolean,
	ratings : [ItemRatingSchema],
	imageUri : String
});

module.exports = mongoose.model("ItemRating", ItemRatingSchema);
module.exports = mongoose.model("Item", ItemSchema);
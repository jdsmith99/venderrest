var mongoose = require("mongoose"),
	Schema = mongoose.Schema;

var PurchaseSchema = new Schema({
	item : {type: Schema.Types.ObjectId, ref: 'Item'},
	account : {type : Schema.Types.ObjectId, ref : 'Account'},
	amount : Number,
	purchaseDate : {type : Date, default : Date.now}
});

module.exports = mongoose.model("Purchase", PurchaseSchema);
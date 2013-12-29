var mongoose = require("mongoose"),
	Schema = mongoose.Schema;


var EmployeeSchema = new Schema ({
	name : String,
	employeeId : String,
	employeeCode : String,
	note : String,
	credits : {type: Number, default: 100},
	active : {type: Boolean, default: "True"},
	lastUpdated : {type: Date, default: Date.now},
	dailyLimit : {type: Number, default: 3},
	purchases : [{ type: Schema.Types.ObjectId, ref: 'Purchase'}],
	exceptions : [{type : Schema.Types.ObjectId, ref: 'Exception'}]
});

module.exports = mongoose.model("Employee", EmployeeSchema);
var mongoose = require("mongoose"),
	exception = require("../models/exception.js");

module.exports = Exception;

function Exception(connection) {
	//mongoose.connect(connection);
}

Exception.prototype = {
	get: function (req, res) {
		var queryFilter = null;
		//console.log("filter" + req.body.filter);
		if (req.body.filter)
		{
			//console.log("applying filter");
			queryFilter = req.body.filter;
		}
		exception.find(queryFilter, function (err, items) {
				//console.log(items);
				res.send(items);
			});
	},

	add: function (req, res) {
		var parmException = req.body;
		var newException = new exception(parmException);
		newException.save(function (err, newException) {
  				if (err) // TODO handle the error
  				{
  					res.send(500, error);
  				}
  				else {
  					res.send(newException);
					//console.log(newEmployee);
  				}
			});
	},

	getExceptionById: function (req, res) {
		var id = req.params.id;
		exception.findById (id, function (err, item) {
				console.log(item);
				res.send({exception: item});
		});
	},

	remove: function (req, res) {
		var queryFilter = null;
		//console.log("filter" + req.body.filter);
		if (req.body.filter)
		{
			//console.log("applying filter");
			queryFilter = req.body.filter;
		}

		exception.remove(queryFilter, function (err, numberAffected) {
			if(err){
				res.send(err);
			}
			else {
				res.send(200, {rows: numberAffected});
			}

		});
	}
};
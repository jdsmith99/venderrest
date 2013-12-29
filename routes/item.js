var mongoose = require("mongoose"),
	item = require("../models/item.js"),
	traceback = require("traceback");

module.exports = Item;

function Item(connection) {
	//mongoose.connect(connection);
}

Item.prototype = {
	get: function (req, res) {
		var queryFilter = null;
		//console.log("filter" + req.body.filter);
		if (req.body.filter)
		{
			//console.log("applying filter");
			queryFilter = req.body.filter;
		}
		item.find(queryFilter, function (err, items) {
				//console.log(items);
				res.send(items);
			});
	},

	add: function (req, res) {
		var parmItem = req.body;
		var newItem = new item(parmItem);
		newItem.save(function (err, newItem) {
  				if (err) // TODO handle the error
  				{
  					res.send(500, error);
  				}
  				else {
  					res.send(newItem);
					//console.log(newEmployee);
  				}
			});
	},

	activate: function (req, res) {
		var id = req.params.id;
		item.update ({_id : id}, {active : true}, {multi : false}, function (err, numAffected) {
			if (err) {
				res.send(500, err);
			}
			else
			{
				res.send(200, {rows : numAffected});
			}
		});

	},

	deactivate: function (req, res) {
		var id = req.params.id;
		item.update ({_id : id}, {active : false}, {multi : false}, function (err, numAffected) {
			if (err) {
				res.send(500, err);
			}
			else
			{
				res.send(200, {rows : numAffected});
			}
		});

	},

	getItemById: function (req, res) {
		var id = req.params.id;
		item.findById (id, function (err, item) {
				console.log(item);
				res.send({item: item});
		});
	},

	getItemRatingsByItemId: function (req, res) {
		var id = req.params.id;
		item.findById (id, function (err, item) {
				console.log(item);
				res.send({ratings: item.ratings});
		});
	}
};
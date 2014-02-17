var mongoose = require("mongoose"),
	account = require("../models/account.js"),
	purchaseItem = require("../models/item.js"),
	purchase = require("../models/purchase.js"),
	traceback = require("traceback");

module.exports = Account;

function Account(connection) {
	//mongoose.connect(connection);
}

Account.prototype = {
	get: function (req, res) {
		var queryFilter = null;
		//console.log("filter" + req.body.filter);
		if (req.body.filter)
		{
			//console.log("applying filter");
			queryFilter = req.body.filter;
		}
		account.find(queryFilter, function (err, items) {
				//console.log(items);
				res.send(items);
			});
	},


	add: function (req, res) {
		var parmAccount = req.body;
		
		/*
		uncomment for batch load
		parmEmployee.forEach( function saveEmployee(element, index, array) {

				var newEmployee = new employee(element);
				newEmployee.save(function (err, newEmployee) {
  					if (err) // TODO handle the error
  					{
  						res.send(500, error);
  					}
				});
		});

		res.send(200);
		
		return;
		*/
		var newAccount = new account(parmAccount);
		newAccount.save(function (err, newAccount) {
  				if (err) // TODO handle the error
  				{
  					res.send(500, error);
  				}
  				else {
  					res.send(newAccount);
					//console.log(newEmployee);
  				}
			});
	},

	addCredits: function (req, res) {
		var queryFilter = null;
		//console.log("filter" + req.body.filter);
		if (req.body.filter)
		{
			//console.log("applying filter");
			queryFilter = req.body.filter;
		}
		account.update(queryFilter, {credits : req.body.credits}, {multi : true}, function (err, numberAffected) {
			if (err) {
				res.send(500, err);
			}
			else
			{
				res.send(200, {rows : numberAffected});
			}
		});
	},

	activate: function (req, res) {
		var id = req.params.id;
		account.update ({_id : id}, {active : true}, {multi : false}, function (err, numAffected) {
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
		account.update ({_id : id}, {active : false}, {multi : false}, function (err, numAffected) {
			if (err) {
				res.send(500, err);
			}
			else
			{
				res.send(200, {rows : numAffected});
			}
		});

	},

	getAccountById: function (req, res) {
		var id = req.params.id;

		account.findOne ({ _id : id, isActive : "yes"}, function (err, item) {
				console.log(item);
				//res.send(item);
				var opts = [{path: 'purchases'}];
				account.populate(item, opts, function (err, results) {
					if (err) {
						res.send(err);
					}
					else {
						console.log("populating purchases");
						res.send(results);
					}


				});

		});

		return;

		account.findById (id, function (err, item) {
				console.log(item);
				//res.send(item);
				var opts = [{path: 'purchases'}];
				account.populate(item, opts, function (err, results) {
					if (err) {
						res.send(err);
					}
					else {
						console.log("populating purchases");
						res.send(results);
					}


				});

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

		account.remove(queryFilter, function (err, numberAffected) {
			if(err){
				res.send(err);
			}
			else {
				res.send(200, {rows: numberAffected});
			}

		});
	}
};
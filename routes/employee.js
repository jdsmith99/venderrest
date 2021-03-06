var mongoose = require("mongoose"),
	employee = require("../models/employee.js"),
	purchaseItem = require("../models/item.js"),
	purchase = require("../models/purchase.js"),
	traceback = require("traceback");

module.exports = Employee;

function Employee(connection) {
	//mongoose.connect(connection);
}

Employee.prototype = {
	get: function (req, res) {
		var queryFilter = null;
		//console.log("filter" + req.body.filter);
		if (req.body.filter)
		{
			//console.log("applying filter");
			queryFilter = req.body.filter;
		}
		employee.find(queryFilter, function (err, items) {
				//console.log(items);
				res.send(items);
			});
	},

	add: function (req, res) {
		var parmEmployee = req.body;
		
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
		var newEmployee = new employee(parmEmployee);
		newEmployee.save(function (err, newEmployee) {
  				if (err) // TODO handle the error
  				{
  					res.send(500, error);
  				}
  				else {
  					res.send(newEmployee);
					//console.log(newEmployee);
  				}
			});
	},

	update: function (req, res) {

		var parmEmployee = req.body;
		var parmId = parmEmployee._id
		var newEmployee = employee(parmEmployee);

		//console.log("body: " + newEmployee);
		//console.log("id: " + parmId);
		employee.findById (parmId, function (err, employee) {
			if (err) {
				res.send(500, err)
				return;
			}
			//console.log(newEmployee);
			//console.log(employee);
			if (newEmployee.name != null) employee.name = newEmployee.name;
			if (newEmployee.employeeCode != null) employee.employeeCode = newEmployee.employeeCode;
			if (newEmployee.employeeId != null) employee.employeeId = newEmployee.employeeId;
			if (newEmployee.note != null) employee.note = newEmployee.note;
			//if (newEmployee.credits != null) employee.credits = newEmployee.credits;
			//if (newEmployee.active != null)	employee.active = newEmployee.active;
			if (newEmployee.dailyLimit != null) employee.dailyLimit = newEmployee.dailyLimit;
			employee.save ( function (err, updatedEmployee){
				if (err) {
					res.send(500, err)
					return;
				}

				res.send(200, updatedEmployee);
			});
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
		employee.update(queryFilter, {credits : req.body.credits}, {multi : true}, function (err, numberAffected) {
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
		employee.update ({_id : id}, {active : true}, {multi : false}, function (err, numAffected) {
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
		employee.update ({_id : id}, {active : false}, {multi : false}, function (err, numAffected) {
			if (err) {
				res.send(500, err);
			}
			else
			{
				res.send(200, {rows : numAffected});
			}
		});

	},

	getEmployeeById: function (req, res) {
		var id = req.params.id;
		employee.findById (id, function (err, item) {
				console.log(item);
				//res.send(item);
				var opts = [{path: 'purchases'}];
				employee.populate(item, opts, function (err, results) {
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

		employee.remove(queryFilter, function (err, numberAffected) {
			if(err){
				res.send(err);
			}
			else {
				res.send(200, {rows: numberAffected});
			}

		});
	}
};
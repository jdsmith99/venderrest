var mongoose = require("mongoose"),
	purchase = require("../models/purchase.js"),
	employee = require("../models/employee.js"),
	item = require("../models/item.js"),
  exception = require("../models/exception.js"),
  traceback = require('traceback');

module.exports = Purchase;

function Purchase(connection) {
	//mongoose.connect(connection);
}

Purchase.prototype = {
	get: function (req, res) {
		var queryFilter = null;
		//console.log("filter" + req.body.filter);
		if (req.body.filter)
		{
			//console.log("applying filter");
			queryFilter = req.body.filter;
		}
		purchase.find(queryFilter, function (err, items) {
				//console.log(items);
				res.send(items);
			});
	},

  addTemp: function (req, res) {
    var parmEmployee = req.body.employee;
    var newEmployee = new employee(parmEmployee);
    var parmItem = req.body.item;
    var newItem = new item(parmItem);
    var excep = new exception();
    var itemQueryParam;

    var stack = traceback();

    console.log ("adding purchase");

    if (parmItem)
    {
      console.log(newItem);

      if(newItem.code)
      {
        itemQueryParam = "{code : " + newItem.code + "}";

      }
      else if (newItem._id)
      {
        itemQueryParam = "{_id : " + newItem._id + "}";

      }
      else
      {
            excep.source = functionName + " line: " + stack[0].line;
            excep.descripton = "Must include valid Item id or Item code.";
            excep.save (function (err, newException) {
              res.send(403, {exception: newException._id});
              });
            return;
      }
    }
    else
    {
      excep.source = functionName + " line: " + stack[0].line;
      excep.descripton = "Must include valid Item entity.";
      excep.save (function (err, newException) {
        res.send(403, {exception: newException._id});
      });
      return;

    }

    item.find (itemQueryParam, function (err, foundItems) {
        if (err) {

            excep.source = functionName + " line: " + stack[0].line;
            excep.error = err;
            excep.save (function (err, newException) {
              res.send(403, {exception: newException._id});
            });
        }
        else
        {
          
          res.send(foundItems);
        }
    });


  },

	add: function (req, res) {
		var parmEmployee = req.body.employee;
		var newEmployee = new employee(parmEmployee);
		var parmItem = req.body.item;
		var newItem = new item(parmItem);
    var excep = new exception();
    var itemQueryParam;

    var stack = traceback();
    var functionName = stack[0].name;

    //if an item code is passed, use that for lookup. otherwise, use the item's id

    if (!parmItem)
    {
      excep.source = functionName + " line: " + stack[0].line;
      excep.descripton = "Must include valid Item entity.";
      excep.save (function (err, newException) {
        res.send(403, {exception: newException._id});
      });
      return;

    }
    else if (!parmItem.code && ! parmItem._id)
    {
      excep.source = functionName + " line: " + stack[0].line;
      excep.descripton = "Must include valid Item id or Item code.";
      excep.save (function (err, newException) {
      res.send(403, {exception: newException._id});
        });
      return;
    }
    else
    {
      //console.log(itemQueryParam);
  		// find item
      var query;
      if(parmItem.code)
      {
          query =  item.find({code : newItem.code, active : true});
      }
      else
      {
          query =  item.find({_id : newItem._id, active : true});

      }

  		query.exec (function (err, foundItems) {
        console.log("found Items: " + foundItems);

  			if (err) {
            excep.source = functionName + " line: " + stack[0].line;
            excep.error = err;
            excep.save (function (err, newException) {
              res.send(403, newException);
            });
  			}
        else if (foundItems.length != 1) {
            excep.description = "Invalid item or more than one Item matches code/Id.";
            excep.source = functionName + " line: " + stack[0].line;
            excep.save (function (err, newException) {
              if (err){

                console.log(err);
                res.send(403, "an exception occurred");
              }
              else {
                console.log("no exception");
                res.send(403, newException);
              }
            });

        }
  			else
  			{
          var foundItem = new item(foundItems[0]);

          if(!parmEmployee)
          {

            stack = traceback();
            excep.source = functionName + " line: " + stack[0].line;
            excep.description = "Must provide an employee entity.";
            excep.save (function (err, newException) {
              if(err)
              {
                //console.log("error occurred");
                console.log(err);
                res.send(400, err);
              }
              else {
                res.send(406, newException);
              }
            });
            return;
          }

  				// find employee
  				employee.findOne ({ _id : newEmployee._id, active : true},  function (err, foundEmployee) {
  				if (err) {
            // save exception
            excep.source = functionName + " line: " + stack[0].line;
            excep.error = err;
            excep.save (function (err, newException) {
              res.send(400, newException);
            });
  					//res.send(403, err);
  				}
          else if(!foundEmployee){
            excep.description = "Invalid employee or employee not active: " + parmEmployee._id;
            excep.source = functionName + " line: " + stack[0].line;
            excep.save (function (err, newException) {
              res.send(400, newException);
            });
          }
  				else {

  					//make sure employee has enough credits for purchase
  					if(foundEmployee.credits >= foundItem.cost)
  					{

  						//console.log(foundEmployee);
  						// make sure employee hasn't exceeded daily purchase limit
  						var topDateRange = new Date();
  						var botDateRange = new Date(topDateRange.getFullYear(), topDateRange.getMonth(), topDateRange.getDate());
  						
  							//.setMinutes(-topDateRange.getMinutes());
  						//console.log(topDateRange);
  						//console.log(botDateRange);
  						purchase.count({employee: foundEmployee, purchaseDate: {$lte : topDateRange}, purchaseDate: {$gte: botDateRange}}, function (err, count) {
  						//purchase.count({employee: foundEmployee}, function (err, count) {
  							if(err) {
  								excep.source = functionName + " line: " + stack[0].line;
                  excep.error = err;
                  excep.save (function (err, newException) {
                    res.send(400, newException);
  								});
                  return;
  							}

  							if (count >= foundEmployee.dailyLimit) {

                  excep.description = "Purchases exceeded daily limit.";
                  excep.source = functionName + " line: " + stack[0].line;
                  excep.save (function (err, newException) {
                    res.send(403, newException);
                    //save to employee
                    foundEmployee.exceptions.push(newException);
                    foundEmployee.save(function (err, savedEmployee){});
                  }); 
  								return;
  							}
  							else {
  									// save purchase
  									var newPurchase = new purchase();
  									newPurchase.employee = foundEmployee._id;
  									newPurchase.item = foundItem._id;
  									newPurchase.amount = foundItem.cost;
  									newPurchase.save(function (err, newPurchase) {
  									  	if (err) {
                          excep.source = functionName + " line: " + stack[0].line;
                          excep.error = err;
                          excep.save (function (err, newException) {
                            res.send(400, newException);
                          }); 
  									  	}
  									  	else {
  									  		foundEmployee.purchases.push(newPurchase);
  								  			foundEmployee.credits = foundEmployee.credits - foundItem.cost;
  								  			foundEmployee.save (function (err, savedEmployee) {
  								  			if(err) {
  								  				excep.source = functionName + " line: " + stack[0].line;
                            excep.error = err;
                            excep.save (function (err, newException) {
                              res.send(400, newException);
                            }); 
  								  			}		
  								  						
  								  			else {
  								  				res.send(200, newPurchase);
  								
  								  			}

  											});
  									  	}
  									});  
  							}
  						});

 						

  					}
  					else
  					{

  						// log exception
              excep.description = "Not enough credits for purchase: " + newItem._id;
              excep.source = functionName + " line: " + stack[0].line;
              excep.save (function (err, newException) {
                res.send(406, newException);
                //save to employee
                foundEmployee.exceptions.push(newException);
                foundEmployee.save(function (err, savedEmployee){});
              });              
  					}
  					
  				}
        });
      }
      });
    }

			//console.log(newEmployee);
			//res.send(403, "An error occurred.");
  				
	},

	remove: function (req, res) {
		var queryFilter = null;
		//console.log("filter" + req.body.filter);
		if (req.body.filter)
		{
			//console.log("applying filter");
			queryFilter = req.body.filter;
		}

		purchase.remove(queryFilter, function (err, numberAffected) {
			if(err){
				res.send(err);
			}
			else {
				res.send(200, {rows: numberAffected});
			}

		});
	}
};
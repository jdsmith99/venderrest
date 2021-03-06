var express = require('express'),
	//wines = require('./routes/wine'),
	utils = require('./routes/util'),
	Employee = require("./routes/employee"),
	Account = require("./routes/account"),
	Item = require("./routes/item"),
	Purchase = require("./routes/purchase"),
	Exception = require("./routes/exception"),
	Application = require("./routes/application");
var port = process.env.PORT || 1337;

var app = express();

var connectionString = process.env.PARAM1 || "mongodb://venderUser:Mellmen123!@ds059938.mongolab.com:59938/venderprod";
//var connectionString = process.env.PARAM1;
//var connectionString = "localhost:27017/drywall";

var appl = new Application(connectionString);
var employee = new Employee(connectionString);
var account = new Account(connectionString);
var item = new Item(connectionString);
var purchase = new Purchase(connectionString);
var exception = new Exception(connectionString);

app.use(express.bodyParser());
app.get("/util/getPort", utils.getPort);

//app.post("/employees/add", employee.add);
//app.get("/employees", employee.get);
//app.post("/employees", employee.get);
//app.put("/employees", employee.update);
//app.post("/employees/addCredits", employee.addCredits);
//app.post("/employees/remove", employee.remove);
//app.get("/employees/:id", employee.getEmployeeById);
//app.get("/employees/:id/activate", employee.activate);
//app.get("/employees/:id/deactivate", employee.deactivate);

app.post("/accounts/add", account.add);
app.get("/accounts", account.get);
app.post("/accounts", account.get);
app.post("/accounts/addCredits", account.addCredits);
app.post("/accounts/remove", account.remove);
app.get("/accounts/:id", account.getAccountById);
app.get("/accounts/:id/activate", account.activate);
app.get("/accounts/:id/deactivate", account.deactivate);

app.get("/items", item.get);
app.post("/items", item.get);
app.post("/items/add", item.add);
app.put("/items", item.update);
app.get("/items/:id", item.getItemById);
app.get("/items/:id/activate", item.activate);
app.get("/items/:id/deactivate", item.deactivate);
app.get("/items/:id/ratings", item.getItemRatingsByItemId);

app.get("/purchases", purchase.get);
app.post("/purchases", purchase.get);
app.post("/purchases/add", purchase.add);
app.post("/purchases/remove", purchase.remove);

app.get("/exceptions", exception.get);
app.get("/exceptions/:id", exception.getExceptionById);
app.post("/exceptions/remove", exception.remove);

app.listen(port);
console.log("Listening on port..." + port + "/n");

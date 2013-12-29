var mongoose = require("mongoose");

module.exports = Application;

function Application(connection) {
	mongoose.connect(connection);
}

Application.prototype = {

};


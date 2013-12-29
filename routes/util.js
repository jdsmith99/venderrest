var port = process.env.PORT || 1337;

exports.getPort = function (req, res) {
	res.send({port: port});
}; 
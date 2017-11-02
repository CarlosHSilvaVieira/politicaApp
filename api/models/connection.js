var mysql = require('sync-mysql');
var connection;

function conectar()
{
	var con = new mysql({
		host: "http://servidorti.database.windows.net",
	  	user: "root",
	  	password: "",
	  	database: "ti_bd"
	});

	return con;
};

connection = conectar();

module.exports = connection;

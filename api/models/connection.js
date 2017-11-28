var mysql = require('sync-mysql');
var connection;

function conectar()
{
	var con = new mysql({
		host: "localhost",
		port: 3306,
		user: "root",
		password: "",
		database: "ti_bd"
	});

	return con;
};

connection = conectar();

module.exports = connection;

/*
host: "us-cdbr-azure-southcentral-f.cloudapp.net",
port: 3306,
user: "be59789822ac80",
password: "f98668a2",
database: "mydb"
*/

/*
host: "localhost",
port: 3306,
user: "root",
password: "",
database: "ti_bd"
*/

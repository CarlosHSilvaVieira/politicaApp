var mysql = require('mysql');

function conectar()
{
	var con = mysql.createConnection({
		host: "us-cdbr-azure-southcentral-f.cloudapp.net",
		port: 3306,
		user: "be59789822ac80",
		password: "f98668a2",
		database: "mydb"
	});

	return con;
}

module.exports = conectar();

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

var connection = require('./connection');

model.exports.getSenadores = function()
{
	var query = "select * from deputados";
	var resultado = connection.query(query);
	return resultado;
}

model.exports.getSenador = function(nome)
{
	var query = "select * from deputados where nome = '"+ nome + "'";
	var resultado = connection.query(query);
	return resultado;
}

model.exports.getTweetsSenadores = function()
{
	var query = "select * from tweets_deputados";
	var resultado = connection.query(query);
	return resultado;
}

model.exports.getTweetsSenador = function(id_parlamentar)
{
	var query = "select * from tweets_deputados where id_parlamentar = "+ id_parlamentar + "";
	var resultado = connection.query(query);
	return resultado;
}

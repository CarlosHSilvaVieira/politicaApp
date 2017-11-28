var connection = require('./connection');
const processador = require('./processador/processador');

module.exports.getDeputados = function ()
{
	var query = "select * from deputados";
	var resultado = connection.query(query);
	return resultado;
}

module.exports.getDeputadosSemTweets = function()
{
	var query = "select * from deputados AS D left join tweets_deputados AS TD on (D.id = TD.id_parlamentar) where TD.id_parlamentar is null";
	var resultado = connection.query(query);
	return resultado;
}

module.exports.getDeputado = function(nome)
{
	var query = "select * from deputados where nome = '"+ nome.toLowerCase() + "'";
	var resultado = connection.query(query);
	return resultado;
}

module.exports.getTweetsDeputados = function ()
{
	var query = "select * from tweets_deputados";
	var resultado = connection.query(query);
	return resultado;
}

module.exports.getTweetsDeputado = function (id_parlamentar)
{
	var query = "select * from tweets_deputados where id_parlamentar = "+ id_parlamentar + "";
	var resultado = connection.query(query);
	return resultado;
}

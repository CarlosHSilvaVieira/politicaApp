var connection = require('./connection');

module.exports.getSenadores = function()
{
	var query = "select * from senadores";
	var resultado = connection.query(query);
	return resultado;
}

module.exports.getSenadoresSemTweets = function ()
{
	var query = "select * from senadores AS S left join tweets_senadores AS TS on (S.id = TS.id_parlamentar) where TS.id_parlamentar is null";
	var resultado = connection.query(query);
	return resultado;
}

module.exports.getSenador = function(nome)
{
	var query = "select * from senadores where nome = '"+ nome + "'";
	var resultado = connection.query(query);
	return resultado;
}

module.exports.getTweetsSenadores = function()
{
	var query = "select * from tweets_senadores";
	var resultado = connection.query(query);
	return resultado;
}

module.exports.getTweetsSenador = function(id_parlamentar)
{
	var query = "select * from tweets_senadores where id_parlamentar = "+ id_parlamentar + "";
	var resultado = connection.query(query);
	return resultado;
}

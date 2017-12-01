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

module.exports.getID = function(nome) {
	var query = "select id from senadores where nome = '"+ nome.toLowerCase() + "'";
	var resultado = connection.query(query);
	return resultado;
}

module.exports.getPolaridade = function (nome)
{
	var parlamentar = this.getID(nome);
	var query = "select polaridade from tweets_senadores where id_parlamentar = "+ parlamentar[0].id + "";
	var resultado = connection.query(query);
	return resultado;
}

module.exports.getPolaridadeByID = function (id)
{
	var query = "select polaridade from tweets_senadores where id_parlamentar = "+ id + "";
	var resultado = connection.query(query);
	return resultado;
}

module.exports.SenadoresQuantTweets = function(quant)
{
	var query = "select id, nome from senadores AS S inner join tweets_senadores AS TS on (S.id = TS.id_parlamentar) having count(TS.id_parlamentar) >= "+ quant;
	var resultado = connection.query(query);
	return resultado;
}

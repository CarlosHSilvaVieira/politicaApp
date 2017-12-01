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

module.exports.getID = function(nome) {
	var query = "select id from deputados where nome = '"+ nome.toLowerCase() + "'";
	var resultado = connection.query(query);
	return resultado;
}

module.exports.getPolaridade = function (nome)
{
	var parlamentar = this.getID(nome);
	var query = "select polaridade from tweets_deputados where id_parlamentar = "+ parlamentar[0].id + "";
	var resultado = connection.query(query);
	return resultado;
}

module.exports.getPolaridadeByID = function (id)
{
	var query = "select polaridade from tweets_deputados where id_parlamentar = "+ id + "";
	var resultado = connection.query(query);
	return resultado;
}

module.exports.DeputadosQuantTweets = function(quant)
{
	var query = "select id, nome from deputados AS D inner join tweets_deputados AS TD on (D.id = TD.id_parlamentar) having count(TD.id_parlamentar) >= "+ quant;
	var resultado = connection.query(query);
	return resultado;
}

var connection = require('../connection');
const classifier = require('classifier');
var bayes = new classifier.Bayesian();

module.exports.train = function ()
{
  var retorno = connection.query("select texto, resultado from learning");
  retorno.forEach(function(item, index)
  {
    bayes.train(item.texto, item.resultado);
  });
};

module.exports.salvarParaTreino = function(texto, resultado, local)
{
  var query = "insert into "+ local + " (texto, resultado) values ('"+texto+"', "+resultado+")";
  connection.query(query);
}

module.exports.classify = function (texto)
{
  return bayes.classify(texto);
}

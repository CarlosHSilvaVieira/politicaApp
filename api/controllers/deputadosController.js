var model = require('../models/deputadosModel.js');
const http = require('ajax-request');

var request = {
   url : "http://www.sentiment140.com/api/bulkClassifyJson",
   headers: {
     "Accept" : "application/json",
     "Content-Type" : "application/json"
   },
   data:
   {
     data: []
   }
 };

exports.createDeputado = function (req, res)
{
  //não será implementado
}

exports.getDeputado = function (req, res)
{
  var d = model.getDeputado(req.params.nomeDepuatdo);
  res.send(200, d);
}

exports.getAllDeputados = function (req, res)
{
  res.send(200, model.getDeputados());
}

exports.updateDeputado = function (req, res)
{
    //não será implementado
}

exports.deleteDeputado = function (req, res)
{
    //não será implementado
}

exports.analiseSentimeno = function (req, res)
{
  var id_parlamentar = model.getDeputado(req.params.nomeDepuatdo)[0].id;

  var tweets = model.getTweetsDeputado(id_parlamentar);

  tweets.forEach(function(item, index)
  {
    request.data.data.push({text: item.texto});
  });
  
  http.post(request, function(e, r, body)
  {
    //se a requisição retornar um erro
    if(e){res.send(500, {error: e});}

    //se estiver tudo de boas
    res.send(200, body);
  });
}

exports.getTweets = function (req, res)
{

}

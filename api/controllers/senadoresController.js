var model = require('../models/senadoresModel.js');
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

exports.getSenador = function (req, res)
{
  var d = model.getSenador(req.params.nomeDepuatdo);
  res.send(200, d);
}

exports.getAllSenadores = function (req, res)
{
  res.send(200, model.getSenadores());
}

exports.analiseSentimeno = function (req, res)
{
  var id_parlamentar = model.getSenador(req.params.nomeSenador);

  if (typeof id_parlamentar[0] !== "undefined")
  {
    var tweets = model.getTweetsSenador(id_parlamentar[0].id);
    if (typeof tweets[0] !== "undefined")
    {
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
    } else {
      res.send(200, {"data": "senador sem tweets"});
    }
  } else {
    res.send(200, {"data": "senador não encontrado"});
  }
}

exports.getTweets = function (req, res)
{
  var id_parlamentar = model.getSenador(req.params.nomeSenador);
  if (typeof id_parlamentar[0] !== "undefined")
  {
    var tweets = model.getTweetsSenador(id_parlamentar[0].id);
    if (typeof tweets[0] !== "undefined")
    {
      res.send(200, tweets);
    } else {
      res.send(200, {"data": "senador sem tweets"});
    }
  } else {
    res.send(200, {"data": "senador não encontrado"});
  }
}

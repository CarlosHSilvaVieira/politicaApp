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

exports.getDeputado = function (req, res)
{
  var d = model.getDeputado(req.params.nomeDepuatdo);
  res.send(200, d);
}

exports.getAllDeputados = function (req, res)
{
  res.send(200, model.getDeputados());
}

exports.analiseSentimeno = function (req, res)
{
  var id_parlamentar = model.getDeputado(req.params.nomeDepuatdo);

  if(typeof id_parlamentar[0] !== "undefined")
  {
    var tweets = model.getTweetsDeputado(id_parlamentar[0].id);

    if(typeof tweets[0] !== "undefined")
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
    }
    else
    {
      res.send(200, {"texto": "deputado sem tweets"});
    }
  }
  else
  {
    res.send(200, {"texto": "deputado não encontrado"});
  }
}

exports.getTweets = function (req, res)
{
  var id_parlamentar = model.getDeputado(req.params.nomeDepuatdo);

  if(typeof id_parlamentar[0] !== "undefined")
  {
    var tweets = model.getTweetsDeputado(id_parlamentar[0].id);
    if(typeof tweets[0] !== "undefined")
    {
      res.send(200, tweets);
    }
    else {
      res.send(200, {"data": "deputado sem tweets"});
    }
  }
  else {
    res.send(200, {"data": "deputado não encontrado"});
  }
}

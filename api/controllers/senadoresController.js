var model = require('../models/senadoresModel.js');
const http = require('ajax-request');

var request = {
   url : "http://www.sentiment140.com/api/bulkClassifyJson",
   headers: {
     "Accept" : "application/json",
     "Content-Type" : "application/json"
   },
   body:
   {
     language: "es",
     data: []
   }
 };

exports.getSenador = function (req, res)
{
  var d = model.getSenador(req.params.nomeDepuatdo);
  res.send(200, JSON.stringify(d));
}

exports.getAllSenadores = function (req, res)
{
  res.send(200, JSON.stringify(model.getSenadores()));
}

exports.analiseSentimeno = function (req, res)
{
  var id_parlamentar = model.getSenador(req.params.nomeSenador);

  if (typeof id_parlamentar[0] !== "undefined")
  {
    var tweets = model.getTweetsSenador(id_parlamentar[0].id);
    var resposta = {total: 0, positivos: 0, negativos: 0, neutros: 0, porcentagem_positivos: 0, porcentagem_negativos: 0, porcentagem_neutros: 0};

    if (tweets.length > 0)
    {
      tweets.forEach(function(item, index)
      {
        request.body.data.push({text: item.texto});
      });

      http.post(request, function(e, r, body)
      {
        //se a requisição retornar um erro
        if(e){res.send(500, {error: e});}
        var serverResponse = JSON.parse(body);

        serverResponse.data.forEach(function(item, index)
        {
          if(item.polarity == 4)
          {
            resposta.positivos++;
          }
          else if(item.polarity == 2)
          {
            resposta.negativos++;
          }
          else
          {
            resposta.neutros++;
          }

        });

        resposta.porcentagem_negativos = (resposta.negativos * 100) / resposta.total;
        resposta.porcentagem_positivos = (resposta.positivos * 100) / resposta.total;
        resposta.porcentagem_neutros = (resposta.neutros * 100) / resposta.total;

        //se estiver tudo de boas
        res.status(200).send(JSON.stringify(resposta));
      });
    }
    else
    {
      res.send(200, JSON.stringify({data: "senador sem tweets"}));
    }
  }
  else
  {
    res.send(200, JSON.stringify({data: "senador não encontrado"}));
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
      res.send(200, JSON.stringify(tweets));
    } else {
      res.send(200, JSON.stringify({data: "senador sem tweets"}));
    }
  } else {
    res.send(200, JSON.stringify({data: "senador não encontrado"}));
  }
}

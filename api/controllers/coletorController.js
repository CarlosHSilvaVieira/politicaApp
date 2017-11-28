var model = require('../models/coletorModel.js');
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

exports.coletaTweetsSenador = function (req, res)
{
  var d = model.coletaTweetsSenador(req.params.nomeSenador);
  if(d == true)
  {
    res.send(200, {texto: "coleta realizada"});
  }
  else
  {
    res.send(200, {texto: "coleta não pode ser realizada"});
  }
}

exports.coletaTweetsSenadores = function (req, res)
{
  var d = model.coletaTweetsSenadores();
  if(d == true)
  {
    res.send(200, {texto: "coleta realizada"});
  }
  else
  {
    res.send(200, {texto: "coleta não pode ser realizada"});
  }
}

exports.coletaTweetsDeputados = function (req, res)
{
  var d = model.coletaTweetsDeputados();
  if(d == true)
  {
    res.send(200, {texto: "coleta realizada"});
  }
  else
  {
    res.send(200, {texto: "coleta não pode ser realizada"});
  }
}

exports.coletaTweetsDeputado = function (req, res)
{
  var d = model.coletaTweetsDeputado(req.params.nomeDeputado);
  if(d == true)
  {
    res.send(200, {texto: "coleta realizada"});
  }
  else
  {
    res.send(200, {texto: "coleta não pode ser realizada"});
  }
}

exports.coletaTweetsDeputadosSemTweets = function(req, res)
{
  var d = model.coletaTweetsDeputadosSemTweets();
  if(d > 0)
  {
    res.send(200, {texto: "coleta realizada " + d + " deputados ainda sem tweets"});
  }
  else
  {
    res.send(200, {texto: "coleta não pode ser realizada"});
  }
}

exports.coletaTweetsSenadoresSemTweets = function(req, res)
{
  var d = model.coletaTweetsSenadoresSemTweets();
  if(d > 0)
  {
    res.send(200, {texto: "coleta realizada " + d + " senadores ainda sem tweets"});
  }
  else
  {
    res.send(200, {texto: "coleta não pode ser realizada"});
  }
}

exports.analiseSentimeno = function (req, res)
{
  var id_parlamentar = model.getSenador(req.params.nomeSenador)[0].id;

  var tweets = model.getTweetsSenador(id_parlamentar);

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

const model = require('../models/coletorModel.js');
const http = require('ajax-request');
const Twitter = require ('twitter');
const processador = require('../models/processador/processador.js');
const senadoresModel = require('../models/senadoresModel.js');
const deputadosModel = require('../models/deputadosModel.js');
const translate = require('translate');

var twitter = new Twitter({
  "consumer_key": "KZ9EgTXuqZK1xOJ6stuoxnuVC",
  "consumer_secret": "XuwiI0CSvpvVVi88gIdtxMpPHuKcuy1wdWcYab6EqiYLA8UIBN",
  "access_token_key": "900130537280589826-BpC2MDincbzozdqhmYkdrTKBUZpjEiz",
  "access_token_secret": "ZaTH7acHpjPY7eYQ5mQEYJ1cmgNNaVrtOISNy0E7q7XES"
});

translate.engine = "yandex";
translate.key = "trnsl.1.1.20171130T112512Z.a54b5194be5a4d4c.79415c6da36fb3451c4ad9f520ab2f282eb887f9";

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
  var deputado = deputadosModel.getDeputado(nomeDepuatdo);

  if(typeof deputado[0] !== 'undefined')
  {
    getTweets(deputado[0], 'deputado', true, 'tweets_deputados');
    getTweets(deputado[0], 'deputado', false, 'tweets_deputados');
  }

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
  /*var d = deputadosModel.getDeputado(req.params.nomeDeputado);
  if(d.length > 0)
  {
    getTweets(d[0], "deputado", false, "tweets_deputados");
    res.status(200).send({"status": "200", "data": "coleta realizada"});
  }
  else
  {
    res.status(500).send({"status": "500", "data": "a coleta não pode ser realizada"});
  }*/
  analiseSentimeno('fodas o mundo')
  res.status(200).send({data: "ok"});
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

async function analiseSentimeno (texto)
{
  var retorno = -1;

  if(typeof texto !== "undefined")
  {
    var a = await traduzir('pt', 'en', texto)

    var request = {
       url : "http://www.sentiment140.com/api/bulkClassifyJson",
       headers: {
         "Accept" : "application/json",
         "Content-Type" : "application/json"
       }
     };

    request.data = {data: []};
    request.data.data.push({text: a});

    http.post(request, function(e, r, body)
    {
      //se a requisição retornar um erro
      if(e){return 0;}
      getPolaridade(JSON.parse(body).data[0].polarity);
    });
  }
  console.log(retorno);
  return retorno;
}

function getPolaridade(polarity) {
  return polarity;
}

async function traduzir(origem, destino, texto)
{
   var resultado = await translate(texto, {from: origem, to: destino});
   return resultado;
}

function getTweets(parlamentar, cargo, direcionado, tabela)
{
  var count = 0;
  var params = {q: '', count: 30, result_type: 'recent', lang: 'pt'};

  if(direcionado == true){cargo = "to:";}

  params.q = cargo + ' ' + parlamentar.nome.toLowerCase().trim() + ' -filter:retweets';

  twitter.get('search/tweets', params, function(error, tweets, response)
  {
    if (!error)
    {
        tweets.statuses.forEach(function(tweet, index)
        {
          var texto = tweet.text;
          var exp = /(\b(https?|ftp|file):\/\/)([-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i;
          texto = texto.replace(exp, "");

          texto = traduzir('pt', 'en', texto);

          if(typeof texto !== "undefined")
          {
            var classificacao = processador.classify(texto);
            processador.salvarParaTreino(texto, classificacao, 'learning');

            if(classificacao == true)
            {
              var sentiment = analiseSentimeno(texto);
              console.log(sentiment);
              var query = "insert into "+tabela+" (id_parlamentar, texto, polarity) values  ("+parlamentar.id+ ", '"+texto+"', "+sentiment.data.polarity+");";
              console.log(query);
              connection.query(query, function(err, responde){});
            }
            else
            {
              console.log("texto regeitado");
            }
          }

        });
    }
    else
    {
      setTimeout(getTweets(parlamentar, cargo, direcionado, tabela), 100000);
      console.log("Limite de requisiões excedido ");
      return;
    }
  });
};

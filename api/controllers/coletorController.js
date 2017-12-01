const http = require('ajax-request');
const Twitter = require ('twitter');
const processador = require('../models/processador/processador.js');
const senadoresModel = require('../models/senadoresModel.js');
const deputadosModel = require('../models/deputadosModel.js');
const translate = require('translate');
const connection = require('../models/connectionAsync');

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
  var s = senadoresModel.getSenador(req.params.nomeSenador);
  if(s.length > 0)
  {
    getTweets(s[0], "senador", "tweets_senadores");
    res.status(200).send({"status": "200", "data": "coleta realizada"});
  }
  else
  {
    res.status(200).send({"status": "500", "data": "a coleta não pode ser realizada"});
  }
}

exports.coletaTweetsSenadores = function (req, res)
{
  var senadores = senadoresModel.getSenadores();

  if(senadores.length > 0)
  {
    senadores.forEach(function (item, index)
    {
      getTweets(item, 'senador', 'tweets_senadores');
    });
    res.status(200).send({"status": "200", "data": "coleta realizada"});
  }
  else
  {
    res.status(200).send({"status": "500", "data": "a coleta não pode ser realizada"});
  }
}

exports.coletaTweetsDeputados = function (req, res)
{
  var deputados = deputadosModel.getDeputados();

  if(deputados.length > 0)
  {
    deputados.forEach(function (item, index)
    {
      getTweets(item, 'deputado', 'tweets_deputados');
    });
    res.status(200).send({"status": "200", "data": "coleta realizada"});
  }
  else
  {
    res.status(200).send({"status": "500", "data": "a coleta não pode ser realizada"});
  }
}

exports.coletaTweetsDeputado = function (req, res)
{
  var d = deputadosModel.getDeputado(req.params.nomeDeputado);
  if(d.length > 0)
  {
    getTweets(d[0], "deputado", "tweets_deputados");
    res.status(200).send({"status": "200", "data": "coleta realizada"});
  }
  else
  {
    res.status(200).send({"status": "500", "data": "a coleta não pode ser realizada"});
  }
}

exports.coletaTweetsDeputadosSemTweets = function(req, res)
{
  var deputados = deputadosModel.getDeputadosSemTweets();
  if(deputados.length > 0)
  {
    deputados.forEach(function (deputado, index)
    {
      getTweets(deputado, "deputado", "tweets_deputados");
    });

    res.status(200).send({"status": "200", "texto": "coleta realizada " + deputados.length + " deputados ainda sem tweets"});
  }
  else
  {
    res.status(200).send({"status": "500", "data": "a coleta não pode ser realizada"});
  }
}

exports.coletaTweetsSenadoresSemTweets = function(req, res)
{
  var senadores = senadoresModel.getSenadoresSemTweets();
  if(senadores.length > 0)
  {
    senadores.forEach(function (senador, index)
    {
      getTweets(senador, "senador", "tweets_senadores");
    });
    res.status(200).send({"status": "200", "texto": "coleta realizada " + senadores.length + " deputados ainda sem tweets"});
  }
  else
  {
    res.status(200).send({"status": "500", "data": "a coleta não pode ser realizada"});
  }
}

async function analiseSentimeno (tabela, id, texto)
{
  if(typeof texto !== "undefined")
  {
    var request = {
       url : "http://www.sentiment140.com/api/bulkClassifyJson",
       headers: {
         "Accept" : "application/json",
         "Content-Type" : "application/json"
       }
     };

    var texto_traduzido = await traduzir('pt', 'en', texto);

    if(texto_traduzido !== "")
    {
      request.data = {data: []};
      request.data.data.push({text: texto_traduzido});

      //var classificacao = processador.classify(texto);
      //processador.salvarParaTreino(texto, classificacao, 'learning');
      console.log(request.data.data);
      http.post(request, function(e, r, body)
      {
        //se a requisição retornar um erro
        if(e){return e;}
        //senão
        salvar(tabela, id, texto_traduzido, JSON.parse(body).data[0].polarity);
      });
    }
  }
}

async function salvar(tabela, id, texto, polarity)
{
  var query = "insert into "+tabela+" (id_parlamentar, texto, polaridade) values  ("+id+ ", '"+texto+"', "+polarity+");";
  connection.query(query, function(e, response){if(e){return;}});
}

async function traduzir(origem, destino, texto)
{
   var resultado = "";
   resultado = await translate(texto, {from: origem, to: destino});
   return resultado;
}

async function getTweets(parlamentar, cargo, tabela)
{
  var count = 0;
  var params = {q: '', count: 30, result_type: 'recent', lang: 'pt'};

  params.q = cargo + ' ' + parlamentar.nome.toLowerCase().trim() + ' -filter:retweets';

  console.log("Coletando Tweets sobre "+ cargo + " - "+ parlamentar.nome + "... \n");

  twitter.get('search/tweets', params, function(error, tweets, response)
  {
    if (!error)
    {
        tweets.statuses.forEach(function(tweet, index)
        {
          var texto = tweet.text;
          var exp = /(\b(https?|ftp|file):\/\/)([-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i;
          texto = texto.replace(exp, " ");
          analiseSentimeno(tabela, parlamentar.id, texto);
        });
    }
    else
    {
      console.log("Limite de requisiões excedido execucão re-agendada para daqui a dez minutos");
      setTimeout(function () {
        getTweets(parlamentar, cargo, tabela)
      }, 100000);
      return;
    }
  });
};

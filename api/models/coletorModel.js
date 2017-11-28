var connection = require('./connectionAsync');
var Twitter = require ('twitter');
var https = require ('https');
var processador = require('./processador/processador.js');
var senadoresModel = require('./senadoresModel.js');
var deputadosModel = require('./deputadosModel.js');
var total = 0;

var client = new Twitter({
  "consumer_key": "KZ9EgTXuqZK1xOJ6stuoxnuVC",
  "consumer_secret": "XuwiI0CSvpvVVi88gIdtxMpPHuKcuy1wdWcYab6EqiYLA8UIBN",
  "access_token_key": "900130537280589826-BpC2MDincbzozdqhmYkdrTKBUZpjEiz",
  "access_token_secret": "ZaTH7acHpjPY7eYQ5mQEYJ1cmgNNaVrtOISNy0E7q7XES"
});


module.exports.coletaTweetsSenador = function(nomeSenador)
{
  var senador = senadoresModel.getSenador(nomeSenador);
  if(senador !== [])
  {
    getTweets(senador[0], 'senador', false, 'tweets_senadores');
    return true;
  }
  else
  {
    return false;
  }
}

module.exports.coletaTweetsSenadores = function()
{
  var senadores = senadoresModel.getSenadores();
  if(senadores !== [])
  {
    senadores.forEach(function(senador, index)
    {
      getTweets(senador, 'senador', false, 'tweets_senadores');
    });
    return true;
  }
  else
  {
    return false;
  }
}

module.exports.coletaTweetsSenadoresSemTweets = function()
{
  var senadores = senadoresModel.getSenadoresSemTweets();
  if(senadores.length > 0)
  {
    senadores.forEach(function(senador, index)
    {
      getTweets(senador, 'senador', false, 'tweets_senadores');
    });
  }
  return senadores.length;
}

module.exports.coletaTweetsDeputado = function(nomeDepuatdo)
{
  var deputado = deputadosModel.getDeputado(nomeDepuatdo);
  if(typeof deputado[0] !== 'undefined')
  {
    getTweets(deputado[0], 'deputado', true, 'tweets_deputados');
    getTweets(deputado[0], 'deputado', false, 'tweets_deputados');

    return true;
  }
  else
  {
    return false;
  }
}

module.exports.coletaTweetsDeputados = function()
{
  var deputados = deputadosModel.getDeputados();
  if(typeof deputados[0] !== 'undefined')
  {

    deputados.forEach(function(deputado, index)
    {
      getTweets(deputado, 'deputado', false, 'tweets_deputados');
    });

    return true;
  }
  else
  {
    return false;
  }
}

module.exports.coletaTweetsDeputadosSemTweets = function()
{
  var deputados = deputadosModel.getDeputadosSemTweets();
  if(typeof deputados[0] !== 'undefined')
  {

    deputados.forEach(function(deputado, index)
    {
      getTweets(deputado, 'deputado', false, 'tweets_deputados');
    });
  }
  return deputados.length;
}


function getTweets(parlamentar, cargo, direcionado, tabela)
{
  var count = 0;
  var params = {q: '', count: 30, result_type: 'recent', lang: 'pt'}; //-filter:retweets -filter:links

  if(direcionado == true){cargo = "to:";}

  params.q = cargo + ' ' + parlamentar.nome.toLowerCase().trim() + ' -filter:retweets';

  client.get('search/tweets', params, function(error, tweets, response)
  {
    if (!error)
    {
        console.log(tweets.statuses.length);

        tweets.statuses.forEach(function(tweet, index)
        {
          var texto = tweet.text;
          var exp = /(\b(https?|ftp|file):\/\/)([-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i;
          texto = texto.replace(exp, "");

          var classificacao = processador.classify(texto);
          classificacao = true;
          //processador.salvarParaTreino(texto, classificacao, 'learning');

          if(classificacao == true)
          {
            var query = "insert into "+tabela+" (id_parlamentar, texto) values  ("+parlamentar.id+ ", '"+texto+"');";
            console.log(query);
            connection.query(query, function(err, responde){});
            count++;
          }
          else
          {
            console.log("texto regeitado");
          }
        });
        total += count;
    }
    else
    {
      console.log("Limite de requisiões excedido ");
      total += count;
    }
  });
};

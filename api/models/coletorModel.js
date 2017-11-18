var connection = require('./connection');
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
  if(senador != [])
  {
    getTweets(senador[0], 'senador');
    return true;
  }
  else
  {
    return false;
  }
}

module.exports.coletaTweetsDeputado = function(nomeDepuatdo)
{
  var deputado = deputadosModel.getSenador(nomeDepuatdo);
  if(deputado != [])
  {
    getTweets(deputado[0], 'deputado');
    return true;
  }
  else
  {
    return false;
  }
}

function getTweets(parlamentar, cargo)
{
  var count = 0;
  var params = {q: '', result_type: 'mixed', lang: 'pt'}; //-filter:retweets -filter:links
  params.q = cargo + ' ' + parlamentar.nome.toLowerCase().trim() + '';

  client.get('search/tweets', params, function(error, tweets, response)
  {
    if (!error)
    {
        tweets.statuses.forEach(function(tweet, index)
        {
          var texto = tweet.text;
          var exp = /(\b(https?|ftp|file):\/\/)([-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i;
          texto = texto.replace(exp, "");

          var classificacao = processador.classify(texto);
          processador.salvarParaTreino(texto, classificacao, 'learning');

          if(classificacao == true)
          {
            var query = "insert into tweets_deputados (id_parlamentar, texto) values  ("+parlamentar.id+ ", '"+texto+"');";
            var result = connection.query(query);
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

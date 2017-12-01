var model = require('../models/deputadosModel.js');

exports.getDeputado = function (req, res)
{
  var response = {status: 200};
  var deputado = model.getDeputado(req.params.nomeDepuatdo);
  if(deputado.length > 0)
  {
    response.data = deputado[0];
  }
  else
  {
    response.status = 500;
    response.data = "deputado não encontrado";
  }
  res.status(200).send(JSON.stringify(response));
}

exports.getAllDeputados = function (req, res)
{
  var deputados = model.getDeputados();
  var response = {status: 200};

  if(deputados.length > 0)
  {
    response.data = [];
    deputados.forEach(function (deputado, index)
    {
      response.data.push(deputado)
    });
  }
  else
  {
    response.status = 500;
    response.data = "deputados não encontrados";
  }

  res.status(200).send(JSON.stringify(response));
}

exports.analiseSentimento = function (req, res)
{
  var polaridades = model.getPolaridade(req.params.nomeDepuatdo);
  var resposta = {total: 0, positivos: 0, negativos: 0, neutros: 0, porcentagem_positivos: 0, porcentagem_negativos: 0, porcentagem_neutros: 0};

  if(polaridades.length > 0)
  {
    resposta = realizaAnalise(polaridades);
  }
  else
  {
    resposta.status = 500;
  }
  res.status(200).send(JSON.stringify(resposta));
}

var realizaAnalise = function (polaridades)
{
  var resposta = {total: 0, positivos: 0, negativos: 0, neutros: 0, porcentagem_positivos: 0, porcentagem_negativos: 0, porcentagem_neutros: 0};
  polaridades.forEach(function (objeto, index)
  {
    if(objeto.polaridade == 4)
    {
      resposta.positivos++;
    }
    else if(objeto.polaridade == 2)
    {
      resposta.neutros++;
    }
    else if(objeto.polaridade == 0)
    {
      resposta.negativos++;
    }
  });

  resposta.status = 200;
  resposta.total = polaridades.length;
  resposta.porcentagem_negativos = (resposta.negativos * 100) / resposta.total;
  resposta.porcentagem_positivos = (resposta.positivos * 100) / resposta.total;
  resposta.porcentagem_neutros = (resposta.neutros * 100) / resposta.total;
  return resposta;
}

exports.rank = function (req, res)
{
  var deputados = model.DeputadosQuantTweets(req.params.quant);
  var response = {status: 200, data: []}
  if(deputados.length > 0)
  {
    var analise = [];
    deputados.forEach(function (deputado, index)
    {
      var polaridades = model.getPolaridadeByID(deputado.id);
      var resultado = realizaAnalise(polaridades);
      resultado.nome = deputado.nome;
      resultado.id_parlamentar = deputado.id;
      analise.push(resultado);
    });

    analise.sort(ordernar);
    response.data = analise;
  }
  else
  {
    response.status = 500;
  }
  res.status(200).send(response);
};

var ordernar = function (A, B) {
  if(A.porcentagem_positivos > B.porcentagem_positivos)
  {
    return 1;
  }
  else if (A.porcentagem_positivos < B.porcentagem_positivos)
  {
    return -1;
  }
  else
  {
    return 0;
  }
};

exports.getTweets = function (req, res)
{
  var id_parlamentar = model.getDeputado(req.params.nomeDeputado);
  if (typeof id_parlamentar[0] !== "undefined")
  {
    var tweets = model.getTweetsDeputado(id_parlamentar[0].id);
    if (typeof tweets[0] !== "undefined")
    {
      res.send(200, JSON.stringify({status: 200, data: tweets}));
    } else {
      res.send(200, JSON.stringify({status: 500, data: "deputado sem tweets"}));
    }
  } else {
    res.send(200, JSON.stringify({status: 500, data: "deputado não encontrado"}));
  }
}

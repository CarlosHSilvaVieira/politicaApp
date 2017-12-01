var model = require('../models/senadoresModel.js');

exports.getSenador = function (req, res)
{
  var response = {status: 200};
  var senador = model.getSenador(req.params.nomeDepuatdo);
  if(senador.length > 0)
  {
    response.data = senador[0];
  }
  else
  {
    response.status = 500;
    response.data = "senador não encontrado";
  }
  res.status(200).send(JSON.stringify(response));
}

exports.getAllSenadores = function (req, res)
{
  var response = {status: 200};
  var senadores = model.getSenadores();
  if(senadores.length > 0)
  {
    response.data = [];
    senadores.forEach(function (senador, index)
    {
      response.data.push(senador)
    });
  }
  else
  {
    response.status = 500;
    response.data = "senadores não encontrados";
  }
  res.status(200).send(JSON.stringify(response));
}

exports.analiseSentimento = function (req, res)
{
  var polaridades = model.getPolaridade(req.params.nomeSenador);
  var resposta = {total: 0, positivos: 0, negativos: 0, neutros: 0, porcentagem_positivos: 0, porcentagem_negativos: 0, porcentagem_neutros: 0};

  if (polaridades.length > 0)
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
  var senadores = model.SenadoresQuantTweets(req.params.quant);
  var response = {status: 200, data: []}
  if(senadores.length > 0)
  {
    var analise = [];
    senadores.forEach(function (senador, index)
    {
      var polaridades = model.getPolaridadeByID(senador.id);
      var resultado = realizaAnalise(polaridades);
      resultado.nome = senador.nome;
      resultado.id_parlamentar = senador.id;
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
  var id_parlamentar = model.getSenador(req.params.nomeSenador);
  if (typeof id_parlamentar[0] !== "undefined")
  {
    var tweets = model.getTweetsSenador(id_parlamentar[0].id);
    if (typeof tweets[0] !== "undefined")
    {
      res.send(200, JSON.stringify({status: 200, data: tweets}));
    } else {
      res.send(200, JSON.stringify({status: 500, data: "senador sem tweets"}));
    }
  } else {
    res.send(200, JSON.stringify({status: 500, data: "senador não encontrado"}));
  }
}

'use strict';

module.exports = function (app)
{
  var deputadosController = require('../controllers/deputadosController.js');

  app.route('/')
  .get(helloWorld)
  .post(helloWorld);

  function helloWorld(req, res)
  {
    res.status(200).send("<html><head><title>API politicaApp</title></head><body><h1>API politicaApp</h1> <p> API de analise de sentimento de twitters sobre políticos brasileiros</p> <hr> <p>Autor: CarlosHSilvaVieira</p><p>https://github.com/CarlosHSilvaVieira/politicaApp</p></body></html>");
  }

  app.route('/deputados')
  .get(deputadosController.getAllDeputados);

  app.route('/deputados/rank/:quant')
  .get(deputadosController.rank);

  app.route('/deputado/analise/:nomeDepuatdo')
  .get(deputadosController.analiseSentimento);

  app.route('/deputado/tweets/:nomeDepuatdo')
  .get(deputadosController.getTweets);

  app.route('/deputado/:nomeDepuatdo')
  .get(deputadosController.getDeputado);
};

'use strict';

module.exports = function (app)
{
  var deputadosController = require('../controllers/deputadosController.js');

  /*app.route('/deputado')
  .post(deputadosController.createDeputado);*/

  app.route('/')
  .get(helloWorld)
  .post(helloWorld);

  function helloWorld(req, res)
  {
    res.status(200).send("<html><head><title>API politicaApp</title></head><body><h1>API politicaApp</h1> <p> API de analise de sentimento de twitters sobre políticos brasileiros</p> <hr> <p>Autor: CarlosHSilvaVieira</p><p>https://github.com/CarlosHSilvaVieira/politicaApp</p></body></html>");
  }

  app.route('/deputados')
  .get(deputadosController.getAllDeputados);

  app.route('/deputado/analise/:nomeDepuatdo')
  .get(deputadosController.analiseSentimeno);

  app.route('/deputado/tweets/:nomeDepuatdo')
  .get(deputadosController.getTweets);

  app.route('/deputado/:nomeDepuatdo')
  .get(deputadosController.getDeputado);

  /*
  .put(deputadosController.updateDeputado)
  .delete(deputadosController.deleteDeputado);
  */
};

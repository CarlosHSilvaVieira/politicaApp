'use strict';

module.exports = function (app)
{
  var deputadosController = require('../controllers/deputadosController.js');

  /*app.route('/deputado')
  .post(deputadosController.createDeputado);*/

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
